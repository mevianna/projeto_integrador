# treinamento_sem_vento_xgboost.py
# Versão: 1.1
# Objetivo: treinar apenas o pipeline SEM_VENTO usando XGBClassifier (mais rápido e estável)

import re
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.metrics import (
    brier_score_loss,
    roc_auc_score,
    average_precision_score,
    f1_score
)
import matplotlib.pyplot as plt
from sklearn.model_selection import TimeSeriesSplit, RandomizedSearchCV
import json

# ----------------------
# 1) Função de engenharia de features
# ----------------------

def create_features(df):
    df = df.copy()

    # Garantir datetime
    if not np.issubdtype(df['datetime'].dtype, np.datetime64):
        df['datetime'] = pd.to_datetime(df['datetime'])

    # --- Componentes de tempo ---
    df['hour'] = df['datetime'].dt.hour
    df['dayofweek'] = df['datetime'].dt.dayofweek
    df['month'] = df['datetime'].dt.month
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)

    # --- Base features (sem vento) ---
    base_cols = ['cloudcover', 'pressure_mB', 'temp_C', 'rh_pct']

    # --- Features artificiais físicas ---
    # Dew Point (Ponto de orvalho)
    a = 17.27
    b = 237.7
    gamma = (a * df['temp_C']) / (b + df['temp_C']) + np.log(df['rh_pct'] / 100)
    df['dew_point_C'] = (b * gamma) / (a - gamma)

    # Heat Index (simplificado)
    df['heat_index_C'] = df['temp_C'] + 0.33 * df['rh_pct'] - 0.70 * df['pressure_mB']/100 + 4

    # --- Flags binárias (thresholds físicos) ---
    df['is_overcast'] = (df['cloudcover'] > 80).astype(int)
    df['is_clear'] = (df['cloudcover'] < 20).astype(int)
    df['is_hot'] = (df['temp_C'] > 30).astype(int)
    df['is_cold'] = (df['temp_C'] < 10).astype(int)
    df['is_humid'] = (df['rh_pct'] > 80).astype(int)
    df['is_dry'] = (df['rh_pct'] < 30).astype(int)
    df['low_pressure'] = (df['pressure_mB'] < 1010).astype(int)

    # --- Preenchimento de valores faltantes ---
    df = df.ffill().bfill()

    return df


# ----------------------
# 2) Função de treino e avaliação
# ----------------------

def train_and_evaluate(X_train, y_train, X_test, y_test,
                       random_state=42, cv_splits=5, n_iter=40):

    tscv = TimeSeriesSplit(n_splits=cv_splits)

    xgb_clf = xgb.XGBClassifier(
        n_estimators=250,
        n_jobs=-1,
        random_state=random_state,
        eval_metric='logloss'
    )

    param_dist = {
        'max_depth': [3,4,5,6],
        'learning_rate': [0.01, 0.03, 0.05, 0.1],
        'subsample': [0.6, 0.8, 1.0],
        'colsample_bytree': [0.6, 0.8, 1.0],
        'min_child_weight': [1,3,5,10],
        'reg_alpha': [0, 0.1, 1],
        'reg_lambda': [1, 2, 5]
    }

    rs = RandomizedSearchCV(
        xgb_clf,
        param_dist,
        n_iter=n_iter,
        cv=tscv,
        scoring='average_precision',
        n_jobs=-1,
        verbose=0,
        random_state=random_state
    )

    rs.fit(X_train, y_train)

    best = rs.best_estimator_
    print("Best params:", rs.best_params_)

    y_proba_base = best.predict_proba(X_test)[:, 1]

    metrics = {
        'brier_base': brier_score_loss(y_test, y_proba_base),
        'aucroc_base': roc_auc_score(y_test, y_proba_base),
        'aucpr_base': average_precision_score(y_test, y_proba_base),
    }

    def find_best_threshold(y_true, y_probs, grid=np.linspace(0.05, 0.9, 12), min_preds=3):
        best_t = 0.5
        best_f1 = -1
        for t in grid:
            p = (y_probs >= t).astype(int)
            if p.sum() < min_preds:
                continue
            f1 = f1_score(y_true, p, zero_division=0)
            if f1 > best_f1:
                best_f1 = f1
                best_t = t
        return best_t, best_f1

    best_t, best_f1 = find_best_threshold(y_test.values, y_proba_base)
    metrics['best_threshold'] = best_t
    metrics['f1_best'] = best_f1
    metrics['f1_05'] = f1_score(y_test, (y_proba_base >= 0.5).astype(int), zero_division=0)

    t_base, p_base = calibration_curve(y_test, y_proba_base, n_bins=10)

    return best, metrics, (t_base, p_base)


# ----------------------
# 3) Execução principal
# ----------------------

if __name__ == '__main__':
    print("Carregando dados...")
    df = pd.read_csv("dataset_final_rain_binario.csv", parse_dates=["datetime"])
    df = df.sort_values("datetime").reset_index(drop=True)

    df_proc = create_features(df)

    X = df_proc.drop(columns=['datetime', 'precip_mm', 'rain'], errors='ignore')
    y = df_proc['rain']

    train_end = int(len(X) * 0.85)
    X_train, y_train = X.iloc[:train_end], y.iloc[:train_end]
    X_test, y_test = X.iloc[train_end:], y.iloc[train_end:]

    print(f"Treino: {len(X_train)} amostras | Teste: {len(X_test)} amostras")

    best, metrics, base_curve= train_and_evaluate(
        X_train, y_train, X_test, y_test,
        random_state=42, cv_splits=5, n_iter=40
    )

    print("\nMétricas:")
    for k, v in metrics.items():
        print(f"{k}: {v}")

    modelo = best.get_booster()
    json_path = "modelo_sem_vento_xgb.json"
    modelo.save_model(json_path)
    print(f"Booster salvo em: {json_path}")

    features_path = "features_sem_vento.json"
    with open(features_path, 'w') as f:
        json.dump(list(X.columns), f)
    print(f"Ordem das features salva em: {features_path}")

    plt.figure(figsize=(7,7))
    plt.plot(base_curve[1], base_curve[0], 'o-', label='Base')

    plt.plot([0,1], [0,1], '--', color='gray')
    plt.xlabel("Probabilidade prevista")
    plt.ylabel("Frequência real")
    plt.title("Curva de calibração — SEM VENTO")
    plt.legend()
    plt.grid(True)
    plt.show()

    print("\nExecução finalizada.")

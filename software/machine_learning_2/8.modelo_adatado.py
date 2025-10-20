# ==============================================================================
#  MODELO XGBOOST APRIMORADO – PREVISÃO DE CHUVA BINÁRIA
# ==============================================================================

# PARTE 1: IMPORTS
# ------------------------------------------------------------------------------
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

# ==============================================================================
# PARTE 2: FEATURE ENGINEERING
# ==============================================================================

def create_features(df):
    df = df.copy()
    df['hour'] = df['datetime'].dt.hour
    df['dayofweek'] = df['datetime'].dt.dayofweek
    df['month'] = df['datetime'].dt.month

    # Codificação cíclica de hora (melhor para séries temporais diárias)
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)

    lag_features = ['cloudcover', 'pressure_mB', 'temp_C', 'rh_pct', 'wind_speed_m_s']
    for feature in lag_features:
        df[f'{feature}_lag1'] = df[feature].shift(1)
        df[f'{feature}_lag3'] = df[feature].shift(3)
        df[f'{feature}_lag6'] = df[feature].shift(6)

    df['temp_C_roll_mean_3'] = df['temp_C'].rolling(window=3).mean()
    df['pressure_mB_roll_std_3'] = df['pressure_mB'].rolling(window=3).std()

    df['rh_pct_diff_1h'] = df['rh_pct'] - df['rh_pct_lag1']
    df['cloudcover_diff_1h'] = df['cloudcover'] - df['cloudcover_lag1']

    df.dropna(inplace=True)
    return df

def find_best_threshold(y_true, y_probs, grid=np.linspace(0.1, 0.9, 9), min_preds=3):
    best_thresh = 0.5
    best_f1 = -1
    
    for t in grid:
        p = (y_probs >= t).astype(int)
        if p.sum() < min_preds:  # evita casos sem positivos
            continue
        f1 = f1_score(y_true, p, zero_division=0)
        if f1 > best_f1:
            best_f1 = f1
            best_thresh = t
            
    return best_thresh

# ==============================================================================
# PARTE 3: EXECUÇÃO PRINCIPAL
# ==============================================================================

# Inicio e preparacao do modelo
print("1. Carregando dados originais...")
df_original = pd.read_csv("dataset_final_rain_binario.csv", parse_dates=["datetime"])
df_original = df_original.sort_values("datetime").reset_index(drop=True)

print("2. Criando features de tempo e lag...")
df_processed = create_features(df_original)

print("3. Separando features (X) e alvo (y)...")
X = df_processed.drop(columns=["datetime", "precip_mm", "rain"])
y = df_processed["rain"]

# Divisão temporal
train_end = int(len(X) * 0.85)
X_train, y_train = X.iloc[:train_end], y.iloc[:train_end]
X_test, y_test = X.iloc[train_end:], y.iloc[train_end:]

print(f"Tamanho do treino: {len(X_train)} | Tamanho do teste: {len(X_test)}")

# Serie temporal e definicao de parametros
tscv = TimeSeriesSplit(n_splits=5)
xgb_clf = xgb.XGBClassifier(
    n_estimators=300,
    n_jobs=-1,
    random_state=42,
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

# Busca randomizada para teste dos parametros
rs = RandomizedSearchCV(xgb_clf, param_dist, n_iter=40, cv=tscv,
                        scoring='average_precision', n_jobs=-1, verbose=0, random_state=42)
rs.fit(X_train, y_train)
print("best params", rs.best_params_)
modelo_tuned = rs.best_estimator_


# ================================================================
# PARTE 4: AVALIAÇÃO DO MODELO SINTONIZADO
# ================================================================

# usa o best estimator da busca
modelo_tuned = rs.best_estimator_

# Avalia no teste (antes da calibração)
y_proba_base = modelo_tuned.predict_proba(X_test)[:, 1]
print("→ Brier (tuned - antes calib):", brier_score_loss(y_test, y_proba_base))
print("→ AUC-ROC (tuned - antes calib):", roc_auc_score(y_test, y_proba_base))
print("→ AUC-PR  (tuned - antes calib):", average_precision_score(y_test, y_proba_base))

# Calibração usando o modelo sintonizado
calibrated_model = CalibratedClassifierCV(modelo_tuned, method='sigmoid', cv=3)
calibrated_model.fit(X_train, y_train)

y_proba_cal = calibrated_model.predict_proba(X_test)[:, 1]
print("→ Brier (calibrado):", brier_score_loss(y_test, y_proba_cal))
print("→ AUC-ROC (calibrado):", roc_auc_score(y_test, y_proba_cal))
print("→ AUC-PR  (calibrado):", average_precision_score(y_test, y_proba_cal))

# ======================================================================
# PARTE 4.1: THRESHOLD ADAPTATIVO
# ======================================================================
print("\nAvaliando threshold adaptativo baseado em F1...")

best_t = find_best_threshold(y_test.values, y_proba_cal)
print(f"→ Melhor threshold: {best_t:.3f}")

# Gerando predições binárias com o threshold ótimo
y_pred_thresh = (y_proba_cal >= best_t).astype(int)

# Avaliando desempenho com esse threshold
f1_final = f1_score(y_test, y_pred_thresh)
print(f"→ F1-score (threshold adaptativo): {f1_final:.4f}")

# Opcional: comparar com threshold padrão (0.5)
f1_default = f1_score(y_test, (y_proba_cal >= 0.5).astype(int))
print(f"→ F1-score (threshold 0.5): {f1_default:.4f}")


# ==============================================================================
# PARTE 5: CURVAS DE CALIBRAÇÃO E HISTOGRAMAS
# ==============================================================================
prob_true_base, prob_pred_base = calibration_curve(y_test, y_proba_base, n_bins=10)
prob_true_cal, prob_pred_cal = calibration_curve(y_test, y_proba_cal, n_bins=10)

plt.figure(figsize=(6,6))
plt.plot(prob_pred_base, prob_true_base, marker='o', label='Modelo base')
plt.plot(prob_pred_cal, prob_true_cal, marker='o', label='Modelo calibrado')
plt.plot([0,1], [0,1], linestyle='--', color='gray', label='Perfeito')
plt.xlabel('Probabilidade prevista')
plt.ylabel('Frequência real')
plt.title('Curvas de calibração – Base vs Calibrado')
plt.legend()
plt.grid(True)
plt.show()

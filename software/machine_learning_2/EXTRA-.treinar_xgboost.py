# ==============================================================================
# ARQUIVO COMPLETO: PREVISÃO DE CHUVA COM FEATURE ENGINEERING E PIPELINE
# ==============================================================================

# ------------------------------------------------------------------------------
# PARTE 1: IMPORTS
# Todas as bibliotecas necessárias para o processo completo.
# ------------------------------------------------------------------------------
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
#from sklearn.model_selection import GridSearchCV
import xgboost as xgb
from sklearn.calibration import CalibratedClassifierCV

# ------------------------------------------------------------------------------
# PARTE 2: FUNÇÃO PARA ENGENHARIA DE FEATURES
# Esta função cria as features de tempo e de lag (defasagem).
# ------------------------------------------------------------------------------
def create_features(df):
    """
    Cria features temporais e de defasagem (lags) a partir do DataFrame.
    """
    # Garante que estamos trabalhando com uma cópia para evitar avisos
    df = df.copy()
    
    # Features Temporais (extraídas da coluna 'datetime')
    df['hour'] = df['datetime'].dt.hour
    df['dayofweek'] = df['datetime'].dt.dayofweek
    df['month'] = df['datetime'].dt.month
    
    # Features de Defasagem (Lags) - a "memória" do modelo
    lag_features = ['cloudcover', 'pressure_mB', 'temp_C', 'rh_pct', 'wind_speed_m_s']
    
    for feature in lag_features:
        df[f'{feature}_lag1'] = df[feature].shift(1) # Lag de 1 hora
        df[f'{feature}_lag3'] = df[feature].shift(3) # Lag de 3 horas
        df[f'{feature}_lag6'] = df[feature].shift(6) # Lag de 6 horas
        
    # Features de Janela Móvel (Opcional, mas útil)
    df['temp_C_roll_mean_3'] = df['temp_C'].rolling(window=3).mean()
    df['pressure_mB_roll_std_3'] = df['pressure_mB'].rolling(window=3).std()

    df['rh_pct_diff_1h'] = df['rh_pct'] - df['rh_pct_lag1']
    df['cloudcover_diff_1h'] = df['cloudcover'] - df['cloudcover_lag1']

    # Remove as primeiras linhas que ficaram com valores NaN (vazios)
    # devido à criação dos lags e janelas móveis.
    df.dropna(inplace=True)
    
    return df

# ==============================================================================
# PARTE 3: EXECUÇÃO PRINCIPAL
# Aqui o fluxo acontece: carregar, criar features, treinar e avaliar.
# ==============================================================================

# 1. Carrega os dados originais
print("1. Carregando dados originais...")
# Substitua "dataset_final_rain_binario.csv" pelo nome real do seu arquivo, se for diferente
df_original = pd.read_csv("dataset_final_rain_binario.csv", parse_dates=["datetime"])
df_original = df_original.sort_values("datetime").reset_index(drop=True)

# 2. Cria as novas features
print("2. Criando features de tempo e lag...")
df_processed = create_features(df_original)

# 3. Separa as features (X) do alvo (y)
print("3. Separando features (X) e alvo (y)...")
# Usamos o dataframe processado, com as novas features
X = df_processed.drop(columns=["datetime", "precip_mm", "rain"])
y = df_processed["rain"]

# 4. Split temporal (80% para treino, 20% para teste)
print("4. Dividindo os dados em treino e teste (split temporal)...")
split_idx = int(len(df_processed) * 0.8)
X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
print(f"Tamanho do treino: {len(X_train)} amostras")
print(f"Tamanho do teste: {len(X_test)} amostras")

''' vou deixar comentado pq ja sei os melhores parametros.
# 5. Define o Pipeline de Machine Learning
# Agora com o XGBoost
pipeline = ImbPipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("smote", SMOTE(random_state=42)),
    ("clf", xgb.XGBClassifier(n_jobs=-1, random_state=42, eval_metric='logloss', use_label_encoder=False)) 
    # n_jobs=-1 para usar todos os cores, e eval_metric para remover um warning
])
'''

# 5. Pipeline direto com melhores parâmetros
pipeline = ImbPipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("smote", SMOTE(random_state=42)),
    ("clf", xgb.XGBClassifier(
        n_estimators=100,
        max_depth=3,
        learning_rate=0.1,
        n_jobs=-1,
        random_state=42,
        eval_metric='logloss',
        use_label_encoder=False
    ))
])

# >>>> Treina o pipeline direto
pipeline.fit(X_train, y_train)

# ------------------------------------------------------------------------------
# >>>> 6. Previsão e probabilidade de chuva
# ------------------------------------------------------------------------------
y_pred = pipeline.predict(X_test)
y_proba = pipeline.predict_proba(X_test)[:,1]  # Probabilidade de chuva

print("\n--- Probabilidades de Chuva ---")
print(y_proba)



# ------------------------------------------------------------------------------
# >>>> 7. Avaliação do modelo
# ------------------------------------------------------------------------------

# Supondo que você já tem y_proba
threshold = 0.7  # só prever chuva se a probabilidade for >= 70%
y_pred_high_precision = (y_proba >= threshold).astype(int)

# Avaliação
from sklearn.metrics import classification_report
print(classification_report(y_test, y_pred_high_precision))

print("\n--- Relatório de Classificação do Modelo Otimizado (XGBoost) ---")
print(classification_report(y_test, y_pred))
print("----------------------------------------------------------")

# --------------------------
# limiar
# --------------------------
from sklearn.metrics import precision_score, recall_score

# Limiar que você quer testar, por exemplo 0.6
threshold = 0.6
y_pred_threshold = (y_proba >= threshold).astype(int)

precision = precision_score(y_test, y_pred_threshold)
recall = recall_score(y_test, y_pred_threshold)

print(f"Limiar: {threshold}")
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")


# ------------------------------------------------------------------------------
# >>>> 8. Importância das features
# ------------------------------------------------------------------------------
importances = pipeline.named_steps['clf'].feature_importances_
feature_names = X.columns
feature_importance_df = pd.DataFrame({'feature': feature_names, 'importance': importances})
print(feature_importance_df.sort_values(by='importance', ascending=False).head(10))
'''
# 6. Define o grid de parâmetros para o XGBoost
# Os parâmetros são diferentes do Random Forest.
param_grid = {
    'clf__n_estimators': [100, 200, 300],
    'clf__max_depth': [3, 5, 7],
    'clf__learning_rate': [0.01, 0.1, 0.2]
}

# 7. Executa o Grid Search com o novo pipeline e grid de parâmetros -> ja executei, ja sei os parametros
print("5. Iniciando o Grid Search para XGBoost...")
grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='f1', n_jobs=-1)
grid_search.fit(X_train, y_train)

print("\n--- Melhores Parâmetros Encontrados ---")
print(grid_search.best_params_)
print("-----------------------------------------")

# 8. Avalia o melhor modelo encontrado no conjunto de teste
print("\n6. Avaliando o melhor modelo no conjunto de teste...")
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)


# Probabilidade de chuva
y_proba = best_model.predict_proba(X_test)[:,1]

# Avaliação (opcional)
from sklearn.metrics import classification_report
print(classification_report(y_test, y_pred))


# 9. Imprime o relatório de classificação
print("\n--- Relatório de Classificação do Modelo Otimizado (XGBoost) ---")
print(classification_report(y_test, y_pred))
print("----------------------------------------------------------")

# Imprime a importância das features do melhor modelo
importances = best_model.named_steps['clf'].feature_importances_
feature_names = X.columns
feature_importance_df = pd.DataFrame({'feature': feature_names, 'importance': importances})
print(feature_importance_df.sort_values(by='importance', ascending=False).head(10))
'''
from sklearn.calibration import calibration_curve
from sklearn.metrics import brier_score_loss
import matplotlib.pyplot as plt

# y_proba: probabilidades previstas de chuva (como você já tem)
# y_test: valores reais

# 1. Brier score (quanto menor, melhor)
brier = brier_score_loss(y_test, y_proba)
print(f"Brier Score: {brier:.4f}")

# 2. Curva de calibração
prob_true, prob_pred = calibration_curve(y_test, y_proba, n_bins=10)

plt.figure(figsize=(6,6))
plt.plot(prob_pred, prob_true, marker='o', label='Modelo')
plt.plot([0,1],[0,1], linestyle='--', label='Perfeitamente calibrado')
plt.xlabel('Probabilidade prevista')
plt.ylabel('Frequência real')
plt.title('Curva de Calibração')
plt.legend()
plt.show()

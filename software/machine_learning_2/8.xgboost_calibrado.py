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

# 4. Split temporal (70% treino, 15% calibração, 15% teste)
print("4. Dividindo os dados em treino, calibração e teste...")
train_end = int(len(df_processed) * 0.70)
calib_end = int(len(df_processed) * 0.85)

# Divisão para o modelo base
X_train_base, y_train_base = X.iloc[:train_end], y.iloc[:train_end]

# Divisão para o calibrador
X_calib, y_calib = X.iloc[train_end:calib_end], y.iloc[train_end:calib_end]

# Divisão para o teste final
X_test, y_test = X.iloc[calib_end:], y.iloc[calib_end:]

print(f"Tamanho do treino: {len(X_train_base)} amostras")
print(f"Tamanho da calibração: {len(X_calib)} amostras")
print(f"Tamanho do teste: {len(X_test)} amostras")


# ---------------------------
# Treinar XGBoost e Calibrar
# ---------------------------
# Define o modelo (a definição não muda)
base_clf = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.1,
    n_jobs=-1,
    random_state=42,
    eval_metric='logloss',
    use_label_encoder=False
)

# 1. Treina o modelo base APENAS nos dados de treino
print("\n1. Treinando modelo base...")
base_clf.fit(X_train_base, y_train_base)

# 2. Instancia o calibrador com o modelo pré-treinado
calibrated_clf = CalibratedClassifierCV(estimator=base_clf, method='isotonic', cv='prefit')

# 3. Treina o calibrador APENAS nos dados de calibração
print("2. Calibrando o modelo...")
calibrated_clf.fit(X_calib, y_calib)

# 4. Avalia no conjunto de teste que nunca foi visto
print("3. Gerando previsões no conjunto de teste...")
y_proba_calibrated = calibrated_clf.predict_proba(X_test)[:,1]

# Previsão "sim/não" usando um limiar
threshold = 0.5
y_pred = (y_proba_calibrated >= threshold).astype(int)

######### ver o quao bom esta

from sklearn.metrics import brier_score_loss
brier = brier_score_loss(y_test, y_proba_calibrated)
print(f"Brier Score: {brier:.4f}")

from sklearn.calibration import calibration_curve
import matplotlib.pyplot as plt

prob_true, prob_pred = calibration_curve(y_test, y_proba_calibrated, n_bins=10)

plt.figure(figsize=(6,6))
plt.plot(prob_pred, prob_true, marker='o', label='Modelo calibrado')
plt.plot([0,1], [0,1], linestyle='--', label='Perfeitamente calibrado')
plt.xlabel('Probabilidade prevista')
plt.ylabel('Frequência real')
plt.title('Curva de calibração')
plt.legend()
plt.show()

from sklearn.metrics import precision_score, recall_score, classification_report

# ==============================================================================
# PARTE FINAL: ANÁLISE DE PRECISION E RECALL (Pós-Calibração)
# ==============================================================================

# 1. Definir o threshold (limiar) para a decisão "sim/não"
# O valor de 0.5 é o padrão, mas você pode experimentar outros valores (ex: 0.4, 0.6).
threshold = 0.5

# 2. Converter as probabilidades em previsões binárias (0 para 'não chove', 1 para 'chove')
y_pred = (y_proba_calibrated >= threshold).astype(int)

# 3. Calcular e imprimir as métricas
print("\n==============================================")
print("      Análise de Precision e Recall")
print("==============================================")
print(f"\nResultados com um threshold de {threshold}:")

# O relatório completo é a forma mais prática de ver tudo
# target_names melhora a leitura do relatório
print(classification_report(y_test, y_pred, target_names=['Não Chove (0)', 'Chove (1)']))
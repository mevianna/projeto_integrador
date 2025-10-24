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
from sklearn.metrics import brier_score_loss
from sklearn.calibration import calibration_curve
import matplotlib.pyplot as plt


# ==============================================================================
# TENTATIVA: VERIFICAR O MODELO "ANTIGO" (Sem split de Calibração)
# ==============================================================================

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

print("Features usadas no modelo:\n")
print(X.columns.tolist())
print(f"\nTotal de features: {len(X.columns)}")


print("\n\n=======================================================")
print("   Rodando a provável VERSÃO ANTIGA (sem calibração)")
print("=======================================================\n")

# 1. Split (85% treino, 15% teste)
# O 'calib_end' do seu código original é o fim do treino aqui
train_end_full = int(len(df_processed) * 0.85) # O mesmo que calib_end

X_train_v_antiga, y_train_v_antiga = X.iloc[:train_end_full], y.iloc[:train_end_full]
X_test_v_antiga, y_test_v_antiga = X.iloc[train_end_full:], y.iloc[train_end_full:]

print(f"Tamanho do treino (antigo): {len(X_train_v_antiga)} amostras")
print(f"Tamanho do teste (antigo): {len(X_test_v_antiga)} amostras")

# 2. Define o modelo (o mesmo XGBoost)
modelo = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.1,
    n_jobs=-1,
    random_state=42,
    eval_metric='logloss',
    use_label_encoder=False
)

# 3. Treina o modelo nos 85% dos dados
print("\nTreinando o modelo antigo (em 85% dos dados)...")
modelo.fit(X_train_v_antiga, y_train_v_antiga)

# 4. Gera previsões de probabilidade
y_proba_antigo = modelo.predict_proba(X_test_v_antiga)[:,1]

# 5. Avalia o Brier Score
brier_antigo = brier_score_loss(y_test_v_antiga, y_proba_antigo)
print(f"\nBrier Score (Versão Antiga): {brier_antigo:.4f}")

# 6. Plota a curva de calibração
print("Plotando a curva de calibração (Versão Antiga)...")
prob_true_antigo, prob_pred_antigo = calibration_curve(y_test_v_antiga, y_proba_antigo, n_bins=10)

plt.figure(figsize=(6,6))
plt.plot(prob_pred_antigo, prob_true_antigo, marker='o', label='Nosso modelo')
plt.plot([0,1], [0,1], linestyle='--', label='Perfeitamente calibrado')
plt.xlabel('Probabilidade prevista')
plt.ylabel('Frequência real')
plt.title('Modelo')
plt.legend()
plt.show()

modelo.get_booster().save_model("modelo_xgb.json")
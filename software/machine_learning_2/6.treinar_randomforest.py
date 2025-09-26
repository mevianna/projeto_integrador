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
from sklearn.model_selection import GridSearchCV

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

# 5. Define o Pipeline de Machine Learning
# O pipeline irá lidar com valores faltantes, escalar os dados,
# balancear os dados de treino (SMOTE) e treinar o classificador.
pipeline = ImbPipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("smote", SMOTE(random_state=42)),
    ("clf", RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)) # n_jobs=-1 usa todos os cores do processador
])

# ==============================================================================
# 6. OTIMIZAÇÃO DE HIPERPARÂMETROS COM GridSearchCV
# ==============================================================================
print("\n5. Configurando a busca por hiperparâmetros...")

# Define o "cardápio" de parâmetros que o GridSearchCV vai testar.
# Usamos 'clf__' como prefixo para dizer ao pipeline que esses parâmetros são do classificador (RandomForest).
param_grid = {
    'clf__n_estimators': [100, 200, 300],          # Número de árvores na floresta
    'clf__max_depth': [10, 20, None],              # Profundidade máxima de cada árvore
    'clf__min_samples_leaf': [1, 2, 4],            # Número mínimo de amostras em um nó folha
    'clf__class_weight': ['balanced', None]        # Pesar as classes para ajudar no desbalanceamento
}

# Configura o GridSearchCV
# cv=3 significa que ele fará uma validação cruzada com 3 "folds"
# scoring='f1' diz a ele para encontrar a combinação que maximiza o F1-Score para a classe positiva (chuva)
# verbose=2 mostra o progresso do processo (útil para saber que não travou)
# n_jobs=-1 usa todos os núcleos do seu processador para acelerar o processo
grid_search = GridSearchCV(estimator=pipeline, 
                           param_grid=param_grid, 
                           scoring='f1', 
                           cv=3, 
                           n_jobs=-1, 
                           verbose=2)

# 7. Executa a busca (esta é a parte que pode demorar)
print("6. Executando a otimização (GridSearch)... Isso pode levar vários minutos.")
grid_search.fit(X_train, y_train)

# 8. Mostra os melhores parâmetros encontrados
print("\n--- Melhores Parâmetros Encontrados ---")
print(grid_search.best_params_)
print("-----------------------------------------")

# 9. Avalia o MELHOR modelo encontrado nos dados de teste
print("\n7. Avaliando o melhor modelo no conjunto de teste...")
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)

# 10. Imprime o relatório de classificação final
print("\n--- Relatório de Classificação do Modelo Otimizado ---")
print(classification_report(y_test, y_pred))
print("----------------------------------------------------------")

''' Antes de fazer o grid search tava assim:
# 6. Treina o modelo
print("\n5. Treinando o modelo...")
pipeline.fit(X_train, y_train)


# 7. Avalia o modelo nos dados de teste
print("6. Avaliando o modelo...")
y_pred = pipeline.predict(X_test)

# 8. Imprime o relatório de classificação
print("\n--- Relatório de Classificação ---")
print(classification_report(y_test, y_pred))
print("------------------------------------")

# Depois do treino (pipeline.fit)
importances = pipeline.named_steps['clf'].feature_importances_
feature_names = X.columns
feature_importance_df = pd.DataFrame({'feature': feature_names, 'importance': importances})
print(feature_importance_df.sort_values(by='importance', ascending=False).head(10))
'''
"""
***************************************************************************
 * File name: randomforest_training.py
 * Description: Complete rain prediction pipeline with feature engineering,
 *              preprocessing, class balancing (SMOTE), Random Forest training,
 *              and hyperparameter optimization via GridSearchCV.
 * Author: 
 * Creation date: 
 * Last modified:
 * Contact: 
 * ***************************************************************************
 * Description:
 * This script implements a full end-to-end machine learning workflow for 
 * binary rain prediction. It includes:
 *   - Temporal and lag-based feature engineering
 *   - Standard preprocessing steps (imputation, scaling)
 *   - Synthetic oversampling with SMOTE to address class imbalance
 *   - Training a Random Forest classifier inside an imbalanced-learn Pipeline
 *   - Hyperparameter tuning via GridSearchCV
 *   - Evaluation with a classification report on the test set
 *
 * Workflow:
 * 1. Load and chronologically sort the raw dataset.
 * 2. Apply create_features() to generate:
 *      - Temporal features (hour, dayofweek, month)
 *      - Lag features (1h, 3h, 6h) for key weather variables
 *      - Rolling statistics (mean/std with window=3)
 *      - Difference features (1h deltas)
 * 3. Remove rows containing NaNs introduced by lag/rolling operations.
 * 4. Split dataset temporally (80% train, 20% test).
 * 5. Define an ImbPipeline with steps:
 *        - SimpleImputer (median)
 *        - StandardScaler
 *        - SMOTE oversampling
 *        - RandomForestClassifier
 * 6. Configure a hyperparameter search space for Random Forest:
 *        - n_estimators, max_depth, min_samples_leaf, class_weight
 * 7. Run GridSearchCV (cv=3, scoring='f1', n_jobs=-1, verbose=2).
 * 8. Retrieve and display the best parameter combination.
 * 9. Evaluate the best model on the test set (classification_report).
 * 10. (Optional) Legacy snippet included for comparison with pre-GridSearch runs.
 *
 * Inputs:
 *   - CSV file: "dataset_final_rain_binario.csv"
 *       Expected columns:
 *         - datetime (parseable)
 *         - rain (binary target)
 *         - precip_mm (dropped)
 *         - weather variables: 
 *             cloudcover, pressure_mB, temp_C, rh_pct, wind_speed_m_s
 *
 * Outputs:
 *   - Printed feature list and dataset split sizes
 *   - Full GridSearchCV progress and best parameter results
 *   - Classification report for the optimized model
 *   - (Optional) Feature importance printed for non-tuned RF version
 *
 * Requirements:
 *   - Interpreter:
 *       - Python 3.10+ (tested with Python 3.13.1). Virtual environment recommended.
 *   - Python libraries:
 *       - pandas >= 1.5
 *       - numpy >= 1.24
 *       - scikit-learn >= 1.2
 *       - imbalanced-learn >= 0.10
 *       - matplotlib >= 3.7 (optional for debugging/plots)
 ****************************************************************************
"""
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.model_selection import GridSearchCV

# FEATURES ENGINEERING
def create_features(df):
    df = df.copy()
    
    # Timestamp features
    df['hour'] = df['datetime'].dt.hour
    df['dayofweek'] = df['datetime'].dt.dayofweek
    df['month'] = df['datetime'].dt.month
    
    # Lag features
    lag_features = ['cloudcover', 'pressure_mB', 'temp_C', 'rh_pct', 'wind_speed_m_s']
    
    for feature in lag_features:
        df[f'{feature}_lag1'] = df[feature].shift(1) # Lag de 1 hora
        df[f'{feature}_lag3'] = df[feature].shift(3) # Lag de 3 horas
        df[f'{feature}_lag6'] = df[feature].shift(6) # Lag de 6 horas
        
    # Mobile features
    df['temp_C_roll_mean_3'] = df['temp_C'].rolling(window=3).mean()
    df['pressure_mB_roll_std_3'] = df['pressure_mB'].rolling(window=3).std()

    df['rh_pct_diff_1h'] = df['rh_pct'] - df['rh_pct_lag1']
    df['cloudcover_diff_1h'] = df['cloudcover'] - df['cloudcover_lag1']

    # Remove all NaNs from the columns
    df.dropna(inplace=True)
    
    return df

# MAIN EXECUTION

# Load original Data
print("1. Carregando dados originais...")
df_original = pd.read_csv("dataset_final_rain_binario.csv", parse_dates=["datetime"])
df_original = df_original.sort_values("datetime").reset_index(drop=True)

# Create new features
print("2. Criando features de tempo e lag...")
df_processed = create_features(df_original)

# Split features (x) and target (y)
print("3. Separando features (X) e alvo (y)...")
X = df_processed.drop(columns=["datetime", "precip_mm", "rain"])
y = df_processed["rain"]

# Time spit (80% train, 20% tests)
print("4. Dividindo os dados em treino e teste (split temporal)...")
split_idx = int(len(df_processed) * 0.8)
X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
print(f"Tamanho do treino: {len(X_train)} amostras")
print(f"Tamanho do teste: {len(X_test)} amostras")

# Define the pipeline
pipeline = ImbPipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("smote", SMOTE(random_state=42)),
    ("clf", RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)) 
])

# 6. OTIMIZAÇÃO DE HIPERPARÂMETROS COM GridSearchCV
print("\n5. Configurando a busca por hiperparâmetros...")

param_grid = {
    'clf__n_estimators': [100, 200, 300],          
    'clf__max_depth': [10, 20, None],              
    'clf__min_samples_leaf': [1, 2, 4],           
    'clf__class_weight': ['balanced', None]       
}

# Configure o GridSearchCV
grid_search = GridSearchCV(estimator=pipeline, 
                           param_grid=param_grid, 
                           scoring='f1', 
                           cv=3, 
                           n_jobs=-1, 
                           verbose=2)

# Execute the search for best parameters
print("6. Executando a otimização (GridSearch)... Isso pode levar vários minutos.")
grid_search.fit(X_train, y_train)

# Best parameters found
print("\n--- Melhores Parâmetros Encontrados ---")
print(grid_search.best_params_)
print("-----------------------------------------")

# Evaluation of the best model
print("\n7. Avaliando o melhor modelo no conjunto de teste...")
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)

# Print classification report
print("\n--- Relatório de Classificação do Modelo Otimizado ---")
print(classification_report(y_test, y_pred))
print("----------------------------------------------------------")
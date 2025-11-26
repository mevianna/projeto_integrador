"""
***************************************************************************
 * File name: xgboost.py
 * Description: Attempts to reproduce the "old" model version (without a 
 *              dedicated calibration split) using engineered features 
 *              (temporal, lag, rolling window, and difference-based).
 * Author: 
 * Creation date:
 * Last modified: 
 * Contact: 
 * ***************************************************************************
 * Description:
 * This script performs a full preprocessing and modeling pipeline intended to
 * replicate an older version of a rain prediction model that did not use a 
 * separate calibration dataset. It:
 *   - Loads and sorts the raw dataset
 *   - Builds engineered features (time-based, lagged values, rolling statistics)
 *   - Splits the data chronologically (85% train, 15% test)
 *   - Trains an XGBoost classifier
 *   - Evaluates the probabilistic performance via Brier Score
 *   - Generates and displays a calibration curve
 *   - Saves the final model to disk (JSON format)
 *
 * Workflow:
 * 1. Load the dataset and ensure chronological ordering.
 * 2. Apply the create_features() function to generate additional inputs:
 *      - Temporal features (hour, dayofweek, month)
 *      - Lag features for key variables (1h, 3h, 6h)
 *      - Rolling window statistics (e.g., mean/std)
 *      - First-order differences for certain variables
 * 3. Drop rows with NaN values produced by lag/rolling operations.
 * 4. Separate processed features (X) from the target (y).
 * 5. Split into train/test using time-based slicing (85% train).
 * 6. Train a standard XGBoost classifier (no calibration split).
 * 7. Generate probability predictions and compute the Brier score.
 * 8. Plot calibration curves for model evaluation.
 * 9. Save the trained model (`modelo_xgb.json`).
 *
 * Inputs:
 *   - CSV file: "dataset_final_rain_binario.csv"
 *       Required columns include:
 *         - datetime (parseable)
 *         - precip_mm (dropped)
 *         - rain (binary target)
 *         - cloudcover, pressure_mB, temp_C, rh_pct, wind_speed_m_s
 *         - any additional original features
 *
 * Outputs:
 *   - Printed messages indicating dataset size, feature list, Brier score
 *   - Calibration curve displayed using matplotlib
 *   - "modelo_xgb.json" saved containing the trained booster
 *
 * Requirements:
 *   - Interpreter:
 *       - Python 3.13.1
 *   - Python libraries:
 *       - pandas >= 1.5
 *       - numpy >= 1.24
 *       - xgboost >= 1.8
 *       - scikit-learn >= 1.2
 *       - imbalanced-learn (optional imports included)
 *       - matplotlib >= 3.7
 ***************************************************************************
"""
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
import xgboost as xgb
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import brier_score_loss
from sklearn.calibration import calibration_curve
import matplotlib.pyplot as plt


# TRY TO VERIFY THE OLD MODEL (Without calibration split)

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

print("Features usadas no modelo:\n")
print(X.columns.tolist())
print(f"\nTotal de features: {len(X.columns)}")


print("   Rodando a provável VERSÃO ANTIGA (sem calibração)")

# Split (85% train, 15% tests)
train_end_full = int(len(df_processed) * 0.85)

X_train_v_antiga, y_train_v_antiga = X.iloc[:train_end_full], y.iloc[:train_end_full]
X_test_v_antiga, y_test_v_antiga = X.iloc[train_end_full:], y.iloc[train_end_full:]

print(f"Tamanho do treino (antigo): {len(X_train_v_antiga)} amostras")
print(f"Tamanho do teste (antigo): {len(X_test_v_antiga)} amostras")

# Define XGBoost
modelo = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.1,
    n_jobs=-1,
    random_state=42,
    eval_metric='logloss',
    use_label_encoder=False
)

# Train model with 85% of the data
print("\nTreinando o modelo antigo (em 85% dos dados)...")
modelo.fit(X_train_v_antiga, y_train_v_antiga)

# Probability predictions
y_proba_antigo = modelo.predict_proba(X_test_v_antiga)[:,1]

# Evaluate Brier score
brier_antigo = brier_score_loss(y_test_v_antiga, y_proba_antigo)
print(f"\nBrier Score (Versão Antiga): {brier_antigo:.4f}")

# Plot calibration curve
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
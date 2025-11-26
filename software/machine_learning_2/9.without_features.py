"""
***************************************************************************
 * File name: without_features.py
 * Description: XGBoost training using only the original features.
 * Author: 
 * Creation date: 
 * Last modified: 
 * Contact: 
 * ***************************************************************************
 * Description:
 * This script trains an XGBoost binary classifier to predict rain using only
 * the original features present in the dataset (no engineered features).
 * It evaluates the model with the Brier score, plots a calibration curve,
 * and saves the trained model to disk (binary and JSON formats).
 *
 * Workflow:
 * 1. Load the original dataset from a CSV and sort by datetime.
 * 2. Select only the original feature columns (drop datetime, precip_mm, rain).
 * 3. Split the data into train and test sets (85% train, 15% test).
 * 4. Define an XGBoost classifier with baseline hyperparameters.
 * 5. Train the model on the training set.
 * 6. Predict probabilities on the test set.
 * 7. Compute the Brier score to evaluate probabilistic calibration.
 * 8. Compute and plot a calibration curve (n_bins=10).
 * 9. Save the trained model to disk as both .bin and .json files.
 *
 * Inputs:
 *   - CSV file: "dataset_final_rain_binario.csv" with at least the columns:
 *       - "datetime" (parseable as datetime)
 *       - "precip_mm" (raw precipitation, dropped for training)
 *       - "rain" (binary target)
 *       - other original feature columns used as predictors
 *
 * Outputs:
 *   - "modelo_xgb.bin"  : saved XGBoost booster (binary)
 *   - "modelo_xgb.json" : saved XGBoost booster (JSON)
 *   - Calibration plot displayed using matplotlib
 *   - Printed model statistics (feature list, train/test sizes, Brier score)
 *
 * Requirements:
 *   - Interpreter:
 *       - Python 3.13.1
 *   - Python libraries
 *       - pandas >= 1.5
 *       - xgboost >= 1.8
 *       - scikit-learn >= 1.2
 *       - matplotlib >= 3.7
 ***************************************************************************
"""
import pandas as pd
import xgboost as xgb
from sklearn.calibration import calibration_curve
import matplotlib.pyplot as plt
from sklearn.metrics import brier_score_loss

# 1. Load orignal data
df = pd.read_csv("dataset_final_rain_binario.csv", parse_dates=["datetime"])
df = df.sort_values("datetime").reset_index(drop=True)

# 2. Split original features (x) and the target (y)
X = df.drop(columns=["datetime", "precip_mm", "rain"])  # only original colu
y = df["rain"]

print("Features originais usadas no modelo:\n")
print(X.columns.tolist())
print(f"\nTotal de features: {len(X.columns)}")

# 3. Split train/tests (85% train, 15% tests)
train_end = int(len(df) * 0.85)
X_train, y_train = X.iloc[:train_end], y.iloc[:train_end]
X_test, y_test = X.iloc[train_end:], y.iloc[train_end:]

print(f"Tamanho do treino: {len(X_train)} amostras")
print(f"Tamanho do teste: {len(X_test)} amostras")

# 4. Define XGBoost
modelo = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.1,
    n_jobs=-1,
    random_state=42,
    eval_metric='logloss',
    use_label_encoder=False
)

# 5. Train model
modelo.fit(X_train, y_train)

# 6. Probabilty predictions
y_proba = modelo.predict_proba(X_test)[:,1]

# 7. Evaluate Brier score
brier = brier_score_loss(y_test, y_proba)
print(f"\nBrier Score (somente features originais): {brier:.4f}")

# 8. Calibration curve
prob_true, prob_pred = calibration_curve(y_test, y_proba, n_bins=10)

plt.figure(figsize=(6,6))
plt.plot(prob_pred, prob_true, marker='o', label='Nosso modelo')
plt.plot([0,1], [0,1], linestyle='--', label='Perfeitamente calibrado')
plt.xlabel('Probabilidade prevista')
plt.ylabel('Frequência real')
plt.title('Curva de calibração (features originais)')
plt.legend()
plt.show()

# 9. Save model
modelo.get_booster().save_model("modelo_xgb.bin")
modelo.get_booster().save_model("modelo_xgb.json")

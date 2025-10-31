# ==================================================================
# Treinamento XGBoost apenas com features originais
# ==================================================================

import pandas as pd
import xgboost as xgb
from sklearn.calibration import calibration_curve
import matplotlib.pyplot as plt
from sklearn.metrics import brier_score_loss

# 1. Carrega os dados originais
df = pd.read_csv("dataset_final_rain_binario.csv", parse_dates=["datetime"])
df = df.sort_values("datetime").reset_index(drop=True)

# 2. Separa features originais (X) e alvo (y)
X = df.drop(columns=["datetime", "precip_mm", "rain"])  # apenas colunas originais
y = df["rain"]

print("Features originais usadas no modelo:\n")
print(X.columns.tolist())
print(f"\nTotal de features: {len(X.columns)}")

# 3. Split treino/teste (85% treino, 15% teste)
train_end = int(len(df) * 0.85)
X_train, y_train = X.iloc[:train_end], y.iloc[:train_end]
X_test, y_test = X.iloc[train_end:], y.iloc[train_end:]

print(f"Tamanho do treino: {len(X_train)} amostras")
print(f"Tamanho do teste: {len(X_test)} amostras")

# 4. Define o modelo XGBoost
modelo = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.1,
    n_jobs=-1,
    random_state=42,
    eval_metric='logloss',
    use_label_encoder=False
)

# 5. Treina o modelo
modelo.fit(X_train, y_train)

# 6. Previsões de probabilidade
y_proba = modelo.predict_proba(X_test)[:,1]

# 7. Avalia Brier Score
brier = brier_score_loss(y_test, y_proba)
print(f"\nBrier Score (somente features originais): {brier:.4f}")

# 8. Curva de calibração
prob_true, prob_pred = calibration_curve(y_test, y_proba, n_bins=10)

plt.figure(figsize=(6,6))
plt.plot(prob_pred, prob_true, marker='o', label='Nosso modelo')
plt.plot([0,1], [0,1], linestyle='--', label='Perfeitamente calibrado')
plt.xlabel('Probabilidade prevista')
plt.ylabel('Frequência real')
plt.title('Curva de calibração (features originais)')
plt.legend()
plt.show()

# 9. Salva modelo
modelo.get_booster().save_model("modelo_xgb.bin")
modelo.get_booster().save_model("modelo_xgb.json")

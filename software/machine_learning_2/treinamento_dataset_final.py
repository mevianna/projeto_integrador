import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

# --- 1️⃣ Ler dataset ---
df = pd.read_csv("dataset_ml_2024_final.csv")

# --- 2️⃣ Selecionar features e target ---
features = ["temperatura", "umidade", "pressao", "vento_vel", "vento_sin", "vento_cos", "cloudcover"]
target = "chuva_bin"

X = df[features].astype(float)  # garante float
y = df[target]

# --- 3️⃣ Separar treino e teste ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# --- 4️⃣ Treinar Random Forest com balanceamento de classes ---
clf = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight='balanced'  # ajusta para dados desbalanceados
)
clf.fit(X_train, y_train)

# --- 5️⃣ Avaliar modelo ---
y_pred = clf.predict(X_test)
y_prob = clf.predict_proba(X_test)[:, 1]  # Probabilidade de chuva

print("=== Classification Report ===")
print(classification_report(y_test, y_pred))

print("=== Confusion Matrix ===")
print(confusion_matrix(y_test, y_pred))

print("=== ROC AUC Score ===")
print(roc_auc_score(y_test, y_prob))

# --- 6️⃣ Ajustar threshold para melhorar recall de chuva ---
threshold = 0.2  # exemplo: prever chuva se p > 0.2
y_pred_thresh = (y_prob > threshold).astype(int)

print(f"\n=== Confusion Matrix com threshold={threshold} ===")
print(confusion_matrix(y_test, y_pred_thresh))

# --- 7️⃣ Exemplo de previsão probabilística para sensores ESP ---
# Suponha que você tenha 1 hora de dados do ESP
exemplo_esp = pd.DataFrame({
    "temperatura": [35.0],
    "umidade": [60.0],
    "pressao": [1010.0],
    "vento_vel": [2.0],
    "vento_sin": [np.sin(np.deg2rad(270))],  # exemplo: vento oeste
    "vento_cos": [np.cos(np.deg2rad(270))],
    "cloudcover": [50]
})

prob_esp = clf.predict_proba(exemplo_esp)[:, 1]
print("\nProbabilidade de chuva para dados do ESP:")
print(prob_esp)

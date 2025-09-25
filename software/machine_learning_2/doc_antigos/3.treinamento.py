import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, roc_auc_score, brier_score_loss

# 1. Ler CSV
df = pd.read_csv("documento_dados_historicos.csv")

# 2. Criar alvo binário
df["rain"] = (df["precipitation"] > 0.1).astype(int)

# 3. Selecionar features
features = [
    "temperature_2m",
    "relative_humidity_2m",
    "pressure_msl",
    "cloudcover",
    "windspeed_10m",
    "winddirection_10m"
]
X = df[features].copy()
y = df["rain"].copy()

# 4. Transformar direção do vento em seno/cosseno
X["winddir_sin"] = np.sin(np.deg2rad(X["winddirection_10m"]))
X["winddir_cos"] = np.cos(np.deg2rad(X["winddirection_10m"]))
X = X.drop(columns=["winddirection_10m"])

# 5. Criar features de lag/tendência
X['humidity_3h_avg'] = df['relative_humidity_2m'].rolling(3).mean().shift(1) 
X['pressure_diff_1h'] = df['pressure_msl'].diff().shift(1)
X = X.dropna()
y = y.loc[X.index]

# 6. Split temporal (80% treino, 20% teste)
split_idx = int(len(X) * 0.8)
X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

# 7. Padronizar features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 8. Treinar regressão logística balanceada
logreg = LogisticRegression(class_weight='balanced', max_iter=1000)
logreg.fit(X_train_scaled, y_train)

# 9. Calibrar probabilidades
clf = CalibratedClassifierCV(logreg, method='isotonic', cv='prefit')
clf.fit(X_train_scaled, y_train)

# 10. Probabilidades e previsões
y_prob = clf.predict_proba(X_test_scaled)[:,1]  # probabilidade de chuva
y_pred = (y_prob >= 0.2).astype(int)  # limiar baixo para maximizar recall

# 11. Avaliação do modelo
print("Classification Report (binário):")
print(classification_report(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, y_prob))
print("Brier score (calibração):", brier_score_loss(y_test, y_prob))

# 12. Exibir % + mensagem
def mensagem_chuva(prob):
    if prob < 0.1:
        return "Pouca chance de chuva"
    elif prob < 0.3:
        return "Chance baixa de chuva"
    elif prob < 0.6:
        return "Chance moderada de chuva"
    elif prob < 0.9:
        return "Boa chance de chuva"
    else:
        return "Alta chance de chuva"

for i, prob in enumerate(y_prob[:10]):
    print(f"Hora {i}: {prob*100:.1f}% chance de chuva — {mensagem_chuva(prob)}")

# 13. Avaliação usando categorias
y_prob_cat = [mensagem_chuva(p) for p in y_prob]
y_true_cat = ["Chuva" if r == 1 else "Sem chuva" for r in y_test]

df_eval = pd.DataFrame({
    "previsto": y_prob_cat,
    "real": y_true_cat
})

conf_matrix = pd.crosstab(df_eval["real"], df_eval["previsto"])
print("\nMatriz de confusão (categorias):")
print(conf_matrix)

print("\nRelatório de previsão por categoria:")
for cat in sorted(set(y_prob_cat)):
    total_real = sum(df_eval["real"]=="Chuva")
    total_previsto = sum(df_eval["previsto"]==cat)
    print(f"{cat}: previsto {total_previsto}, total chuva real {total_real}")

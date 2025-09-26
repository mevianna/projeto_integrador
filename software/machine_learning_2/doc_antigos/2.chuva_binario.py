import pandas as pd
import numpy as np

# Caminho do arquivo
caminho_csv = "documento_dados_historicos.csv"

# 1. Ler o CSV
df = pd.read_csv(caminho_csv)

# 2. Criar alvo binário (0 = não choveu, 1 = choveu)
# Usamos 0.1 mm como limiar para evitar "chuvisco"
df["rain"] = (df["precipitation"] > 0.1).astype(int)

# 3. Selecionar features que correspondem aos nossos sensores + API
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

print("Formato das features:", X.shape)
print("Distribuição do alvo (rain):")
print(y.value_counts(normalize=True))

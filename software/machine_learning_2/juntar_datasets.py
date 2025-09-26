import pandas as pd
import numpy as np

# --- 1️⃣ Ler dados do INMET ---
df_inmet = pd.read_csv("INMET_S_SC_A867_ARARANGUA_01-01-2024_A_31-12-2024.csv", sep=";")

# Criar coluna datetime
df_inmet["datetime"] = pd.to_datetime(
    df_inmet["Data"] + " " + df_inmet["Hora UTC"].str.replace(" UTC", ""), 
    format="%Y/%m/%d %H%M"
)

# --- 2️⃣ Ler dados de cloud cover ---
df_cloud = pd.read_csv("cloudcover_2024.csv")
df_cloud["datetime"] = pd.to_datetime(df_cloud["datetime"])

# --- 3️⃣ Merge dos datasets ---
df_merged = pd.merge(df_inmet, df_cloud, on="datetime", how="left")

# --- 4️⃣ Selecionar colunas úteis para ML ---
df_ml = df_merged[[
    "datetime",
    "PRECIPITACAO TOTAL, HORARIO (mm)",
    "TEMPERATURA DO AR - BULBO SECO, HORARIA (graus C)",
    "UMIDADE RELATIVA DO AR, HORARIA (%)",
    "PRESSAO ATMOSFERICA AO NIVEL DA ESTACAO, HORARIA (mB)",
    "VENTO, VELOCIDADE HORARIA (m/s)",
    "VENTO, DIRECAO HORARIA (gr) ( (gr))",
    "cloudcover"
]]

# Renomear colunas pra ficar mais fácil
df_ml.columns = [
    "datetime", "chuva", "temperatura", "umidade", "pressao", "vento_vel", "vento_dir", "cloudcover"
]

# --- 5️⃣ Corrigir vírgulas e converter para float ---
colunas_num = ["chuva", "temperatura", "pressao", "vento_vel"]
for col in colunas_num:
    df_ml[col] = df_ml[col].astype(str).str.replace(",", ".").astype(float)

# --- 6️⃣ Criar coluna chuva binária (choveu/não choveu) ---
df_ml["chuva_bin"] = (df_ml["chuva"] > 0).astype(int)

# --- 7️⃣ Converter direção do vento em seno e cosseno ---
df_ml["vento_sin"] = np.sin(np.deg2rad(df_ml["vento_dir"]))
df_ml["vento_cos"] = np.cos(np.deg2rad(df_ml["vento_dir"]))

# --- 8️⃣ Salvar CSV pronto pra ML ---
df_ml.to_csv("dataset_ml_2024_final.csv", index=False)
print("Arquivo 'dataset_ml_2024_final.csv' criado com sucesso!")

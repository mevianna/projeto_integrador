import pandas as pd
import numpy as np

# ======== Ler CSV ========
file_path = "INMET_S_SC_A867_ARARANGUA_01-01-2024_A_31-12-2024.csv"
df = pd.read_csv(file_path, sep=';', encoding='latin1')

# ======== Remover colunas extras "Unnamed" ========
df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

# ======== Converter vírgula para ponto e transformar colunas numéricas ========
num_cols = df.columns[2:]  # todas exceto Data e Hora UTC
for col in num_cols:
    df[col] = df[col].astype(str).str.replace(',', '.')
    df[col] = pd.to_numeric(df[col], errors='coerce')

# ======== Transformar direção do vento em seno e cosseno ========
df['winddir_sin'] = np.sin(np.deg2rad(df['VENTO, DIRECAO HORARIA (gr) ( (gr))']))
df['winddir_cos'] = np.cos(np.deg2rad(df['VENTO, DIRECAO HORARIA (gr) ( (gr))']))

# ======== Criar coluna de chuva binária ========
df['rain'] = (df['PRECIPITACAO TOTAL, HORARIO (mm)'] > 0.1).astype(int)

# ======== Renomear colunas para compatibilidade com sensores ========
df_sensores = df.rename(columns={
    "TEMPERATURA DO AR - BULBO SECO, HORARIA (graus C)": "temperature_2m",
    "UMIDADE RELATIVA DO AR, HORARIA (%)": "relative_humidity_2m",
    "PRESSAO ATMOSFERICA AO NIVEL DA ESTACAO, HORARIA (mB)": "pressure_msl",
    "VENTO, VELOCIDADE HORARIA (m/s)": "windspeed_10m"
})

# ======== Adicionar cloudcover da API (aqui só como placeholder) ========
df_sensores['cloudcover'] = np.nan

# ======== Selecionar colunas finais compatíveis com ESP ========
cols_final = [
    'temperature_2m',
    'relative_humidity_2m',
    'pressure_msl',
    'windspeed_10m',
    'winddir_sin',
    'winddir_cos',
    'rain',
    'cloudcover'
]

df_final = df_sensores[cols_final]

# ======== Visualizar primeiras linhas ========

print(df_final.describe())

import pandas as pd

# ==============================================================================
# SCRIPT PARA JUNTAR CLOUDCOVER + INMET (2022–2024)
# ==============================================================================

print("--- Lendo arquivos ---")
df_inmet = pd.read_csv("inmet_3_anos.csv", parse_dates=["datetime"])
df_cloud = pd.read_csv("cloudcover_3_anos.csv", parse_dates=["datetime"])

# Faz merge pelo datetime (inner = só onde os dois têm dado)
df = pd.merge(df_inmet, df_cloud, on="datetime", how="inner")

# Ordena só pra garantir
df = df.sort_values("datetime").reset_index(drop=True)

# Salva arquivo final
df.to_csv("cloudcover_e_inmet_3_anos.csv", index=False)

print("--- Arquivo salvo: cloudcover_e_inmet_3_anos.csv ---")
print(df.head())

import pandas as pd

df = pd.read_csv("cloudcover_e_inmet_3_anos.csv", parse_dates=["datetime"])

# remove espaços e converte para float
df["precip_mm"] = df["precip_mm"].astype(str).str.strip().astype(float)

# agora cria coluna binária rain
df["rain"] = (df["precip_mm"] > 0).astype(int)

df.to_csv("dataset_final_rain_binario.csv", index=False)

print(df.head())


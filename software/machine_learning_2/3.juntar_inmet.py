import pandas as pd

# ==============================================================================
# SCRIPT PARA JUNTAR E LIMPAR OS ARQUIVOS DO INMET (2022–2024)
# ==============================================================================

print("--- Lendo e processando os arquivos do INMET ---")

inmet_files = [
    "INMET_S_SC_A867_ARARANGUA_01-01-2022_A_31-12-2022.csv",
    "INMET_S_SC_A867_ARARANGUA_01-01-2023_A_31-12-2023.csv",
    "INMET_S_SC_A867_ARARANGUA_01-01-2024_A_31-12-2024.csv"
]

dfs = []
for file in inmet_files:
    # lê como texto pra evitar problema com vírgulas/decimais
    df = pd.read_csv(file, sep=";", decimal=",", dtype=str)
    
    # remove possíveis cabeçalhos repetidos no meio
    df = df[df["Data"] != "Data"]

    # cria coluna datetime juntando Data + Hora
    df["datetime"] = pd.to_datetime(
        df["Data"] + " " + df["Hora UTC"].str.replace(" UTC", ""),
        format="%Y/%m/%d %H%M"
    )

    dfs.append(df)

# junta e ordena
df_inmet = pd.concat(dfs, ignore_index=True)
df_inmet = df_inmet.sort_values("datetime").reset_index(drop=True)

# seleciona apenas colunas relevantes
keep = {
    "PRECIPITACAO TOTAL, HORARIO (mm)": "precip_mm",
    "PRESSAO ATMOSFERICA AO NIVEL DA ESTACAO, HORARIA (mB)": "pressure_mB",
    "TEMPERATURA DO AR - BULBO SECO, HORARIA (graus C)": "temp_C",
    "UMIDADE RELATIVA DO AR, HORARIA (%)": "rh_pct",
    "VENTO, DIRECAO HORARIA (gr) ( (gr))": "wind_dir_deg",
    "VENTO, VELOCIDADE HORARIA (m/s)": "wind_speed_m_s"
}

df_inmet = df_inmet[["datetime"] + list(keep.keys())]
df_inmet = df_inmet.rename(columns=keep)

# Converte strings com vírgula -> floats
for col in ["pressure_mB", "temp_C", "wind_speed_m_s"]:
    df_inmet[col] = (
        df_inmet[col]
        .astype(str)                   # garante string
        .str.replace(",", ".", regex=False)  # troca vírgula por ponto
        .replace("", "0")              # casos tipo ",2" ficam "0,2"
        .astype(float)                 # converte pra float
    )

# Converte precip_mm corretamente
df_inmet["precip_mm"] = (
    df_inmet["precip_mm"]
    .astype(str)
    .str.strip()
    .replace(r'^,', '0,', regex=True)   # ",2" → "0,2"
    .str.replace(",", ".", regex=False)  # vírgula decimal → ponto
    .astype(float)
)

# Agora salva CSV já corrigido
df_inmet.to_csv("inmet_3_anos.csv", index=False)

print("--- Arquivo final salvo: inmet_3_anos.csv ---")
print(df_inmet.head())


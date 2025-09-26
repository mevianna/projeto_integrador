import pandas as pd

# ====================================================================
# SCRIPT PARA JUNTAR E LIMPAR TODOS OS ARQUIVOS DO INMET (2022–2024)
# ====================================================================

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

# converte todas as colunas numéricas possíveis
for col in df_inmet.columns:
    if col != "datetime":
        df_inmet[col] = (
            df_inmet[col]
            .astype(str)
            .str.strip()
            .replace(r'^,', '0,', regex=True)   # ",2" → "0,2"
            .str.replace(",", ".", regex=False)  # vírgula decimal → ponto
        )
        # tenta converter pra float, ignora se não conseguir
        try:
            df_inmet[col] = df_inmet[col].astype(float)
        except:
            pass

# salva CSV completo com todas as colunas
df_inmet.to_csv("inmet_3_anos_todascolunas.csv", index=False)

print("--- Arquivo final salvo: inmet_3_anos_completo.csv ---")
print(df_inmet.head())

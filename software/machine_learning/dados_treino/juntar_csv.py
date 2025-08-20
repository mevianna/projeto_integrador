import pandas as pd

# Lista de arquivos
arquivos = ["primavera.csv", "verao.csv", "outono.csv", "inverno.csv"]

# Lê todos os CSVs e coloca em uma lista de DataFrames
dfs = [pd.read_csv(arq) for arq in arquivos]

# Junta todos os DataFrames
csv_final = pd.concat(dfs, ignore_index=True)

# Salva em um único CSV
csv_final.to_csv("csv_final.csv", index=False)

print(f"CSV final gerado com {len(csv_final)} linhas.")

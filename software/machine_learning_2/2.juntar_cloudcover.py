import pandas as pd

# Coloque os 3 arquivos CSV na mesma pasta que este script
# Lista com os nomes dos seus arquivos
files = ["cloudcover_2022.csv", "cloudcover_2023.csv", "cloudcover_2024.csv"]

# Lista para guardar os dados de cada arquivo
lista_de_dataframes = []

print("Lendo e combinando os arquivos de nuvens...")
for file in files:
    df = pd.read_csv(file)
    lista_de_dataframes.append(df)

# Junta todos os dataframes da lista em um único dataframe
df_nuvens_combinado = pd.concat(lista_de_dataframes, ignore_index=True)

# Boa prática: garantir que os dados fiquem em ordem de data
df_nuvens_combinado['datetime'] = pd.to_datetime(df_nuvens_combinado['datetime'])
df_nuvens_combinado = df_nuvens_combinado.sort_values(by='datetime')

# Salva o resultado em um novo arquivo CSV
output_filename = "cloudcover_3_anos.csv"
df_nuvens_combinado.to_csv(output_filename, index=False)

print(f"\nArquivo '{output_filename}' criado com sucesso!")
print(f"Total de registros combinados: {len(df_nuvens_combinado)}")
print("\nInício dos dados combinados:")
print(df_nuvens_combinado.head())
print("\nFinal dos dados combinados:")
print(df_nuvens_combinado.tail())
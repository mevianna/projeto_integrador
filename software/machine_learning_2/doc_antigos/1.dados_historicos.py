import requests
import pandas as pd

# ======== CONFIGURAÇÃO ========
# Latitude e longitude da cidade
latitude = -28.53   # Araranguá, SC
longitude = -48.63

# Intervalo de datas (ano/mês/dia)
start_date = "2023-01-01"
end_date   = "2023-12-31"

# Variáveis que correspondem aos sensores do ESP32
variables = [
    "temperature_2m",
    "relative_humidity_2m",
    "pressure_msl",
    "cloudcover",
    "windspeed_10m",
    "winddirection_10m",
    "precipitation"
]

# Nome do arquivo CSV que será criado
output_file = "documento_dados_historicos.csv"

# ======== REQUISIÇÃO ========
url = (
    "https://archive-api.open-meteo.com/v1/archive?"
    f"latitude={latitude}&longitude={longitude}"
    f"&start_date={start_date}&end_date={end_date}"
    "&hourly=" + ",".join(variables)
)

response = requests.get(url)
data = response.json()

# ======== CONVERSÃO PARA DATAFRAME ========
df = pd.DataFrame(data['hourly'])
df.to_csv(output_file, index=False)

print(f"Dados salvos em '{output_file}' com sucesso!")

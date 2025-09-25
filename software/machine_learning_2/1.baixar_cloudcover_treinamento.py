import requests
import pandas as pd

# URL da API
url = (
    "https://archive-api.open-meteo.com/v1/archive?"
    "latitude=-28.951476920243184&longitude=-49.4671919955338"
    "&start_date=2022-01-01&end_date=2022-12-31"
    "&hourly=cloudcover&timezone=UTC"
)

# Faz a requisição
response = requests.get(url)
data = response.json()

# Extrai os dados de cloudcover
df = pd.DataFrame({
    "datetime": data["hourly"]["time"],
    "cloudcover": data["hourly"]["cloudcover"]
})

# Salva em CSV
df.to_csv("cloudcover_2022.csv", index=False)
print("Arquivo cloudcover_2022.csv salvo!")

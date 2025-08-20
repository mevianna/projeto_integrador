# Este arquivo pega o txt, que foi adquirido no site, e transforma em csv.

import re
import csv

# Função para extrair campos básicos de um METAR
def parse_metar(line):
    # Remove tudo antes de "METAR" ou "SPECI"
    if "METAR" in line:
        idx = line.find("METAR")
    elif "SPECI" in line:
        idx = line.find("SPECI")
    else:
        return None  # Linha sem METAR/SPECI
    metar = line[idx:]

    # Regex simples para pegar campos principais
    # Estações
    station = metar.split()[1]

    # Temperatura e ponto de orvalho (ex: 20/18)
    temp_dew = re.search(r" (\d{1,2})/(\d{1,2}) ", metar)
    if temp_dew:
        temp = int(temp_dew.group(1))
        dew_point = int(temp_dew.group(2))
    else:
        temp = dew_point = None

    # Pressão (ex: Q1013)
    pressure_match = re.search(r"Q(\d+)", metar)
    pressure = int(pressure_match.group(1)) if pressure_match else None

    # Vento (ex: 24002KT ou 33009KT)
    wind_match = re.search(r"(\d{3}|VRB)(\d{2})(G\d{2})?KT", metar)
    if wind_match:
        wind_dir = wind_match.group(1)
        wind_speed = int(wind_match.group(2))
    else:
        wind_dir = wind_speed = None

    # Visibilidade (ex: 9999)
    vis_match = re.search(r" (\d{4}) ", metar)
    visibility = int(vis_match.group(1)) if vis_match else None

    # Chuva simples (-RA, +RA etc)
    rain_match = re.search(r"(-|\+)?RA", metar)
    rain = 1 if rain_match else 0

    return [station, temp, dew_point, pressure, wind_dir, wind_speed, visibility, rain]

# Arquivos de entrada e saída
input_file = "inverno.txt"
output_file = "inverno.csv"

# Lista para armazenar dados
data = []

with open(input_file, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        parsed = parse_metar(line)
        if parsed:
            data.append(parsed)

# Cabeçalho CSV
header = ["station", "temperature", "dew_point", "pressure", "wind_dir", "wind_speed", "visibility", "rain"]

# Salva CSV
with open(output_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(data)

print(f"CSV gerado com {len(data)} linhas: {output_file}")

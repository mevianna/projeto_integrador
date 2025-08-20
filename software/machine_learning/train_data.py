import avwx

report = avwx.Metar("SBGR")
report.update()

print("Temperatura:", report.data.temperature.value)
print("Ponto de orvalho:", report.data.dewpoint.value)
print("Umidade relativa:", report.data.relative_humidity)
print("Pressão:", report.data.altimeter.value)
print("Vento direção:", report.data.wind_direction.value)
print("Vento velocidade:", report.data.wind_speed.value)
print("Visibilidade:", report.data.visibility.value)



Percentual de dados faltantes em cada coluna no dataset_final_rain_binario.csv

datetime           0.00
precip_mm          0.13
pressure_mB        0.13
temp_C             0.13
rh_pct            15.12
wind_dir_deg       8.85
wind_speed_m_s     8.85
cloudcover         0.00
rain               0.00
dtype: float64

precip_mm, pressure_mB, temp_C → só 0,13% de NaNs → vamos dropar essas linhas. 


O PROBLEMA EH Q ESTAMOS FAZENDO OVERSAMPLING ANTES DE SEPARAR TREINO E TESTE!!!!!
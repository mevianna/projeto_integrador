REGIAO:;S
UF:;SC
ESTACAO:;ARARANGUA
CODIGO (WMO):;A867
LATITUDE:;-28,931353
LONGITUDE:;-49,49792
ALTITUDE:;2
DATA DE FUNDACAO:;28/09/08
no documento do inmet.


| Sensor                      | Min   | Max    | Observação                                                |
| --------------------------- | ----- | ------ | --------------------------------------------------------- |
| Temperatura (°C)            | 2.7   | 36.4   | Compatível com ESP32                                      |
| Umidade relativa (%)        | 30    | 100    | Ok                                                        |
| Pressão atmosférica (mB)    | 994.8 | 1032.1 | Ok                                                        |
| Velocidade do vento (m/s)   | 0.1   | 10.7   | Ok, mas baixo comparado ao CSV da Open-Meteo (max 70 m/s) |
| Direção do vento (seno/cos) | -1    | 1      | Correto (representação circular)                          |
| Chuva (0 ou 1)              | 0     | 1      | Ok                                                        |
| Cloudcover                  | NaN   | NaN    | Precisa preencher via API                                 |

Com a criacao de colunas novas, o modelo comecou a acertar mais as chuvas. 

--- Relatório de Classificação ---
              precision    recall  f1-score   support

           0       0.94      0.93      0.93      3301
           1       0.45      0.50      0.48       395

    accuracy                           0.88      3696
   macro avg       0.70      0.71      0.71      3696
weighted avg       0.89      0.88      0.88      3696

------------------------------------
                feature  importance
2                rh_pct    0.158875
5            cloudcover    0.085983
18          rh_pct_lag1    0.079668
9       cloudcover_lag1    0.069786
4        wind_speed_m_s    0.058022
10      cloudcover_lag3    0.046965
21  wind_speed_m_s_lag1    0.043789
19          rh_pct_lag3    0.041901
11      cloudcover_lag6    0.041632
6                  hour    0.036592

Umidade e Nuvens são Reis: As features mais importantes, de longe, são a umidade relativa (rh_pct) e a cobertura de nuvens (cloudcover). Isso faz total sentido meteorologicamente.

O Passado Imediato é Crucial: Observe como rh_pct_lag1 e cloudcover_lag1 (os dados de 1 hora atrás) estão no topo da lista. Isso prova que a engenharia de features foi a decisão correta. O modelo não está apenas olhando a "foto" do momento, mas sim a "tendência" recente.

A Hora do Dia Importa: A feature hour estar no top 10 indica que existe um padrão de chuva relacionado ao horário no seu dataset (por exemplo, chuvas de verão que se formam à tarde).

Depois de adicionar mais:
df['rh_pct_diff_1h'] = df['rh_pct'] - df['rh_pct_lag1']
df['cloudcover_diff_1h'] = df['cloudcover'] - df['cloudcover_lag1']

--- Relatório de Classificação ---
              precision    recall  f1-score   support

           0       0.94      0.93      0.94      3301
           1       0.48      0.53      0.50       395

    accuracy                           0.89      3696
   macro avg       0.71      0.73      0.72      3696
weighted avg       0.89      0.89      0.89      3696

Fazendo grid search para achar os melhores parametros, obtivemos:
--- Melhores Parâmetros Encontrados ---
{'clf__class_weight': 'balanced', 'clf__max_depth': None, 'clf__min_samples_leaf': 4, 'clf__n_estimators': 200}
Aí depois disso:
### --- Relatório de Classificação do Modelo Otimizado --- (Random Forest)
              precision    recall  f1-score   support

           0       0.96      0.92      0.94      3301
           1       0.49      0.67      0.56       395

    accuracy                           0.89      3696
   macro avg       0.72      0.79      0.75      3696
weighted avg       0.91      0.89      0.90      3696

--------- PARA XGBOOST: ------------
Parameters: { "use_label_encoder" } are not used.

  bst.update(dtrain, iteration=i, fobj=obj)

--- Melhores Parâmetros Encontrados ---
{'clf__learning_rate': 0.1, 'clf__max_depth': 3, 'clf__n_estimators': 100}
-----------------------------------------

6. Avaliando o melhor modelo no conjunto de teste...

### --- Relatório de Classificação do Modelo Otimizado (XGBoost) ---
              precision    recall  f1-score   support

           0       0.97      0.87      0.92      3301
           1       0.43      0.81      0.57       395

    accuracy                           0.87      3696
   macro avg       0.70      0.84      0.74      3696
weighted avg       0.92      0.87      0.88      3696

----------------------------------------------------------
                feature  importance
2                rh_pct    0.143261
5            cloudcover    0.138179
9       cloudcover_lag1    0.128814
10      cloudcover_lag3    0.094561
4        wind_speed_m_s    0.064878
21  wind_speed_m_s_lag1    0.058098
11      cloudcover_lag6    0.050532
6                  hour    0.026920
22  wind_speed_m_s_lag3    0.024900
1                temp_C    0.023363

O Que Aprendemos com a Comparação
XGBoost tem um Recall muito maior: Ele foi muito mais eficaz em identificar os dias em que realmente choveu. Dos 395 eventos de chuva, ele acertou 81% deles, enquanto o Random Forest acertou 67%. Isso significa que o XGBoost é bem melhor em não deixar a pessoa se molhar.

XGBoost tem uma Precisão um pouco menor: Para conseguir esse alto recall, o XGBoost fez mais "falsos alarmes". Das vezes que ele disse "vai chover", ele errou mais do que o Random Forest.

O F1-Score do XGBoost foi levemente superior: Como essa métrica equilibra precision e recall, o F1-Score de 0.57 sugere que o XGBoost, no geral, teve um desempenho um pouco melhor para a classe minoritária.

Qual Modelo Usar?
A escolha depende do custo do erro.

Se o maior problema é prever chuva quando não vai chover (falso alarme): Use o Random Forest.

Se o maior problema é não prever chuva quando vai chover (falso negativo): Use o XGBoost.

Com base nos números, o XGBoost conseguiu um salto enorme no recall, o que é geralmente o objetivo principal em problemas com classes desbalanceadas. A ligeira perda na precisão e na acurácia geral é um preço pequeno a se pagar por um modelo muito mais útil para prever o evento real de chuva.
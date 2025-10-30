import xgboost as xgb
model = xgb.XGBClassifier()
model.load_model("modelo_xgb.bin")
print("Modelo carregado com sucesso")
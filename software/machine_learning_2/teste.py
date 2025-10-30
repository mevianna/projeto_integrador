import os
import xgboost as xgb

# Caminho absoluto do script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "modelo_xgb.bin")

model = xgb.XGBClassifier()
model.load_model(MODEL_PATH)
print("Modelo carregado com sucesso")

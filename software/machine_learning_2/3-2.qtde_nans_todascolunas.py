import pandas as pd

# lê o CSV completo
df = pd.read_csv("inmet_3_anos_todascolunas.csv")

# conta NaNs
n_missing = df.isna().sum()

# porcentagem de NaNs
perc_missing = 100 * n_missing / len(df)

# coloca em um DataFrame pra visualizar melhor
missing_table = pd.DataFrame({
    "missing_count": n_missing,
    "missing_percent": perc_missing
}).sort_values("missing_percent", ascending=False)

print(missing_table)

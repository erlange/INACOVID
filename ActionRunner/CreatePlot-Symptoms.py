import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from matplotlib import dates as mdates
import datetime

c_r="#ec3454"
c_g="#3caa55"
c_y="#e4c12f"
c_b="#3c45ee"
d = pd.read_csv("data/csv/cat.natl.csv" )
df = pd.DataFrame({"Category": d["Category"], "SubCategory":d["SubCategory"], "Confirmed": d["kasus"], "Hosp": d["perawatan"], "Cured": d["sembuh"], "Deaths":d["meninggal"]})

df_comorbid = df.loc[df["Category"]=="kondisi_penyerta"]
df_comorbid = df_comorbid.sort_values("Confirmed", ascending=True)
df_symptom = df.loc[df["Category"]=="gejala"]
df_symptom = df_symptom.sort_values("Confirmed", ascending=True)
df_age = df.loc[df["Category"]=="kelompok_umur"].drop("Category",axis=1).set_index("SubCategory") 

fig, axs = plt.subplots(1, 1,  figsize=(6,6))

df_symptom["SubCategory"] = df_symptom["SubCategory"].map({"BATUK":"COUGH"
    ,"RIWAYAT DEMAM":"FEVER HISTORY","DEMAM":"FEVER","SESAK NAPAS":"SHORTNESS OF BREATH"
    ,"LEMAS":"FATIGUE","SAKIT TENGGOROKAN":"SORE THROAT","PILEK":"RUNY NOSE"
    ,"SAKIT KEPALA":"HEADACHES", "MUAL":"NAUSEA","KERAM OTOT":"MUSCLE CRAMP"
    ,"MENGGIGIL":"CHILLS","DIARE":"DIARRHEA","SAKIT PERUT":"STOMACH PAIN","LAIN-LAIN":"OTHERS"})

hh=.315
axs.barh(np.arange(len(df_symptom["Deaths"])), df_symptom["Deaths"],height=hh, label="% Deaths", color=c_r)
axs.barh(np.arange(len(df_symptom["Cured"])) + hh, df_symptom["Cured"],height=hh, label="% Recovered", color=c_y)
axs.barh(np.arange(len(df_symptom["Confirmed"])) + 2 * hh, df_symptom["Confirmed"], height=hh,label="% Confirmed", color=c_b)
r = np.arange(len(df_symptom["Deaths"])) + hh
axs.set_yticks(r)
axs.set_yticklabels(df_symptom["SubCategory"])
# axs.set_title("% Comorbidities")
axs.legend()
axs.grid(axis="x")

fig.subplots_adjust( top=0.92, left=0.34, bottom=0.08, right=0.97)
fig.suptitle('Cases by Symptoms', fontsize=14)
# plt.show()
plt.savefig("data/plot/inasymptoms.png")
print("Plotting symptoms chart - Done.")


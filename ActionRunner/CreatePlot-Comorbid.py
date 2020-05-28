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
df_sex = df.loc[df["Category"]=="kelompok_umur"].drop("Category",axis=1).set_index("SubCategory") 

fig, axs = plt.subplots(1, 1,  figsize=(6,6))

hh=.3
df_comorbid["SubCategory"] = df_comorbid["SubCategory"].map({"HIPERTENSI":"HYPERTENSION", "DIABETES MELITUS":"DIABETES MELLITUS",
    "PENYAKIT JANTUNG":"CORONARY DISEASES","PENYAKIT PARU OBSTRUKTIF KRONIS":"OBSTRUCTIVE PULMONARY DISEASES",
    "GANGGUAN NAPAS LAIN":"OTHER RESPIRATORY DISEASES","PENYAKIT GINJAL":"RENAL DISEASES", "ASMA":"ASTHMA","KANKER":"CANCER","TBC":"TUBERCULOSIS", "PENYAKIT HATI":"LIVER DISEASES","GANGGUAN IMUN":"IMMUNE SYSTEM DISORDERS"})

axs.barh(np.arange(len(df_comorbid["Deaths"])), df_comorbid["Deaths"],height=hh, label="% Deaths", color=c_r)
axs.barh(np.arange(len(df_comorbid["Cured"])) + hh, df_comorbid["Cured"],height=hh, label="% Recovered", color=c_y)
axs.barh(np.arange(len(df_comorbid["Confirmed"])) + 2 * hh, df_comorbid["Confirmed"], height=hh,label="% Confirmed", color=c_b)
r = np.arange(len(df_comorbid["Cured"])) + hh
axs.set_yticks(r)
axs.set_yticklabels(df_comorbid["SubCategory"])
# axs.set_title("% Comorbidities")
axs.legend()
axs.grid(axis="x")

fig.subplots_adjust( top=0.92, left=0.46, bottom=0.08, right=0.97)
fig.suptitle('Cases by Preexisting Health Conditions', fontsize=14)
# plt.show()
plt.savefig("data/plot/inacomorbid.png")
print("Plotting comorbid chart - Done.")




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
df_sex = df.loc[df["Category"]=="jenis_kelamin"].drop("Category",axis=1).set_index("SubCategory")
fig, axs = plt.subplots(2, 1,  figsize=(6,6))

ww=.3
w1=.287
axs[1].bar(np.arange( len(df_age["Confirmed"])), df_age["Confirmed"], width=w1,label="% Confirmed", color=c_b, align='center')
axs[1].bar(np.arange( len(df_age["Cured"])) + ww, df_age["Cured"], width=w1, label="% Recovered", color=c_y, align='center')
axs[1].bar(np.arange( len(df_age["Deaths"])) + 2 * ww, df_age["Deaths"], width=w1, label="% Deaths", color=c_r, align='center')
r=np.arange( len(df_age["Deaths"])) + ww
axs[1].set_xticks( r)
axs[1].set_xticklabels(df_age.index)
axs[1].set_xlabel("Age")

# axs[1].legend()
axs[1].grid(axis="y")

ws = .13
ws1 = .11
axs[0].bar(np.arange( len(df_sex["Confirmed"])), df_sex["Confirmed"], width=ws1,label="% Confirmed", color=c_b, align='center')
axs[0].bar(np.arange( len(df_sex["Cured"])) + ws, df_sex["Cured"], width=ws1, label="% Recovered", color=c_y, align='center')
axs[0].bar(np.arange( len(df_sex["Deaths"])) + 2 * ws, df_sex["Deaths"], width=ws1, label="% Deaths", color=c_r, align='center')
r=np.arange( len(df_sex["Cured"])) + ws
axs[0].set_xticks( r)
axs[0].set_xticklabels(["Male","Female"])
# axs[0].set_xlabel("Gender Group")
axs[0].legend()
axs[0].grid(axis="y")

# fig.subplots_adjust( top=0.92, left=0.30, bottom=0.08, right=0.97)
fig.suptitle('Cases by Genders and Age Groups', fontsize=14)
# plt.show()

plt.savefig("data/plot/inagender.png")
print("Plotting age chart -  Done.")

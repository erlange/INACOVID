import pandas as pd
import matplotlib as mpl
from matplotlib.ticker import (AutoMinorLocator, MultipleLocator, MaxNLocator)
from matplotlib import pyplot as plt
from matplotlib import dates as mdates
import datetime

c_Confirmed = "#2c347c"
c_Hosp="#c6ac42"
c_Cured="#3c928c"
c_Deaths="#ec6f58"

c_r="#ec3454"
c_g="#3caa55"
c_y="#e4c12f"
c_b="#3c45ee"

d = pd.read_csv("data/csv/hospitals.csv" )
# df = pd.DataFrame({"Date": pd.to_datetime(d["Date"]), "Location": d["Location"], "Confirmed": d["AKUMULASI_KASUS"], "Hospitalised":d["AKUMULASI_DIRAWAT_OR_ISOLASI"], "Cured": d["AKUMULASI_SEMBUH"], "Deaths":d["AKUMULASI_MENINGGAL"]})
df = pd.DataFrame(d)

dfg= df.groupby("propinsi").agg({"tempat_tidur":"sum", "propinsi":"count"})
dfg.rename(columns={"propinsi": "prop"}, inplace=True)
dfg.sort_values("tempat_tidur", ascending=True, inplace=True)
fig, axs = plt.subplots(1, 1, sharex=True, figsize=(6,6))
# axs.barh(dfg.index, dfg["prop"] , color = c_b, label = "Num. Hospitals")
axs.barh(dfg.index, dfg["tempat_tidur"] , color = c_b, label = "Bedding Capacity")
# axs.legend()
axs.grid(axis="x")
axs.set_title("Hospital Bedding Capacity by Provinces")

myFmtY = mpl.ticker.StrMethodFormatter("{x:,.0F}")
axs.xaxis.set_major_formatter(myFmtY)
axs.xaxis.set_major_locator(MultipleLocator(5000))

fig.subplots_adjust(hspace=0.2, top=0.92, left=0.42, bottom=0.12, right=0.97)
plt.xticks(rotation=90)
plt.margins(y=0)
# plt.show()

plt.savefig("data/plot/inahosp.png")
print("Plotting hospital chart - Done.")

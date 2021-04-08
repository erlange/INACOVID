import pandas as pd
import matplotlib as mpl
from matplotlib import pyplot as plt
from matplotlib import dates as mdates
from matplotlib.ticker import (AutoMinorLocator, MultipleLocator, MaxNLocator)
import datetime

c_Confirmed = "#2c347c"
c_Hosp="#c6ac42"
c_Cured="#3c928c"
c_Deaths="#ec6f58"

c_r="#ec3454"
c_g="#3caa55"
c_y="#e4c12f"
c_b="#3c45ee"

d = pd.read_csv("data/csv/ext.prov.csv" )
df = pd.DataFrame({"Date": pd.to_datetime(d["Date"]), "Location": d["Location"], "Confirmed": d["AKUMULASI_KASUS"], "Hospitalised":d["AKUMULASI_DIRAWAT_OR_ISOLASI"], "Cured": d["AKUMULASI_SEMBUH"], "Deaths":d["AKUMULASI_MENINGGAL"]})
latest_ = df.sort_values("Date").groupby("Location").tail(1)
latest = latest_.sort_values("Confirmed", ascending=True).tail(20)
latest_update = latest.sort_values("Confirmed", ascending=True).tail(1).iloc[0,0]
fig, axs = plt.subplots(1, 1, sharex=True, figsize=(6,6))
axs.barh(latest["Location"], latest["Cured"] + latest["Deaths"] + latest["Hospitalised"], color = c_b, label = "Active Cases")
axs.barh(latest["Location"], latest["Cured"] + latest["Deaths"], color = c_y, label = "Recovered")
axs.barh(latest["Location"], latest["Deaths"], color = c_r, label = "Death")
axs.legend()
axs.grid(axis="x")
axs.set_title("Impact on Provinces - Top 20")
myFmtY = mpl.ticker.StrMethodFormatter("{x:,.0F}")
axs.xaxis.set_major_formatter(myFmtY)
axs.xaxis.set_major_locator(MultipleLocator(25000))

dt_latest_update = pd.to_datetime(latest_update)
plt.gcf().text(0.05, 0.97, "Last updated", color="#888888", fontsize=10, family="Arial", weight="bold", bbox=dict(facecolor="none", edgecolor="none",  boxstyle='square,pad=.7'))
plt.gcf().text(0.05, 0.93, f"{dt_latest_update: %Y-%b-%d}", color="#888888", fontsize=16, family="Arial", weight="bold", bbox=dict(facecolor="none", edgecolor="none",  boxstyle='square,pad=.7'))

fig.subplots_adjust(hspace=0.2, top=0.92, left=0.42, bottom=0.14, right=0.97)
plt.xticks(rotation=90)

# plt.show()

plt.savefig("data/plot/inaprovinces.png")
print("Plotting provinces chart -  Done.")

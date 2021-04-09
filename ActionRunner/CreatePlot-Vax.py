import pandas as pd
from matplotlib import pyplot as plt
from matplotlib import dates as mdates
from matplotlib.ticker import (AutoMinorLocator, MultipleLocator, MaxNLocator)
import matplotlib as mpl
import datetime

print("-----------")
print("Plotting Vaccination Data")

d_raw = pd.read_csv("data/csv/vax.csv")
d = d_raw.tail(720)
d = d.iloc[1:]

# fig.subplots_adjust(hspace=0.46, top=0.85, bottom=0)
fig, axs = plt.subplots(4, 1, sharex=True, figsize=(8,8))

x = d["Date"]
x = pd.to_datetime(d["Date"])

SpecPcr = d["jumlah_spesimen_pcr_tcm"] 
SpecAntigen = d["jumlah_spesimen_antigen"] 
SpecTotal = d["jumlah_spesimen_total"] 
PplPcr = d["jumlah_orang_pcr_tcm"] 
PplAntigen = d["jumlah_orang_antigen"] 
PplTotal = d["jumlah_orang_total"]
SpecTotalCum = d["jumlah_spesimen_total_kum"]
PplTotalCum = d["jumlah_orang_total_kum"]

Vax1 = d["jumlah_vaksinasi_1"] 
Vax2 = d["jumlah_vaksinasi_2"] 
Vax1Cum = d["jumlah_jumlah_vaksinasi_1_kum"] 
Vax2Cum = d["jumlah_jumlah_vaksinasi_2_kum"] 

cc = ["#7eca9c","#d0af84","#b8b5ff","#8ac4d0","#4b778d","#206a5d","#91c788","#e2703a","#9e9d89","#f39189"]

df = pd.DataFrame({"Date": pd.to_datetime(d["Date"]),"jumlah_spesimen_pcr_tcm": SpecPcr,"jumlah_spesimen_antigen": SpecAntigen,"jumlah_spesimen_total": SpecTotal,"jumlah_orang_pcr_tcm": PplPcr,"jumlah_orang_antigen":PplAntigen, "jumlah_orang_total": PplTotal, "jumlah_spesimen_total_kum": SpecTotalCum, "jumlah_orang_total_kum": PplTotalCum,"jumlah_vaksinasi_1":Vax1,"jumlah_vaksinasi_2":Vax2,"jumlah_jumlah_vaksinasi_1_kum":Vax1Cum,"jumlah_jumlah_vaksinasi_2_kum":Vax2Cum})
df.index = x

axs[0].xaxis_date()
axs[1].xaxis_date()
axs[2].xaxis_date()
axs[3].xaxis_date()

# axs[0].xaxis.set_major_locator(MultipleLocator(1))
# axs[1].xaxis.set_major_locator(MultipleLocator(1))
# axs[2].xaxis.set_major_locator(MultipleLocator(1))

myFmt = mdates.DateFormatter('%Y-%b-%d')
axs[0].xaxis.set_major_formatter(myFmt)
axs[1].xaxis.set_major_formatter(myFmt)
axs[2].xaxis.set_major_formatter(myFmt)
axs[3].xaxis.set_major_formatter(myFmt)

myFmtY = mpl.ticker.StrMethodFormatter("{x:,.0F}")
axs[0].yaxis.set_major_formatter(myFmtY)
axs[1].yaxis.set_major_formatter(myFmtY)
axs[2].yaxis.set_major_formatter(myFmtY)
axs[3].yaxis.set_major_formatter(myFmtY)

# axs[0].margins(x=0,y=0)

# simulating stacked bar
axs[0].bar(x, SpecPcr + SpecAntigen, color = cc[0], label="PCR Specimens Tested")
axs[0].bar(x, SpecAntigen, color = cc[2], label="Antigen Specimens Tested")
axs[0].plot(x, SpecTotal.rolling(window=7).mean(), color=cc[7], label="7-day Moving Average", linewidth=1.5)
axs[0].set_title("Specimens Tested (PCR + Antigen)")
axs[0].legend()
axs[0].grid(axis="both")

axs[1].bar(x, PplPcr + PplAntigen, color = cc[1], label="People PCR Tested")
axs[1].bar(x, PplAntigen, color = cc[3], label="People Antigen Tested")
axs[1].plot(x, PplTotal.rolling(window=7).mean(), color=cc[7], label="7-day Moving Average", linewidth=1.5)
axs[1].set_title("People Tested (PCR + Antigen)")
axs[1].legend()
axs[1].grid(axis="both")

axs[2].plot(x, Vax1, color=cc[3], label="Received 1st Dose", linewidth=1.5)
axs[2].plot(x, Vax1.rolling(window=7).mean(), color=cc[4], label="7-day Moving Average", linewidth=1.5)
axs[2].set_title("Vaccine 1st Dose")
axs[2].legend()
axs[2].set_ylabel("Num")
axs[2].grid(axis="both")


axs[3].plot(x, Vax2, color=cc[6], label="Received 2nd Dose", linewidth=1.5)
axs[3].plot(x, Vax2.rolling(window=7).mean(), color=cc[5], label="7-day Moving Average", linewidth=1.5)
axs[3].set_title("Vaccine 2nd Dose")
axs[3].legend()
axs[3].set_ylabel("Num")
axs[3].grid(axis="both")

fig.autofmt_xdate()

dd = d_raw.tail(1)
last_updated = dd.iloc[0,0]
last = dd.iloc[0,6]
latest_cured = dd.iloc[0,7]
latest_deaths = dd.iloc[0,9] 
latest_hosp = dd.iloc[0,8]

LastSpecPcr = dd.iloc[0,1]
LastSpecAntigen = dd.iloc[0,2]
LastSpecTotal = dd.iloc[0,3]
LastSpecPcrCum = dd.iloc[0,9]
LastSpecAntigenCum = dd.iloc[0,10]
LastSpecTotalCum = dd.iloc[0,11]

LastPplPcr = dd.iloc[0,5]
LastPplAntigen = dd.iloc[0,6]
LastPplTotal = dd.iloc[0,7]
LastPplPcrCum = dd.iloc[0,12]
LastPplAntigenCum = dd.iloc[0,13]
LastPplTotalCum = dd.iloc[0,14]

LastVax1 = dd.iloc[0,15]
LastVax2 = dd.iloc[0,17]
LastVax1Cum = dd.iloc[0,19]
LastVax2Cum = dd.iloc[0,20]

dt_last_updated = pd.to_datetime(last_updated)
plt.gcf().text(0.84, 0.925, f"{dt_last_updated:%Y-%b-%d}", color="#888888", fontsize=14, family="Arial", weight="bold", bbox=dict(facecolor="none", edgecolor="none",  boxstyle='square,pad=.7'))
plt.gcf().text(0.84, 0.955, "Last Updated", color="#888888", fontsize=8,  family="Arial", weight="bold")

plt.gcf().text(0.036, 0.925, "{:,}".format(LastSpecTotalCum), color="#ffffff", fontsize=18, family="Arial", weight="bold", bbox=dict(facecolor=cc[0], edgecolor=cc[0],  boxstyle='square, pad=.7'))
plt.gcf().text(0.036, 0.955, "Specimens Tested", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.036, 0.90, '+' + f"{LastSpecTotal:,}", color="#ffffff", fontsize=10,  family="Arial", weight="bold")

plt.gcf().text(0.24, 0.925, f"{LastPplTotalCum:,}", color="#ffffff", fontsize=18,  family="Arial", weight="bold", bbox=dict(facecolor=cc[1], edgecolor=cc[1],  boxstyle='square,pad=.7'))
plt.gcf().text(0.24, 0.955, "People Tested", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.24, 0.90, '+' + f"{LastPplTotal:,}", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
# plt.gcf().text(0.51, 0.89, f"{latest_recov/100:.1%}", color="#ffffff", fontsize=10,  family="Arial", weight="bold")

plt.gcf().text(0.43, 0.925, f"{LastVax1Cum:,}", color="#ffffff", fontsize=18,  family="Arial", weight="bold", bbox=dict(facecolor=cc[4], edgecolor=cc[4],  boxstyle='square,pad=.7'))
plt.gcf().text(0.43, 0.955, "Vaccine 1st Dose", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.43, 0.90, '+' + f"{LastVax1:,}", color="#ffffff", fontsize=10,  family="Arial", weight="bold")

plt.gcf().text(0.62, 0.925, f"{LastVax2Cum:,}", color="#ffffff", fontsize=18,  family="Arial", weight="bold", bbox=dict(facecolor=cc[5], edgecolor=cc[5],  boxstyle='square,pad=.7'))
plt.gcf().text(0.62, 0.955, "Vaccine 2nd Dose", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.62, 0.90, '+' + f"{LastVax2:,}", color="#ffffff", fontsize=10,  family="Arial", weight="bold")

fig.subplots_adjust(hspace=0.44, top=0.84, left=0.11, bottom=0.15, right=0.97)

plt.xticks(rotation=45)
plt.margins(x=0)
# plt.show()

plt.savefig("data/plot/vax.png")
print("Plotting Vaccination Data - Done.")

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
fig, axs = plt.subplots(3, 1, sharex=True, figsize=(8,8))

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

c_SpecPcr = "#2c347c"
c_SpecAntigen="#c6ac42"
c_PplPcr="#3c928c"
c_PplAntigen="#ec6f58"

cc = ["#7eca9c","#d0af84","#b8b5ff","#8ac4d0","#4b778d","#206a5d","#91c788","#e2703a","#9e9d89","#f39189"]

df = pd.DataFrame({"Date": pd.to_datetime(d["Date"]),"jumlah_spesimen_pcr_tcm": SpecPcr,"jumlah_spesimen_antigen": SpecAntigen,"jumlah_spesimen_total": SpecTotal,"jumlah_orang_pcr_tcm": PplPcr,"jumlah_orang_antigen":PplAntigen, "jumlah_orang_total": PplTotal, "jumlah_spesimen_total_kum": SpecTotalCum, "jumlah_orang_total_kum": PplTotalCum,"jumlah_vaksinasi_1":Vax1,"jumlah_vaksinasi_2":Vax2,"jumlah_jumlah_vaksinasi_1_kum":Vax1Cum,"jumlah_jumlah_vaksinasi_2_kum":Vax2Cum})
df.index = x

axs[0].xaxis_date()
axs[1].xaxis_date()
axs[2].xaxis_date()

# axs[0].xaxis.set_major_locator(MultipleLocator(1))
# axs[1].xaxis.set_major_locator(MultipleLocator(1))
# axs[2].xaxis.set_major_locator(MultipleLocator(1))

myFmt = mdates.DateFormatter('%Y-%b-%d')
axs[0].xaxis.set_major_formatter(myFmt)
axs[1].xaxis.set_major_formatter(myFmt)
axs[2].xaxis.set_major_formatter(myFmt)

myFmtY = mpl.ticker.StrMethodFormatter("{x:,.0F}")
axs[0].yaxis.set_major_formatter(myFmtY)
axs[1].yaxis.set_major_formatter(myFmtY)
axs[2].yaxis.set_major_formatter(myFmtY)

# axs[0].margins(x=0,y=0)

# simulating stacked bar
axs[0].bar(x, SpecPcr + SpecAntigen, color = cc[0], label="PCR Tests")
axs[0].bar(x, SpecAntigen, color = cc[2], label="Antigen Tests")
axs[0].plot(x, SpecTotal.rolling(window=7).mean(), color=cc[7], label="7-day Moving Average", linewidth=1.5)
axs[0].set_title("Specimen Tests (PCR + Antigen)")
axs[0].legend()
axs[0].grid(axis="both")

axs[1].plot(x, Vax1, color=cc[3], label="Received 1st Dose", linewidth=1.5)
axs[1].plot(x, Vax1.rolling(window=7).mean(), color=cc[4], label="7-day Moving Average", linewidth=1.5)
axs[1].set_title("Vaccine 1st Dose")
axs[1].legend()
axs[1].set_ylabel("Num")
axs[1].grid(axis="both")


axs[2].plot(x, Vax2, color=cc[5], label="Received 2nd Dose", linewidth=1.5)
axs[2].plot(x, Vax2.rolling(window=7).mean(), color=cc[6], label="7-day Moving Average", linewidth=1.5)
axs[2].set_title("Vaccine 2nd Dose")
axs[2].legend()
axs[2].set_ylabel("Num")
axs[2].grid(axis="both")



fig.autofmt_xdate()

dd = d_raw.tail(1)
last_updated = dd.iloc[0,0]
latest_confirmed = dd.iloc[0,6]
latest_cured = dd.iloc[0,7]
latest_deaths = dd.iloc[0,9] 
latest_hosp = dd.iloc[0,8]

dt_last_updated = pd.to_datetime(last_updated)
plt.gcf().text(0.78, 0.918, "{:%Y-%b-%d}".format(dt_last_updated), color="#888888", fontsize=18, family="Arial", weight="bold", bbox=dict(facecolor="none", edgecolor="none",  boxstyle='square,pad=.7'))
plt.gcf().text(0.78, 0.955, "Last Updated", color="#888888", fontsize=10,  family="Arial", weight="bold")

# plt.gcf().text(0.036, 0.918, "{:,}".format(latest_confirmed), color="#ffffff", fontsize=21, family="Arial", weight="bold", bbox=dict(facecolor=c_Confirmed, edgecolor=c_Confirmed,  boxstyle='square, pad=.7'))
# plt.gcf().text(0.036, 0.955, "Confirmed", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
# plt.gcf().text(0.036, 0.89, '+' + str(DI_latest_confirmed), color="#ffffff", fontsize=10,  family="Arial", weight="bold")

# plt.gcf().text(0.42, 0.918, f"{latest_cured:,}", color="#ffffff", fontsize=21,  family="Arial", weight="bold", bbox=dict(facecolor=c_Cured, edgecolor=c_Cured,  boxstyle='square,pad=.7'))
# plt.gcf().text(0.42, 0.955, "Recovered", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
# plt.gcf().text(0.42, 0.89, '+' + str(DI_latest_cured), color="#ffffff", fontsize=10,  family="Arial", weight="bold")
# plt.gcf().text(0.51, 0.89, f"{latest_recov/100:.1%}", color="#ffffff", fontsize=10,  family="Arial", weight="bold")

# plt.gcf().text(0.62, 0.918, "{:,}".format(latest_deaths), color="#ffffff", fontsize=21,  family="Arial", weight="bold", bbox=dict(facecolor=c_Deaths, edgecolor=c_Deaths,  boxstyle='square,pad=.7'))
# plt.gcf().text(0.62, 0.89, '+' +str(DI_latest_deaths), color="#ffffff", fontsize=10,  family="Arial", weight="bold")
# plt.gcf().text(0.62, 0.955, "Death", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
# plt.gcf().text(0.68, 0.89, f"{latest_fatal/100:.1%}", color="#ffffff", fontsize=10,  family="Arial", weight="bold")

# plt.gcf().text(0.25, 0.918, "{:,}".format(latest_hosp), color="#ffffff", fontsize=21, family="Arial", weight="bold", bbox=dict(facecolor=c_Hosp, edgecolor=c_Hosp,  boxstyle='square, pad=.7'))
# plt.gcf().text(0.25, 0.955, "Active", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
# plt.gcf().text(0.25, 0.89, '+' + str(DI_latest_hosp), color="#ffffff", fontsize=10,  family="Arial", weight="bold")

fig.subplots_adjust(hspace=0.44, top=0.84, left=0.11, bottom=0.15, right=0.97)

plt.xticks(rotation=45)
plt.margins(x=0)
# plt.show()

plt.savefig("data/plot/vax.png")
print("Plotting vax chart - Done.")

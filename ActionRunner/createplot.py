import pandas as pd
import matplotlib as mpl
from matplotlib import pyplot as plt
from matplotlib import dates as mdates
from matplotlib.ticker import (AutoMinorLocator, MultipleLocator, MaxNLocator)
import datetime

print("-----------")
print("Plotting Indonesia trends")

d_raw = pd.read_csv("data/csv/ext.natl.csv")
d = d_raw.tail(400)
# fig.subplots_adjust(hspace=0.46, top=0.85, bottom=0)
fig, axs = plt.subplots(3, 1, sharex=True, figsize=(8,8))

x = d["Date"]
x = pd.to_datetime(d["Date"])

Confirmed = d["jumlah_positif_kum"] 
Deaths = d["jumlah_meninggal_kum"]
Cured = d["jumlah_sembuh_kum"]
Hosp = d["jumlah_dirawat_kum"]

DI_Confirmed = d["jumlah_positif"] 
DI_Deaths = d["jumlah_meninggal"]
DI_Cured = d["jumlah_sembuh"]
DI_Hosp = d["jumlah_dirawat"]

# Pct_Cured = d["Persentase_Pasien_Sembuh"]
# Pct_Dead = d["Persentase_Pasien_Meninggal"]

Pct_Cured = 100 * Cured / Confirmed 
Pct_Dead =  100 * Deaths / Confirmed

c_Confirmed = "#2c347c"
c_Hosp="#c6ac42"
c_Cured="#3c928c"
c_Deaths="#ec6f58"

# df = pd.DataFrame({"Date": pd.to_datetime(d["Date"]),"Confirmed": d["Jumlah_Kasus_Kumulatif"], "Hospitalised":d["Jumlah_pasien_dalam_perawatan"], "Cured": d["Jumlah_Pasien_Sembuh"], "Deaths":d["Jumlah_Pasien_Meninggal"]})
df = pd.DataFrame({"Date": pd.to_datetime(d["Date"]),"Confirmed": Confirmed, "Hospitalised": Hosp, "Cured": Cured, "Death": Deaths})
df.index = x

axs[0].xaxis.set_major_locator(MultipleLocator(30))
axs[1].xaxis.set_major_locator(MultipleLocator(30))
axs[2].xaxis.set_major_locator(MultipleLocator(30))

myFmt = mdates.DateFormatter('%Y-%b-%d')
axs[0].xaxis.set_major_formatter(myFmt)
axs[1].xaxis.set_major_formatter(myFmt)
axs[2].xaxis.set_major_formatter(myFmt)

myFmtY = mpl.ticker.StrMethodFormatter("{x:,.0F}")
axs[0].yaxis.set_major_formatter(myFmtY)
axs[1].yaxis.set_major_formatter(myFmtY)
axs[2].yaxis.set_major_formatter(myFmtY)

axs[2].xaxis_date()
axs[1].xaxis_date()
axs[0].xaxis_date()
# axs[0].margins(x=0,y=0)

# simulating stacked bar
axs[0].plot(x, Confirmed, color=c_Confirmed, label="Total Confirmed", linewidth=1.5)
axs[0].bar(x, Hosp + Cured + Deaths, color = c_Hosp, label="Active")
axs[0].bar(x, Cured + Deaths, color=c_Cured, label="Recovered")
axs[0].bar(x, Deaths, color=c_Deaths, label="Death")
axs[0].set_title("Indonesia COVID-19 Cumulative Confirmed Cases")
axs[0].legend()
axs[0].grid(axis="both")

axs[1].plot(x, DI_Confirmed, color=c_Confirmed, label="Confirmed", linewidth=1.5)
axs[1].plot(x, DI_Cured, color=c_Cured, label="Recovered", linewidth=1.5)
axs[1].plot(x, DI_Deaths, color=c_Deaths, label="Death", linewidth=1.5)
axs[1].set_title("Daily Incident Cases")
axs[1].legend()
axs[1].set_ylabel("Cases")
axs[1].grid(axis="both")

axs[2].plot(x, Pct_Dead, color=c_Deaths, label="% Fatality Rate", linewidth=1.5)
axs[2].plot(x, Pct_Cured, color=c_Cured, label="% Recovery Rate", linewidth=1.5)
axs[2].set_title("% Fatality/Recovery Rate (Cumulative)")
axs[2].legend()
axs[2].set_ylabel("% Rate")
axs[2].grid(axis="both")


fig.autofmt_xdate()

dd = d_raw.tail(1)
last_updated = dd.iloc[0,0]
latest_confirmed = dd.iloc[0,6]
latest_cured = dd.iloc[0,7]
latest_deaths = dd.iloc[0,9] 
latest_hosp = dd.iloc[0,8]

# latest_recov = dd.iloc[0,10] 
# latest_fatal = dd.iloc[0,11] 

latest_recov = 100 * latest_cured / latest_confirmed
latest_fatal = 100 * latest_deaths / latest_confirmed

DI_latest_confirmed = dd.iloc[0,2] 
DI_latest_hosp = dd.iloc[0,4] 
DI_latest_cured = dd.iloc[0,3] 
DI_latest_deaths = dd.iloc[0,5] 


dt_last_updated = pd.to_datetime(last_updated)
plt.gcf().text(0.78, 0.918, "{:%Y-%b-%d}".format(dt_last_updated), color="#888888", fontsize=18, family="Arial", weight="bold", bbox=dict(facecolor="none", edgecolor="none",  boxstyle='square,pad=.7'))
plt.gcf().text(0.78, 0.955, "Last Updated", color="#888888", fontsize=10,  family="Arial", weight="bold")

plt.gcf().text(0.036, 0.918, "{:,}".format(latest_confirmed), color="#ffffff", fontsize=21, family="Arial", weight="bold", bbox=dict(facecolor=c_Confirmed, edgecolor=c_Confirmed,  boxstyle='square, pad=.7'))
plt.gcf().text(0.036, 0.955, "Confirmed", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.036, 0.89, '+' + str(DI_latest_confirmed), color="#ffffff", fontsize=10,  family="Arial", weight="bold")

plt.gcf().text(0.42, 0.918, f"{latest_cured:,}", color="#ffffff", fontsize=21,  family="Arial", weight="bold", bbox=dict(facecolor=c_Cured, edgecolor=c_Cured,  boxstyle='square,pad=.7'))
plt.gcf().text(0.42, 0.955, "Recovered", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.42, 0.89, '+' + str(DI_latest_cured), color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.51, 0.89, f"{latest_recov/100:.1%}", color="#ffffff", fontsize=10,  family="Arial", weight="bold")

plt.gcf().text(0.62, 0.918, "{:,}".format(latest_deaths), color="#ffffff", fontsize=21,  family="Arial", weight="bold", bbox=dict(facecolor=c_Deaths, edgecolor=c_Deaths,  boxstyle='square,pad=.7'))
plt.gcf().text(0.62, 0.89, '+' +str(DI_latest_deaths), color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.62, 0.955, "Death", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.68, 0.89, f"{latest_fatal/100:.1%}", color="#ffffff", fontsize=10,  family="Arial", weight="bold")

plt.gcf().text(0.25, 0.918, "{:,}".format(latest_hosp), color="#ffffff", fontsize=21, family="Arial", weight="bold", bbox=dict(facecolor=c_Hosp, edgecolor=c_Hosp,  boxstyle='square, pad=.7'))
plt.gcf().text(0.25, 0.955, "Active", color="#ffffff", fontsize=10,  family="Arial", weight="bold")
plt.gcf().text(0.25, 0.89, '+' + str(DI_latest_hosp), color="#ffffff", fontsize=10,  family="Arial", weight="bold")

fig.subplots_adjust(hspace=0.44, top=0.84, left=0.11, bottom=0.15, right=0.97)

plt.xticks(rotation=45)
plt.margins(x=0)
# plt.show()

plt.savefig("data/plot/inachart.png")
print("Plotting general chart - Done.")

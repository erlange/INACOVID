[![Scheduled Data Collecting](https://github.com/erlange/INACOVID/workflows/Report%20Collecting/badge.svg)](https://github.com/erlange/INACOVID/actions?query=workflow%3A%22Report+Collecting%22)

## Indonesia COVID-19 (INACOVID) Data Repository in CSV and JSON Format

![Indonesia Covid-19 Chart](https://raw.githubusercontent.com/erlange/INACOVID/master/data/plot/inachart.png)


Independent effort of providing up-to-the-minute time-series reports in JSON and CSV format for analytical purposes.

## Table of Contents
* [**Dataset**](#dataset)
* [**Charts**](#charts)
  * [Impacts on Indonesia Provinces](#impacts-on-indonesia-provinces)
  * [Demographics](#demographics)
  * [Medical Conditions](#medical-conditions)
  * [Medical Facilities](#medical-facilities)
* [**Scrapers**](#scrapers)
* [**Workflows**](#workflow)
* [**Data Sources**](#data-sources)
* [**Contributing**](#submit-bugs)


### Dataset
The data are automatically scheduled to refresh every hour at the 11th minute as specified in the [Action workflow](https://github.com/erlange/INACOVID/actions) of this repo including the below chart, however if there is no update from the data sources then the data on this repo will not change.


The data files are stored in the [data](https://github.com/erlange/INACOVID/tree/master/data) folder categorised in tabular format (CSV) and JSON respectively.

<table>
<thead>
<tr>
<td><b>Folder</b></td>
<td><b>Filename</b></td>
<td ><b>Description</b></td>
</thead>
<tbody>
<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/csv>📁data/csv</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/csv/arcgis.natl.csv>📄arcgis.natl.csv</a></td>
<td rowspan=2>ArcGIS version of national level time-series data
</td>
</tr>
<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/json>📁data/json</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/json/arcgis.natl.json>📜arcgis.natl.json</a></td>
</td>
</tr>

<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/csv>📁data/csv</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/csv/basic.csv>📄basic.csv</a></td>
<td rowspan=2>Basic version of national and state/provincial level time-series data
</td>
</tr>
<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/json>📁data/json</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/json/basic.minified.json>📜basic.minified.json</a></td>
</td>
</tr>

<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/csv>📁data/csv</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/csv/ext.natl.csv>📄ext.natl.csv</a></td>
<td rowspan=2>BNPB version of national level time-series data
</td>
</tr>
<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/json>📁data/json</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/json/ext.natl.json>📜ext.natl.json</a></td>
</td>
</tr>

<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/csv>📁data/csv</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/csv/ext.prov.csv>📄ext.prov.csv</a></td>
<td rowspan=2>BNPB version of state/provincial level time-series data
</td>
</tr>
<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/json>📁data/json</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/json/ext.prov.json>📜ext.prov.json</a></td>
</td>
</tr>

<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/csv>📁data/csv</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/csv/hospitals.csv>📄hospitals.csv</a></td>
<td rowspan=2>Local hospital contacts and addresses
</td>
</tr>
<tr>
<td><a href=https://github.com/erlange/INACOVID/tree/master/data/json>📁data/json</a></td>
<td><a href=https://github.com/erlange/INACOVID/blob/master/data/json/hospitals.json>📜hospitals.json</a></td>
</td>
</tr>

<tr>
<td colspan=3>*BNPB (Badan Nasional Penanggulangan Bencana) is the Indonesian government/national institution for disaster recovery</td>
</tr>

</tbody>
</table>
<br>

### Charts
---
These charts are plotted regularly based on the scraped data. You can find some `.py` files to generate the charts in the [📁ActionRunner](https://github.com/erlange/INACOVID/tree/master/ActionRunner) folder.
<br>

#### Impacts on Indonesia Provinces
---
![Cases by Provinces](https://raw.githubusercontent.com/erlange/INACOVID/master/data/plot/inaprovinces.png)

Script: [CreatePlot-Provinces.py](https://github.com/erlange/INACOVID/blob/master/ActionRunner/CreatePlot-Provinces.py)
<br>
#### Demographics
---

![Indonesia Covid-19 Cases by Genders and Age](https://raw.githubusercontent.com/erlange/INACOVID/master/data/plot/inagender.png)

Script: [CreatePlot-Age.py](https://github.com/erlange/INACOVID/blob/master/ActionRunner/CreatePlot-Age.py)
<br>
#### Medical Conditions
---

![Comorbidities](https://raw.githubusercontent.com/erlange/INACOVID/master/data/plot/inacomorbid.png)

Script: [CreatePlot-Comorbid.py](https://github.com/erlange/INACOVID/blob/master/ActionRunner/CreatePlot-Comorbid.py)
<br>
![Symptoms](https://raw.githubusercontent.com/erlange/INACOVID/master/data/plot/inasymptoms.png)

Script: [CreatePlot-Symptoms.py](https://github.com/erlange/INACOVID/blob/master/ActionRunner/CreatePlot-Symptoms.py)
<br>

#### Medical Facilities
---

![Medical Facilities](https://raw.githubusercontent.com/erlange/INACOVID/master/data/plot/inahosp.png)

Script: [CreatePlot-Hospitals.py](https://github.com/erlange/INACOVID/blob/master/ActionRunner/CreatePlot-Hospitals.py)
<br>

### Scrapers
---
The scripts to gather the data are all in the [📁ActionRunner](https://github.com/erlange/INACOVID/tree/master/ActionRunner) folder, written mostly in C# designed to run on the latest version .NET Core.  Some files however are in `.py` python format to plot the chart.

### Workflows
---
All the data scraping processes are located in the [📁.github/workflows](https://github.com/erlange/INACOVID/tree/master/.github/workflows)  folder automated by this repo  [Actions](https://github.com/erlange/INACOVID/actions). 


### Data Sources
---
The data sources are from the [Official Government Site](https://covid19.go.id/peta-sebaran)


### Submit Bugs
---
Just open an issue [here](https://github.com/erlange/INACOVID/issues/new). All contributions and inputs are welcome.


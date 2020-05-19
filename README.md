[![Scheduled Data Collecting](https://github.com/erlange/INACOVID/workflows/Report%20Collecting/badge.svg)](https://github.com/erlange/INACOVID/actions?query=workflow%3A%22Report+Collecting%22)

## Indonesia COVID-19 (INACOVID) Data Repository in CSV and JSON Format

This repo is intended as an independent effort of providing up-to-the-minute time-series reports in JSON and CSV format for analytical purposes.

Datasets are automatically scheduled to refresh every hour at the 11th minute as specified in the [Action workflow](https://github.com/erlange/INACOVID/actions) of this repo including the below chart, however if there is no update from the data sources then the data on this repo will not change.

![Indonesia Covid-19 Chart](https://raw.githubusercontent.com/erlange/INACOVID/master/data/plot/inachart.png)


The data sources are taken from the [Official Government Site](https://covid19.go.id/peta-sebaran) and the [ArcGIS Covid dashboard of Indonesia.](https://inacovid19.maps.arcgis.com/apps/opsdashboard/index.html#/81a3572883014c0088a62e1f320c97e1)


### Datasets

The data files are stored in the [data](https://github.com/erlange/INACOVID/tree/master/data) folder categorised in tabular format (CSV) and JSON respectfully.

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
<td colspan=3>*BNPB (Badan Nasional Penanggulangan Bencana) is the Indonesian government/national institution for disaster recovery</td>
</tr>

</tbody>
</table>

### Scrapers

The scripts to gather the data are all in the [📁ActionRunner](https://github.com/erlange/INACOVID/tree/master/ActionRunner) folder, written mostly in C# designed to run on the latest version .NET Core.  Some files however are in `.py` python format to plot the chart.

### Workflow

All the data scraping processes are located in the [📁.github/workflows](https://github.com/erlange/INACOVID/tree/master/.github/workflows)  folder automated by this repo  [Actions](https://github.com/erlange/INACOVID/actions). 

### Submit Bugs

Just open an [issue](https://github.com/erlange/INACOVID/issues/new). Any inputs are welcome.


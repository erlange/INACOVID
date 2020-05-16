using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using System;
using System.IO;
using System.Net;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace com.github.erlange.inacovid
{
    public class Indonesia
    {


        public static async Task Process()
        {
            string fileName= "basic.minified.json";
            string fileNameCsv= "basic.csv";
            string appDir = System.AppDomain.CurrentDomain.BaseDirectory;
            string relDir = Utils.LocalEndPoints["PathToJson"];
            //string fullPath = Path.Combine(appDir, relDir, fileName);
            //string fullPathCsv = Path.Combine(appDir, Utils.LocalEndPoints["PathToCsv"], fileNameCsv);
            string fullPath = Utils.GetAbsdir(fileName, relDir);
            string fullPathCsv = Utils.GetAbsdir(fileNameCsv, Utils.LocalEndPoints["PathToCsv"]);
            
            JObject jResult = await GetBasicJson();
            await File.WriteAllTextAsync(fullPath, JsonConvert.SerializeObject(jResult, Formatting.None));
            await File.WriteAllTextAsync(fullPathCsv, await GetBasicCsvMerged());
            Log.Information("Basic data done.");
        }


        public static async Task<string> GetBasicCsvMerged()
        {
            var recsNatl = await GetBasicCsvNatl();
            var recsProv = await GetBasicCsvProv();
            recsNatl.AddRange(recsProv);

            //var recs = from r in recsNatl
            //          orderby r.Date ascending
            //          select r;


            var sb = new System.Text.StringBuilder();
            sb.AppendLine("\"Date\",\"Location\",\"Confirmed\",\"Cured\",\"Deaths\"");
            foreach (var fld in recsNatl)
            {
                sb.AppendFormat("\"{0:yyyy/MM/dd}\",\"{1}\",{2},{3},{4}", fld.Date, fld.Location, fld.Confirmed, fld.Cured, fld.Deaths);
                sb.AppendLine();
            }
            return sb.ToString();
        }

        public static async Task<JObject> GetBasicJson()
        {
            Log.Information("Processing Indonesia data...");
            Log.Information(Utils.Delim);

            string sCasesNatl = Utils.DictNatl["Cases"];
            string sCuredNatl = Utils.DictNatl["Cured"];
            string sDeadNatl = Utils.DictNatl["Dead"];

            string sCasesProv = Utils.DictProv["Cases"];
            string sCuredProv = Utils.DictProv["Cured"];
            string sDeadProv = Utils.DictProv["Dead"];

            string urlNatl = Utils.ApiEndPoints["Natl"];
            string urlProv = Utils.ApiEndPoints["Prov"];

            var root = JObject.Parse(@"{""National"":{}}");
            var triCasesNatl = JObject.Parse(@"{""Cases"":{}, ""Cured"":{},""Dead"":{}}");
            root["National"] = triCasesNatl;
            var jRoot = root["National"];

            string sJson = await Utils.DownloadJsonStringAsync(urlNatl);

            JObject obj = (JObject)JsonConvert.DeserializeObject(sJson);

            JArray arr = (JArray)obj["features"];
            var allRecords = arr.Children()["attributes"];

            Log.Information("Processing Indonesia National data...");
            for (int i = 0; i < Utils.DictNatl.Count; i++)
            {
                string k = Utils.DictNatl.ElementAt(i).Key;
                string v = Utils.DictNatl.ElementAt(i).Value;
                var eachCaseNatl = from recs in allRecords
                                   where recs[v].ToString() != ""
                                && recs[v].ToString() != "0"
                                && recs[v].ToString().ToLower() != "null"
                                   select recs;
                Log.Information("-- " + k + "(" + v + "):" + eachCaseNatl.Count() + " cases");

                foreach (var col in eachCaseNatl)
                {
                    jRoot[k][col["Tgl"].ToString()] = col[v];
                }
            }

            Log.Information(Utils.Delim);
            Log.Information("Processing Indonesia Provincial data...");

            sJson = await Utils.DownloadJsonStringAsync(urlProv);

            obj = (JObject)JsonConvert.DeserializeObject(sJson);
            arr = (JArray)obj["features"];
            allRecords = arr.Children()["attributes"];

            var provGrouped = allRecords.GroupBy(x => x["Provinsi"])
                .Select(g => g.First()).OrderByDescending(x => x[sCasesProv]);

            foreach (var prov in provGrouped)
            {
                var triCasesProv = JObject.Parse(@"{""Cases"":{}, ""Cured"":{},""Dead"":{}}");

                string sProv = prov["Provinsi"].ToString();
                Log.Information("Processing province " + sProv);

                root[sProv] = triCasesProv;
                var jNodeProv = root[sProv];

                for (int i = 0; i < Utils.DictProv.Count; i++)
                {
                    string k = Utils.DictProv.ElementAt(i).Key;
                    string v = Utils.DictProv.ElementAt(i).Value;

                    var eachCaseProv = from rec in allRecords
                                       where rec["Provinsi"].ToString() == sProv
                                       && rec[v].ToString() != ""
                                       && rec[v].ToString().ToLower() != "null"
                                       && rec[v].ToString() != "0"
                                       select rec;

                    Log.Information("-- " + k + " (" + v + "):" + eachCaseProv.Count() + " cases");
                    foreach (var col in eachCaseProv)
                    {
                        jNodeProv[k][col["Tgl"].ToString()] = col[v];
                    }
                }
            }
            return root;
        }
        public static async Task< List<CsvField>> GetBasicCsvNatl()
        {
            WebHeaderCollection headers = new WebHeaderCollection();
            foreach (var item in Utils.httpHeaders)
                headers.Add(item.Key, item.Value);

            string jsonString = await Utils.DownloadJsonStringAsync(Utils.ApiEndPoints["Natl"]);

            var recs = Utils.JsonToEnumerable(jsonString);

            var csvFields = new List<CsvField>();
            CsvField csv = new CsvField();
            foreach(var rec in recs)
            {
                try
                {
                    csvFields.Add(new CsvField
                    {
                        Date = DateTime.Parse(rec["Tgl"].ToString()),
                        Location = "National",
                        Confirmed = int.Parse(rec[Utils.DictNatl["Cases"]].ToString()),
                        Cured = int.Parse(rec[Utils.DictNatl["Cured"]].ToString()),
                        Deaths = int.Parse(rec[Utils.DictNatl["Dead"]].ToString()),
                    });
                }
                catch (Exception)
                {
                    continue;
                }
            }
            return csvFields;
            //var sb=new System.Text.StringBuilder();
            //foreach(var fld in csvFields)
            //{
            //    sb.AppendFormat("\"{0}\",\"{1}\",{2},{3},{4}", fld.Date, fld.Location, fld.Confirmed, fld.Cured, fld.Deaths);
            //    sb.AppendLine();
            //}
            //return sb.ToString();
        }

        public static async Task<List<CsvField>> GetBasicCsvProv()
        {
            WebHeaderCollection headers = new WebHeaderCollection();
            foreach (var item in Utils.httpHeaders)
                headers.Add(item.Key, item.Value);

            string jsonString = await Utils.DownloadJsonStringAsync(Utils.ApiEndPoints["Prov"]);

            var recs = Utils.JsonToEnumerable(jsonString);

            var csvFields = new List<CsvField>();
            foreach (var rec in recs)
            {
                csvFields.Add(new CsvField
                {
                    Date = DateTime.Parse(rec["Tgl"].ToString()),
                    Location = rec["Provinsi"].ToString(),
                    Confirmed = int.Parse(rec[Utils.DictProv["Cases"]].ToString()),
                    Cured = int.Parse(rec[Utils.DictProv["Cured"]].ToString()),
                    Deaths = int.Parse(rec[Utils.DictProv["Dead"]].ToString()),
                });
            }
            return csvFields;
        }

    }

    public class CsvField
    {
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public int Confirmed { get; set; }
        public int Cured { get; set; }
        public int Deaths { get; set; }

    }
}

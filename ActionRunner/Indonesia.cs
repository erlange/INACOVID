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
        public static IConfigurationRoot configuration = Program.configuration;

        private static Dictionary<string, string> ApiEndPoints = configuration.GetSection("ApiEndPoints").Get<Dictionary<string, string>>();
        private static Dictionary<string, string> LocalEndPoints = configuration.GetSection("LocalEndPoints").Get<Dictionary<string, string>>();
        private static Dictionary<string, string> DictNatl = configuration.GetSection("DictAlt1").Get<Dictionary<string, string>>();
        private static Dictionary<string, string> DictProv = configuration.GetSection("DictAlt2").Get<Dictionary<string, string>>();
        private static Dictionary<string, string> httpHeaders = configuration.GetSection("HttpHeader").Get<Dictionary<string, string>>();
        private const string sDelim = "--------------------";

        public static async Task ProcessBasicData()
        {
            string fileName= "basic.minified.json";
            string fileNameCsv= "basic.csv";
            string appDir = System.AppDomain.CurrentDomain.BaseDirectory;
            string relDir = LocalEndPoints["PathToJson"];
            string fullPath = Path.Combine(appDir, relDir, fileName);
            string fullPathCsv = Path.Combine(appDir, LocalEndPoints["PathToCsv"], fileNameCsv);
            
            JObject jResult = await GetBasicJson();
            Log.Information("Saving JSON data...");
            await File.WriteAllTextAsync(fullPath, JsonConvert.SerializeObject(jResult, Formatting.None));
            Log.Information("Saving CSV data...");
            await File.WriteAllTextAsync(fullPathCsv, await GetBasicCsvMerged());
            Log.Information("Finished processing basic data");
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
            sb.AppendLine("Date,Location,Confirmed,Cured,Deaths");
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
            Log.Information(sDelim);

            string sCasesNatl = DictNatl["Cases"];
            string sCuredNatl = DictNatl["Cured"];
            string sDeadNatl = DictNatl["Dead"];

            string sCasesProv = DictProv["Cases"];
            string sCuredProv = DictProv["Cured"];
            string sDeadProv = DictProv["Dead"];

            string urlNatl = ApiEndPoints["Natl"];
            string urlProv = ApiEndPoints["Prov"];



            var root = JObject.Parse(@"{""National"":{}}");
            var triCasesNatl = JObject.Parse(@"{""Cases"":{}, ""Cured"":{},""Dead"":{}}");
            root["National"] = triCasesNatl;
            var jRoot = root["National"];

            WebHeaderCollection headers = new WebHeaderCollection();
            foreach (var item in httpHeaders)
                headers.Add(item.Key, item.Value);

            string sJson = await Utils.GetData(ApiEndPoints["Natl"], headers);

            JObject obj = (JObject)JsonConvert.DeserializeObject(sJson);

            JArray arr = (JArray)obj["features"];
            var allRecords = arr.Children()["attributes"];

            Log.Information("Processing Indonesia National data...");
            for (int i = 0; i < DictNatl.Count; i++)
            {
                string k = DictNatl.ElementAt(i).Key;
                string v = DictNatl.ElementAt(i).Value;
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

            Log.Information(sDelim);
            Log.Information("Processing Indonesia Provincial data...");

            sJson = await Utils.GetData(urlProv, headers);

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

                for (int i = 0; i < DictProv.Count; i++)
                {
                    string k = DictProv.ElementAt(i).Key;
                    string v = DictProv.ElementAt(i).Value;

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
            foreach (var item in httpHeaders)
                headers.Add(item.Key, item.Value);

            string jsonString = await Utils.GetData(ApiEndPoints["Natl"], headers);

            var recs = Utils.JsonToEnumerable(jsonString);

            var csvFields = new List<CsvField>();
            CsvField csv = new CsvField();
            foreach(var rec in recs)
            {
                csvFields.Add(new CsvField
                {
                    Date = DateTime.Parse(rec["Tgl"].ToString()),
                    Location = "National",
                    Confirmed = int.Parse(rec[DictNatl["Cases"]].ToString()),
                    Cured = int.Parse(rec[DictNatl["Cured"]].ToString()),
                    Deaths = int.Parse(rec[DictNatl["Dead"]].ToString()),
                });
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
            foreach (var item in httpHeaders)
                headers.Add(item.Key, item.Value);

            string jsonString = await Utils.GetData(ApiEndPoints["Prov"], headers);

            var recs = Utils.JsonToEnumerable(jsonString);

            var csvFields = new List<CsvField>();
            foreach (var rec in recs)
            {
                csvFields.Add(new CsvField
                {
                    Date = DateTime.Parse(rec["Tgl"].ToString()),
                    Location = rec["Provinsi"].ToString(),
                    Confirmed = int.Parse(rec[DictProv["Cases"]].ToString()),
                    Cured = int.Parse(rec[DictProv["Cured"]].ToString()),
                    Deaths = int.Parse(rec[DictProv["Dead"]].ToString()),
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

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
using System.Text;

namespace com.github.erlange.inacovid
{
    class ProvincialExtended
    {
        // For testing only
        readonly static string inputprovNm = "JAWA_BARAT";

        static readonly string DiConfirmed = Utils.DictProvExt["Daily-DI-Confirmed"];
        static readonly string DiCured = Utils.DictProvExt["Daily-DI-Cured"];
        static readonly string DiDead = Utils.DictProvExt["Daily-DI-Dead"];
        static readonly string DiHosp = Utils.DictProvExt["Daily-DI-Hosp"];
        static readonly string Confirmed = Utils.DictProvExt["Daily-Confirmed"];
        static readonly string Cured = Utils.DictProvExt["Daily-Cured"];
        static readonly string Dead = Utils.DictProvExt["Daily-Dead"];
        static readonly string Hosp = Utils.DictProvExt["Daily-Hosp"];
        static readonly string Dd = Utils.DictProvExt["Daily-Date"];
        
        static readonly string provNm = Utils.DictProvExt["Location"];
        readonly static string fmt = Utils.FmtDt;

        public static async Task<List<string>> GetAllProvinces()
        {
            //string urlProvAll = Utils.ApiEndPoints["ProvAll"];
            string urlProvAll = Utils.ApiEndPoints["Prov"];
            JObject o = await Utils.GetJsonObj(urlProvAll);
            var li = new List<string>();

            //foreach (var p in o["list_data"].Children())
            //    li.Add(p["key"].ToString());

            foreach (var p in o["features"].Children())
                li.Add(p["attributes"]["Provinsi"].ToString());

            return li.Distinct().Select(x => x).ToList();
        }


        public static async Task Process()
        {
            string[] s = (await GetAllProvinces()).Select(x => x.Replace(' ', '_').ToUpper()).ToArray();
            //foreach (string ss in s)
            //Console.WriteLine(ss);
            await ProcessOne(s);
        }

        public static async Task ProcessOne()
        {

            string urlProvExt = Utils.ApiEndPoints["ProvExt"];
            var recs = GetDailyListExt(await Utils.GetJsonObj(urlProvExt.Replace("[]", inputprovNm)));
            string s = ListToCsv(recs);
            string loc = Utils.GetAbsdir("ext.prov.csv", Utils.LocalEndPoints["PathToCsv"]);
            await File.WriteAllTextAsync(loc, s);
        }

        public static async Task ProcessOne(string[] provinces)
        {
            string urlProvExt = Utils.ApiEndPoints["ProvExt"];
            string loc = Utils.GetAbsdir("ext.prov.csv", Utils.LocalEndPoints["PathToCsv"]);
            string locJson = Utils.GetAbsdir("ext.prov.json", Utils.LocalEndPoints["PathToJson"]);
            File.Delete(loc);
            await File.AppendAllTextAsync(loc, WriteHeaderLine());
            //var lJson = new List<JObject>();
            JObject o = null;
            foreach (var p in provinces)
            {
                var recs = GetDailyListExt(await Utils.GetJsonObj(urlProvExt.Replace("[]", p)));
                string sCsv = ListToCsv(recs, false);

                //if (o != null)
                if (o == null)
                    o = BuildJson(recs);
                else
                    o.Merge(BuildJson(recs));

                string fCsv = Utils.GetAbsdir("ext.prov.csv", Utils.LocalEndPoints["PathToCsv"]);
                await File.AppendAllTextAsync(fCsv, sCsv);
                Console.WriteLine(p + " done.");
                System.Threading.Thread.Sleep(1000);
            }

            await File.WriteAllTextAsync(locJson, JsonConvert.SerializeObject(o));
            
        }

        public static JObject BuildJson(List<CsvFieldExt> list)
        {
            string s = list[0].Location;
            JObject o = JObject.Parse(@"{""" + s + @""":{}}");

            o[s][DiConfirmed] = JObject.Parse("{}");
            o[s][DiCured] = JObject.Parse("{}");
            o[s][DiDead] = JObject.Parse("{}");
            o[s][DiHosp] = JObject.Parse("{}");
            o[s][Confirmed] = JObject.Parse("{}");
            o[s][Cured] = JObject.Parse("{}");
            o[s][Dead] = JObject.Parse("{}");
            o[s][Hosp] = JObject.Parse("{}");

            foreach (var l in list)
            {
                string sDate = l.Date.ToString("yyyy-MM-dd");
                o[s][DiConfirmed][sDate] = l.DiConfirmed;
                o[s][DiCured][sDate] = l.DiCured;
                o[s][DiDead][sDate] = l.DiDeaths;
                o[s][DiHosp][sDate] = l.DiHosp;
                o[s][Confirmed][sDate] = l.Confirmed;
                o[s][Cured][sDate] = l.Cured;
                o[s][Dead][sDate] = l.Deaths;
                o[s][Hosp][sDate] = l.Hosp;
            }
            return o;
        }


        public static List<CsvFieldExt> GetDailyListExt(JObject jsonObject)
        {
            var oDaily = jsonObject["list_perkembangan"].Children();
            var sb = new StringBuilder();
            sb.Append("{");
            sb.AppendFormat(@"""{0}""", DiConfirmed);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", DiCured);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", DiDead);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", DiHosp);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", Confirmed);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", Cured);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", Dead);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", Hosp);
            sb.Append(":{}");
            sb.Append("}");

            //var oDailyCases = JObject.Parse(@"{""DiConfirmed"":{}, ""DiCured"":{},""DiDead"":{},""DiHosp"":{},""Confirmed"":{}, ""Cured"":{},""Dead"":{},""Hosp"":{}}");
            var oDailyCases = JObject.Parse(sb.ToString());
            var fields = new List<CsvFieldExt>();

            foreach (var d in oDaily)
            {
                //DateTime dt = DateTime.Parse(d[Dd].ToString());
                string sDateKey = d[Dd].ToString().Remove(d[Dd].ToString().Length - 3, 3);
                DateTime dt = Utils.ConvertFromUnixTimestamp(double.Parse(sDateKey));

                oDailyCases[DiConfirmed][dt.ToString(fmt)] = d[DiConfirmed].ToString();
                oDailyCases[DiCured][dt.ToString(fmt)] = d[DiCured].ToString();
                oDailyCases[DiDead][dt.ToString(fmt)] = d[DiDead].ToString();
                oDailyCases[DiHosp][dt.ToString(fmt)] = d[DiHosp].ToString();

                oDailyCases[Confirmed][dt.ToString(fmt)] = d[Confirmed].ToString();
                oDailyCases[Cured][dt.ToString(fmt)] = d[Cured].ToString();
                oDailyCases[Dead][dt.ToString(fmt)] = d[Dead].ToString();
                oDailyCases[Hosp][dt.ToString(fmt)] = d[Hosp].ToString();
                
                fields.Add(new CsvFieldExt
                {
                    Location = jsonObject[provNm].ToString(),
                    Date = dt,
                    DiConfirmed = int.Parse(d[DiConfirmed].ToString()),
                    DiCured = int.Parse(d[DiCured].ToString()),
                    DiDeaths = int.Parse(d[DiDead].ToString()),
                    DiHosp = int.Parse(d[DiHosp].ToString()),
                    Confirmed = int.Parse(d[Confirmed].ToString()),
                    Cured = int.Parse(d[Cured].ToString()),
                    Deaths = int.Parse(d[Dead].ToString()),
                    Hosp = int.Parse(d[Hosp].ToString())
                }) ;  
            }
            return fields;
        }

        public static string WriteHeaderLine()
        {
            var line = new StringBuilder();
            line.AppendFormat("\"Date\",\"Location\",");
            line.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\",", DiConfirmed, DiCured, DiDead, DiHosp);
            line.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\"", Confirmed, Cured, Dead, Hosp);
            line.AppendLine();
            return line.ToString();
        }

        public static string ListToCsv(IEnumerable<CsvFieldExt> list, bool writeHeader = true)
        {
            var csv = new StringBuilder();
            if (writeHeader)
                csv.AppendLine(WriteHeaderLine());
        
            foreach (var r in list)
            {
                csv.AppendFormat("\"{0}\"", r.Date.ToString(fmt));
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.Location);
                csv.Append(",");
                csv.AppendFormat("{0}", r.DiConfirmed);
                csv.Append(",");
                csv.AppendFormat("{0}", r.DiCured);
                csv.Append(",");
                csv.AppendFormat("{0}", r.DiDeaths);
                csv.Append(",");
                csv.AppendFormat("{0}", r.DiHosp);
                csv.Append(",");
                csv.AppendFormat("{0}", r.Confirmed);
                csv.Append(",");
                csv.AppendFormat("{0}", r.Hosp);
                csv.Append(",");
                csv.AppendFormat("{0}", r.Cured);
                csv.Append(",");
                csv.AppendFormat("{0}", r.Deaths);
                csv.AppendLine();
            }
            return csv.ToString();
        }

    }

}

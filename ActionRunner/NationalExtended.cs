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


    class NationalExtended
    {
        static readonly string DiConfirmed = Utils.DictNatlExt["Daily-DI-Confirmed"];
        static readonly string DiCured = Utils.DictNatlExt["Daily-DI-Cured"];
        static readonly string DiDead = Utils.DictNatlExt["Daily-DI-Dead"];
        static readonly string DiHosp = Utils.DictNatlExt["Daily-DI-Hosp"];
        static readonly string Confirmed = Utils.DictNatlExt["Daily-Confirmed"];
        static readonly string Cured = Utils.DictNatlExt["Daily-Cured"];
        static readonly string Dead = Utils.DictNatlExt["Daily-Dead"];
        static readonly string Hosp = Utils.DictNatlExt["Daily-Hosp"];
        static readonly string Dd = Utils.DictNatlExt["Daily-Date"];
        readonly static string fmt = Utils.FmtDt;



    public static async Task Process()
        {
            string urlNatlExt = Utils.ApiEndPoints["NatlExt"];
            var recs = GetDailyListExt(await Utils.GetJsonObj(urlNatlExt));
            //Log.Information("Getting data: " + urlNatlExt);

            string sCsv = ListToCsv(recs);
            string sJson = JsonConvert.SerializeObject(BuildJson(recs, false));
            string fCsv = Utils.GetAbsdir("ext.natl.csv", Utils.LocalEndPoints["PathToCsv"]);
            string fJson = Utils.GetAbsdir("ext.natl.json", Utils.LocalEndPoints["PathToJson"]);
            await File.WriteAllTextAsync(fCsv, sCsv);
            //Log.Information("   Saved to: " + fCsv);
            await File.WriteAllTextAsync(fJson, sJson);
            //Log.Information("   Saved to: " + fJson);
            Console.WriteLine("National data extended done.");
            Console.WriteLine(Utils.Delim);
        }

        public static List<CsvFieldExt> GetDailyListExt(JObject jsonObject)
        {
            var oDaily = jsonObject["update"]["harian"].Children();
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
                DateTime dt = DateTime.Parse(d[Dd].ToString());
                oDailyCases[DiConfirmed][dt.ToString(fmt)] = d[DiConfirmed]["value"].ToString();
                oDailyCases[DiCured][dt.ToString(fmt)] = d[DiCured]["value"].ToString();
                oDailyCases[DiDead][dt.ToString(fmt)] = d[DiDead]["value"].ToString();
                oDailyCases[DiHosp][dt.ToString(fmt)] = d[DiHosp]["value"].ToString();

                oDailyCases[Confirmed][dt.ToString(fmt)] = d[Confirmed]["value"].ToString();
                oDailyCases[Cured][dt.ToString(fmt)] = d[Cured]["value"].ToString();
                oDailyCases[Dead][dt.ToString(fmt)] = d[Dead]["value"].ToString();
                oDailyCases[Hosp][dt.ToString(fmt)] = d[Hosp]["value"].ToString();
                
                fields.Add(new CsvFieldExt
                {
                    Location = "National",
                    Date = dt,
                    DiConfirmed = int.Parse(d[DiConfirmed]["value"].ToString()),
                    DiCured = int.Parse(d[DiCured]["value"].ToString()),
                    DiDeaths = int.Parse(d[DiDead]["value"].ToString()),
                    DiHosp = int.Parse(d[DiHosp]["value"].ToString()),
                    Confirmed = int.Parse(d[Confirmed]["value"].ToString()),
                    Cured = int.Parse(d[Cured]["value"].ToString()),
                    Deaths = int.Parse(d[Dead]["value"].ToString()),
                    Hosp = int.Parse(d[Hosp]["value"].ToString())
                }) ;  
            }
            return fields;
        }

        public static string ListToCsv(IEnumerable<CsvFieldExt> list)
        {
            var csv = new StringBuilder();
            csv.AppendFormat("\"Date\",\"Location\",");
            csv.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\",", DiConfirmed, DiCured, DiHosp, DiDead);
            csv.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\"", Confirmed, Cured, Hosp, Dead);
            csv.AppendLine();
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
                csv.AppendFormat("{0}", r.DiHosp);
                csv.Append(",");
                csv.AppendFormat("{0}", r.DiDeaths);
                csv.Append(",");
                csv.AppendFormat("{0}", r.Confirmed);
                csv.Append(",");
                csv.AppendFormat("{0}", r.Cured);
                csv.Append(",");
                csv.AppendFormat("{0}", r.Hosp);
                csv.Append(",");
                csv.AppendFormat("{0}", r.Deaths);
                csv.AppendLine();
            }
            return csv.ToString();
        }

        public static JObject BuildJson(List<CsvFieldExt> list)
        {
            JObject o = JObject.Parse(@"{""Nasional"":{}}");

            o["Nasional"][DiConfirmed] = JObject.Parse("{}");
            o["Nasional"][DiCured] = JObject.Parse("{}");
            o["Nasional"][DiDead] = JObject.Parse("{}");
            o["Nasional"][DiHosp] = JObject.Parse("{}");
            o["Nasional"][Confirmed] = JObject.Parse("{}");
            o["Nasional"][Cured] = JObject.Parse("{}");
            o["Nasional"][Dead] = JObject.Parse("{}");
            o["Nasional"][Hosp] = JObject.Parse("{}");

            foreach (var l in list)
            {
                string sDate = l.Date.ToString("yyyy-MM-dd");
                o["Nasional"][DiConfirmed][sDate] = l.DiConfirmed;
                o["Nasional"][DiCured][sDate] = l.DiCured;
                o["Nasional"][DiDead][sDate] = l.DiDeaths;
                o["Nasional"][DiHosp][sDate] = l.DiHosp;
                o["Nasional"][Confirmed][sDate] = l.Confirmed;
                o["Nasional"][Cured][sDate] = l.Cured;
                o["Nasional"][Dead][sDate] = l.Deaths;
                o["Nasional"][Hosp][sDate] = l.Hosp;
            }
            return o;
        }

        public static JObject BuildJson(List<CsvFieldExt> list, bool noHeader = true)
        {
            if (!noHeader)
                return BuildJson(list);

            JObject o = JObject.Parse("{}");

            o[DiConfirmed] = JObject.Parse("{}");
            o[DiCured] = JObject.Parse("{}");
            o[DiDead] = JObject.Parse("{}");
            o[DiHosp] = JObject.Parse("{}");
            o[Confirmed] = JObject.Parse("{}");
            o[Cured] = JObject.Parse("{}");
            o[Dead] = JObject.Parse("{}");
            o[Hosp] = JObject.Parse("{}");

            foreach (var l in list)
            {
                string sDate = l.Date.ToString("yyyy-MM-dd");
                o[DiConfirmed][sDate] = l.DiConfirmed;
                o[DiCured][sDate] = l.DiCured;
                o[DiDead][sDate] = l.DiDeaths;
                o[DiHosp][sDate] = l.DiHosp;
                o[Confirmed][sDate] = l.Confirmed;
                o[Cured][sDate] = l.Cured;
                o[Dead][sDate] = l.Deaths;
                o[Hosp][sDate] = l.Hosp;
            }
            return o;
        }


    }

}

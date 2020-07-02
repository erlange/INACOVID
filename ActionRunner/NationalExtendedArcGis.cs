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
    class NationalExtendedArcGis
    {
        static readonly string DiConfirmed = Utils.DictNatlExtArcGis["DI-Confirmed"];
        static readonly string DiCured = Utils.DictNatlExtArcGis["DI-Cured"];
        static readonly string DiDead = Utils.DictNatlExtArcGis["DI-Dead"];
        static readonly string DiHosp = Utils.DictNatlExtArcGis["DI-Hosp"];
        static readonly string Confirmed = Utils.DictNatlExtArcGis["Confirmed"];
        static readonly string Cured = Utils.DictNatlExtArcGis["Cured"];
        static readonly string Dead = Utils.DictNatlExtArcGis["Dead"];
        static readonly string Hosp = Utils.DictNatlExtArcGis["Hosp"];
        static readonly string PctCured = Utils.DictNatlExtArcGis["Pct-Cured"];
        static readonly string PctDead = Utils.DictNatlExtArcGis["Pct-Dead"];
        static readonly string PctHosp = Utils.DictNatlExtArcGis["Pct-Hosp"];
        static readonly string SpecTotal = Utils.DictNatlExtArcGis["Spec-Total"];
        static readonly string SpecConfirmed = Utils.DictNatlExtArcGis["Spec-Confirmed"];
        static readonly string SpecNeg = Utils.DictNatlExtArcGis["Spec-Neg"];
        static readonly string TracObserved= Utils.DictNatlExtArcGis["Trac-Observed"];
        static readonly string TracMonitored = Utils.DictNatlExtArcGis["Trac-Monitored"];
        static readonly string Dd = Utils.DictNatlExtArcGis["Date"];
        readonly static string fmt = Utils.FmtDt;



    public static async Task Process()
        {
            string urlNatlExt = Utils.ApiEndPoints["Natl"];
            var recs = GetDailyListExt(await Utils.GetJsonObj(urlNatlExt));
            string sCsv = ListToCsv(recs);
            string sJson = JsonConvert.SerializeObject(BuildJson(recs, false));
            string fCsv = Utils.GetAbsdir("arcgis.natl.csv", Utils.LocalEndPoints["PathToCsv"]);
            string fJson = Utils.GetAbsdir("arcgis.natl.json", Utils.LocalEndPoints["PathToJson"]);
            await File.WriteAllTextAsync(fCsv, sCsv);
            await File.WriteAllTextAsync(fJson, sJson);
            Console.WriteLine("National data extended (ArcGis version) done.");
            Console.WriteLine(Utils.Delim);
        }

        public static List<CsvFieldArcGis> GetDailyListExt(JObject jsonObject)
        {
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
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", PctCured);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", PctDead);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", PctHosp);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", SpecTotal);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", SpecConfirmed);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", SpecNeg);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", TracObserved);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", TracMonitored);
            sb.Append(":{}");
            sb.Append("}");
            
            var oDaily = jsonObject["features"].Children();

            //var oDailyCases = JObject.Parse(@"{""DiConfirmed"":{}, ""DiCured"":{},""DiDead"":{},""DiHosp"":{},""Confirmed"":{}, ""Cured"":{},""Dead"":{},""Hosp"":{}}");
            var oDailyCases = JObject.Parse(sb.ToString());
            var fields = new List<CsvFieldArcGis>();

            var daily = from dd in oDaily["attributes"]
                        where Utils.ParseInt(dd[Confirmed]) != null
                        //&& dd[Confirmed].ToString() != "null"
                        //&& dd[Confirmed].ToString() != null
                        orderby dd[Dd] ascending
                        select dd;

            foreach (var d in daily)
            {
                DateTime dt = DateTime.Parse(d[Dd].ToString());
                //oDailyCases[DiConfirmed][dt.ToString(fmt)] = d[DiConfirmed].ToString();
                //oDailyCases[DiCured][dt.ToString(fmt)] = d[DiCured].ToString();
                //oDailyCases[DiDead][dt.ToString(fmt)] = d[DiDead].ToString();
                //oDailyCases[DiHosp][dt.ToString(fmt)] = d[DiHosp].ToString();

                //oDailyCases[Confirmed][dt.ToString(fmt)] = d[Confirmed].ToString();
                //oDailyCases[Cured][dt.ToString(fmt)] = d[Cured].ToString();
                //oDailyCases[Dead][dt.ToString(fmt)] = d[Dead].ToString();
                //oDailyCases[Hosp][dt.ToString(fmt)] = d[Hosp].ToString();

                //oDailyCases[PctCured][dt.ToString(fmt)] = d[PctCured].ToString();
                //oDailyCases[PctDead][dt.ToString(fmt)] = d[PctDead].ToString();
                //oDailyCases[PctHosp][dt.ToString(fmt)] = d[PctHosp].ToString();

                //oDailyCases[SpecTotal][dt.ToString(fmt)] = d[SpecTotal].ToString();
                //oDailyCases[SpecConfirmed][dt.ToString(fmt)] = d[SpecConfirmed].ToString();
                //oDailyCases[SpecNeg][dt.ToString(fmt)] = d[SpecNeg].ToString();

                //oDailyCases[TracObserved][dt.ToString(fmt)] = d[TracObserved].ToString();
                //oDailyCases[TracMonitored][dt.ToString(fmt)] = d[TracMonitored].ToString();
                fields.Add(new CsvFieldArcGis
                {
                    Location = "National",
                    Date = dt,
                    DiConfirmed = Utils.ParseInt(d[DiConfirmed]),
                    DiCured = Utils.ParseInt(d[DiCured]),
                    DiDeaths = Utils.ParseInt(d[DiDead]),
                    DiHosp = Utils.ParseInt(d[DiHosp]),
                    Confirmed = Utils.ParseInt(d[Confirmed]),
                    Cured = Utils.ParseInt(d[Cured]),
                    Deaths = Utils.ParseInt(d[Dead]),
                    Hosp = Utils.ParseInt(d[Hosp]),
                    PctCured = Utils.ParseDouble(d[PctCured]),
                    PctDead = d[PctDead]==null? (double?)null : d[PctDead].ToString()==""? (double?)null : double.Parse(d[PctDead].ToString()),
                    PctHosp = d[PctHosp]==null? (double?)null : d[PctHosp].ToString() == "" ? (double?)null : double.Parse(d[PctHosp].ToString()),
                    SpecTotal = d[SpecTotal] == null ? (int?)null : d[SpecTotal].ToString() == "" ? (int?)null : Convert.ToInt32(d[SpecTotal].ToString()),
                    SpecConfirmed = d[SpecConfirmed] == null ? (int?)null : d[SpecConfirmed].ToString() == "" ? (int?)null : Convert.ToInt32(d[SpecConfirmed].ToString()),
                    SpecNeg = d[SpecNeg] == null ? (int?)null : d[SpecNeg].ToString() == "" ? (int?)null : Convert.ToInt32(d[SpecNeg].ToString()),
                    TracObserved = d[TracObserved] == null ? (int?)null : d[TracObserved].ToString() == "" ? (int?)null : Convert.ToInt32(d[TracObserved].ToString()),
                    TracMonitored = d[TracMonitored] == null ? (int?)null : d[TracMonitored].ToString() == "" ? (int?)null : Convert.ToInt32(d[TracMonitored].ToString())
                });
            }
            return fields;
        }

        public static string ListToCsv(IEnumerable<CsvFieldArcGis> list)
        {
            var csv = new StringBuilder();
            csv.AppendFormat("\"Date\",\"Location\",");
            csv.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\",", DiConfirmed, DiCured, DiHosp, DiDead);
            csv.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\",", Confirmed, Cured, Hosp, Dead);
            csv.AppendFormat("\"{0}\",\"{1}\",\"{2}\",", PctCured, PctDead, PctHosp);
            csv.AppendFormat("\"{0}\",\"{1}\",\"{2}\",", SpecTotal, SpecConfirmed, SpecNeg);
            csv.AppendFormat("\"{0}\",\"{1}\"", TracObserved, TracMonitored);
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
                csv.Append(",");
                csv.AppendFormat("{0}", r.PctCured);
                csv.Append(",");
                csv.AppendFormat("{0}", r.PctDead);
                csv.Append(",");
                csv.AppendFormat("{0}", r.PctHosp);
                csv.Append(",");
                csv.AppendFormat("{0}", r.SpecTotal);
                csv.Append(",");
                csv.AppendFormat("{0}", r.SpecConfirmed);
                csv.Append(",");
                csv.AppendFormat("{0}", r.SpecNeg);
                csv.Append(",");
                csv.AppendFormat("{0}", r.TracObserved);
                csv.Append(",");
                csv.AppendFormat("{0}", r.TracMonitored);
                csv.AppendLine();
            }
            return csv.ToString();
        }

        public static JObject BuildJson(List<CsvFieldArcGis> list)
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
            o["Nasional"][PctCured] = JObject.Parse("{}");
            o["Nasional"][PctDead] = JObject.Parse("{}");
            o["Nasional"][PctHosp] = JObject.Parse("{}");
            o["Nasional"][SpecTotal] = JObject.Parse("{}");
            o["Nasional"][SpecConfirmed] = JObject.Parse("{}");
            o["Nasional"][SpecNeg] = JObject.Parse("{}");
            o["Nasional"][TracObserved] = JObject.Parse("{}");
            o["Nasional"][TracMonitored] = JObject.Parse("{}");

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
                o["Nasional"][PctCured][sDate] = l.PctCured;
                o["Nasional"][PctDead][sDate] = l.PctDead;
                o["Nasional"][PctHosp][sDate] = l.PctHosp;
                o["Nasional"][SpecTotal][sDate] = l.SpecTotal;
                o["Nasional"][SpecConfirmed][sDate] = l.SpecConfirmed;
                o["Nasional"][SpecNeg][sDate] = l.SpecNeg;
                o["Nasional"][TracObserved][sDate] = l.TracObserved;
                o["Nasional"][TracMonitored][sDate] = l.TracMonitored;
            }
            return o;
        }

        public static JObject BuildJson(List<CsvFieldArcGis> list, bool noHeader = true)
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
            o[PctCured] = JObject.Parse("{}");
            o[PctDead] = JObject.Parse("{}");
            o[PctHosp] = JObject.Parse("{}");
            o[SpecTotal] = JObject.Parse("{}");
            o[SpecConfirmed] = JObject.Parse("{}");
            o[SpecNeg] = JObject.Parse("{}");
            o[TracObserved] = JObject.Parse("{}");
            o[TracMonitored] = JObject.Parse("{}");

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
                o[PctCured][sDate] = l.PctCured;
                o[PctDead][sDate] = l.PctDead;
                o[PctHosp][sDate] = l.PctHosp;
                o[SpecTotal][sDate] = l.SpecTotal;
                o[SpecConfirmed][sDate] = l.SpecConfirmed;
                o[SpecNeg][sDate] = l.SpecNeg;
                o[TracObserved][sDate] = l.TracObserved;
                o[TracMonitored][sDate] = l.TracMonitored;
            }
            return o;
        }


    }

}

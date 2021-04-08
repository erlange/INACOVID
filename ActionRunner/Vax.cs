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
    class Vax
    {
        static readonly string SpecPcrTcm = Utils.DictVax["SpecPcrTcm"];
        static readonly string SpecAntigen = Utils.DictVax["SpecAntigen"];
        static readonly string PplAntigen = Utils.DictVax["PplAntigen"];
        static readonly string PplPcrTcm = Utils.DictVax["PplPcrTcm"];
        static readonly string CummSpecPcrTcm = Utils.DictVax["CummSpecPcrTcm"];
        static readonly string CummSpecAntigen = Utils.DictVax["CummSpecAntigen"];
        static readonly string CummPplAntigen = Utils.DictVax["CummPplAntigen"];
        static readonly string CummPplPcrTcm = Utils.DictVax["CummPplPcrTcm"];
        static readonly string PplVax1 = Utils.DictVax["PplVax1"];
        static readonly string PplVax2 = Utils.DictVax["PplVax2"];
        static readonly string CummPplVax1 = Utils.DictVax["CummPplVax1"];
        static readonly string CummPplVax2 = Utils.DictVax["CummPplVax2"];
        static readonly string Dd = Utils.DictVax["DailyDate"];
        static readonly string fmt = Utils.FmtDt;
        public static async Task Process()
        {
            string urlVax = Utils.ApiEndPoints["Vax"];
            var recs = GetDailyListExt(await Utils.GetJsonObj(urlVax));
            string sCsv = ListToCsv(recs);
            string sJson = JsonConvert.SerializeObject(BuildJson(recs));
            string fCsv = Utils.GetAbsdir("vax.csv", Utils.LocalEndPoints["PathToCsv"]);
            string fJson = Utils.GetAbsdir("vax.json", Utils.LocalEndPoints["PathToJson"]);
            await File.WriteAllTextAsync(fCsv, sCsv);
            await File.WriteAllTextAsync(fJson, sJson);
            Console.WriteLine("Vax data done.");
            Console.WriteLine(Utils.Delim);


        }

        public static string ListToCsv(IEnumerable<CsvFieldVax> list)
        {
            var csv = new StringBuilder();
            csv.AppendFormat("\"Date\",");
            csv.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\",", SpecPcrTcm, SpecAntigen, PplAntigen, PplPcrTcm);
            csv.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\",", CummSpecPcrTcm, CummSpecAntigen, CummPplAntigen, CummPplPcrTcm);
            csv.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\"", PplVax1, PplVax2, CummPplVax1, CummPplVax2);
            csv.AppendLine();
            foreach (var r in list)
            {
                csv.AppendFormat("\"{0}\"", r.Date.ToString(fmt));
                csv.Append(",");
                csv.AppendFormat("{0}", r.SpecPcrTcm);
                csv.Append(",");
                csv.AppendFormat("{0}", r.SpecAntigen);
                csv.Append(",");
                csv.AppendFormat("{0}", r.PplAntigen);
                csv.Append(",");
                csv.AppendFormat("{0}", r.PplPcrTcm);
                csv.Append(",");
                csv.AppendFormat("{0}", r.CummSpecPcrTcm);
                csv.Append(",");
                csv.AppendFormat("{0}", r.CummSpecAntigen);
                csv.Append(",");
                csv.AppendFormat("{0}", r.CummPplAntigen);
                csv.Append(",");
                csv.AppendFormat("{0}", r.CummPplPcrTcm);
                csv.Append(",");
                csv.AppendFormat("{0}", r.PplVax1);
                csv.Append(",");
                csv.AppendFormat("{0}", r.PplVax2);
                csv.Append(",");
                csv.AppendFormat("{0}", r.CummPplVax1);
                csv.Append(",");
                csv.AppendFormat("{0}", r.CummPplVax2);
                csv.AppendLine();
            }
            return csv.ToString();
        }

        public static List<CsvFieldVax> GetDailyListExt(JObject jsonObject)
        {
            var oDaily = jsonObject["pemeriksaan"]["harian"].Children();
            var oDailyVax = jsonObject["vaksinasi"]["harian"];
            var sb = new StringBuilder();
            sb.Append("{");
            sb.AppendFormat(@"""{0}""", SpecPcrTcm);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", SpecAntigen);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", PplAntigen);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", PplPcrTcm);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", CummSpecPcrTcm);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", CummSpecAntigen);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", CummPplAntigen);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", CummPplPcrTcm);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", PplVax1);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", PplVax2);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", CummPplVax1);
            sb.Append(":{},");
            sb.AppendFormat(@"""{0}""", CummPplVax2);
            sb.Append(":{}");
            sb.Append("}");

            //var oDailyCases = JObject.Parse(@"{""DiConfirmed"":{}, ""DiCured"":{},""DiDead"":{},""DiHosp"":{},""Confirmed"":{}, ""Cured"":{},""Dead"":{},""Hosp"":{}}");
            var oDailyCases = JObject.Parse(sb.ToString());
            var fields = new List<CsvFieldVax>();

            foreach (var d in oDaily)
            {
                
                DateTime dt = DateTime.Parse(d[Dd].ToString());
                oDailyCases[SpecPcrTcm][dt.ToString(fmt)] = d[SpecPcrTcm]["value"].ToString();
                oDailyCases[SpecAntigen][dt.ToString(fmt)] = d[SpecAntigen]["value"].ToString();
                oDailyCases[PplAntigen][dt.ToString(fmt)] = d[PplAntigen]["value"].ToString();
                oDailyCases[PplPcrTcm][dt.ToString(fmt)] = d[PplPcrTcm]["value"].ToString();

                oDailyCases[CummSpecPcrTcm][dt.ToString(fmt)] = d[CummSpecPcrTcm]["value"].ToString();
                oDailyCases[CummSpecAntigen][dt.ToString(fmt)] = d[CummSpecAntigen]["value"].ToString();
                oDailyCases[CummPplAntigen][dt.ToString(fmt)] = d[CummPplAntigen]["value"].ToString();
                oDailyCases[CummPplPcrTcm][dt.ToString(fmt)] = d[CummPplPcrTcm]["value"].ToString();

                var v = oDailyVax.Where(p => p["key_as_string"].Equals(d["key_as_string"])).FirstOrDefault();

                oDailyCases[PplVax1][dt.ToString(fmt)] = v[PplVax1]["value"].ToString();
                oDailyCases[PplVax2][dt.ToString(fmt)] = v[PplVax2]["value"].ToString();
                oDailyCases[CummPplVax1][dt.ToString(fmt)] = v[CummPplVax1]["value"].ToString();
                oDailyCases[CummPplVax2][dt.ToString(fmt)] = v[CummPplVax2]["value"].ToString();

                fields.Add(new CsvFieldVax
                {
                    Date = dt,
                    SpecPcrTcm = int.Parse(d[SpecPcrTcm]["value"].ToString()),
                    SpecAntigen = int.Parse(d[SpecAntigen]["value"].ToString()),
                    PplAntigen = int.Parse(d[PplAntigen]["value"].ToString()),
                    PplPcrTcm = int.Parse(d[PplPcrTcm]["value"].ToString()),
         
                    CummSpecPcrTcm = int.Parse(d[CummSpecPcrTcm]["value"].ToString()),
                    CummSpecAntigen = int.Parse(d[CummSpecAntigen]["value"].ToString()),
                    CummPplAntigen = int.Parse(d[CummPplAntigen]["value"].ToString()),
                    CummPplPcrTcm = int.Parse(d[CummPplPcrTcm]["value"].ToString()),

                    PplVax1 = int.Parse(v[PplVax1]["value"].ToString()),
                    PplVax2 = int.Parse(v[PplVax2]["value"].ToString()),
                    CummPplVax1 = int.Parse(v[CummPplVax1]["value"].ToString()),
                    CummPplVax2 = int.Parse(v[CummPplVax2]["value"].ToString())

                });

            }
            return fields;
        }


        public static JObject BuildJson(List<CsvFieldVax> list)
        {
            JObject o = JObject.Parse("{}");

            o[SpecPcrTcm] = JObject.Parse("{}");
            o[SpecAntigen] = JObject.Parse("{}");
            o[PplAntigen] = JObject.Parse("{}");
            o[PplPcrTcm] = JObject.Parse("{}");
            
            o[CummSpecPcrTcm] = JObject.Parse("{}");
            o[CummSpecAntigen] = JObject.Parse("{}");
            o[CummPplAntigen] = JObject.Parse("{}");
            o[CummPplPcrTcm] = JObject.Parse("{}");
            
            o[PplVax1] = JObject.Parse("{}");
            o[PplVax2] = JObject.Parse("{}");
            o[CummPplVax1] = JObject.Parse("{}");
            o[CummPplVax2] = JObject.Parse("{}");

            foreach (var l in list)
            {
                string sDate = l.Date.ToString("yyyy-MM-dd");
                o[SpecPcrTcm][sDate] = l.SpecPcrTcm;
                o[SpecAntigen][sDate] = l.SpecAntigen;
                o[PplAntigen][sDate] = l.PplAntigen;
                o[PplPcrTcm][sDate] = l.PplPcrTcm;

                o[CummSpecPcrTcm][sDate] = l.CummSpecPcrTcm;
                o[CummSpecAntigen][sDate] = l.CummSpecAntigen;
                o[CummPplAntigen][sDate] = l.CummPplAntigen;
                o[CummPplPcrTcm][sDate] = l.CummPplPcrTcm;
                
                o[PplVax1][sDate] = l.PplVax1;
                o[PplVax2][sDate] = l.PplVax2;
                o[CummPplVax1][sDate] = l.CummPplVax1;
                o[CummPplVax2][sDate] = l.CummPplVax2;
            }
            return o;
        }


    }


}

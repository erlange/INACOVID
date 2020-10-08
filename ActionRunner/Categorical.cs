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
    class Categorical
    {
        static readonly string CsvFile = "cat.natl.csv";
        //static readonly string _ = "cat.natl.json";
        static readonly string Confirmed = Utils.DictCat["Confirmed"];
        static readonly string Cured = Utils.DictCat["Cured"];
        static readonly string Dead = Utils.DictCat["Dead"];
        static readonly string Hosp = Utils.DictCat["Hosp"];
        static readonly string Comorbid = Utils.DictCat["Comorbid"];
        static readonly string Gender = Utils.DictCat["Gender"];
        static readonly string AgeGrp = Utils.DictCat["AgeGrp"];
        static readonly string Symptom = Utils.DictCat["Symptom"];
        static readonly string ListData = Utils.DictCat["ListData"];
        static readonly string Key = Utils.DictCat["Key"];
        static readonly string DocCount = Utils.DictCat["DocCount"];
        static readonly string Dd = Utils.DictCat["Date"];
        public static async Task Process()
        {
            string urlNatlCat= Utils.ApiEndPoints["NatlExtD"];
            var recs = GetDailyListCat(await Utils.GetJsonObj(urlNatlCat));
            //Log.Information("Getting data: " + urlNatlCat);
            string s = ListToCsv(recs);
            string loc = Utils.GetAbsdir(CsvFile, Utils.LocalEndPoints["PathToCsv"]);
            await File.WriteAllTextAsync(loc, s);
            //Log.Information("   Saved to: " + loc);
            Log.Information("Categorical data done.");
            Log.Information(Utils.Delim);
        }

        public static List<CsvFieldCat> GetDailyListCat(JObject jsonObject)
        {
            var o = jsonObject;
            var li = new List<CsvFieldCat>();
            for (int i = 0; i < o[Confirmed][Comorbid][ListData].Children().Count(); i++)
            {
                li.Add(new CsvFieldCat()
                {
                    Category = Comorbid,
                    SubCategory = o[Confirmed][Comorbid][ListData].Children().ElementAt(i)[Key].ToString(),
                    Confirmed = Convert.ToDouble(o[Confirmed][Comorbid][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Hosp = i >= o[Hosp][Comorbid][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Hosp][Comorbid][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Cured = i >= o[Cured][Comorbid][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Cured][Comorbid][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Deaths = i >= o[Dead][Comorbid][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Dead][Comorbid][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Location = "Nasional",
                    Date = Convert.ToDateTime(o[Dd].ToString()),
                });
            }
            for (int i = 0; i < o[Confirmed][Symptom][ListData].Children().Count(); i++)
            {
                li.Add(new CsvFieldCat()
                {
                    Category = Symptom,
                    SubCategory = o[Confirmed][Symptom][ListData].Children().ElementAt(i)[Key].ToString(),
                    Confirmed = Convert.ToDouble(o[Confirmed][Symptom][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Hosp = i >= o[Hosp][Symptom][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Hosp][Symptom][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Cured = i >= o[Cured][Symptom][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Cured][Symptom][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Deaths = i >= o[Dead][Symptom][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Dead][Symptom][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Location = "Nasional",
                    Date = Convert.ToDateTime(o[Dd].ToString()),
                });
            }
            for (int i = 0; i < o[Confirmed][AgeGrp][ListData].Children().Count(); i++)
            {
                li.Add(new CsvFieldCat()
                {
                    Category = AgeGrp,
                    SubCategory = o[Confirmed][AgeGrp][ListData].Children().ElementAt(i)[Key].ToString(),
                    Confirmed = Convert.ToDouble(o[Confirmed][AgeGrp][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Hosp = i >= o[Hosp][AgeGrp][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Hosp][AgeGrp][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Cured = i >= o[Cured][AgeGrp][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Cured][AgeGrp][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Deaths = i >= o[Dead][AgeGrp][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Dead][AgeGrp][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Location = "Nasional",
                    Date = Convert.ToDateTime(o[Dd].ToString()),
                });
            }
            for (int i = 0; i < o[Confirmed][Gender][ListData].Children().Count(); i++)
            {
                li.Add(new CsvFieldCat()
                {
                    Category = Gender,
                    SubCategory = o[Confirmed][Gender][ListData].Children().ElementAt(i)[Key].ToString(),
                    Confirmed = Convert.ToDouble(o[Confirmed][Gender][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Hosp = i >= o[Hosp][Gender][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Hosp][Gender][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Cured = i >= o[Cured][Gender][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Cured][Gender][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Deaths = i >= o[Dead][Gender][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Dead][Gender][ListData].Children().ElementAt(i)[DocCount].ToString()),
                    Location = "Nasional",
                    Date = Convert.ToDateTime(o[Dd].ToString()),
                });
            }
            return li;
        }
        public static string WriteHeaderLine()
        {
            var line = new StringBuilder();
            line.AppendFormat("\"Date\",\"Location\",\"Category\",\"SubCategory\",");
            line.AppendFormat("\"{0}\",\"{1}\",\"{2}\",\"{3}\"", Confirmed, Cured, Hosp, Dead);
            line.AppendLine();
            return line.ToString();
        }

        public static string ListToCsv(IEnumerable<CsvFieldCat> list, bool writeHeader = true)
        {
            var csv = new StringBuilder();
            if (writeHeader)
                csv.Append(WriteHeaderLine());

            foreach (var r in list)
            {
                csv.AppendFormat("\"{0}\"", r.Date.ToString(Utils.FmtDt));
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.Location);
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.Category);
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.SubCategory);
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
    }
}

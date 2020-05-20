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
    class CategoryProvincial
    {
        static readonly string CsvFile = "cat.prov.csv";
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

        static readonly string provNm = Utils.DictCat["Location"];

        public static async Task Process()
        {
            string[] s = (await Utils.GetAllProvinces()).Select(x => x.Replace(' ', '_').ToUpper()).ToArray();
            await ProcessOne(s);
        }

        public static async Task ProcessOne(string[] provinces)
        {

            string urlProvCat = Utils.ApiEndPoints["ProvExt"];
            string loc = Utils.GetAbsdir(CsvFile, Utils.LocalEndPoints["PathToCsv"]);
            //string locJson = Utils.GetAbsdir("ext.prov.json", Utils.LocalEndPoints["PathToJson"]);
            File.Delete(loc);
            await File.AppendAllTextAsync(loc, WriteHeaderLine());
            //JObject o = null;
            foreach (var p in provinces)
            {
                try
                {
                    var recs = GetDailyListCat(await Utils.GetJsonObj(urlProvCat.Replace("[]", p)));
                    string sCsv = ListToCsv(recs, false);

                    ////JSON can wait
                    //if (o == null)
                    //    o = BuildJson(recs);
                    //else
                    //    o.Merge(BuildJson(recs));

                    string fCsv = Utils.GetAbsdir(CsvFile, Utils.LocalEndPoints["PathToCsv"]);
                    await File.AppendAllTextAsync(fCsv, sCsv);
                    Console.WriteLine("Categorical data " + p + " done.");
                    System.Threading.Thread.Sleep(1000);
                }
                catch (Exception)
                {
                    continue;
                }
            }
            //await File.WriteAllTextAsync(locJson, JsonConvert.SerializeObject(o));
        }


        public static List<CsvFieldCat> GetDailyListCat(JObject jsonObject)
        {
            var o = jsonObject["data"];
            var li = new List<CsvFieldCat>();
            for (int i = 0; i < o[Confirmed][Comorbid][ListData].Children().Count(); i++)
            {
                var f = new CsvFieldCat();
                f.Category = Comorbid;
                f.SubCategory = o[Confirmed][Comorbid][ListData].Children().ElementAt(i)[Key].ToString();
                f.Confirmed = Convert.ToDouble(o[Confirmed][Comorbid][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Hosp].Children().Count() > 0)
                    f.Hosp = i >= o[Hosp][Comorbid][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Hosp][Comorbid][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Cured].Children().Count() > 0)
                    f.Cured = i >= o[Cured][Comorbid][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Cured][Comorbid][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Dead].Children().Count() > 0)
                    f.Deaths = i >= o[Dead][Comorbid][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Dead][Comorbid][ListData].Children().ElementAt(i)[DocCount].ToString());

                f.Location = jsonObject[provNm].ToString();
                f.Date = Convert.ToDateTime(o[Dd].ToString());
                li.Add(f);
            }

            for (int i = 0; i < o[Confirmed][Symptom][ListData].Children().Count(); i++)
            {
                var f = new CsvFieldCat();
                f.Category = Symptom;
                f.SubCategory = o[Confirmed][Symptom][ListData].Children().ElementAt(i)[Key].ToString();
                f.Confirmed = Convert.ToDouble(o[Confirmed][Symptom][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Hosp].Children().Count() > 0)
                    f.Hosp = i >= o[Hosp][Symptom][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Hosp][Symptom][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Cured].Children().Count() > 0)
                    f.Cured = i >= o[Cured][Symptom][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Cured][Symptom][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Dead].Children().Count() > 0)
                    f.Deaths = i >= o[Dead][Symptom][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Dead][Symptom][ListData].Children().ElementAt(i)[DocCount].ToString());

                f.Location = jsonObject[provNm].ToString();
                f.Date = Convert.ToDateTime(o[Dd].ToString());
                li.Add(f);

            }
            for (int i = 0; i < o[Confirmed][AgeGrp][ListData].Children().Count(); i++)
            {
                var f = new CsvFieldCat();
                f.Category = AgeGrp;
                f.SubCategory = o[Confirmed][AgeGrp][ListData].Children().ElementAt(i)[Key].ToString();
                f.Confirmed = Convert.ToDouble(o[Confirmed][AgeGrp][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Hosp].Children().Count() > 0)
                    f.Hosp = i >= o[Hosp][AgeGrp][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Hosp][AgeGrp][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Cured].Children().Count() > 0)
                    f.Cured = i >= o[Cured][AgeGrp][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Cured][AgeGrp][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Dead].Children().Count() > 0)
                    f.Deaths = i >= o[Dead][AgeGrp][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Dead][AgeGrp][ListData].Children().ElementAt(i)[DocCount].ToString());

                f.Location = jsonObject[provNm].ToString();
                f.Date = Convert.ToDateTime(o[Dd].ToString());
                li.Add(f);
            }
            for (int i = 0; i < o[Confirmed][Gender][ListData].Children().Count(); i++)
            {
                var f = new CsvFieldCat();
                f.Category = Gender;
                f.SubCategory = o[Confirmed][Gender][ListData].Children().ElementAt(i)[Key].ToString();
                f.Confirmed = Convert.ToDouble(o[Confirmed][Gender][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Hosp].Children().Count() > 0)
                    f.Hosp = i >= o[Hosp][Gender][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Hosp][Gender][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Cured].Children().Count() > 0)
                    f.Cured = i >= o[Cured][Gender][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Cured][Gender][ListData].Children().ElementAt(i)[DocCount].ToString());

                if (o[Dead].Children().Count() > 0)
                    f.Deaths = i >= o[Dead][Gender][ListData].Children().Count() ? (double?)null : Convert.ToDouble(o[Dead][Gender][ListData].Children().ElementAt(i)[DocCount].ToString());

                f.Location = jsonObject[provNm].ToString();
                f.Date = Convert.ToDateTime(o[Dd].ToString());
                li.Add(f);
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

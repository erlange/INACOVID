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
    class HospitalRef
    {
        static readonly string CsvFile = "hospitals.csv";
        static readonly string JsonFile = "hospitals.json";

        public static async Task Process()
        {
            string url = Utils.ApiEndPoints["Hospitals"];
            string locCsv = Utils.GetAbsdir(CsvFile, Utils.LocalEndPoints["PathToCsv"]);
            string locJson = Utils.GetAbsdir(JsonFile, Utils.LocalEndPoints["PathToJson"]);
            
            var recs = GetHosp(await Utils.GetJsonArray(url));
            string sCsv = ListToCsv(recs);
            await File.WriteAllTextAsync(locCsv, sCsv);
         
            var j = BuildJson(recs);
            await File.WriteAllTextAsync(locJson, JsonConvert.SerializeObject(j));
            Log.Information("Hospital data  done.");

        }


        public static List<Hospital> GetHosp(object jsonObject)
        {
            var o = (JArray)jsonObject;

            var li = new List<Hospital>();
            for (int i = 0; i < o.Children().Count(); i++)
            {
                var f = new Hospital();
                f.nama = o[i]["nama"] == null ? null : o[i]["nama"].ToString();
                f.kode_rs = o[i]["kode_rs"] == null ? null : o[i]["kode_rs"].ToString();
                f.tempat_tidur = o[i]["tempat_tidur"] == null ? (int?)null : Convert.ToInt32(o[i]["tempat_tidur"].ToString());
                f.telepon = o[i]["telepon"] == null ? null : o[i]["telepon"].ToString();
                f.lat = o[i]["lokasi"] == null ? (double?)null : o[i]["lokasi"]["lat"] == null ? (double?)null : Convert.ToDouble(o[i]["lokasi"]["lat"].ToString());
                f.lon = o[i]["lokasi"] == null ? (double?)null : o[i]["lokasi"]["lon"] == null ? (double?)null : Convert.ToDouble(o[i]["lokasi"]["lon"].ToString());
                f.alamat = o[i]["alamat"] == null ? null : o[i]["alamat"].ToString();
                f.tipe = o[i]["tipe"] == null ? null : o[i]["tipe"].ToString();
                f.wilayah = o[i]["wilayah"] == null ? null : o[i]["wilayah"].ToString();
                f.propinsi = f.wilayah == null ? null : !f.wilayah.Contains(",") ? f.wilayah : f.wilayah.Split(",")[1].Trim();
                li.Add(f);
            }
            return li;
        }
        public static string WriteHeaderLine()
        {
            var line = new StringBuilder();
            line.AppendFormat("\"nama\",\"kode_rs\",\"tempat_tidur\",\"telepon\",");
            line.AppendFormat("\"lat\",\"lon\",\"alamat\",\"tipe\",");
            line.AppendFormat("\"wilayah\",\"propinsi\"");
            line.AppendLine();
            return line.ToString();
        }

        public static string ListToCsv(IEnumerable<Hospital> list, bool writeHeader = true)
        {
            var csv = new StringBuilder();
            if (writeHeader)
                csv.Append(WriteHeaderLine());

            foreach (var r in list)
            {
                csv.AppendFormat("\"{0}\"", r.nama ) ;
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.kode_rs);
                csv.Append(",");
                csv.AppendFormat("{0}", r.tempat_tidur);
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.telepon);
                csv.Append(",");
                csv.AppendFormat("{0}", r.lat);
                csv.Append(",");
                csv.AppendFormat("{0}", r.lon);
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.alamat);
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.tipe);
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.wilayah);
                csv.Append(",");
                csv.AppendFormat("\"{0}\"", r.propinsi);
                csv.AppendLine();
            }
            return csv.ToString();
        }
        public static JObject BuildJson(List<Hospital> list)
        {
            
            JObject o = null;
            o = JObject.Parse("{}");

            foreach (var l in list)
            {
                try
                {
                    //string s = "{\"" + l.nama + @"\"":{}}";
                    string n = l.nama.Replace(@"""", "");
                    string s = @"{""" + n+ @""":{}}";
                    //o = JObject.Parse(s);
                    //string s = l.nama;
                    //o = JObject.Parse(s);
                    o[n] = JObject.Parse("{}");
                    o[n]["kode_rs"] = l.kode_rs == null ? "{}" : l.kode_rs;
                    o[n]["tempat_tidur"] = l.tempat_tidur == null ? (int?)null : l.tempat_tidur;
                    o[n]["telepon"] = l.telepon == null ? "{}" : l.telepon;
                    o[n]["lat"] = l.lat == null ? (double?)null : l.lat;
                    o[n]["lon"] = l.lon == null ? (double?)null : l.lon;
                    o[n]["alamat"] = l.alamat == null ? "{}" : l.alamat;
                    o[n]["tipe"] = l.tipe == null ? "{}" : l.tipe;
                    o[n]["wilayah"] = l.wilayah == null ? "{}" : l.wilayah;
                    o[n]["propinsi"] = l.propinsi == null ? "{}" : l.propinsi;

                }
                catch (Exception ex)
                {
                    string s = o.ToString();
                    File.WriteAllText(@"C:\0Proj\VS2019\INACOVID\data\json\err.json",s);
                    Console.WriteLine(s);
                    Console.WriteLine(ex.ToString());
                    throw ex;
                }
            }
            return o;
        }

    }
}

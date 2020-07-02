using System;
using System.IO;
using System.Text;
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;

namespace com.github.erlange.inacovid
{
    public class Utils
    {
        public static IConfigurationRoot configuration = Program.configuration;

        public static Dictionary<string, string> ApiEndPoints = configuration.GetSection("ApiEndPoints").Get<Dictionary<string, string>>();
        public static Dictionary<string, string> LocalEndPoints = configuration.GetSection("LocalEndPoints").Get<Dictionary<string, string>>();
        public static Dictionary<string, string> DictNatl = configuration.GetSection("DictAlt1").Get<Dictionary<string, string>>();
        public static Dictionary<string, string> DictProv = configuration.GetSection("DictAlt2").Get<Dictionary<string, string>>();
        public static Dictionary<string, string> httpHeaders = configuration.GetSection("HttpHeader").Get<Dictionary<string, string>>();
        public static Dictionary<string, string> DictNatlExt = configuration.GetSection("DictAltExt1").Get<Dictionary<string, string>>();
        public static Dictionary<string, string> DictProvExt = configuration.GetSection("DictAltExt2").Get<Dictionary<string, string>>();
        public static Dictionary<string, string> DictNatlExtArcGis = configuration.GetSection("DictAltExt3").Get<Dictionary<string, string>>();
        public static Dictionary<string, string> DictCat = configuration.GetSection("DictAltExt4").Get<Dictionary<string, string>>();


        public const string Delim = "--------------------";
        public const string FmtDt = "yyyy-MM-dd";

        public static async Task<string> GetData(string url, WebHeaderCollection httpHeaders)
        {
            //var httpHeaders = configuration.GetSection("HttpHeader").Get<Dictionary<string, string>>();

            using (WebClient wc = new WebClient())
            {
                wc.Headers.Clear();
                wc.Headers = httpHeaders;
                //foreach (var item in httpHeaders)
                //{
                //    wc.Headers.Add(item.Key, item.Value);
                //}
                return await wc.DownloadStringTaskAsync(url);
            }
        }

        public static async Task<string> GetData(string url)
        {
            using (WebClient wc = new WebClient())
            {
                 return await wc.DownloadStringTaskAsync(url);
            }
        }
        public static IJEnumerable<JToken> JsonToEnumerable(string jsonString)
        {
            JObject obj = (JObject)JsonConvert.DeserializeObject(jsonString);

            JArray arr = (JArray)obj["features"];
            return arr.Children()["attributes"];
        }

        public static async Task<string> DownloadJsonStringAsync(string url)
        {
            string JsonString = "-failed-";
            WebHeaderCollection headers = new WebHeaderCollection();
            foreach (var item in Utils.httpHeaders)
                headers.Add(item.Key, item.Value);

            using (WebClient wc = new WebClient { Headers = headers })
            {
                try
                {
                    JsonString = await wc.DownloadStringTaskAsync(url);
                }
                catch (WebException wex)
                {
                    //string s = new StreamReader(wex.Response.GetResponseStream()).ReadToEnd();
                    JsonString = "-failed-";
                    Console.WriteLine("ERROR WebException: " + wex.ToString());
                    throw wex;
                }
                catch (System.Net.Sockets.SocketException sex)
                {
                    JsonString = "-failed-";
                    Console.WriteLine("ERROR SocketException: " + sex.ToString());
                    throw sex;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("ERROR: " + ex.Message);
                    JsonString = "-failed-";
                    throw ex;
                }

            }
            return JsonString;
        }
        public static async Task<List<string>> GetAllProvinces()
        {
            //string urlProvAll = Utils.ApiEndPoints["ProvAll"];
            string urlProvAll = Utils.ApiEndPoints["Prov"];
            JObject o = await Utils.GetJsonObj(urlProvAll);
            var li = new List<string>();

            foreach (var p in o["features"].Children())
                li.Add(p["attributes"]["Provinsi"].ToString());

            return li.Distinct().Select(x => x).ToList();
        }

        public static async Task<JObject> GetJsonObj(string url)
        {
            string json = await Utils.DownloadJsonStringAsync(url);
            return (JObject)JsonConvert.DeserializeObject(json);
        }
        public static async Task<JArray> GetJsonArray(string url)
        {
            string json = await Utils.DownloadJsonStringAsync(url);
            return (JArray)JsonConvert.DeserializeObject(json);
        }

        public static string GetAbsdir(string filename, string dir)
        {
            string appDir = System.AppDomain.CurrentDomain.BaseDirectory;
            return Path.Combine(appDir, dir, filename);

        }

        public static DateTime ConvertFromUnixTimestamp(double timestamp)
        {
            DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return origin.AddSeconds(timestamp);
        }

        public static int? ParseInt(object number)
        {
            return number == null ? (int?)null : number.ToString() == "" ? (int?)null : Convert.ToInt32(number.ToString());
        }
        public static double? ParseDouble(object number)
        {
            return number == null ? (double?)null : number.ToString() == "" ? (double?)null : Convert.ToDouble(number.ToString());
        }
    }
}

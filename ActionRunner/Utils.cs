using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace com.github.erlange.inacovid
{
    public class Utils
    {
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

    }
}

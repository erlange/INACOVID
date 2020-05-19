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
        public static async Task Process()
        {
            string urlNatlCat= Utils.ApiEndPoints["NatlExtD"];
            //var recs = GetDailyListCat(await Utils.GetJsonObj(urlNatlCat));
            await Utils.GetJsonObj(urlNatlCat);

        }

        //public static List<CsvFieldCat> GetDailyListCat(JObject jsonObject)
        //{
        //    var oData = jsonObject["data"].Children();
        //    foreach(var o in oData)
        //    {

        //    }

        //}

    }
    public class CsvFieldCat
    {
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public double Confirmed { get; set; }
        public double Cured { get; set; }
        public double Deaths { get; set; }
        public double Hosp { get; set; }

    }

}

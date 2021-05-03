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

namespace com.github.erlange.inacovid
{
    class Program
    {
        public static IConfigurationRoot configuration;

        static int Main(string[] args)
        {

            Log.Logger = new LoggerConfiguration()
                 .WriteTo.Console(Serilog.Events.LogEventLevel.Debug)
                 .MinimumLevel.Debug()
                 .Enrich.FromLogContext()
                 .CreateLogger();


            try
            {
                MainAsync(args).Wait();
                return 0;
            }
            catch
            {
                return 1;
            }
        }

        static async Task MainAsync(string[] args)
        {
            Log.Information("Starting INACOVID service collection...");
            ServiceCollection serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);

            Log.Information("Starting INACOVID service provider...");
            IServiceProvider serviceProvider = serviceCollection.BuildServiceProvider();


            try
            {
                Log.Information("Collecting data...");

                //await Indonesia.Process();
                //await NationalExtendedArcGis.Process();

                await NationalExtended.Process();
                await ProvincialExtended.Process();
                await Categorical.Process();
                await CategoryProvincial.Process();
                await Vax.Process();

                string p = Utils.LocalEndPoints["PathToJson"];
                string f1 = Utils.GetAbsdir("ext.natl.json", p);
                string f2 = Utils.GetAbsdir("ext.prov.json", p);
                string f3 = Utils.GetAbsdir("ext.merge.json", p);
                string f4 = Utils.GetAbsdir("all.min.json", p);

                JObject o1 = await Utils.GetJsonObj(f1);
                JObject o2 = await Utils.GetJsonObj(f2);
                o1.Merge(o2, new JsonMergeSettings() { MergeArrayHandling = MergeArrayHandling.Merge });
                string f3s = JsonConvert.SerializeObject(o1);
                File.WriteAllText(f3, f3s);
                System.Text.StringBuilder sb = new System.Text.StringBuilder(f3s);

                sb.Replace(Utils.DictNatlExt["Daily-Hosp"], "Hosp_T");
                sb.Replace(Utils.DictNatlExt["Daily-Dead"], "Dead_T");
                sb.Replace(Utils.DictNatlExt["Daily-Cured"], "Cured_T");
                sb.Replace(Utils.DictNatlExt["Daily-Confirmed"], "Confirmed_T");
                sb.Replace(Utils.DictNatlExt["Daily-DI-Hosp"], "Hosp");
                sb.Replace(Utils.DictNatlExt["Daily-DI-Dead"], "Dead");
                sb.Replace(Utils.DictNatlExt["Daily-DI-Cured"], "Cured");
                sb.Replace(Utils.DictNatlExt["Daily-DI-Confirmed"], "Confirmed");

                sb.Replace(Utils.DictProvExt["Daily-Hosp"], "Hosp_T");
                sb.Replace(Utils.DictProvExt["Daily-Dead"], "Dead_T");
                sb.Replace(Utils.DictProvExt["Daily-Cured"], "Cured_T");
                sb.Replace(Utils.DictProvExt["Daily-Confirmed"], "Confirmed_T");
                sb.Replace(Utils.DictProvExt["Daily-DI-Hosp"], "Hosp");
                sb.Replace(Utils.DictProvExt["Daily-DI-Dead"], "Dead");
                sb.Replace(Utils.DictProvExt["Daily-DI-Cured"], "Cured");
                sb.Replace(Utils.DictProvExt["Daily-DI-Confirmed"], "Confirmed");

                Log.Information("Writing minified files for web");
                Log.Information(Utils.Delim);
                File.WriteAllText(f4, sb.ToString());

                Log.Information("Merging data done.");
                Log.Information(Utils.Delim);

                Log.Information("Getting hospital data...");
                await HospitalRef.Process();

                Log.Information(Utils.Delim);
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Error running INACOVID service");
                Log.Error(ex.ToString());
                //throw ex;
            }
            finally
            {
                Log.Information("Closing INACOVID service");
                Log.CloseAndFlush();
            }
        }



        private static void ConfigureServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddSingleton(LoggerFactory.Create(builder =>
            {
                builder
                    .AddSerilog(dispose: true);
            }));

            serviceCollection.AddLogging();

            configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetParent(AppContext.BaseDirectory).FullName)
                .AddJsonFile("appsettings.json", false)
                .Build();

            serviceCollection.AddSingleton<IConfigurationRoot>(configuration);

            serviceCollection.AddTransient<RunnerService>();
        }


    }
}

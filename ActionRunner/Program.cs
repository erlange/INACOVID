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
                Log.Information("Starting INACOVID runner...");

                await Indonesia.Process();
                await NationalExtendedArcGis.Process();

                //await Indonesia.Process();
                //await NationalExtended.Process();
                //await ProvincialExtended.Process();
                //await NationalExtendedArcGis.Process();
                //await Categorical.Process();
                //await CategoryProvincial.Process();
                //await HospitalRef.Process();

                //string p = Utils.LocalEndPoints["PathToJson"];
                //string f1 = Utils.GetAbsdir("ext.natl.json", p);
                //string f2 = Utils.GetAbsdir("ext.prov.json", p);
                //string f3 = Utils.GetAbsdir("ext.merge.json", p);

                //JObject o1 = await Utils.GetJsonObj(f1);
                //JObject o2 = await Utils.GetJsonObj(f2);
                //o1.Merge(o2, new JsonMergeSettings() { MergeArrayHandling = MergeArrayHandling.Merge });
                //File.WriteAllText(f3, JsonConvert.SerializeObject(o1));

                Console.WriteLine("Merging data done.");
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

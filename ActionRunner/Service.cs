using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace com.github.erlange.inacovid
{
    public class RunnerService
    {
        private readonly IConfigurationRoot _config;
        private readonly ILogger<RunnerService> _logger;

        public RunnerService(IConfigurationRoot config, ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<RunnerService>();
            _config = config;
        }

        //public async Task Run()
        //{
        //    List<string> emailAddresses = _config.GetSection("EmailAddresses").Get<List<string>>();
        //    foreach (string emailAddress in emailAddresses)
        //    {
        //        _logger.LogInformation("Email address: {@EmailAddress}", emailAddress);
        //    }
        //}
    }
}

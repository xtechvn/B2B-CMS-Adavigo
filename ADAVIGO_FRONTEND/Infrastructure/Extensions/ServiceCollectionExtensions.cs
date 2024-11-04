using ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddSettings(this IServiceCollection services, IConfiguration configuration)
        {
            configuration.GetSection(ApplicationSettings.DataCom).Bind(ApplicationSettings.DataComSettings);
            configuration.GetSection(ApplicationSettings.Adavigo).Bind(ApplicationSettings.AdavigoSettings);
            configuration.GetSection(ApplicationSettings.AdavigoLive).Bind(ApplicationSettings.AdavigoLiveSettings);
            configuration.GetSection(ApplicationSettings.Timeout).Bind(ApplicationSettings.TimeoutSettings);
            configuration.GetSection(ApplicationSettings.Vinwonder).Bind(ApplicationSettings.VinwonderSettings);
            configuration.GetSection(ApplicationSettings.Tour).Bind(ApplicationSettings.TourSettings);
        }
    }
}

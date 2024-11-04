using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings
{
    public static class ApplicationSettings
    {
        public const string DataCom = "DataComSettings";

        public static DataComSettings DataComSettings { get; set; } = new DataComSettings();

        public const string Adavigo = "AdavigoSettings";

        public static AdavigoSettings AdavigoSettings { get; set; } = new AdavigoSettings();


        public const string AdavigoLive = "AdavigoLiveSettings";
        public static AdavigoLiveSettings AdavigoLiveSettings { get; set; } = new AdavigoLiveSettings();

        public const string Timeout = "TimeoutSettings";
        public static TimeoutSettings TimeoutSettings { get; set; } = new TimeoutSettings();

        public const string Vinwonder = "VinwonderSettings";
        public static VinwonderSettings VinwonderSettings { get; set; } = new VinwonderSettings(); 
        
        public const string Tour = "TourSettings";
        public static TourSettings TourSettings { get; set; } = new TourSettings();
    }
}

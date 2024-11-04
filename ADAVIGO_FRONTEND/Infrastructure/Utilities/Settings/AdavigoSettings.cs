using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Infrastructure.Utilities.Settings
{
    public class AdavigoSettings
    {
        public string Url { get; set; }
        public string Domain_Url { get; set; }
        public string OnePayUrl { get; set; }
        public string PrivateKey { get; set; }
        public string BankToken { get; set; }
        public int ClientType { get; set; }
        public int SourceType { get; set; }
        public int FailStatus { get; set; }
        public int FlightService { get; set; }
        public string LoginVersion { get; set; }
        public string LocationKey { get; set; }
        public string NewsCategoryToken { get; set; }
        public string VinHomeImagesToken { get; set; }
        public string VinGetSitesToken { get; set; }
        public string StaticImage { get; set; }
        public int VinwonderIndexNewsCategory { get; set; }    

    }
}

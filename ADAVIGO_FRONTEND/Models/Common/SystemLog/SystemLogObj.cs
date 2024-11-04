using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.SystemLog
{
    public class SystemLogObj
    {
        public string Url { get; set; }
        public string Token { get; set; }
        public string Message { get; set; }
        public int Status { get; set; }
    }
}

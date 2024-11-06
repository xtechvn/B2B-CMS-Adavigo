using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class RequestSearchModel
    {
        public string RequestId { get; set; }
        public long ClientId { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}

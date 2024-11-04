using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Tour.ListTourByType
{
    public class ListTourByTypeRequest
    {
        public int pageindex { get; set; }
        public int pagesize { get; set; }
        public int tourtype { get; set; }
    }
}

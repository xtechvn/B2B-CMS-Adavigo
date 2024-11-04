using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Common
{
    public class BaseObjectResponse<T>
    {
        public int status { get; set; }
        public string msg { get; set; }
        public T data { get; set; }
    }
}

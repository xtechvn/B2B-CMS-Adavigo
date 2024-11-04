using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.News.GetListByTag
{
    public class GetListByTagRequest :BasePaginate
    {
        public string tag { get; set; }
    }
}

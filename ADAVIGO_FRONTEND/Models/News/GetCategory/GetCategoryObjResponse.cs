﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.News.GetCategory
{
    public class GetCategoryResponse
    {
        public int id { get; set; }
        public string name { get; set; }
        public string image_path { get; set; }
        public string url_path { get; set; }
        public int order_no { get; set; }
    }
}

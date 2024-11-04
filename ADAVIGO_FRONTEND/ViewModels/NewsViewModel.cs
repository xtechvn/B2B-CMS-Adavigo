﻿using System;
using System.Collections.Generic;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class NewsViewModel
    {
        public bool IsShowSlider { get; set; }
        public IEnumerable<NewsApiDataModel> NewsDatas { get; set; }
    }

    public class NewsApiDataModel
    {
        public long id { get; set; }
        public string category_name { get; set; }
        public string title { get; set; }
        public string lead { get; set; }
        public string image_169 { get; set; }
        public string image_43 { get; set; }
        public string image_11 { get; set; }
        public string body { get; set; }
        public DateTime publish_date { get; set; }
        public DateTime update_last { get; set; }
        public int article_type { get; set; }
        public short? position { get; set; }
        public int status { get; set; }
    }
}

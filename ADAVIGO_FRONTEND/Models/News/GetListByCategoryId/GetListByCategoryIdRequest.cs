﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.News.GetListByCategoryId
{
    public class GetListByCategoryIdRequest :BasePaginate
    {
        public int category_id { get; set; }
    }
}

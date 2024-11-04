using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.News.FindArticle
{
    public class FindArticleRequest : BasePaginate
    {
        public string title { get; set; }
        public int parent_id { get; set; }

    }
}

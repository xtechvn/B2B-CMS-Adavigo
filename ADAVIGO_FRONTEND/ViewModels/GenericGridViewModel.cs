using System.Collections.Generic;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class GenericGridViewModel<T> where T : class
    {
        public IEnumerable<T> ListData { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPage { get; set; }
        public long TotalRecord { get; set; }
    }
}

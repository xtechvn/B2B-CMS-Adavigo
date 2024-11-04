using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.AllCode
{
    public class AllCodeModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public short CodeValue { get; set; }
        public string Description { get; set; }
        public short? OrderNo { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreateDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdateTime { get; set; }
    }
}

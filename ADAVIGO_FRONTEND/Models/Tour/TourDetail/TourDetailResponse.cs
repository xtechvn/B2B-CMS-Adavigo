using System;
using System.Collections.Generic;

namespace ADAVIGO_FRONTEND.Models.Tour.TourDetail
{
    public class TourDetailResponse
    {
        public long id { get; set; }
        public double price { get; set; }
        public int? status { get; set; }
        public int? days { get; set; }
        public double? oldPrice { get; set; }
        public string avatar { get; set; }
        public int? star { get; set; }
        public int? tourType { get; set; }
        public string image { get; set; }
        public string schedule { get; set; }
        public string description { get; set; }
        public string include { get; set; }
        public string exclude { get; set; }
        public string refund { get; set; }
        public string surcharge { get; set; }
        public string note { get; set; }
        public IEnumerable<TourProductScheduleModel> tourSchedule { get; set; }
        public IEnumerable<string> otherImages { get; set; }
        public IEnumerable<int> endPoints { get; set; }
        public string supplierName { get; set; }
        public string startPoint1 { get; set; }
        public string startPoint2 { get; set; }
        public string startPoint3 { get; set; }
        public string groupEndPoint1 { get; set; }
        public string groupEndPoint2 { get; set; }
        public string groupEndPoint3 { get; set; }
        public string transportName { get; set; }
        public string tourName { get; set; }
        public string tourTypeName { get; set; }
        public string organizingName { get; set; }
        public string dateDeparture { get; set; }
    }

    public class TourProductScheduleModel
    {
        public int day_num { get; set; }
        public string day_title { get; set; }
        public string day_description { get; set; }
    }
    public class TourDetailResponseExtend : TourDetailResponse
    {
        public double? min_adultprice { get; set; }
        public double? min_childprice { get; set; }
        public double? daily_adultprice { get; set; }
        public double? daily_childprice { get; set; }
        public long? daily_package_id { get; set; }
        public List<TourProgramPackages> packages { get; set; }
    }
    public partial class TourProgramPackages
    {
        public long Id { get; set; }
        public long? TourProductId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool? IsDaily { get; set; }
        public double? AdultPrice { get; set; }
        public double? ChildPrice { get; set; }
        public int? ClientType { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

    }

}

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class LocationModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public int? status { get; set; }
    }

    public class ProvinceModel : LocationModel
    {
        public string provinceId { get; set; }
    }

    public class DistrictModel : LocationModel
    {
        public string provinceId { get; set; }
        public string districtId { get; set; }
    }

    public class WardModel : LocationModel
    {
        public string districtId { get; set; }
        public string wardId { get; set; }
    }
}

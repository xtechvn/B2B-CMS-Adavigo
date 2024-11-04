namespace ADAVIGO_FRONTEND.Models.Configs
{
    public class SystemUserModel
    {
        public int ClientID { get; set; }
        public string ClientName { get; set; }
        public int ClientType { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public int ParentId { get; set; }
    }
}

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class AccountModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string phone { get; set; }
        public int client_type { get; set; }
        public string client_type_name { get; set; }
        public string email { get; set; }
        public string indentifer_id { get; set; }
        public string country { get; set; }
        public string provinced_id { get; set; }
        public string district_id { get; set; }
        public string ward_id { get; set; }
        public string address { get; set; }
        public string account_number { get; set; }
        public string account_name { get; set; }
        public string bank_name { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int GroupPermission { get; set; }
        public int Status { get; set; }
        public int ParentId { get; set; }
    }

    public class AccountChangePassModel
    {
        public string password_old { get; set; }
        public string password_new { get; set; }
        public string confirm_password_new { get; set; }
    }
    public class AccountViewModel
    {
        public int id { get; set; }
        public string ClientName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string PasswordBackup { get; set; }
        public int Status { get; set; }
        public int Type { get; set; }
        public int ClientType { get; set; }
        public int AccountId { get; set; }
    }

    public class ListAccountClientModel
    {
        public int Id { get; set; }
        public string Avartar { get; set; }
        public string Email { get; set; }
        public string ClientName { get; set; }
        public string StatusName { get; set; }
        public string UserName { get; set; }
        public string GroupPermissionName { get; set; }
        public int Status { get; set; }
        public int TotalRow { get; set; }
    }
}

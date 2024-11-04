using System.Collections.Generic;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class BankPaymentViewModel
    {
        public decimal amount { get; set; }
        public int service_type { get; set; }
        public string tran_code { get; set; }
    }

    public class BankDataModel
    {
        public int id { get; set; }
        public string bankName { get; set; }
        public string code { get; set; }
        public int type { get; set; }
        public string logo { get; set; }
        public int status { get; set; }
        public string fullnameEn { get; set; }
        public string fullnameVi { get; set; }

        public string branch_name { get; set; }
        public string account_number { get; set; }
        public string account_name { get; set; }
    }

    public class BankPaymentModel
    {
        public string title { get; set; }
        public string image { get; set; }
        public string bank_id { get; set; }
        public string bank_alias { get; set; }
        public string bank_account { get; set; }
        public string payment_id { get; set; }
        public decimal amount { get; set; }
        public string tran_code { get; set; }
    }

    public class PaymentInsertModel
    {
        public string trans_no { get; set; }
        public string bank_name { get; set; }
    }

    public class PaymentConfirmModel
    {
        public string Base64Image { get; set; }
        public string TransNo { get; set; }
    }
}

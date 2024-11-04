using System;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class FundHistoryViewModel
    {

    }

    public class FundHistorySearchModel
    {
        public string from_date { get; set; }
        public string to_date { get; set; }
        public string code { get; set; }
        public int page_index { get; set; }
        public int page_size { get; set; }
        public int? service_type { get; set; }
    }

    public class FundHistoryModel
    {
        public int id { get; set; }
        public DateTime createDate { get; set; }
        public DateTime? updateLast { get; set; }
        public int userId { get; set; }
        public string transNo { get; set; }
        public string title { get; set; }
        public decimal totalAmount { get; set; }
        public decimal price { get; set; }
        public int transType { get; set; }
        public int paymentType { get; set; }
        public string paymentName { get; set; }
        public int status { get; set; }
        public string statusName { get; set; }
        public string imageScreen { get; set; }
        public string serviceType { get; set; }
        public string bankName { get; set; }
        public int? userVerifyId { get; set; }
        public DateTime? verifyDate { get; set; }
        public string noteReject { get; set; }
        public string clientId { get; set; }
        public string bankAccount { get; set; }
    }
   public class DepositHistoryViewMdel : DepositHistory
    {
        public string PaymentTypeName { get; set; }
        public string StatusName { get; set; }
        public string ServiceName { get; set; }
        public double Amount { get; set; }
   }
    public partial class DepositHistory
    {
        public int Id { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? UpdateLast { get; set; }
        public long? UserId { get; set; }
        public string TransNo { get; set; }
        public string Title { get; set; }
        public double? Price { get; set; }
        public short? TransType { get; set; }
        public short? PaymentType { get; set; }
        public int? Status { get; set; }
        public string ImageScreen { get; set; }
        public short? ServiceType { get; set; }
        public string BankName { get; set; }
        public long? UserVerifyId { get; set; }
        public DateTime? VerifyDate { get; set; }
        public string NoteReject { get; set; }
        public long? ClientId { get; set; }
        public string BankAccount { get; set; }
        public bool? IsFinishPayment { get; set; }
    }
}

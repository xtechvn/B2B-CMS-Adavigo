using System.Collections.Generic;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class FundManageViewModel
    {
        public decimal fund_balance_total { get; set; }
        public IEnumerable<FundDataModel> fund_list { get; set; }
        public IEnumerable<DepositHistoryViewMdel> fund_history { get; set; }
    }

    public class FundDataModel
    {
        public string service_name { get; set; }
        public int service_type { get; set; }
        public decimal account_blance { get; set; }
        public double TotalDebtAmount { get; set; }
        public double TotalAmount { get; set; }
    }

    public class FundTranferModel
    {
        public int from_fund_type { get; set; }
        public int to_fund_type { get; set; }
        public decimal amount_move { get; set; }
    }
}

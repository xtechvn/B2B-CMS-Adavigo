using ADAVIGO_FRONTEND.Models.Services;
using ADAVIGO_FRONTEND.ViewModels;
using LIB.ENTITIES.ViewModels.Hotels;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.ViewComponents
{
    public class BankTransferViewComponent : ViewComponent
    {
        private readonly HomeService _HomeService;
        private readonly HotelService _hotelService;
       

        public BankTransferViewComponent(HomeService homeService, HotelService hotelService)
        {
            _HomeService = homeService;
            _hotelService = hotelService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            
            var models = new List<BankingAccount>
            {
                new BankingAccount()
                {
                    AccountName = "Công ty cổ phần Thương mại và Dịch vụ Quốc tế Đại Việt",
                    AccountNumber = "19131835226016",
                    BankId = "Techcombank",
                    Branch = "Đông Đô",
                      Bin="970407",
                    Image="/images/nganhang/TCB.png",
                    ClientId = null,
                    CreatedBy = 18,
                    CreatedDate = DateTime.Now,
                    Id = 0,
                    SupplierId = 604,
                    UpdatedBy = 18,
                    UpdatedDate = DateTime.Now,
                },
                new BankingAccount()
                {
                    AccountName = "Công ty cổ phần Thương mại và Dịch vụ Quốc tế Đại Việt",
                    AccountNumber = "371704070000023",
                    BankId = "HDBank",
                    Bin="970437",
                    Image="/images/nganhang/HDB.png",
                    Branch = "Hà Nội",
                    ClientId = null,
                    CreatedBy = 18,
                    CreatedDate = DateTime.Now,
                    Id = 1,
                    SupplierId = 604,
                    UpdatedBy = 18,
                    UpdatedDate = DateTime.Now,
                },
                new BankingAccount()
                {
                    AccountName = "Công ty cổ phần Thương mại và Dịch vụ Quốc tế Đại Việt",
                    AccountNumber = "113600558866",
                    BankId = "VietinBank",
                    Branch = "Tràng An",
                    Bin="970415",
                    Image="/images/nganhang/ICB.png",
                    ClientId = null,
                    CreatedBy = 18,
                    CreatedDate = DateTime.Now,
                    Id = 2,
                    SupplierId = 604,
                    UpdatedBy = 18,
                    UpdatedDate = DateTime.Now,
                },
            };
            //var viet_qr_banks = await _hotelService.GetVietQRBankList();
            //var datas = models.Where(x=>x.AccountNumber!=null &&x.AccountNumber.Trim()!="" &&x.AccountNumber.Trim()!="0").Select(s => new BankingAccount
            //{
            //    AccountName = s.AccountName,
            //    AccountNumber = s.AccountNumber,
            //    BankId = s.BankId,
            //    Bin = viet_qr_banks.FirstOrDefault(x => x.shortName == s.BankId)!=null? viet_qr_banks.First(x=>x.shortName==s.BankId).bin :"",
            //    Branch= s.Branch,
            //    ClientId= s.ClientId,
            //    CreatedBy= s.CreatedBy,
            //    CreatedDate= s.CreatedDate,
            //    Id= s.Id,
            //    Image= viet_qr_banks.FirstOrDefault(x => x.shortName == s.BankId) != null ?  viet_qr_banks.First(x => x.shortName == s.BankId).logo:"",
            //    SupplierId = s.SupplierId,
            //    UpdatedBy=  s.UpdatedBy,
            //    UpdatedDate= s.UpdatedDate,
            //});
            var datas = models;
            return View(datas);
        }
    }
}

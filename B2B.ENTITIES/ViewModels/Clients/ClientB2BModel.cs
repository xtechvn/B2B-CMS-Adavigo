using System;
using System.Collections.Generic;
using System.Text;

namespace ENTITIES.ViewModels.Client
{
    public class ClientB2BModel
    {
        public string UserName { get; set; }
        public string Avatar { get; set; }
        public string ClientName { get; set; }
        public long ClientId { get; set; }
        public int ClientType { get; set; }
        public int Status { get; set; }
        public string phone { get; set; }
        public DateTime? birthday { get; set; }
        public string address { get; set; }
        public string email { get; set; }
        public int ParentId { get; set; }
        public int GroupPermission { get; set; }
    }
}

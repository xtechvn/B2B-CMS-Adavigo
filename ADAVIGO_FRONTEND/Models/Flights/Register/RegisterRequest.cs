using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADAVIGO_FRONTEND.Models.Flights.Register
{
    public class RegisterRequest
    {
        public string ClientName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string PasswordBackup { get; set; }
        public bool isReceiverInfoEmail { get; set; }
        public RegisterRequest()
        {
            isReceiverInfoEmail = false;
        }
    }
}

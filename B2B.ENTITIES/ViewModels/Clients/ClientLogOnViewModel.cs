using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;


namespace ENTITIES.ViewModels.Client
{
    public class ClientLogOnViewModel
    {
        [Required(ErrorMessage = "Bạn phải nhập tên tài khoản")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Bạn phải nhập mật khẩu")]
        [StringLength(100, ErrorMessage = "Mật khẩu không được dài quá 100 ký tự")]
        [RegularExpression("[\\S ]{6,100}", ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên")]
        public string Password { get; set; }

        public string return_url { get; set; }

        //[DisplayName("Ghi nhớ mật khẩu")]
        [ScaffoldColumn(false)]
        public bool remember_me { get; set; }

    }

    public class ClientForgetPasswordViewModel
    {
        [Required(ErrorMessage = "Bạn phải nhập tên tài khoản")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; }
    }

    public class ClientMailTokenModel
    {
        public string email { get; set; }
        public string token { get; set; }
        public DateTime expireTime { get; set; }
    }

    public class AccountResetPasswordModel
    {
        public string email { get; set; }
        public string token { get; set; }
        public string password_new { get; set; }
    }
}

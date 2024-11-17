using System;
using System.Collections.Generic;
namespace ADAVIGO_FRONTEND.ViewModels
{
    public class CommentViewModel
    {
        public int Id { get; set; }
        public int RequestId { get; set; }
        public string Content { get; set; }

        // Danh sách file đính kèm tương tự như API
        public List<FileViewModel> AttachFiles { get; set; } = new List<FileViewModel>();

        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public string UserName { get; set; }

        public DateTime? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }

    public class FileViewModel
    {
        public string Url { get; set; }
        public string Name { get; set; }
    }

    public class ApiResponse<T>
    {
        public int Status { get; set; }
        public string Msg { get; set; }
        public T Data { get; set; }
    }
}



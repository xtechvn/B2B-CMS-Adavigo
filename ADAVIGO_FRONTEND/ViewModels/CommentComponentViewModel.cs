using System.Collections.Generic;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class CommentComponentViewModel
    {
        public int RequestId { get; set; }
        public List<CommentViewModel> Comments { get; set; }
    }
}

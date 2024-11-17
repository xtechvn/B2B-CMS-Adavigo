using Microsoft.AspNetCore.Mvc;
using ADAVIGO_FRONTEND.Models.Services;
using System.Threading.Tasks;
using ADAVIGO_FRONTEND.ViewModels;
using System.Collections.Generic;

public class CommentViewComponent : ViewComponent
{
    private readonly CommentService _commentService;

    public CommentViewComponent(CommentService commentService)
    {
        _commentService = commentService;
    }

    public async Task<IViewComponentResult> InvokeAsync(int requestId)
    {
        if (requestId <= 0)
        {
            return View(new List<CommentViewModel>()); // Trả về danh sách rỗng nếu RequestId không hợp lệ
        }
        var comments = await _commentService.GetListCommentsAsync(requestId);
        return View("Default", new CommentComponentViewModel
        {
            RequestId = requestId,
            Comments = comments ?? new List<CommentViewModel>()
        });
    }
}

using API.Extensions;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator mediator;

        protected IMediator Mediator => mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();

            if (result.IsSuccess)
            {
                return result.Value == null ? NotFound() : Ok(result.Value);
            }
            else
            {
                return BadRequest(result.Error);
            }
        }
        protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
        {
            if (result == null) return NotFound();

            if (result.IsSuccess)
            {
                if (result.Value != null)
                {
                    Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize,
                        result.Value.TotalCount, result.Value.TotalPages);
                    return Ok(result.Value);
                }
                else
                {
                    return NotFound();
                }
            }
            else
            {
                return BadRequest(result.Error);
            }
        }
    }
}
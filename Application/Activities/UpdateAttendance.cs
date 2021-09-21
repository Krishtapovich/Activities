using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activitiy = await context.Activities
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (activitiy == null) return null;

                var user = await context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUserName());

                if (user == null) return null;

                var hostUsername = activitiy.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendance = activitiy.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if (attendance != null && hostUsername == user.UserName)
                {
                    activitiy.IsCancelled = !activitiy.IsCancelled;
                }

                if (attendance != null && hostUsername != user.UserName)
                {
                    activitiy.Attendees.Remove(attendance);
                }

                if (attendance == null)
                {
                    attendance = new Domain.ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activitiy,
                        IsHost = false
                    };

                    activitiy.Attendees.Add(attendance);
                }

                var result = await context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}
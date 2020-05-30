using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : Activity, IRequest {}

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) {
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes");
            }
        }
    }
}
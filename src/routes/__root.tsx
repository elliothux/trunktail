import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

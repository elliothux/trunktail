import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/commands')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/commands/"!</div>;
}

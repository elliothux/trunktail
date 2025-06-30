import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/monitor')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/monitor/"!</div>;
}

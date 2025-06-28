import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/pods')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/pods/"!</div>;
}

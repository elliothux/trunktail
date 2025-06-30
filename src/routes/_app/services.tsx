import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/services')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/services/"!</div>;
}

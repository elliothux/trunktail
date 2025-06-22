import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/volumes/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/volumes/"!</div>;
}

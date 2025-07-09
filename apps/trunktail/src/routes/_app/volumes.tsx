import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/volumes')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/volumes/"!</div>;
}

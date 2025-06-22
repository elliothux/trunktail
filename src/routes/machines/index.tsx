import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/machines/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/machines/"!</div>
}

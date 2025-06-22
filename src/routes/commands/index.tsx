import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/commands/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/commands/"!</div>
}

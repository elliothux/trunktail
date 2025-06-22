import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/images/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/images/"!</div>
}

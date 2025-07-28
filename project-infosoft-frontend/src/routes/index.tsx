import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className='flex justify-center'>Welcome to Bogsy Video Store</h1>
    </div>
  )
}

import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl mb-8">Dashboard</h1>

            <Link href='/'>Home</Link>
        </div>
    )
}
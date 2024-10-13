import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/investments')({
  component: Investments,
})

function Investments() {
    return (
        <div>
            <h1 className="text-3xl mb-8">Investments</h1>

            <Link href='/'>investments</Link>
        </div>
    )
}
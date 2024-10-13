import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transactions')({
  component: Transactions,
})

function Transactions() {
    return (
        <div>
            <h1 className="text-3xl mb-8">Transactions</h1>

            <Link href='/'>Home</Link>
        </div>
    )
}
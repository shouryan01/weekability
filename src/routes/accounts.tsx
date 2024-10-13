import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/accounts')({
  component: Accounts,
})

function Accounts() {
    return (
        <div>
            <h1 className="text-3xl mb-8">Accounts</h1>

            <Link href='/'>Home</Link>
        </div>
    )
}
import { Link, createFileRoute } from '@tanstack/react-router'

import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/transactions')({
  component: Transactions,
})

function Transactions() {
    return (
        <div className="flex justify-center min-h-screen w-screen">
            Transactions
        </div>
    )
}
import { Link, createFileRoute } from '@tanstack/react-router'

import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/investments')({
  component: Investments,
})

function Investments() {
    return (
        <div className="flex justify-center min-h-screen w-screen">
            Investments
        </div>
    )
}
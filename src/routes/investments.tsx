import { createFileRoute } from '@tanstack/react-router'

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
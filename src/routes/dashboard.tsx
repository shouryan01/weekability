import { Link, createFileRoute } from '@tanstack/react-router'

import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
    return (
        <div>
            <Link href='/'>
                <ArrowLeft className='h-8 w-8 rounded-full m-1 transition duration-100 hover:bg-zinc-300' /> 
            </Link>

            <div className="flex flex-col items-center min-h-screen text-center">
                <h1 className="text-3xl mb-8">Dashboard</h1>
            </div>
        </div>
    )
}
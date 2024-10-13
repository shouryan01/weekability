import '../App.css'

import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/hooks/use-toast'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { toast } = useToast()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl mb-8">week<span className='font-bold'>ability</span></h1>

      <Link href='/dashboard'>Dashboard</Link>
      <Link href='/transactions'>Transactions</Link>
      <Link href='/accounts'>Accounts</Link>
      <Link href='/investments'>Investments</Link>
      <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>
    </div>
  )
}

export default App

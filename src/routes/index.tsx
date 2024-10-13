import '../App.css'

import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl mb-8">week<span className='font-bold'>ability</span></h1>

      <Link href='/dashboard'>Dashboard</Link>
      <Link href='/transactions'>Transactions</Link>
      <Link href='/accounts'>Accounts</Link>
      <Link href='/investments'>Investments</Link>
    </div>
  )
}

export default App

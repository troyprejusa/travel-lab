import { Button } from '@/components/ui/button'

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-5">
        <p className="text-sm font-medium text-neutral-500">Travel Lab</p>
        <h1 className="text-4xl font-semibold tracking-tight">A fresh start.</h1>
        <p className="text-neutral-500">Your React, Vite, and shadcn/ui foundation is ready to build on.</p>
        <Button asChild><a href="https://ui.shadcn.com/docs/components" target="_blank" rel="noreferrer">Explore components</a></Button>
      </div>
    </main>
  )
}

export default App

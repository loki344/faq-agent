import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            <Link href="/">
            Home</Link>
          </h2>
          <div className="space-y-1">
            <Link
              href="/files"
              className="flex items-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Files
            </Link>
            <Link
              href="/faq-collections"
              className="flex items-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
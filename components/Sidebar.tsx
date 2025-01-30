import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Home
            </Link>
            <Link
              href="/collections"
              className="flex items-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              FAQ Collections
            </Link>
            <Link
              href="/faqs"
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
import type { ReactNode } from 'react'
import Sidebar from '../SideBar'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-hidden w-full">
        <div className="h-full w-full overflow-y-auto">
          <div className="p-6 w-full min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
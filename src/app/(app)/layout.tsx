import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { DesktopNav } from '@/components/nav/DesktopNav'
import { MobileNav } from '@/components/nav/MobileNav'
import { MobileHeader } from '@/components/nav/MobileHeader'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session.isLoggedIn) {
    redirect('/')
  }

  const userName = session.name || 'Friend'

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <DesktopNav userName={userName} />
      <MobileHeader userName={userName} />

      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {children}
      </main>

      <MobileNav />
    </div>
  )
}

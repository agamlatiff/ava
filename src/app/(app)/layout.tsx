import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { DesktopNav } from '@/components/nav/DesktopNav'
import { MobileNav } from '@/components/nav/MobileNav'
import { MobileHeader } from '@/components/nav/MobileHeader'
import styles from './layout.module.css'

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
    <div className={styles.appRoot}>
      <DesktopNav userName={userName} />
      <MobileHeader userName={userName} />

      <main className={styles.mainContent}>
        {children}
      </main>

      <MobileNav />
    </div>
  )
}

'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FishOutlineIcon } from '@/components/ui/OceanIcons'
import styles from './Nav.module.css'

interface MobileHeaderProps {
  title?: string
  userName?: string
}

export function MobileHeader({ title, userName = 'A' }: MobileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isRootTab = pathname === '/home' || pathname === '/memories' || pathname === '/hangouts'
  const displayTitle = title || (pathname === '/home' ? 'AVA' : 'Plan')

  return (
    <header className={styles.mobileHeader}>
      {!isRootTab ? (
        <button
          onClick={() => router.back()}
          className={styles.backBtn}
          aria-label="Go back"
        >
          ←
        </button>
      ) : (
        <Link href="/home" className={styles.logoLink}>
          <FishOutlineIcon size={20} color="var(--accent-cyan)" />
          <span>AVA</span>
        </Link>
      )}

      <h1 className={styles.headerTitle}>{displayTitle}</h1>

      <div className={styles.userAvatar} aria-label={`Logged in as ${userName}`}>
        {userName.charAt(0).toUpperCase()}
      </div>
    </header>
  )
}

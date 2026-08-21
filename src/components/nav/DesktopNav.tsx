'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/lib/actions/auth'
import { FishOutlineIcon } from '@/components/ui/OceanIcons'
import styles from './Nav.module.css'

interface DesktopNavProps {
  userName?: string
}

export function DesktopNav({ userName = 'You' }: DesktopNavProps) {
  const pathname = usePathname()

  const links = [
    { href: '/home', label: 'Home' },
    { href: '/hangouts', label: 'Plans' },
    { href: '/hangouts/new', label: '+ New' },
    { href: '/memories', label: 'Memories' },
  ]

  return (
    <nav className={styles.desktopNav} aria-label="Main desktop navigation">
      <div className={styles.navContainer}>
        <Link href="/home" className={styles.logoLink}>
          <FishOutlineIcon size={24} color="var(--accent-cyan)" /> Let&apos;s Go
        </Link>

        <ul className={styles.navLinks}>
          {links.map((link) => {
            const isActive =
              link.href === '/home'
                ? pathname === '/home'
                : pathname.startsWith(link.href)

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className={styles.userBadge}>
          <span>{userName}</span>
          <form action={logoutAction}>
            <button type="submit" className={styles.logoutBtn} aria-label="Sign out">
              ✕
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/lib/actions/auth'
import {
  HomeIcon,
  ExploreIcon,
  CalendarIcon,
  SparklesIcon,
  FishOutlineIcon,
} from '@/components/ui/OceanIcons'
import styles from './Nav.module.css'

interface DesktopNavProps {
  userName?: string
}

export function DesktopNav({ userName = 'You' }: DesktopNavProps) {
  const pathname = usePathname()

  const links = [
    { href: '/home', label: 'Home', icon: <HomeIcon size={19} /> },
    { href: '/hangouts/new', label: 'Explore', icon: <ExploreIcon size={19} /> },
    { href: '/hangouts', label: 'Plans', icon: <CalendarIcon size={19} /> },
    { href: '/memories', label: 'Memories', icon: <SparklesIcon size={19} /> },
  ]

  return (
    <aside className={styles.desktopSidebar} aria-label="Main desktop navigation">
      {/* ── Brand / Logo ── */}
      <div className={styles.sidebarHeader}>
        <Link href="/home" className={styles.brandLink}>
          <div className={styles.brandIconWrapper}>
            <FishOutlineIcon size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <span className={styles.brandTitle}>AVA</span>
            <span className={styles.brandSubtitle}>Two people · One plan</span>
          </div>
        </Link>
      </div>

      {/* ── Nav Links ── */}
      <nav className={styles.sidebarNav}>
        <ul className={styles.sidebarNavList}>
          {links.map((link) => {
            const isActive =
              link.href === '/home'
                ? pathname === '/home'
                : pathname.startsWith(link.href)

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.sidebarNavLink} ${isActive ? styles.sidebarNavLinkActive : ''}`}
                >
                  <span className={styles.sidebarNavIcon}>{link.icon}</span>
                  <span className={styles.sidebarNavText}>{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── Bottom User Profile / Logout ── */}
      <div className={styles.sidebarFooter}>
        <div className={styles.userProfilePill}>
          <div className={styles.userAvatar}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userNameText}>{userName}</span>
            <span className={styles.userStatusText}>Connected</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className={styles.sidebarLogoutBtn} title="Sign out" aria-label="Sign out">
              ✕
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}

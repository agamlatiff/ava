'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/lib/actions/auth'
import {
  HomeIcon,
  ExploreIcon,
  CalendarIcon,
  ShellIcon,
  SettingsIcon,
  ChevronDownIcon,
  FishOutlineIcon,
  JellyfishIcon,
} from '@/components/ui/OceanIcons'
import styles from './Nav.module.css'

interface DesktopNavProps {
  userName?: string
}

export function DesktopNav({ userName = 'Diva' }: DesktopNavProps) {
  const pathname = usePathname()
  const partnerName = userName.toLowerCase() === 'diva' ? 'Agam' : 'Diva'

  const links = [
    { href: '/home', label: 'Home', icon: <HomeIcon size={20} /> },
    { href: '/hangouts/new', label: 'Explore', icon: <ExploreIcon size={20} /> },
    { href: '/hangouts', label: 'Plans', icon: <CalendarIcon size={20} /> },
    { href: '/memories', label: 'Memories', icon: <ShellIcon size={20} /> },
    { href: '/settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
  ]

  return (
    <aside className={styles.desktopSidebar} aria-label="Main desktop navigation">
      {/* ── Brand / Logo ── */}
      <div className={styles.sidebarHeader}>
        <Link href="/home" className={styles.brandLink}>
          <div className={styles.brandIconWrapper}>
            <ShellIcon size={24} color="var(--accent-cyan)" />
          </div>
          <div>
            <span className={styles.brandTitle}>Ava</span>
            <span className={styles.brandSubtitle}>Somewhere worth going.</span>
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

      {/* ── Ambient Decorative Jellyfish In Sidebar ── */}
      <div className={styles.sidebarAmbientDeco} aria-hidden="true">
        <JellyfishIcon size={44} color="#F48FB1" />
      </div>

      {/* ── Bottom User Profile / Logout ── */}
      <div className={styles.sidebarFooter}>
        <div className={styles.userProfilePill}>
          <div className={styles.userAvatar}>
            <FishOutlineIcon size={18} color="#FFFFFF" />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userNameText}>{userName}</span>
            <span className={styles.userStatusText}>You & {partnerName}</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className={styles.sidebarLogoutBtn} title="Sign out" aria-label="Sign out">
              <ChevronDownIcon size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}

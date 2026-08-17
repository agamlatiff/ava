'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

export function MobileNav() {
  const pathname = usePathname()

  const tabs = [
    { href: '/home', label: 'Home', icon: '🏠' },
    { href: '/hangouts', label: 'Plans', icon: '📋' },
    { href: '/hangouts/new', label: 'New', icon: '+', isAction: true },
    { href: '/memories', label: 'Memories', icon: '🐚' },
  ]

  return (
    <nav className={styles.mobileBottomNav} aria-label="Mobile navigation bar">
      {tabs.map((tab) => {
        const isActive =
          tab.href === '/home'
            ? pathname === '/home'
            : pathname.startsWith(tab.href)

        if (tab.isAction) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={styles.createTabBtn}
              aria-label="Create new hangout plan"
            >
              <span>+</span>
            </Link>
          )
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.tabItem} ${isActive ? styles.tabItemActive : ''}`}
          >
            <span className={styles.tabIcon} aria-hidden="true">
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

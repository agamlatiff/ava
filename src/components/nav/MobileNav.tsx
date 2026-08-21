'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarIcon,
  SparklesIcon,
  FishOutlineIcon,
  PlusIcon,
} from '@/components/ui/OceanIcons'
import styles from './Nav.module.css'

export function MobileNav() {
  const pathname = usePathname()

  const tabs = [
    { href: '/home', label: 'Home', icon: <FishOutlineIcon size={20} /> },
    { href: '/hangouts', label: 'Plans', icon: <CalendarIcon size={20} /> },
    { href: '/hangouts/new', label: 'New', icon: <PlusIcon size={22} />, isAction: true },
    { href: '/memories', label: 'Memories', icon: <SparklesIcon size={20} /> },
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
            <div className={styles.tabIcon} aria-hidden="true">
              {tab.icon}
            </div>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

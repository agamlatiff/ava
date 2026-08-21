'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ExploreIcon,
  CalendarIcon,
  SparklesIcon,
} from '@/components/ui/OceanIcons'
import styles from './Nav.module.css'

export function MobileNav() {
  const pathname = usePathname()

  const tabs = [
    { href: '/home', label: 'Home', icon: <HomeIcon size={20} /> },
    { href: '/hangouts/new', label: 'Explore', icon: <ExploreIcon size={20} /> },
    { href: '/hangouts', label: 'Plans', icon: <CalendarIcon size={20} /> },
    { href: '/memories', label: 'Memories', icon: <SparklesIcon size={20} /> },
  ]

  return (
    <nav className={styles.mobileBottomNav} aria-label="Mobile navigation bar">
      {tabs.map((tab) => {
        const isActive =
          tab.href === '/home'
            ? pathname === '/home'
            : pathname.startsWith(tab.href)

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

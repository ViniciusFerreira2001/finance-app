'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import styles from './Sidebar.module.css';

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" />
        <rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: 'transactions',
    label: 'Transações',
    href: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 6h16M2 10h10M2 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  const initials = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Minimalist V and F integrated */}
            <path d="M6 10L14 26L22 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 10H30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22 18H28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22 10V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            {/* Subtle accent dot */}
            <circle cx="14" cy="26" r="1.5" fill="var(--accent)" />
          </svg>
        </div>
        <div className={styles.logoBrand}>
          <span className={styles.vLabel}>VF</span>
          <span className={styles.financeLabel}>FINANCE</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            onClick={() => router.push(item.href)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}

      </nav>

      {/* User + Logout */}
      <div className={styles.bottom}>
        <div className={styles.user}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{user?.email || 'Usuário'}</span>
          </div>
        </div>
        <button
          id="sidebar-logout"
          className={styles.logoutBtn}
          onClick={handleSignOut}
          title="Sair"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 2H3a1 1 0 00-1 1v12a1 1 0 001 1h4M12 13l4-4-4-4M16 9H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

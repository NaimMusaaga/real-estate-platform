import { Link, useLocation } from 'react-router-dom';

const TABS = [
  { to: '/admin/dashboard', label: 'نظرة عامة' },
  { to: '/admin/users', label: 'المستخدمون' },
  { to: '/admin/reports', label: 'البلاغات' },
];

export function AdminTabs() {
  const { pathname } = useLocation();

  return (
    <nav className="mb-6 flex gap-1 border-b border-stone-200">
      {TABS.map((tab) => {
        const active = pathname === tab.to;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={[
              'border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
              active ? 'border-brand-600 text-brand-700' : 'border-transparent text-stone-500 hover:text-stone-800',
            ].join(' ')}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

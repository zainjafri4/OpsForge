'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { getUserDisplayName, getUserInitials, getStoredAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardListIcon, 
  BarChart,
  LogOutIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Learn', href: '/dashboard/learn', icon: BookOpenIcon },
  { name: 'Test', href: '/dashboard/test', icon: ClipboardListIcon },
  { name: 'Results', href: '/dashboard/results', icon: BarChart },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Check if we're on the active quiz page (hide sidebar)
  const isQuizPage = pathname.includes('/test/') && pathname.split('/').length > 4;

  useEffect(() => {
    // Wait for zustand to finish rehydrating before checking auth
    if (!hasHydrated) return;
    
    // Check localStorage directly as additional fallback
    const stored = getStoredAuth();
    if (!isAuthenticated && !stored.accessToken) {
      router.push('/login');
    }
  }, [isAuthenticated, hasHydrated, router]);

  // Dark mode initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Show loading state while zustand is rehydrating
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // After hydration, check if user is authenticated
  if (!isAuthenticated || !user) {
    // Check localStorage as fallback
    const stored = getStoredAuth();
    if (!stored.accessToken) {
      return null;
    }
    // If we have a token but no user yet, show loading
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar - Hidden on quiz pages */}
      {!isQuizPage && (
        <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚙️</span>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Ops Forge
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-4 h-4" />
                ) : (
                  <MoonIcon className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  {getUserInitials(user)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getUserDisplayName(user)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => logout()}
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation - Hidden on quiz pages */}
      {!isQuizPage && (
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
          <nav className="flex justify-around items-center h-16 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href} className="flex-1">
                  <div className="flex flex-col items-center justify-center py-2">
                    <Icon
                      className={`w-6 h-6 mb-1 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Mobile Top Bar with Theme Toggle - Only visible when sidebar is hidden */}
      {!isQuizPage && (
        <div className="md:hidden fixed top-0 inset-x-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚙️</span>
              <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ops Forge
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${!isQuizPage ? 'md:ml-64 pt-14 md:pt-0 pb-16 md:pb-0' : ''}`}>
        <main className={`${!isQuizPage ? 'p-4 md:p-8' : ''}`}>{children}</main>
      </div>
    </div>
  );
}

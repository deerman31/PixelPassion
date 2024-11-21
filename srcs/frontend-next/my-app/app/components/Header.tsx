'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'  // routerをnext/navigationからインポート
import { useState } from 'react'

// 成功時のResponse型(BackendのTokenResponse構造体と同じようにする)
interface LogoutSuccessResponse {
    access_token: string;
    refresh_token: string;
}
// Error時のresponseの型
export interface LogoutErrorResponse {
    error: string;
}

export function Header() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // リダイレクト
      await router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // エラー処理をここに追加できます（例：トースト通知など）
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="fixed w-full top-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-emerald-600">PixelPassion</span>
        </Link>

        {/* Navigation Buttons */}
        <nav className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </nav>
      </div>
    </header>
  )
}
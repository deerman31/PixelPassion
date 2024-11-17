import Link from 'next/link'
import * as Button from '@radix-ui/react-button';

export function Header() {
  return (
    <header className="fixed w-full top-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-emerald-600">PixelPassion</span>
        </Link>


        {/* Navigation Buttons */}
        <nav className="flex items-center space-x-4">
          <Link
            href="/signup"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  )
}
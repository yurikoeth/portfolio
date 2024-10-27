'use client'

import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="flex justify-between items-center py-6 px-4 md:px-6">
      <Link href="/" className="text-black dark:text-white text-2xl font-bold">
        M
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/projects" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
          projects
        </Link>
        <Link href="/blog" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
          blog
        </Link>
        <button 
          onClick={toggleTheme} 
          className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  )
}
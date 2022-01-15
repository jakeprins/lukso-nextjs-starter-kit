import { ReactNode, RefObject, useRef, useState } from 'react'

import AccountDropdown from './AccountDropdown'
import Link from 'next/link'
import Logo from 'components/Logo'
import { useRouter } from 'next/router'

export const Navbar = ({ children }: { children?: ReactNode }) => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const { pathname } = useRouter()
  const navbarNode = useRef() as RefObject<HTMLDivElement>
  const hamburgerNode = useRef() as RefObject<HTMLDivElement>

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 px-4 sm:px-0">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <a className="flex items-center mr-6">
                  <Logo className="w-10 h-10 mb-1 text-primary-600" />
                </a>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline">
                <Link href="/">
                  <a
                    className={`px-3 py-2 mr-4 text-sm font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                      pathname === '/' && 'text-primary-700 bg-gray-100'
                    }`}
                  >
                    Home
                  </a>
                </Link>
                <Link href="/fetch">
                  <a
                    className={`px-3 py-2 mr-4 text-sm font-semibold text-gray-700 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                      pathname === '/fetch' && 'text-primary-700 bg-gray-100'
                    }`}
                  >
                    Fetch profile
                  </a>
                </Link>
                <Link href="/create">
                  <a
                    className={`px-3 py-2 mr-4 text-sm font-semibold text-gray-700 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                      pathname === '/create' && 'text-primary-700 bg-gray-100'
                    }`}
                  >
                    Create profile
                  </a>
                </Link>
                <Link href="/update">
                  <a
                    className={`px-3 py-2 mr-4 text-sm font-semibold text-gray-700 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                      pathname === '/update' && 'text-primary-700 bg-gray-100'
                    }`}
                  >
                    Update profile
                  </a>
                </Link>
                <Link href="/transfer">
                  <a
                    className={`px-3 py-2 mr-4 text-sm font-semibold text-gray-700 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                      pathname === '/transfer' && 'text-primary-700 bg-gray-100'
                    }`}
                  >
                    Transfer LXY
                  </a>
                </Link>
                <Link href="/permissions">
                  <a
                    className={`px-3 py-2 mr-4 text-sm font-semibold text-gray-700 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                      pathname === '/permissions' && 'text-primary-700 bg-gray-100'
                    }`}
                  >
                    Permissions
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="hidden md:block">
              <div className="flex items-center ml-4 md:ml-6">
                {children}
                <AccountDropdown />
              </div>
            </div>
          </div>
          <div className="flex -mr-2 md:hidden" ref={hamburgerNode}>
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-primary-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:text-primary-700"
            >
              <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {navbarOpen ? (
                  <path
                    className="inline-flex"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    className="inline-flex"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {navbarOpen && (
        <div className="block border-b border-gray-200 md:hidden" ref={navbarNode}>
          <div className="px-2 py-3 sm:px-3">
            <Link href="/">
              <a
                className={`block px-3 py-2 text-base font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                  pathname === '/' && 'text-primary-700 bg-gray-100'
                }`}
              >
                Homepage
              </a>
            </Link>
            <Link href="/fetch">
              <a
                className={`block px-3 py-2 text-base font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                  pathname === '/fetch' && 'text-primary-700 bg-gray-100'
                }`}
              >
                Fetch profile
              </a>
            </Link>
            <Link href="/create">
              <a
                className={`block px-3 py-2 text-base font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                  pathname === '/create' && 'text-primary-700 bg-gray-100'
                }`}
              >
                Create profile
              </a>
            </Link>
            <Link href="/update">
              <a
                className={`block px-3 py-2 text-base font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                  pathname === '/update' && 'text-primary-700 bg-gray-100'
                }`}
              >
                Update profile
              </a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

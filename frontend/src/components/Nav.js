import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MobileMenu from './MobileMenu'
import logo from '../images/new_logo.png'
import BookingButton from './BookingButton';

function Nav() {
  const [mobileMenuActive, setMobileMenuActive] = useState(false)
  const [mobileMenuShowing, setMobileMenuShowing] = useState(false)
  const [scrollDir, setScrollDir] = useState('scrolling up')
  const [activeLink, setActiveLink] = useState('')
  const location = useLocation()

  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location])

  useEffect(() => {
    const threshold = 75
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollDir = () => {
      const scrollY = window.scrollY
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false
        return
      }
      setScrollDir(scrollY > lastScrollY ? 'scrolling down' : 'scrolling up')
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollDir])

  // Desktop links configuration
  const leftLinks = [
    { path: '/services', label: 'Serviços' },
    { path: '/about', label: 'Informações' }
  ]
  const rightLinks = [
    { path: '/prices', label: 'Preços' },
    { path: '/reservations', label: 'Agendar' }
  ]

  return (
    <div>
      {/* Spacer for fixed navbar */}
      <div className='h-24 bg-[#F5F1E9]'></div>

      {/* Main navbar */}
      <nav
        style={
          scrollDir === 'scrolling up'
            ? { animation: 'slideDown 300ms ease forwards' }
            : { animation: 'slideUp 300ms ease forwards' }
        }
        className="fixed top-0 w-full h-24 px-6 z-40 bg-gradient-to-r from-[#F5F1E9] to-[#f3f3eb] shadow-md border-b border-[#a5bf99] nav flex items-center justify-between"
      >
        {/* Left group */}
        <ul className="hidden 2xl:flex gap-6 items-center">
          {leftLinks.map(link => (
            <li key={link.path} className="relative px-2">
              <Link
                to={link.path}
                className={`text-[#5c7160] hover:text-[#a3ba93] transition-all py-2 ${
                  activeLink === link.path ? 'font-medium' : 'font-light'
                }`}
                onClick={() => setActiveLink(link.path)}
              >
                {link.label}
              </Link>
              <span
                className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-[#a5bf99] transition-all duration-300 ease-out ${
                  activeLink === link.path ? 'w-3/4 opacity-100' : 'w-0 opacity-0'
                }`}
              ></span>
            </li>
          ))}
        </ul>

        {/* Center logo */}
        <Link
          onClick={() => setActiveLink('')}
          to="/"
          className="absolute left-1/2 transform -translate-x-1/2"
        >
          <img
            src={logo}
            className="px-2 w-48 mx-auto"
            alt="Your Moments Estética Logo"
          />
        </Link>

        {/* Right group */}
        <ul className="hidden 2xl:flex gap-6 items-center">
          {rightLinks.map(link => (
            <li key={link.path} className="relative px-2">
              <Link
                to={link.path}
                className={`text-[#5c7160] hover:text-[#a3ba93] transition-all py-2 ${
                  activeLink === link.path ? 'font-medium' : 'font-light'
                }`}
                onClick={() => setActiveLink(link.path)}
              >
                {link.label}
              </Link>
              <span
                className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-[#a5bf99] transition-all duration-300 ease-out ${
                  activeLink === link.path ? 'w-3/4 opacity-100' : 'w-0 opacity-0'
                }`}
              ></span>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          style={
            scrollDir === 'scrolling up'
              ? { visibility: 'visible' }
              : { visibility: 'hidden' }
          }
          onClick={() => {
            setMobileMenuActive(!mobileMenuActive)
            setMobileMenuShowing(true)
          }}
          aria-label="Toggle mobile menu"
          className="absolute right-6 z-50 2xl:hidden"
        >
          <div className="hb w-8 h-8">
            {mobileMenuShowing ? (
              <>
                <div
                  style={
                    mobileMenuActive
                      ? { animation: 'hb1 0.3s linear forwards', backgroundColor: '#5c7160' }
                      : { animation: 'hb1r 0.3s linear forwards', backgroundColor: '#5c7160' }
                  }
                  className="hb1"
                ></div>
                <div
                  style={
                    mobileMenuActive
                      ? { animation: 'hb2 0.15s linear forwards', backgroundColor: '#5c7160' }
                      : { animation: 'hb2r 0.15s linear forwards', backgroundColor: '#5c7160' }
                  }
                  className="hb2"
                ></div>
                <div
                  style={
                    mobileMenuActive
                      ? { animation: 'hb3 0.3s linear forwards', backgroundColor: '#5c7160' }
                      : { animation: 'hb3r 0.3s linear forwards', backgroundColor: '#5c7160' }
                  }
                  className="hb3"
                ></div>
              </>
            ) : (
              <>
                <div className="hb1" style={{ backgroundColor: '#5c7160' }}></div>
                <div className="hb2" style={{ backgroundColor: '#5c7160' }}></div>
                <div className="hb3" style={{ backgroundColor: '#5c7160' }}></div>
              </>
            )}
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuShowing && (
        <>
          {mobileMenuActive ? (
            <MobileMenu
              mobileMenuActive={mobileMenuActive}
              slide={'left'}
              setMobileMenuActive={setMobileMenuActive}
            />
          ) : (
            <MobileMenu
              slide={'right'}
              setMobileMenuActive={setMobileMenuActive}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Nav

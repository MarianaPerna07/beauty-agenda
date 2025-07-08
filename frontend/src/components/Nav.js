import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import logo from '../images/logo.png';

function Nav() {
    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const [mobileMenuShowing, setMobileMenuShowing] = useState(false)
    const [scrollDir, setScrollDir] = useState("scrolling up");
    const [activeLink, setActiveLink] = useState("");
    const location = useLocation();
  
  useEffect(() => {
    // Set active link based on current path
    setActiveLink(location.pathname);
  }, [location]);
  
  useEffect(() => {
    const threshold = 75;
    let lastScrollY = window.scrollY;
    let ticking = false;
  
    const updateScrollDir = () => {
      const scrollY = window.scrollY;
  
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? "scrolling down" : "scrolling up");
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };
  
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };
  
    window.addEventListener("scroll", onScroll);
    
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDir]);
  
  return (
    <div>
      {/* Spacer for fixed navbar */}
      <div className='h-24 bg-[#F5F1E9]'></div>
      
      {/* Main navbar */}
      <nav 
        style={scrollDir === 'scrolling up' 
          ? {animation: 'slideDown 300ms ease forwards'} 
          : {animation: 'slideUp 300ms ease forwards'}} 
        className="fixed top-0 nav flex w-full items-center justify-between h-24 px-6 bg-gradient-to-r from-[#F5F1E9] to-[#f3f3eb] z-40 shadow-md border-b border-[#a5bf99]"
      >
        {/* Top golden decorative element */}
        <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-[#c0a080] via-[#e9d3a3] to-[#c0a080]"></div>
        
        {/* Logo */}
        <Link 
          onClick={() => setActiveLink("")} 
          to="/" 
          className="relative"
        >
          <img src={logo} className="px-2 w-48" alt="Beauty Space Logo"></img>
        </Link>
        
        {/* Desktop Navigation Links - Better spacing between items */}
        <ul className="2xl:flex absolute items-center left-1/2 -translate-x-1/2 gap-6 text-lg hidden">
          {[
            // { path: '/services', label: 'Services' },
            { path: '/team', label: 'Serviços' },
            { path: '/about', label: 'Informações' },
            // { path: '/contact', label: 'Contact' }
          ].map((link) => (
            <li key={link.path} className="relative px-2">
              <Link 
                to={link.path} 
                className={`text-[#5c7160] hover:text-[#a3ba93] transition-all py-2 
                  ${activeLink === link.path ? 'font-medium' : 'font-light'}`}
                onClick={() => setActiveLink(link.path)}
              >
                {link.label}
              </Link>
              {/* Animated underline - only show when actively selected */}
              <span 
                className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-[#a5bf99] transition-all duration-300 ease-out
                ${activeLink === link.path ? 'w-3/4 opacity-100' : 'w-0 opacity-0'}`}
              ></span>
              {/* Subtle separator */}
              {link.path !== '/contact' && <span className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-px bg-[#a5bf99] opacity-30"></span>}
            </li>
          ))}
          
          {/* Liquid Glass Book Now Button */}
          <li className="ml-6">
            <Link 
              to='/reservations' 
              className="relative group px-8 py-2.5 flex items-center justify-center transition-all duration-300"
            >
              {/* Glass effect background */}
              <span 
                className="absolute inset-0 rounded-full backdrop-blur-md bg-white/20 group-hover:bg-white/30 
                         border border-white/50 group-hover:border-white/60 shadow-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(120deg, rgba(165, 191, 153, 0.7), rgba(92, 113, 96, 0.6))',
                  boxShadow: '0 4px 15px rgba(165, 191, 153, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.1)'
                }}
              ></span>
              
              {/* Enhanced shine effect */}
              <span 
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{ opacity: 0.4 }}
              >
                <span 
                  className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                ></span>
              </span>
              
              {/* Button text */}
              <span className="relative z-10 font-medium text-white tracking-wide">
                Agendar
              </span>
              
              {/* Golden accent at bottom */}
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-[#c0a080] group-hover:w-2/3 transition-all duration-300"></span>
            </Link>
          </li>
        </ul>
        
        {/* Mobile menu button - Updated to show earlier */}
        <button 
          style={scrollDir === 'scrolling up' ? {visibility: 'visible'} : {visibility: 'hidden'}} 
          onClick={() => {setMobileMenuActive(!mobileMenuActive); setMobileMenuShowing(true)}}
          aria-label="Toggle mobile menu"
          className="relative z-50"
        >
          <div className="hb w-8 h-8 2xl:hidden">
            {mobileMenuShowing ? 
            <><div style={ mobileMenuActive ? {animation: 'hb1 0.3s linear forwards', backgroundColor: '#5c7160'} : {animation: 'hb1r 0.3s linear forwards', backgroundColor: '#5c7160'}} className="hb1"></div>
            <div style={ mobileMenuActive ? {animation: 'hb2 0.15s linear forwards', backgroundColor: '#5c7160'} : {animation: 'hb2r 0.15s linear forwards', backgroundColor: '#5c7160'}} className="hb2"></div>
            <div style={ mobileMenuActive ? {animation: 'hb3 0.3s linear forwards', backgroundColor: '#5c7160'} : {animation: 'hb3r 0.3s linear forwards', backgroundColor: '#5c7160'}} className="hb3"></div></>
            : <><div className="hb1" style={{backgroundColor: '#5c7160'}}></div>
            <div className="hb2" style={{backgroundColor: '#5c7160'}}></div>
            <div className="hb3" style={{backgroundColor: '#5c7160'}}></div></>}
          </div>
        </button>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuShowing ? <>
      {mobileMenuActive ? 
        <MobileMenu 
          mobileMenuActive={mobileMenuActive} 
          slide={'left'} 
          setMobileMenuActive={setMobileMenuActive}
          bgColor="#F5F1E9"
          textColor="#5c7160"
          accentColor="#a5bf99"
        /> : 
        <MobileMenu 
          slide={'right'} 
          setMobileMenuActive={setMobileMenuActive}
          bgColor="#F5F1E9"
          textColor="#5c7160"
          accentColor="#a5bf99"
        />}
      </> : null}
    </div>
  )
}

export default Nav
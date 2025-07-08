import React from 'react'
import logo from '../images/logo.png'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-[#F5F1E9] to-[#f3f3eb] text-[#5c7160] py-12 px-6 border-t border-[#a5bf99]">
      {/* Top golden decorative element */}
      <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-[#c0a080] via-[#e9d3a3] to-[#c0a080]"></div>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and about section */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/">
              <img src={logo} alt="Beauty Space Logo" className="w-36 mb-4" />
            </Link>
            <p className="text-sm text-[#5c7160] opacity-80 mt-2 text-center md:text-left">
              Your beauty sanctuary where expertise meets elegance. Schedule your self-care session today.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-medium text-lg mb-4 text-[#5c7160] relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#a5bf99]"></span>
            </h3>
            <ul className="space-y-2">
              {/* <li><Link to="/services" className="text-[#5c7160] hover:text-[#a3ba93] transition-colors">Serviços</Link></li> */}
              <li><Link to="/team" className="text-[#5c7160] hover:text-[#a3ba93] transition-colors">Serviços</Link></li>
              <li><Link to="/about" className="text-[#5c7160] hover:text-[#a3ba93] transition-colors">Informações</Link></li>
              {/* <li><Link to="/contact" className="text-[#5c7160] hover:text-[#a3ba93] transition-colors"></Link></li> */}
            </ul>
          </div>

          {/* Contact info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-medium text-lg mb-4 text-[#5c7160] relative inline-block">
              Contact Info
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#a5bf99]"></span>
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                <span>123 Beauty Street, Lisboa</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📱</span>
                <span>+351 123 456 789</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                <span>contact@beautyspace.pt</span>
              </li>
            </ul>
          </div>

          {/* Social & Book Now */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-medium text-lg mb-4 text-[#5c7160] relative inline-block">
              Follow Us
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#a5bf99]"></span>
            </h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F1E9] border border-[#a5bf99] transition-all hover:bg-[#a5bf99] hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F1E9] border border-[#a5bf99] transition-all hover:bg-[#a5bf99] hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F1E9] border border-[#a5bf99] transition-all hover:bg-[#a5bf99] hover:text-white">
                <i className="fab fa-pinterest-p"></i>
              </a>
            </div>
            <Link 
              to="/reservations"
              className="relative group px-6 py-2 flex items-center justify-center transition-all duration-300"
            >
              <span 
                className="absolute inset-0 rounded-full backdrop-blur-md bg-white/20 group-hover:bg-white/30 
                       border border-white/50 group-hover:border-white/60 shadow-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(120deg, rgba(165, 191, 153, 0.7), rgba(92, 113, 96, 0.6))',
                  boxShadow: '0 4px 15px rgba(165, 191, 153, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.1)'
                }}
              ></span>
              <span className="relative z-10 font-medium text-white tracking-wide">
                Book Now
              </span>
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-[#c0a080] group-hover:w-2/3 transition-all duration-300"></span>
            </Link>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-10 pt-6 border-t border-[#a5bf99] border-opacity-30 text-center">
          <p className="text-[#5c7160] text-sm opacity-70">
            © {new Date().getFullYear()} Beauty Space. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
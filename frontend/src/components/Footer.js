import React from 'react'
import logo from '../images/new_logo.png'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="relative bg-[#F5F1E9] text-[#5c7160] overflow-hidden">
      {/* Decorative wave shape at the top */}
      <div className="absolute left-0 top-0 w-full h-12">
        <svg viewBox="0 0 1200 30" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 C150,40 350,0 500,20 C650,40 750,10 900,20 C1050,30 1200,10 1200,10 V30 H0 V0Z" fill="#a5bf99" fillOpacity="0.15"/>
        </svg>
      </div>
      
      {/* Gold accent line */}
      <div className="absolute left-0 top-12 w-full h-0.5 bg-gradient-to-r from-[#c0a080] via-[#e9d3a3] to-[#c0a080]"></div>
      
      <div className="container mx-auto pt-20 pb-8 px-6 relative z-10">
        {/* Main footer content with two-row layout */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10">
          {/* Logo and description - Left column */}
          <div className="mb-8 md:mb-0 text-center md:text-left md:max-w-xs">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="Beauty Space Logo" className="w-36" />
            </Link>
            <p className="text-sm font-light text-[#5c7160] opacity-80">
              O seu espaço de beleza onde a expertise encontra a elegância. Agende a sua sessão de autocuidado hoje.
            </p>
          </div>
          
          {/* Navigation columns - Right side */}
          <div className="flex flex-wrap justify-center md:justify-end gap-12 lg:gap-16">
            {/* Links column */}
            <div>
              <h4 className="font-medium text-[#5c7160] mb-3 relative inline-block">
                Links Úteis
                <span className="absolute -bottom-1 left-0 w-2/3 h-0.5 bg-[#a5bf99]"></span>
              </h4>
              <ul className="space-y-2">
                <li><Link to="/team" className="text-[#5c7160] hover:text-[#a3ba93] transition-colors text-sm">Serviços</Link></li>
                <li><Link to="/about" className="text-[#5c7160] hover:text-[#a3ba93] transition-colors text-sm">Informações</Link></li>
                <li><Link to="/contact" className="text-[#5c7160] hover:text-[#a3ba93] transition-colors text-sm">Contactos</Link></li>
              </ul>
            </div>
            
            {/* Contact info column */}
            <div>
              <h4 className="font-medium text-[#5c7160] mb-3 relative inline-block">
                Contactos
                <span className="absolute -bottom-1 left-0 w-2/3 h-0.5 bg-[#a5bf99]"></span>
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <span className="mr-2 text-[#a5bf99]">📍</span>
                  <span>Rua da Beleza 123, Lisboa</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="mr-2 text-[#a5bf99]">📱</span>
                  <span>+351 933 817 786</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="mr-2 text-[#a5bf99]">✉️</span>
                  <span>info@beautyspace.pt</span>
                </li>
              </ul>
            </div>
            
            {/* Book Now and social column */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-medium text-[#5c7160] mb-3 relative inline-block">
                Siga-nos
                <span className="absolute -bottom-1 left-0 w-2/3 h-0.5 bg-[#a5bf99]"></span>
              </h4>
              <div className="flex space-x-3 mb-4">
                {/* Facebook Link */}
                <a 
                  href="https://www.facebook.com/people/Cardoso-beauty/100076114537149/?locale=en_GB" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#a5bf99] transition-all hover:bg-[#a5bf99] hover:text-white text-[#5c7160]"
                  aria-label="Facebook - Maria Cardoso Estética"
                >
                  <FaFacebookF className="text-xs" />
                </a>
                
                {/* Instagram Link */}
                <a 
                  href="https://www.instagram.com/larailucy?igsh=MXdqdnVqbXN0ZTNybQ==" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#a5bf99] transition-all hover:bg-[#a5bf99] hover:text-white text-[#5c7160]"
                  aria-label="Instagram - larailucy"
                >
                  <FaInstagram className="text-xs" />
                </a>
                
                {/* WhatsApp Link */}
                <a 
                  href="https://wa.me/351933817786" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#a5bf99] transition-all hover:bg-[#a5bf99] hover:text-white text-[#5c7160]"
                  aria-label="WhatsApp - 933 817 786"
                >
                  <FaWhatsapp className="text-xs" />
                </a>
              </div>
              
              {/* Agendar Button */}
              <Link 
                to="/reservations" 
                className="relative group px-6 py-2 flex items-center justify-center transition-all duration-300"
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
                
                {/* Shine effect */}
                <span 
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{ opacity: 0.4 }}
                >
                  <span 
                    className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                  ></span>
                </span>
                
                <span className="relative z-10 font-medium text-white tracking-wide text-sm">
                  Agendar
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom copyright bar with decorative elements */}
        <div className="relative">
          {/* Gold dotted line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#c0a080] to-transparent opacity-50"></div>
          
          <div className="pt-6 text-center">
            <p className="text-[#5c7160] text-xs opacity-70 font-light">
              © {new Date().getFullYear()} Beauty Space. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative leaf elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-5 -rotate-45">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,80 Q40,60 60,80 T100,80 Q80,60 80,40 T80,0 Q60,20 40,0 T0,0 Q20,40 0,80 Z" fill="#5c7160"/>
        </svg>
      </div>
      <div className="absolute top-20 right-0 w-24 h-24 opacity-5 rotate-45">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,80 Q40,60 60,80 T100,80 Q80,60 80,40 T80,0 Q60,20 40,0 T0,0 Q20,40 0,80 Z" fill="#5c7160"/>
        </svg>
      </div>
    </footer>
  )
}

export default Footer
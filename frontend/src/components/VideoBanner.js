import React from 'react'
import barbervid from './videos/barbervid.mp4'
import { Link } from 'react-router-dom'

function VideoBanner() {
  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Video background with overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5c7160]/50 to-[#5c7160]/70 z-10"></div>
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover" 
          src={barbervid} 
          muted 
          loop 
          autoPlay 
          playsInline
        ></video>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#c0a080] via-[#e9d3a3] to-[#c0a080] z-20"></div>
      
      <div className="absolute bottom-0 left-0 w-full h-16 z-20">
        <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,60 C150,20 350,60 500,40 C650,20 750,50 900,40 C1050,30 1200,50 1200,50 V0 H0 V60Z" fill="#F5F1E9"/>
        </svg>
      </div>
      
      {/* Content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-6 text-center">
        <h2 className="text-[#F5F1E9] text-4xl md:text-5xl font-light mb-3 tracking-wide">
          <span className="block">Descubra a Arte</span>
          <span className="block mt-2">do Autocuidado</span>
        </h2>
        
        <p className="text-[#F5F1E9]/90 max-w-2xl mx-auto text-lg md:text-xl font-light mb-8 tracking-wide">
          Onde a beleza e o bem-estar se encontram num só lugar
        </p>
        
        {/* Subtle divider */}
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#e9d3a3] to-transparent mb-8"></div>
        
        {/* Liquid glass button */}
        <Link 
          to="/reservations" 
          className="relative group px-10 py-3 flex items-center justify-center transition-all duration-300"
        >
          {/* Glass effect background */}
          <span 
            className="glass-green absolute inset-0 rounded-full backdrop-blur-md bg-white/20 group-hover:bg-white/30 
                     border border-white/50 group-hover:border-white/60 shadow-lg transition-all duration-300"
            // style={{
            //   background: 'linear-gradient(120deg, rgba(165, 191, 153, 0.7), rgba(92, 113, 96, 0.6))',
            //   boxShadow: '0 4px 15px rgba(165, 191, 153, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.1)'
            // }}
          ></span>
          
          {/* Shine effect */}
          {/* <span 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ opacity: 0.4 }}
          >
            <span 
              className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
            ></span>
          </span> */}
          
          {/* Button text */}
          <span className="relative z-10 font-medium text-white tracking-wide text-lg">
            Agendar Agora
          </span>
          
          {/* Golden accent at bottom */}
          {/* <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-[#c0a080] group-hover:w-2/3 transition-all duration-300"></span> */}
        </Link>
      </div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 z-20 opacity-10 bg-repeat" 
           style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25.5 0 L25.5 60 M0 25.5 L60 25.5' stroke='%23ffffff' stroke-width='1' fill='none' /%3E%3C/svg%3E')" }}>
      </div>
    </div>
  )
}

export default VideoBanner
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
      
      {/* Modificada a curva da onda para criar uma transição mais suave */}
      <div className="absolute bottom-0 left-0 w-full h-16 z-20">
        <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 C150,40 350,0 500,20 C650,40 750,10 900,20 C1050,30 1200,10 1200,10 V60 H0 V0Z" fill="#F5F1E9"/>
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
          ></span>
          
          {/* Button text */}
          <span className="relative z-10 font-medium text-white tracking-wide text-lg">
            Agendar Agora
          </span>
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
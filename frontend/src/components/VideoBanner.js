import React from 'react'
import bannerImage from './images/banner.png'
import { Link } from 'react-router-dom'

function VideoBanner() {
  return (
    <div className="relative h-[60vh] overflow-hidden">
      {/* Image background with refined overlay */}
      <div className="absolute inset-0 w-full h-full">
        {/* Opção 1: Overlay dourado suave */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#c0a080]/20 via-[#c0a080]/30 to-[#c0a080]/40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent mix-blend-overlay z-10"></div>
        
        {/* Imagem com brilho levemente ajustado */}
        <img 
          className="absolute top-0 left-0 w-full h-full object-cover object-center filter brightness-90" 
          src={bannerImage} 
          alt="Your Moments Estética"
        />
      </div>
      
      {/* Gold accent at top */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#c0a080] via-[#e9d3a3] to-[#c0a080] z-20"></div>
      
      {/* Refined wave transition */}
      <div className="absolute bottom-0 left-0 w-full h-16 z-20">
        <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,30 C200,70 400,20 600,40 C800,60 1000,10 1200,30 V80 H0 V30Z" fill="#F5F1E9"/>
          <path d="M0,40 C300,80 500,30 700,50 C900,70 1100,20 1200,40 V80 H0 V40Z" fill="#F5F1E9" fillOpacity="0.7"/>
        </svg>
      </div>
      
      {/* Content container com espaçamento reduzido */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-6 text-center">
        {/* Decorative element menor */}
        <div className="w-12 h-12 mb-4 opacity-30">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#e9d3a3" strokeWidth="2" />
            <circle cx="50" cy="50" r="35" stroke="#e9d3a3" strokeWidth="1" />
          </svg>
        </div>
        
        {/* Heading com espaçamento reduzido */}
        <h2 className="text-white text-3xl md:text-4xl font-light mb-2 tracking-widest drop-shadow-md">
          <span className="block">ARTE E CUIDADO EM</span>
          <span className="block mt-1">CADA TRAÇO</span>
        </h2>
        
        {/* Subtitle com espaçamento reduzido */}
        <p className="text-white/90 max-w-2xl mx-auto text-base md:text-lg font-light mb-6 tracking-wide drop-shadow-md">
          Onde a beleza e o bem-estar se encontram num só lugar
        </p>
        
        {/* Divider menor */}
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#e9d3a3] to-transparent mb-6"></div>
        
        {/* Botão mais compacto */}
        <Link 
          to="/reservations" 
          className="relative group px-8 py-3 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
        >
          {/* Fundo com efeito de vidro */}
          <span 
            className="absolute inset-0 rounded-full backdrop-blur-md bg-[#c0a080]/30 group-hover:bg-[#c0a080]/40 
                     border border-white/40 group-hover:border-white/60 shadow-lg transition-all duration-300"
          ></span>
          
          {/* Texto do botão */}
          <span className="relative z-10 font-medium text-white tracking-widest text-base flex items-center">
            <span className="mr-2">AGENDAR AGORA</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default VideoBanner
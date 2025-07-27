import React from 'react';
import { Link } from 'react-router-dom';

const BookingButton = ({ className = '', children, ...props }) => {
  return (
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
  );
};

export default BookingButton;
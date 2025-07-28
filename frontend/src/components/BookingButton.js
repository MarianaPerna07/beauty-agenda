import React from 'react';
import { Link } from 'react-router-dom';

const BookingButton = ({ className = '', children, to = '/reservations', fullWidth = false, ...props }) => {
  return (
    <Link
      to={to}
      className={`relative group px-6 py-3 flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Fundo com efeito de vidro */}
      <span 
        className="absolute inset-0 rounded-full backdrop-blur-md bg-[#c0a080]/30 group-hover:bg-[#c0a080]/40 
                 border border-white/40 group-hover:border-white/60 shadow-lg transition-all duration-300"
      ></span>
      
      {/* Texto do botão */}
      <span className="relative z-10 font-medium text-white tracking-widest text-base flex items-center">
        {children || (
          <>
            <span>AGENDAR AGORA</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </span>
    </Link>
  );
};

export default BookingButton;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingButton from './BookingButton';

const ServiceModal = ({ service, onClose, categoryId }) => {
  const navigate = useNavigate();
  
  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEsc);
    // Prevenir rolagem do body quando o modal está aberto
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Função para navegar para página de reservas com parâmetros
  const handleBooking = () => {
    navigate(`/reservations?category=${categoryId}&service=${encodeURIComponent(service.title)}`);
  };

  // Prevenir propagação de cliques no conteúdo do modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-scaleIn"
        onClick={handleModalContentClick}
      >
        {/* Decorative top border */}
        {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a5bf99] to-[#5c7160]"></div> */}
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#5c7160]/10 hover:bg-[#5c7160]/20 transition-colors z-10"
          aria-label="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image section */}
          <div className="h-64 md:h-96 overflow-hidden relative">
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-full object-cover"
            />
            {/* Optional decorative element */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          
          {/* Content section */}
          <div className="p-6 pt-10 md:pt-6 flex flex-col h-full">
            <h2 className="text-2xl font-light text-[#5c7160] mb-2">{service.title}</h2>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="px-3 py-1 bg-[#F5F1E9] rounded-full text-[#c0a080] font-medium">
                {service.price}
              </div>
              <div className="px-3 py-1 bg-[#F5F1E9] rounded-full text-[#5c7160]">
                {service.duration}
              </div>
            </div>
            
            <div className="mt-2 mb-6 grow">
              <h3 className="text-lg font-medium text-[#5c7160] mb-3">Detalhes do serviço</h3>
              <ul className="space-y-3">
                {service.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-[#5c7160]/80">
                    <span className="text-[#a5bf99] mr-2 text-xl">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Booking button */}
            {/* <div className="mt-auto pt-4">
              <div 
                onClick={handleBooking}
                className="w-full"
              >
                <BookingButton fullWidth>
                  <span className="flex items-center justify-center w-full">
                    <span className="mr-2">Agendar Agora</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                </BookingButton>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
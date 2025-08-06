import React from 'react';
import Typography from '@material-ui/core/Typography';

const SharedFooter = () => (
    <div className="relative bg-[#F5F1E9] pt-3 pb-2 mt-auto z-10">
        {/* Gold accent line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#c0a080] to-transparent opacity-50"></div>
        
        <div className="max-w-3xl mx-auto text-center px-4">
            <Typography 
                variant="caption"
                style={{ 
                    color: 'rgba(92, 113, 96, 0.7)',
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '0.7rem'
                }}
            >
                © {new Date().getFullYear()} Your Moments Estética. Todos os direitos reservados.
            </Typography>
        </div>
        
        {/* Decorative leaf element - made smaller and moved up slightly */}
        <div className="absolute bottom-1 right-2 w-12 h-12 opacity-5 rotate-45 pointer-events-none">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M20,80 Q40,60 60,80 T100,80 Q80,60 80,40 T80,0 Q60,20 40,0 T0,0 Q20,40 0,80 Z" fill="#5c7160"/>
            </svg>
        </div>
    </div>
);

export default SharedFooter;

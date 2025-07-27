import React from 'react'
import { Link } from 'react-router-dom'

function MobileMenu({ mobileMenuActive, setMobileMenuActive, slide }) {
  return (
    <div className={mobileMenuActive ? 'requires-no-scroll' : null}>
      <div
        className={`
          fixed right-0 
          w-full md:w-2/5 
          h-full
          top-24
          z-40 p-2 
          text-center
          glass
          text-[#F5F1E9]
        `}
        style={{
          animation:
            slide === 'left'
              ? 'slideLeft 0.5s ease forwards'
              : 'slideRight 0.7s ease forwards',
        }}
      >
        <div className='flex flex-col gap-10 items-center justify-center h-full text-2xl nav'>
          {[
            { to: '/about', label: 'Sobre nós' },
            { to: '/services',  label: 'Serviços' },
            { to: '/prices', label: 'Preços' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              onClick={() => setMobileMenuActive(false)}
              to={to}
              className="
                inline-block           /* allow transform */
                px-10 py-4              /* padding for clickable area */
                transform              /* enable transforms */
                transition             /* default all-properties transition */
                duration-300           /* 500ms smooth */
                hover:scale-115        /* scale up to 110% */
                hover:text-[#A5BF99]   /* your hover color */
              "
            >
              {label}
            </Link>
          ))}

          <Link
            onClick={() => setMobileMenuActive(false)}
            to='/reservations'
            className="
              inline-block
              px-10 py-4              /* padding for clickable area */
              transform
              transition
              duration-300
              hover:scale-110
              text-[#C0A080]
              hover:text-[#A5BF99]
            "
          >
            Agendar
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
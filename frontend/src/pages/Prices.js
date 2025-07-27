import React, { useEffect } from 'react'
import ServicePrices from '../components/ServicePrices'
import scrollToTop from '../helpers/scrollToTop'

function Prices() {
  useEffect(() => {
    scrollToTop()
  },[])
  return (
    <div className='min-h-screen'>
        <div className='relative'>
            <img className='brightness-75 grayscale object-cover h-[40vh] object-left-bottom w-full' src='https://lella.qodeinteractive.com/wp-content/uploads/2019/08/title-area-img-3.jpg'></img>
            <h2 className="absolute h-full top-0 flex items-center left-1/2 -translate-x-1/2 text-center py-4 text-6xl text-red-800">Preçário</h2>
        </div>
        <section className="justify-center gap-12 px-4 pb-4">
        <ServicePrices/>
      </section>
    </div>
  )
}

export default Prices
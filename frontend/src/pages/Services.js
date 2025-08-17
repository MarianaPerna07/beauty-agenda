import React, { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import scrollToTop from '../helpers/scrollToTop'
import bannerImage from '../images/banner-image.png'
import ServiceModal from '../components/ServiceModal'
import BookingButton from '../components/BookingButton'

function Services() {
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const serviceFromUrl = searchParams.get('service')

  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // ativo: usa valor da URL ou vazio — será ajustado depois que categories carregar
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'manicure')
  const [selectedService, setSelectedService] = useState(null)

  const scrollContainerRef = useRef(null)
  const servicesSectionRef = useRef(null)

  // Fetch all services apenas uma vez no load
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        const res = await fetch('http://127.0.0.1:5001/services')
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const json = await res.json()
        setServices(json.services)
        // extrai categorias únicas
        const uniqueCats = [...new Set(json.services.map(s => s.category))]
        const formatted = uniqueCats.map(cat => ({
          id: cat.toLowerCase().replace(/\s+/g, '_').replace(/ç/g, 'c'),
          name: cat
        }))
        setCategories(formatted)
        setError(null)
      } catch (e) {
        console.error(e)
        setError('Erro ao carregar serviços.')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  // define categoria ativa após categorias carregarem
  useEffect(() => {
    if (!loading && categories.length) {
      if (categoryFromUrl) {
        setActiveCategory(categoryFromUrl)
      } else {
        setActiveCategory(categories[0].id)
      }
    }
  }, [loading, categories, categoryFromUrl])

  // scroll e highlight se serviço direto
  useEffect(() => {
    scrollToTop()
    if (serviceFromUrl && !loading) {
      setTimeout(() => {
        const el = document.getElementById(`service-${serviceFromUrl}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.add('highlight-service')
          setTimeout(() => el.classList.remove('highlight-service'), 2000)
        }
      }, 500)
    }
  }, [serviceFromUrl, loading])

  const handleCategoryClick = (catId, e) => {
    setActiveCategory(catId)
    // centra botão
    const cont = scrollContainerRef.current
    const btn = e.currentTarget
    if (cont && btn) {
      cont.scrollTo({ left: btn.offsetLeft - cont.clientWidth/2 + btn.clientWidth/2, behavior: 'smooth' })
    }
    // scroll para secção
    if (servicesSectionRef.current) {
      setTimeout(() => {
        const yOff = -80
        const top = servicesSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOff
        window.scrollTo({ top, behavior: 'smooth' })
      }, 100)
    }
  }

  const openServiceModal = svc => setSelectedService(svc)
  const closeServiceModal = () => setSelectedService(null)

  // retorna lista de serviços da categoria, com image path local
  const getServicesByCategory = catId =>
    services
      .filter(s =>
        s.category.toLowerCase().replace(/\s+/g, '_').replace(/ç/g, 'c') === catId
      )
      .map(svc => ({
        title: svc.name,
        price: typeof svc.price === 'number' ? `${svc.price.toFixed(2)} €` : svc.price,
        duration: `${svc.duration} min`, 
        image: `/${svc.service_image}`,
        details: svc.description,
        rawId: svc.service_id
      }))

  return (
    <div className="min-h-screen bg-[#F5F1E9]">
      {/* Hero */}
      <div className="relative border-b-2 border-[#F5F1E9]">
        <img src={bannerImage} alt="Serviços" className="object-cover h-[30vh] w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#c0a080]/40 to-[#c0a080]/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-[#F5F1E9] text-4xl md:text-5xl lg:text-6xl font-light">Nossos Serviços</h2>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16">
          <svg viewBox="0 0 1200 60" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,60 V30 C150,50 350,40 500,35 C650,30 750,25 900,30 C1050,35 1200,45 1200,45 V60 H0 Z" fill="#F5F1E9"/>
          </svg>
        </div>
      </div>

      {/* Categories */}
      <section className="pt-2 max-w-7xl justify-center mx-auto">
        <div className="relative overflow-hidden container mx-auto hide-scrollbar">
          <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-4 px-6 py-2 hide-scrollbar">
            {loading
              ? Array(6).fill().map((_, i) => (<div key={i} className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />))
              : categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={e => handleCategoryClick(cat.id, e)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full transition-all ${activeCategory === cat.id ? 'bg-[#5c7160] text-white shadow-md' : 'bg-white text-[#5c7160] hover:bg-[#a5bf99]/20'}`}
                  >{cat.name}</button>
                ))}
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section ref={servicesSectionRef} className="py-12 px-6 bg-[#F5F1E9]/5">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill().map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-64 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#5c7160] text-white rounded-lg">Tentar novamente</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getServicesByCategory(activeCategory).map((svc, idx) => (
                <div
                  key={idx}
                  id={`service-${svc.rawId}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openServiceModal(svc)}
                >
                  <div className="h-64 relative">
                    <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-[#5c7160] mb-2">{svc.title}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[#5c7160]/70">{svc.duration}</span>
                      <span className="font-bold text-[#c0a080]">{svc.price}</span>
                    </div>
                    <ul className="space-y-1">
                      {svc.details.slice(0, 3).map((d, i) => <li key={i} className="text-[#5c7160]/80 text-sm">• {d}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedService && <ServiceModal service={selectedService} onClose={closeServiceModal} />}
    </div>
  )
}

export default Services;

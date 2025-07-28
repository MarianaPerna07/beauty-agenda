import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import scrollToTop from '../helpers/scrollToTop'

function Contact() {
  useEffect(() => {
    scrollToTop()
  }, [])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'Informação Geral'
  })
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Formulário enviado:', formData)
    
    setTimeout(() => {
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'Informação Geral'
      })
      
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 800)
  }
  
  const subjectOptions = [
    'Informação Geral',
    'Agendamento',
    'Preços',
    'Cancelamento',
    'Outros'
  ]

  return (
    <div className='min-h-screen bg-[#F5F1E9]'>
      <div className='relative'>
        <img 
          className='object-cover h-[50vh] w-full' 
          src='https://images.pexels.com/photos/3997378/pexels-photo-3997378.jpeg' 
          alt="Entre em contato conosco"
        />
        <div className='absolute inset-0 bg-gradient-to-b from-[#c0a080]/40 to-[#c0a080]/70'></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-[#F5F1E9] text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
            Fale Connosco
          </h2>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-16">
          <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,60 V30 C150,50 350,40 500,35 C650,30 750,25 900,30 C1050,35 1200,45 1200,45 V60 H0 Z" fill="#F5F1E9"/>
          </svg>
        </div>
      </div>
      
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl md:text-4xl font-light text-[#5c7160] mb-6">
            Como Podemos Ajudar?
          </h3>
          <p className="text-lg text-[#5c7160]/80">
            Estamos à sua disposição para responder às suas perguntas, agendar serviços ou fornecer informações adicionais.
            Entre em contacto connosco através do formulário abaixo ou pelos nossos contactos diretos.
          </p>
          
          <div className="w-32 h-0.5 mx-auto my-8 bg-gradient-to-r from-transparent via-[#c0a080] to-transparent"></div>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a5bf99] to-[#5c7160]"></div>
              
              <h4 className="text-2xl font-light text-[#5c7160] mb-6 relative inline-block">
                Contactos
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#a5bf99]"></span>
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#5c7160]/10 rounded-full p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#5c7160]/70 mb-1">Telefone</p>
                    <p className="text-lg text-[#5c7160]">+351 935 215 712</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#5c7160]/10 rounded-full p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#5c7160]/70 mb-1">Email</p>
                    <p className="text-lg text-[#5c7160]">info@yourmomentos.pt</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#5c7160]/10 rounded-full p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#5c7160]/70 mb-1">Morada</p>
                    <p className="text-lg text-[#5c7160]">Gafanha da Nazaré</p>
                    <p className="text-lg text-[#5c7160]">Aveiro</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#5c7160]/10 rounded-full p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#5c7160]/70 mb-1">Horário</p>
                    <p className="text-lg text-[#5c7160]">Segunda - Sábado: 9h - 19h</p>
                    <p className="text-lg text-[#5c7160]">Domingo: Fechado</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h5 className="text-lg font-medium text-[#5c7160] mb-4">Siga-nos</h5>
                <div className="flex space-x-4">
                  <a href="#" className="bg-[#5c7160]/10 hover:bg-[#5c7160] text-[#5c7160] hover:text-white transition-colors duration-300 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </a>
                  <a href="#" className="bg-[#5c7160]/10 hover:bg-[#5c7160] text-[#5c7160] hover:text-white transition-colors duration-300 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  {/* <a href="#" className="bg-[#5c7160]/10 hover:bg-[#5c7160] text-[#5c7160] hover:text-white transition-colors duration-300 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </a> */}
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden opacity-10">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100,0 C60,0 0,60 0,100 L100,100 L100,0 Z" fill="#5c7160" />
                </svg>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5c7160] to-[#a5bf99]"></div>
              
              <h4 className="text-2xl font-light text-[#5c7160] mb-6 relative inline-block">
                Envie-nos uma Mensagem
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#a5bf99]"></span>
              </h4>
              
              {isSubmitted ? (
                <div className="bg-[#a5bf99]/20 border border-[#a5bf99] text-[#5c7160] rounded-lg p-4 animate-fade-in">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mensagem enviada com sucesso! Entraremos em contacto brevemente.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm text-[#5c7160]/80 mb-1">Nome</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-[#5c7160]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/50 focus:border-[#a5bf99]"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm text-[#5c7160]/80 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-[#5c7160]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/50 focus:border-[#a5bf99]"
                        placeholder="Seu email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm text-[#5c7160]/80 mb-1">Telefone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-[#5c7160]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/50 focus:border-[#a5bf99]"
                        placeholder="Seu número de telefone"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm text-[#5c7160]/80 mb-1">Assunto</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-[#5c7160]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/50 focus:border-[#a5bf99] bg-white"
                      >
                        {subjectOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm text-[#5c7160]/80 mb-1">Mensagem</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 border border-[#5c7160]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5bf99]/50 focus:border-[#a5bf99]"
                      placeholder="Como podemos ajudar?"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#5c7160] hover:bg-[#5c7160]/90 text-white rounded-md transition-colors duration-300 flex items-center"
                    >
                      <span>Enviar Mensagem</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}
              
              <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden opacity-10">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100,0 C60,0 0,60 0,100 L100,100 L100,0 Z" fill="#a5bf99" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-12 overflow-hidden">
          <svg viewBox="0 0 1200 30" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 C150,40 350,0 500,20 C650,40 750,10 900,20 C1050,30 1200,10 1200,10 V30 H0 V0Z" fill="#5c7160" fillOpacity="0.05"/>
          </svg>
        </div>
        
        <div className="container mx-auto max-w-6xl mt-8">
          <h4 className="text-2xl font-light text-center text-[#5c7160] mb-8 relative inline-block">
            Nossa Localização
            <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#a5bf99]"></span>
          </h4>
          
          <div className="relative h-96 rounded-lg overflow-hidden shadow-lg border-4 border-white">
            <div className="absolute inset-0 bg-[#5c7160]/10 flex items-center justify-center">
              <p className="text-[#5c7160]">Mapa será carregado aqui</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden transform rotate-180">
          <svg viewBox="0 0 1200 30" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 C150,40 350,0 500,20 C650,40 750,10 900,20 C1050,30 1200,10 1200,10 V30 H0 V0Z" fill="#5c7160" fillOpacity="0.05"/>
          </svg>
        </div>
      </section>
      
      <section className="py-16 px-6 bg-gradient-to-br from-[#5c7160]/10 to-[#a5bf99]/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-2xl md:text-3xl font-light text-[#5c7160] mb-6">
            Pronta para marcar a sua consulta?
          </h3>
          <p className="text-lg text-[#5c7160]/80 mb-8">
            Estamos ansiosos para recebê-la e proporcionar uma experiência de beleza personalizada.
          </p>
          
          <Link 
            to="/reservations" 
            className="px-10 py-3 bg-[#5c7160] hover:bg-[#5c7160]/90 text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl inline-flex items-center"
          >
            <span className="mr-2">Marcar Agora</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Contact
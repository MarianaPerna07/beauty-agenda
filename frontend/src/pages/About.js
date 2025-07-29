import React, { useEffect } from 'react'
import scrollToTop from '../helpers/scrollToTop'
import bannerImage from '../images/banner-image.png'
import maria from '../images/maria.png'
import lara from '../images/lara.png'
import elas from '../images/elas_imagem_fake.png'

function About() {
  useEffect(() => {
    scrollToTop()
  },[])
  
  return (
    <div className='min-h-screen bg-[#F5F1E9]'>
      {/* Hero Section */}
      <div className='relative'>
        <img 
          className='object-cover h-[30vh] w-full' 
          src={bannerImage}
          alt="Ambiente acolhedor do Beauty Space"
        />
        <div className='absolute inset-0 bg-gradient-to-b from-[#c0a080]/40 to-[#c0a080]/70'></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-[#F5F1E9] text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
            Sobre Nós
          </h2>
        </div>
        
        {/* Wave shape at the bottom - Refinada */}
        <div className="absolute bottom-0 left-0 w-full h-16">
          <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,60 V30 C150,50 350,40 500,35 C650,30 750,25 900,30 C1050,35 1200,45 1200,45 V60 H0 Z" fill="#F5F1E9"/>
          </svg>
        </div>
      </div>
      
      {/* Nossa Equipe - Esteticistas Section */}
      <section className="py-16 md:py-20 px-6 ">
        <div className="container mx-auto">
          <h3 className="text-3xl md:text-4xl font-light text-center text-[#5c7160] mb-12 relative">
            A Nossa Equipa
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-[#a5bf99]"></span>
          </h3>
          
          {/* Primeira Esteticista */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-16">
            <div className="md:w-1/4">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={maria}
                  className="w-full h-auto object-cover aspect-[3/4]" 
                  alt="Maria Lúcia" 
                />
                <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
              </div>
              <div className="relative">
                <div className="absolute -bottom-2 -right-2 w-16 h-16 border border-[#a5bf99]/30 rounded-lg -z-10"></div>
              </div>
            </div>
            
            <div className="md:w-3/4 flex flex-col gap-4">
              <div>
                <h4 className="text-2xl font-light text-[#5c7160]">Maria Lúcia</h4>
                <p className="italic text-[#5c7160]/80">Esteticista Sênior</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <h5 className="text-lg font-medium text-[#5c7160]">Formação</h5>
                  <ul className="list-disc list-inside text-[#5c7160]/80 ml-2">
                    <li>Faculdade de Estética e Cosmetologia, Universidade de Lisboa</li>
                    <li>Especialização em Tratamentos Faciais Avançados</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-lg font-medium text-[#5c7160]">Certificações</h5>
                  <ul className="list-disc list-inside text-[#5c7160]/80 ml-2">
                    <li>Dermo-Cosmética Avançada</li>
                    <li>Microagulhamento</li>
                    <li>Terapias Anti-idade</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-lg font-light text-[#5c7160]">
                Maria traz mais de 10 anos de experiência no campo da estética. Apaixonada por cuidados com a pele, ela personaliza cada tratamento com base nas necessidades individuais de seus clientes. Nos momentos de lazer, aprecia a prática de yoga e a leitura sobre as mais recentes inovações em cuidados com a pele.
              </p>
              
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#c0a080] to-transparent my-2"></div>
            </div>
          </div>
          
          {/* Segunda Esteticista */}
          <div className="flex flex-col md:flex-row-reverse items-start justify-between gap-8">
            <div className="md:w-1/4">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={lara}
                  className="w-full h-auto object-cover aspect-[3/4]" 
                  alt="Lara Oliveira" 
                />
                <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
              </div>
              <div className="relative">
                <div className="absolute -bottom-2 -left-2 w-16 h-16 border border-[#c0a080]/30 rounded-lg -z-10"></div>
              </div>
            </div>
            
            <div className="md:w-3/4 flex flex-col gap-4">
              <div>
                <h4 className="text-2xl font-light text-[#5c7160]">Lara Oliveira</h4>
                <p className="italic text-[#5c7160]/80">Especialista em Manicure e Pedicure</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <h5 className="text-lg font-medium text-[#5c7160]">Formação</h5>
                  <ul className="list-disc list-inside text-[#5c7160]/80 ml-2">
                    <li>Instituto de Beleza e Bem-Estar de Portugal</li>
                    <li>Técnica Especializada em Nail Art</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-lg font-medium text-[#5c7160]">Certificações</h5>
                  <ul className="list-disc list-inside text-[#5c7160]/80 ml-2">
                    <li>Técnicas de Gel e Acrílico</li>
                    <li>Design de Unhas Artísticas</li>
                    <li>Cuidados com Unhas Problemáticas</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-lg font-light text-[#5c7160]">
                Lara transforma o cuidado com as unhas em verdadeiras obras de arte. Com um olhar atento aos detalhes e uma mão firme, ela cria designs exclusivos que expressam a personalidade de cada cliente. Entusiasta de arte contemporânea, Lara busca inspiração em exposições e na natureza para suas criações.
              </p>
              
              
            </div>
          </div>
        </div>
      </section>
      
      {/* Valores Section */}
      <section className="py-16 md:py-24 px-6 bg-[#f3f3eb]">
        <div className="container mx-auto">
          <h3 className="text-3xl md:text-4xl font-light text-center text-[#415140] mb-12 relative">
            Os nossos valores
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-[#a5bf99]"></span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-md p-8 transition-transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-[#a5bf99]/20 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h4 className="text-xl font-medium text-center text-[#415140] mb-4">Excelência</h4>
              <p className="text-[#415140]/80 text-center">
                Entregamos serviços de elevada qualidade, com rigor e atenção a cada pormenor, para realçar a sua verdadeira beleza.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 transition-transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-[#a5bf99]/20 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-medium text-center text-[#415140] mb-4">Cuidado</h4>
              <p className="text-[#415140]/80 text-center">
                Tratamos cada cliente como único, ouvindo atentamente e adaptando cada tratamento às suas necessidades pessoais.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 transition-transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-[#a5bf99]/20 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5c7160]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-medium text-center text-[#415140] mb-4">Bem-estar</h4>
              <p className="text-[#415140]/80 text-center">
                Acreditamos que a verdadeira beleza nasce do equilíbrio interior. Promovemos o seu bem-estar para um resultado harmonioso.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
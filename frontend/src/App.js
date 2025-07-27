import VideoBanner from "./components/VideoBanner";
import ImageCarousel from "./components/ImageCarousel";
import { useEffect } from "react";
import scrollToTop from "./helpers/scrollToTop";
import { Link } from "react-router-dom";

function App() {
  useEffect(() => {
    scrollToTop()
  },[])
  
  return (
    <div className="relative bg-[#F5F1E9]">
      {/* Hero Banner */}
      <VideoBanner />
      
      {/* Welcome Section */}
      <section className="py-12 px-6">
        <h2 className="text-center font-light text-4xl md:text-5xl lg:text-6xl text-[#5c7160] mb-3">
          Your Moments Estética
        </h2>
        <p className="italic text-center text-lg md:text-xl text-[#5c7160]/80 max-w-3xl mx-auto">
          Um refúgio onde beleza e bem-estar se encontram para criar momentos de autocuidado memoráveis.
        </p>
        
        {/* Decorative divider */}
        <div className="w-32 h-0.5 mx-auto my-8 bg-gradient-to-r from-transparent via-[#c0a080] to-transparent"></div>
      </section>
      
      {/* Services Carousel */}
      <section className="py-4">
        <ImageCarousel />
      </section>
      
      {/* About Us Section */}
      <section className="py-16 px-6 relative bg-gradient-to-b from-[#F5F1E9] to-[#f3f3eb]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-12 overflow-hidden">
          <svg viewBox="0 0 1200 30" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full transform rotate-180">
            <path d="M0,0 C150,40 350,0 500,20 C650,40 750,10 900,20 C1050,30 1200,10 1200,10 V30 H0 V0Z" fill="#a5bf99" fillOpacity="0.15"/>
          </svg>
        </div>
        
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Text content */}
          <div className="flex flex-col gap-6 md:w-1/2 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-light text-[#5c7160] relative">
              Quem Somos
              <span className="absolute -bottom-2 left-0 md:w-24 h-0.5 bg-[#a5bf99] hidden md:block"></span>
            </h3>
            <p className="italic text-[#5c7160]/80">Lisboa | Desde 2023</p>
            <p className="text-lg font-light text-[#5c7160]">
              O seu destino para serviços de beleza e bem-estar de alto nível no coração de Lisboa. Estabelecidos com paixão pela arte da beleza e comprometidos com nossa comunidade, dedicamo-nos a proporcionar uma experiência excepcional que a deixará radiante por dentro e por fora.
            </p>
            <p className="text-lg font-light text-[#5c7160]">
              Nossa equipe de profissionais experientes e qualificados é o alicerce do nosso sucesso. Temos orgulho de nossos talentos diversos, cada um comprometido em oferecer o mais alto nível de serviço personalizado.
            </p>
            
            <Link to="/services" className="self-center md:self-start mt-4 relative group inline-flex items-center">
              <span className="text-[#5c7160] group-hover:text-[#a3ba93] transition-colors">Conheça os nossos serviços</span>
              <span className="ml-2 transform translate-x-0 group-hover:translate-x-2 transition-transform">→</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a5bf99] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          
          {/* Image */}
          <div className="md:w-1/3 relative">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.pexels.com/photos/3738348/pexels-photo-3738348.jpeg" 
                alt="Your Moments Estética" 
                className="w-full h-auto object-cover" 
              />
              <div className="absolute inset-0 border border-white/20 rounded-lg"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[#a5bf99]/30 rounded-lg -z-10"></div>
            <div className="absolute -top-4 -left-4 w-20 h-20 border border-[#c0a080]/30 rounded-lg -z-10"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

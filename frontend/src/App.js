import VideoBanner from "./components/VideoBanner";
import ImageCarousel from "./components/ImageCarousel";
import { useEffect } from "react";
import scrollToTop from "./helpers/scrollToTop";
import { Link } from "react-router-dom";
import './css/embla.css'
import ImagemAboutUs from "./components/images/elas_imagem_fake.png";

const OPTIONS = { loop: true }
const SLIDE_COUNT = 6 // Number of slides in the carousel
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

// Define your 6 service slides here:
const services = [
  {
    src: 'https://p2.trrsf.com/image/fget/cf/1200/900/middle/images.terra.com/2023/11/27/245499322-mitos-verdades-micropigmentacao.jpg',
    alt: 'Micropigmentação',
    title: 'Micropigmentação',
    caption: 'Traços leves, resultados duradouros',
    price: '180€'
  },
  {
    src: 'https://altoastral.joaobidu.com.br/wp-content/uploads/2023/03/o-que-e-micropigmentacao-labial.jpg',
    alt: 'Micropigmentação Labial',
    title: 'Micropigmentação Labial',
    caption: 'O detalhe que faz a diferença',
    price: '240€'
  },
  {
    src: 'https://static.wixstatic.com/media/186ea16b01a346a086fe3e396511f97e.jpg/v1/fill/w_480,h_335,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/186ea16b01a346a086fe3e396511f97e.jpg',
    alt: 'Microblading',
    title: 'Microblading',
    caption: 'Beleza moldada fio a fio',
    price: '180€'
  },
  {
    src: 'https://img.freepik.com/fotos-premium/esteticista-do-conceito-de-micropigmentacao-fazendo-procedimento-de-delineador-de-maquiagem-permanente-para-jovem_116547-72228.jpg',
    alt: 'Eyeliner',
    title: 'Eyeliner',
    caption: 'Perfeito todos os dias, sem esforço',
    price: '100€'
  },
  {
    src: 'https://skinboutique.pt/wp-content/uploads/2025/01/67_microneedling.jpg',
    alt: 'Microagulhamento',
    title: 'Microagulhamento',
    caption: 'Revitaliza a tua pele, revela a tua beleza',
    price: 'Sob consulta'
  },
  {
    src: 'https://www.gioesteticaavancada.com.br/wp-content/uploads/2022/05/post_thumbnail-a44bae8ed55e240b125f5bda1802430d.jpeg',
    alt: 'Depilação a Laser',
    title: 'Depilação a Laser',
    caption: 'Diz adeus aos pelos de vez!',
    price: 'Sob consulta'
  }
];

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
      </section>

      {/* Decorative divider */}
      <div className="w-64 h-0.5 mx-auto my-2 bg-gradient-to-r from-transparent via-[#c0a080] to-transparent"></div>
      
      {/* Services Carousel */}
      <section className="py-12">
        <h3 className="text-3xl md:text-4xl font-light text-center text-[#5c7160] mb-6">
          Destaques
          {/* <span className="block w-24 h-0.5 bg-[#a5bf99] mx-auto mt-2"></span> */}
        </h3>
        <ImageCarousel slides={services} options={OPTIONS}/>
      </section>

      {/* Decorative divider */}
      <div className="w-64 h-0.5 mx-auto my-2 bg-gradient-to-r from-transparent via-[#c0a080] to-transparent"></div>
      
      {/* About Us Section */}
      <section className="py-12 relative bg-[#f5f1e9]">
        {/* Decorative SVG Top Element */}
        <div className="absolute top-0 left-0 w-full h-12 overflow-hidden">
          <svg viewBox="0 0 1200 30" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full transform rotate-180">
            <path d="M0,0 C150,40 350,0 500,20 C650,40 750,10 900,20 C1050,30 1200,10 1200,10 V30 H0 V0Z" fill="#a5bf99" fillOpacity="0.15"/>
          </svg>
        </div>

        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12 px-6">
          {/* Text content */}
          <div className="flex flex-col gap-6 md:w-1/2 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-light text-[#5c7160] relative">
              Quem Somos
              <span className="absolute -bottom-2 left-0 md:w-24 h-0.5 bg-[#a5bf99] hidden md:block"></span>
            </h3>
            <p className="italic text-[#5c7160]/80">Your Moments</p>
            <div className="text-lg font-light text-[#5c7160] space-y-4">
              <p>
                Somos mãe e filha, unidas não só por laços familiares, mas também pela paixão partilhada pela estética e pelo bem-estar. A <strong>Your Moments</strong> nasceu desse amor comum pela arte de cuidar, pelo detalhe, e sobretudo, pelo brio em fazer bem feito.
              </p>
              <p>
                Com uma dedicação profunda à excelência, investimos constantemente na nossa formação e contamos com certificações especializadas nas áreas em que atuamos. Trabalhamos exclusivamente com produtos de qualidade, devidamente certificados pela União Europeia, garantindo segurança, eficácia e respeito pela saúde de cada cliente.
              </p>
              <p>
                Estamos muito entusiasmadas com o futuro. Acreditamos que a estética vai muito além da aparência — é também sobre confiança, autoestima e momentos de cuidado pessoal. Por isso, estamos também a apostar no crescimento digital da <strong>Your Moments</strong>, para que os nossos serviços cheguem a ainda mais pessoas, com a mesma atenção e carinho que oferecemos em cada atendimento presencial.
              </p>
              <p>
                Mais do que um espaço de beleza, a <strong>Your Moments</strong> é um projeto de vida. É o reflexo da nossa dedicação, da nossa paixão, e da vontade sincera de proporcionar experiências verdadeiramente especiais.
              </p>
            </div>

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
                src={ImagemAboutUs}
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

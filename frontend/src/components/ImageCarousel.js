import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./carousel-custom.css";

function ImageCarousel(props) {  
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1
    }
  };
  
  // Serviços em destaque
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
  
  return (
    <div className="carousel-container-wrapper">
      {/* Decorative elements */}
      <div className="carousel-decorative-top">
        <div className="carousel-wave"></div>
        <div className="carousel-gold-accent"></div>
      </div>
      
      <div className="carousel-content-wrapper">
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={true}
          responsive={responsive}
          ssr={false}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={4000}
          keyBoardControl={true}
          customTransition="all 500ms ease"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["mobile"]}
          deviceType={props?.deviceType}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item"
        >
          {services.map((service, index) => (
            <div key={index} className="carousel-image-container">
              <div className="carousel-image-wrapper">
                <img 
                  src={service.src} 
                  alt={service.alt}
                  className="carousel-image" 
                />
                <div className="carousel-overlay">
                  <h3 className="carousel-title">{service.title}</h3>
                  <p className="carousel-caption">{service.caption}</p>
                  <div className="carousel-price">{service.price}</div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      
      <div className="carousel-decorative-bottom">
        <div className="carousel-gold-accent"></div>
      </div>
    </div>
  )
}

export default ImageCarousel
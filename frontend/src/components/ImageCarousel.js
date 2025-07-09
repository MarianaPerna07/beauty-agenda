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
  
  // Beautiful spa & beauty images
  const images = [
    {
      src: 'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg',
      alt: 'Spa Treatment',
      caption: 'Relaxing Treatments'
    },
    {
      src: 'https://images.pexels.com/photos/3865557/pexels-photo-3865557.jpeg',
      alt: 'Facial Treatment',
      caption: 'Revitalizing Care'
    },
    {
      src: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg',
      alt: 'Beauty Products',
      caption: 'Premium Products'
    },
    {
      src: 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg',
      alt: 'Nail Treatment',
      caption: 'Professional Manicures'
    },
    {
      src: 'https://images.pexels.com/photos/3738348/pexels-photo-3738348.jpeg',
      alt: 'Massage Therapy',
      caption: 'Therapeutic Massages'
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
          {images.map((image, index) => (
            <div key={index} className="carousel-image-container">
              <div className="carousel-image-wrapper">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="carousel-image" 
                />
                <div className="carousel-caption-wrapper">
                  <p className="carousel-caption handwriting">{image.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      
      {/* Decorative elements */}
      <div className="carousel-decorative-bottom">
        <div className="carousel-gold-accent"></div>
      </div>
    </div>
  )
}

export default ImageCarousel
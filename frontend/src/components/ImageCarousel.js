import React, { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import './carousel-custom.css';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'

const TWEEN_FACTOR_BASE = 0.84

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max)

const ImageCarousel = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const tweenFactor = useRef(0)
  const navigate = useNavigate()

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  // Função atualizada para lidar com categorias diferentes
  const handleSlideClick = (serviceTitle) => {
    // Mapeia serviços específicos para suas categorias apropriadas
    let category = 'destaques';
    
    // Verifica o título do serviço para determinar a categoria correta
    if (serviceTitle === 'Depilação a Laser') {
      category = 'depilacao_laser'; 
    }
    
    // Navega para a página de serviços com a categoria correta
    navigate(`/services?category=${category}&service=${encodeURIComponent(serviceTitle)}`);
  }

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenOpacity = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
        const opacity = numberWithinRange(tweenValue, 0, 1).toString()
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity
      })
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setTweenFactor(emblaApi)
    tweenOpacity(emblaApi)
    emblaApi
      .on('reInit', setTweenFactor)
      .on('reInit', tweenOpacity)
      .on('scroll', tweenOpacity)
      .on('slideFocus', tweenOpacity)
  }, [emblaApi, tweenOpacity])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
        {slides.map((slide, idx) => (
            <div 
              className="embla__slide cursor-pointer select-none"
              key={idx}
              onClick={() => handleSlideClick(slide.title)}
              style={{ userSelect: 'none', outline: 'none', border: 'none' }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <img
                className="embla__slide__img"
                src={slide.src}
                alt={slide.alt}
                draggable={false}
              />
              {/* overlay or caption container */}
              <div className="mt-2 text-center">
                <h3 className="text-lg font-medium text-[#5c7160]">
                  {slide.title}
                </h3>
                <p className="text-sm italic text-[#5c7160]/80">
                  {slide.caption}
                </p>
                <span className="block font-semibold text-[#c0a080] mt-1 text-xl">
                  {slide.price}
                </span>
              </div>
              
              {/* Botão "Ver mais" opcional
              <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="bg-[#5c7160]/80 text-white px-4 py-2 rounded-full text-sm">
                  Ver detalhes
                </span>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* <div className="embla__controls"> */}
        {/* <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div> */}

        {/* <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div> */}
      {/* </div> */}
    </div>
  )
}

export default ImageCarousel

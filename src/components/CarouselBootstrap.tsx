import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface ImageItem {
  src: string;
  alt?: string;
  caption?: {
    title?: string;
    description?: string;
  };
}

interface CarouselBootstrapProps {
  images: ImageItem[];
  interval?: number;
  pause?: "hover" | false;
  fade?: boolean;
}

const CarouselBootstrap: React.FC<CarouselBootstrapProps> = ({
  images,
  interval = 5000,
  pause = "hover",
  fade = true,
}) => {
  const [index, setIndex] = useState<number>(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  // Estilos para el texto con borde negro
  const captionStyle = {
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
    padding: '20px',
    width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center' as const
  };

  const titleStyle = {
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    fontWeight: 'bold' as const,
    fontSize: '1.8rem'
  };

  const descriptionStyle = {
    color: 'white',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
    fontSize: '1.2rem'
  };

  return (
    <div style={{ position: 'relative' }}>
      <Carousel 
        activeIndex={index} 
        onSelect={handleSelect} 
        interval={interval} 
        pause={pause}
        fade={fade}
        prevIcon={
          <span 
            aria-hidden="true" 
            style={{
              color: 'white',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
              fontSize: '3rem',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            ‹
          </span>
        }
        nextIcon={
          <span 
            aria-hidden="true" 
            style={{
              color: 'white',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
              fontSize: '3rem',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            ›
          </span>
        }
      >
        {images.map((img, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={img.src}
              alt={img.alt || `Slide ${idx + 1}`}
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
            {img.caption && (
              <Carousel.Caption style={captionStyle}>
                {img.caption.title && (
                  <h3 style={titleStyle}>
                    {img.caption.title}
                  </h3>
                )}
                {img.caption.description && (
                  <p style={descriptionStyle}>
                    {img.caption.description}
                  </p>
                )}
              </Carousel.Caption>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselBootstrap;
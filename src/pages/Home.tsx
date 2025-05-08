import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import CarouselBootstrap from "../components/CarouselBootstrap";

const Home: React.FC = () => {
  // Datos para el carrusel
  const carouselImagesHardware = [
    {
      src: "https://ftecnologica.udistrital.edu.co/laboratorios/ciencias-basicas/sites/lab-ciencias-basicas/files/imagenes-laboratorios/2022-12/Fisica%20Moderna%20%281%29.jpg",
      alt: "Equipo de Fisica",
      caption: {
        title: "Equipo de Fisica",
        description: "Reserva los mejores equipos para tus prácticas",
      },
    },
    {
      src: "https://ftecnologica.udistrital.edu.co/laboratorios/electricidad/sites/lab-tec-electricidad/files/imagenes-laboratorios/2022-10/IMG_9445.JPG",
      alt: "Equipo de Electronica",
      caption: {
        title: "Equipo de Electronica",
        description: "Reserva los mejores equipos para tus prácticas",
      },
    },
    {
      src: "https://ftecnologica.udistrital.edu.co/laboratorios/sistemas/sites/lab-sistemas/files/imagen-principal-equipo/2023-03/video%20beam%20epson_2.png",
      alt: "Equipos de apoyo para clases",
      caption: {
        title: "Equipos de apoyo para clases",
        description: "Accede a los recursos tecnológicos de apoyo que necesites",
      },
    },
    {
      src: "https://uefi.udistrital.edu.co/static/img/DSC_0025-min_1_icYoJCB.jpg",
      alt: "Portatiles",
      caption: {
        title: "Portatiles",
        description: "Accede a los recursos tecnológicos que necesites",
      },
    },
  ];

  const carouselImagesEspaciosFisicos = [
    {
      src: "https://ftecnologica.udistrital.edu.co/laboratorios/electronica/sites/lab-electronica/files/imagen-principal-laboratorio/2023-03/LAB1_1.jpeg",
      alt: "Laboratorios",
      caption: {
        title: "Laboratorio",
        description: "Reserva los salones de laboratorio tanto de fisica, electronica y de sistemas para tus practicas",
      },
    },
    {
      src: "https://agencia.udistrital.edu.co/sites/agencia/files/imagen-noticias/2022-03/j%C3%B3venes%20a%20la%20u.jpg",
      alt: "Salones",
      caption: {
        title: "Salones ",
        description: "Auditorios, salones y áreas deportivas disponibles",
      },
    },
    {
      src: "https://pbs.twimg.com/media/Di9WPMlWsAUfTP-.jpg:large",
      alt: "Auditorios",
      caption: {
        title: "Auditorios",
        description: "Accede a los auditorios para realizar la actividad academica de tu preferencia",
      },
    },
    {
      src: "https://fciencias.udistrital.edu.co/lic-lenguas/sites/lic-lenguas/files/imagenes-editor/yuyjjyyu.jpg",
      alt: "Areas deportivas",
      caption: {
        title: "Areas deportivas",
        description: "Canchas polideportivas, accesorios deportivos, etc.",
      },
    }
  ];

  return (
    <Container className="mt-4">
      <Row className="mb-5">
        <Col md={12} className="text-center mb-4">
          <h2>Bienvenido a IntegraServiciosUD</h2>
        </Col>

        <Col md={8}>
          <p>
            IntegraServicios es una plataforma diseñada para el préstamo de
            recursos dentro de un establecimiento universitario. Los usuarios
            pueden reservar distintos tipos de recursos, como equipos de
            laboratorio, hardware tecnológico y espacios físicos como
            auditorios, salones y canchas deportivas, todo de manera sencilla y
            eficiente. Con la posibilidad de reservar múltiples recursos al
            mismo tiempo, el sistema facilita la gestión de los espacios y
            equipos disponibles para estudiantes, profesores y personal
            administrativo.
          </p>
          <p>
            Los recursos son gestionados por las unidades correspondientes,
            quienes definen los horarios de disponibilidad, las características
            de los recursos y las reglas de préstamo. ¡Descubre los recursos que
            puedes reservar y mejora tu experiencia académica con
            IntegraServicios!
          </p>
        </Col>
        <Col md={4}>
          <img
            src="https://agencia.udistrital.edu.co/sites/agencia/files/imagen-noticias/2022-03/Ingenieria%20pagweb.jpg"
            alt="Instalaciones universitarias"
            className="img-fluid rounded shadow"
          />
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col md={12} className="text-center mb-4">
          <h2>Hardware</h2>
        </Col>
        <Col md={{ span: 10, offset: 1 }}>
          <CarouselBootstrap
            images={carouselImagesHardware}
            interval={4000}
            fade={true}
          />
        </Col>
      </Row>
      <Row className="mb-5">
        <Col md={12} className="text-center mb-4">
          <h2>Espacios Fisicos</h2>
        </Col>
        <Col md={{ span: 10, offset: 1 }}>
          <CarouselBootstrap
            images={carouselImagesEspaciosFisicos}
            interval={4000}
            fade={true}
          />
        </Col>
      </Row>
      {/* Otras secciones pueden ir aquí */}
    </Container>
  );
};

export default Home;

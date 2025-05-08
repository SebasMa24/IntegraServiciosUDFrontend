import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          {/* Columna 1: Información Universidad */}
          <Col md={4} className="mb-4">
            <h5>Universidad Distrital Francisco José de Caldas</h5>
            <p>
              Institución de Educación Superior pública y autónoma, comprometida con la excelencia académica y la formación integral.
            </p>
            <p>
              <i className="bi bi-geo-alt-fill me-2"></i>
              Sede Principal: Carrera 7 No. 40B - 53, Bogotá D.C.
            </p>
            <p>
              <i className="bi bi-building me-2"></i>
              Institución de Educación Superior sujeta a inspección y vigilancia por el Ministerio de Educación Nacional
            </p>
          </Col>

          {/* Columna 2: Links rápidos */}
          <Col md={4} className="mb-4">
            <h5>Enlaces rápidos</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="https://www.udistrital.edu.co/" className="text-white text-decoration-none">
                  Página principal
                </a>
              </li>
              <li className="mb-2">
                <a href="https://www.udistrital.edu.co/admisiones" className="text-white text-decoration-none">
                  Admisiones
                </a>
              </li>
              <li className="mb-2">
                <a href="https://www.udistrital.edu.co/academia" className="text-white text-decoration-none">
                  Academia
                </a>
              </li>
              <li className="mb-2">
                <a href="https://www.udistrital.edu.co/investigacion" className="text-white text-decoration-none">
                  Investigación
                </a>
              </li>
              <li className="mb-2">
                <a href="https://www.udistrital.edu.co/extencion" className="text-white text-decoration-none">
                  Extensión
                </a>
              </li>
            </ul>
          </Col>

          {/* Columna 3: Contacto */}
          <Col md={4} className="mb-4">
            <h5>Contacto</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-telephone-fill me-2"></i>
                PBX: (601) 3239300
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>
                <a href="mailto:contactenos@udistrital.edu.co" className="text-white text-decoration-none">
                  contactenos@udistrital.edu.co
                </a>
              </li>
              <li className="mb-2">
                <i className="bi bi-globe me-2"></i>
                <a href="https://www.udistrital.edu.co" className="text-white text-decoration-none">
                  www.udistrital.edu.co
                </a>
              </li>
              <li className="mb-2">
                <i className="bi bi-clock-fill me-2"></i>
                Horario de atención: Lunes a viernes 8:00 a.m. - 5:00 p.m.
              </li>
            </ul>
          </Col>
        </Row>

        {/* Redes sociales */}
        <Row className="mt-3">
          <Col className="text-center">
            <a href="https://www.facebook.com/UniversidadDistrital" className="mx-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
                alt="Facebook" 
                style={{ width: '40px', height: '40px' }}
              />
            </a>
            <a href="https://twitter.com/UniversidadDist" className="mx-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" 
                alt="Twitter" 
                style={{ width: '40px', height: '40px' }}
              />
            </a>
            <a href="https://www.instagram.com/universidaddistrital/" className="mx-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" 
                alt="Instagram" 
                style={{ width: '40px', height: '40px' }}
              />
            </a>
            <a href="https://www.youtube.com/user/udistritaltv" className="mx-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" 
                alt="YouTube" 
                style={{ width: '40px', height: '40px' }}
              />
            </a>
          </Col>
        </Row>

        {/* Derechos de autor */}
        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Universidad Distrital Francisco José de Caldas. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
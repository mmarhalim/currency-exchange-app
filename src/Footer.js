import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Footer.css';


const Footer = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-between">
            <div>Project built by Mohamad Marhalim as part of <a href="www.altcademy.com">Altcademy</a></div>
            <div>
              <span class="badge rounded-pill bg-secondary"><a className='social-links' href="https://github.com/mmarhalim">GitHub</a></span>
              <span> </span>
              <span class="badge rounded-pill bg-secondary"><a className='social-links' href="https://www.linkedin.com/in/mohamadmarhalim/">LinkedIn</a></span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Footer;



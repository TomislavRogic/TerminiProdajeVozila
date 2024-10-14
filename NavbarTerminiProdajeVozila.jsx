import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';



export default function NavbarTerminiProdajeVozila() {

    const navigate=useNavigate(); // u pravilu; ne treba
   
  return (
  <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand className= 'ruka'
        onClick={()=>navigate(RouteNames.HOME)}
        >TerminiProdajeVozila APP</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="https://tomislavrogic-001-site1.ftempurl.com/swagger/index.html"
            target='_blank'>Swagger</Nav.Link>
           
            <NavDropdown title="TerminiProdajeVozila" id="basic-nav-dropdown">
              <NavDropdown.Item 
              onClick={()=>navigate(RouteNames.OSOBA_PREGLED)}
              >Osobe</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>navigate(RouteNames.VOZILA_PREGLED)}>
                Vozila
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Termini</NavDropdown.Item>
             
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
 </>
  )
}
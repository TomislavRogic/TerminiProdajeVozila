import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import VozilaService from "../../services/VozilaService";


export default function VozilaDodaj() {
    const navigate = useNavigate();

    async function dodaj(e) {
        const odgovor = await VozilaService.dodaj(e);
        if(odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }

        navigate(RouteNames.VOZILA_PREGLED);

    }

    function obradiSubmit(e){
        e.preventDefault();

        const podaci = new FormData(e.target);

        dodaj({
            marka: podaci.get('marka'),
            opisvozila: podaci.get('opisvozila'),
            cijena: podaci.get('cijena'),
            
        });
    }

    return(
        <>
        Dodavanje novog vozila

        <Form onSubmit={obradiSubmit}>
            <Form.Group controlId="marka">
                <Form.Label>Marka</Form.Label>
                <Form.Control type="text" name="marka" required />
            </Form.Group>

            <Form.Group controlId="opisvozila">
                <Form.Label>Opis vozila</Form.Label>
                <Form.Control type="text" name="opisvozila" required />
            </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" name="cijena" required />
            </Form.Group>

           <hr/>
           <Row>
           <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                    <Link to={RouteNames.VOZILA_PREGLED}
                    className="btn btn-danger siroko">
                    Odustani
                    </Link>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                    <Button variant="success" type="submit" className="siroko">Dodaj novo vozilo</Button>
                    </Col>
           </Row>
        </Form>

        
        
        </>
    )
}

import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import VozilaService from "../../services/VozilaService";
import { useEffect, useState } from "react";

export default function VozilaPromjena() {
    const navigate = useNavigate();
    const routeParams = useParams();
    const [vozilo, setVozilo] = useState({});

    async function dohvatiVozilo() {
        const odgovor = await VozilaService.getBySifra(routeParams.sifravozila);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        setVozilo(odgovor.poruka);
    }

    useEffect(() => {
        dohvatiVozilo();
    }, []);

    async function promjena(e) {
        const odgovor = await VozilaService.promjena(routeParams.sifravozila, e);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.VOZILA_PREGLED);
    }

    function obradiSubmit(e) { 
        e.preventDefault();
        const podaci = new FormData(e.target);
        promjena({
            marka: podaci.get('marka'),
            opisvozila: podaci.get('opisvozila'),
            cijena: podaci.get('cijena')
        });
    }

    return (
        <>
            <>Promjena Vozila</>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="marka">
                    <Form.Label>Marka</Form.Label>
                    <Form.Control type="text" name="marka" required defaultValue={vozilo.marka} />
                </Form.Group>
                <Form.Group controlId="opisvozila">
                    <Form.Label>Opis Vozila</Form.Label>
                    <Form.Control type="text" name="opisvozila" required defaultValue={vozilo.opisvozila} />
                </Form.Group>
                <Form.Group controlId="cijena">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control type="text" name="cijena" required defaultValue={vozilo.cijena} />
                </Form.Group>
                <hr />
                <Row>
                    <Col xs={6}>
                        <Link to={RouteNames.VOZILA_PREGLED} className="btn btn-danger siroko">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={6}>
                        <Button variant="primary" type="submit" className="siroko">
                            Promjeni vozilo
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

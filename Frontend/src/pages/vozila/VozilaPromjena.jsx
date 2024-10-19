import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import TerminiService from "../../services/TerminiService";
import { useEffect, useState } from "react";

export default function TerminiPromjena() {
    const navigate = useNavigate();
    const routeParams = useParams();
    const [termin, setTermin] = useState({});
    const [error, setError] = useState(null); // State for storing error messages

    async function dohvatiTermin() {
        try {
            const odgovor = await TerminiService.getBySifra(routeParams.sifratermina);
            if (odgovor.greska) {
                throw new Error(odgovor.poruka);
            }
            setTermin(odgovor.poruka);
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        dohvatiTermin();
    }, []);

    async function promjena(podaci) {
        try {
            const odgovor = await TerminiService.promjena(routeParams.sifratermina, podaci);
            if (odgovor.greska) {
                throw new Error(odgovor.poruka);
            }
            navigate(RouteNames.TERMINI_PREGLED);
        } catch (err) {
            setError(err.message);
        }
    }

    function obradiSubmit(e) { 
        e.preventDefault();
        const podaci = new FormData(e.target);
        promjena({
            Marka: podaci.get('marka'),
            Opisvozila: podaci.get('opisvozila'),
            Cijena: parseFloat(podaci.get('cijena'))
        });
    }

    return (
        <>
            <h2>Promjena Termina</h2>
            {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="marka">
                    <Form.Label>Marka</Form.Label>
                    <Form.Control type="text" name="marka" required defaultValue={termin.Marka} />
                </Form.Group>
                <Form.Group controlId="opisvozila">
                    <Form.Label>Opis Vozila</Form.Label>
                    <Form.Control type="text" name="opisvozila" required defaultValue={termin.Opisvozila} />
                </Form.Group>
                <Form.Group controlId="cijena">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control type="number" step="0.01" name="cijena" required defaultValue={termin.Cijena} />
                </Form.Group>
                <hr />
                <Row>
                    <Col xs={6}>
                        <Link to={RouteNames.TERMINI_PREGLED} className="btn btn-danger siroko">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={6}>
                        <Button variant="primary" type="submit" className="siroko">
                            Promjeni termin
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
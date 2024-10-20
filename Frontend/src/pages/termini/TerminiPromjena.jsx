import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Service from "../../services/TerminiService";
import { RouteNames } from "../../constants";
import VozilaService from "../../services/VozilaService";
import moment from "moment";

export default function TerminiPromjena() {
    const navigate = useNavigate();
    const routeParams = useParams();

    const [vozilo, setVozila] = useState([]);
    const [termin, setTermin] = useState({});

    async function dohvatiVozila() {
        const odgovor = await VozilaService.get();
        setVozila(odgovor.poruka);
    }

    async function dohvatiTermin() {
        const odgovor = await Service.getBySifra(routeParams.sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        let termin = odgovor.poruka;
        setTermin(termin);
    }

    async function dohvatiInicialnePodatke() {
        await dohvatiVozila();
        await dohvatiTermin();
    }

    useEffect(() => {
        dohvatiInicialnePodatke();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function promjena(podaci) {
        const odgovor = await Service.promjena(routeParams.sifratermina, podaci);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.TERMINI_PREGLED);
    }

    function obradiSubmit(e) {
        e.preventDefault();

        const podaci = new FormData(e.target);
        promjena({
            sifravozila: parseInt(podaci.get('sifravozila')),
            sifraosoba: parseInt(podaci.get('sifraosoba')),
            vrijemetermina: moment.utc(podaci.get('vrijemetermina'))
        });
    }

    return (
        <>
            <h2>Mjenjanje podataka termina</h2>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="sifravozila">
                    <Form.Label>Sifra Vozila</Form.Label>
                    <Form.Control type="select" name="sifravozila" required defaultValue={termin.sifravozila} />
                </Form.Group>
                <Form.Group controlId="osobaIme">
                    <Form.Label>Sifra osobe</Form.Label>
                    <Form.Control type="select" name="sifraosoba" required defaultValue={termin.sifraosoba} />
                </Form.Group>
                <Form.Group controlId="vrijemetermina">
                    <Form.Label>Datum termina</Form.Label>
                    <Form.Control type="date" name="vrijemetermina" required defaultValue={termin.vrijemetermina} />
                </Form.Group>
                <hr />
                <Row>
                    <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
                        <Link to={RouteNames.TERMINI_PREGLED} className="btn btn-danger siroko">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
                        <Button variant="primary" type="submit" className="siroko">
                            Promjeni termin
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
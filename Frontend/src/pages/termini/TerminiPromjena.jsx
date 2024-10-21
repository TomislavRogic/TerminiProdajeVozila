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

    const [vozila, setVozila] = useState([]); 
    const [osobe, setOsobe] = useState([]); 
    const [termin, setTermin] = useState({});

    async function dohvatiVozila() {
        const odgovor = await VozilaService.get();
        setVozila(odgovor.poruka);
    }

    async function dohvatiOsobe() {
        const odgovor = await OsobeService.get();
        console.log(odgovor.poruka); // Dodano za provjeru strukture podataka
        setOsobe(odgovor.poruka);
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
        await dohvatiOsobe();
        await dohvatiTermin();
    }

    useEffect(() => {
        dohvatiInicialnePodatke();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function promjena(e) {
        const odgovor = await Service.promjena(routeParams.sifratermina, e);
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
            Vozila: parseInt(podaci.get('sifravozila')),
            Osobe: parseInt(podaci.get('sifraosoba')),
            Vrijemetermina: podaci.get('vrijemetermina')
        });
    }

    return (
        <>
            <h2>Mjenjanje podataka termina</h2>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="sifravozila">
                    <Form.Label>Vozilo</Form.Label>
                    <Form.Control as="select" name="sifravozila" required defaultValue={termin.Vozila}>
    {vozila.map((vozilo) => (
        <option key={vozilo.sifravozila} value={vozilo.sifravozila}>
           {vozilo.marka}/ {vozilo.opisvozila}
        </option>
    ))}
</Form.Control>
                </Form.Group>
                <Form.Group controlId="sifraosoba">
                    <Form.Label>Osoba</Form.Label>
                    <Form.Control as="select" name="sifraosoba" required defaultValue={termin.Osobe}>
    {osobe.map((osoba) => (
        <option key={osoba.sifraosoba} value={osoba.sifraosoba}>
            {osoba.sifraosoba} 
        </option>
    ))}
</Form.Control>
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
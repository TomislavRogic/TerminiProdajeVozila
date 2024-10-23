import { Button, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import TerminiService from "../../services/TerminiService";
import VozilaService from "../../services/VozilaService";
import OsobaService from "../../services/OsobaService";

export default function TerminiPromjena() {
    const [termin, setTermin] = useState({});
    const [vozila, setVozila] = useState([]);
    const [osobe, setOsobe] = useState([]);
    const [sifravozila, setVoziloSifra] = useState('');
    const [sifraosoba, setOsobaSifra] = useState('');
    const navigate = useNavigate();
    const routeParams = useParams();

    useEffect(() => {
        console.log('Dohvaćanje termina s šifrom:', routeParams.sifratermina);
        const dohvatiPodatke = async () => {
            try {
                const [terminOdgovor, vozilaOdgovor, osobeOdgovor] = await Promise.all([
                    TerminiService.getBySifra(routeParams.sifratermina),
                    VozilaService.get(),
                    OsobaService.get()
                ]);

                if (terminOdgovor.greska) {
                    alert(terminOdgovor.poruka);
                    return;
                }
                setTermin(terminOdgovor.poruka);
                setVozila(vozilaOdgovor.poruka);
                setOsobe(osobeOdgovor.poruka);
                setVoziloSifra(terminOdgovor.poruka.sifravozila);
                setOsobaSifra(terminOdgovor.poruka.sifraosoba);

            } catch (error) {
                console.error("Greška pri dohvaćanju podataka:", error);
            }
        };

        dohvatiPodatke();
    }, [routeParams.sifratermina]);

    async function promjena(terminZaPromjenu) {
        console.log('Promjena termina:', terminZaPromjenu);
        const odgovor = await TerminiService.promjena(routeParams.sifratermina, terminZaPromjenu);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.TERMINI_PREGLED);
    }

    function obradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);
        const terminZaPromjenu = {
            Vozila: sifravozila,
            Osobe: sifraosoba,
            vrijemetermina: podaci.get('vrijemetermina')
        };
        console.log('Podaci za promjenu:', terminZaPromjenu);
        promjena(terminZaPromjenu);
    }

    if (!termin || !vozila.length || !osobe.length) {
        return <div>Učitavanje...</div>;
    }

    return (
        <>
            Promjena termina
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="sifravozila">
                    <Form.Label>Vozilo</Form.Label>
                    <Form.Select value={sifravozila} onChange={(e) => setVoziloSifra(e.target.value)}>
                        {vozila.map(v => (
                            <option key={v.sifra} value={v.sifravozila}>{v.sifravozila}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="sifraosoba">
                    <Form.Label>Osoba</Form.Label>
                    <Form.Select value={sifraosoba} onChange={(e) => setOsobaSifra(e.target.value)}>
                        {osobe.map(o => (
                            <option key={o.sifra} value={o.sifraosoba}>{o.sifraosoba}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="vrijemetermina">
                    <Form.Label>Vrijeme termina</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="vrijemetermina"
                        required
                        defaultValue={new Date(termin.vrijemetermina).toISOString().slice(0, 16)}
                    />
                </Form.Group>

                <Row className="akcije">
                    <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
                        <Link to={RouteNames.TERMINI_PREGLED} className="btn btn-danger siroko">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
                        <Button variant="success" type="submit" className="siroko">
                            Promjeni termin
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
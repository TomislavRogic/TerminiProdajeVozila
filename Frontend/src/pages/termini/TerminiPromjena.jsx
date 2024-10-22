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
    const navigate = useNavigate();
    const routeParams = useParams();

    useEffect(() => {
        console.log('Dohvaćanje termina s šifrom:', routeParams.sifratermina); // Dodano za dijagnostiku
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

                if (!vozilaOdgovor.greska) {
                    setVozila(vozilaOdgovor.poruka);
                } else {
                    console.error("Greška pri dohvaćanju vozila:", vozilaOdgovor.poruka);
                }

                if (!osobeOdgovor.greska) {
                    setOsobe(osobeOdgovor.poruka);
                } else {
                    console.error("Greška pri dohvaćanju osoba:", osobeOdgovor.poruka);
                }
            } catch (error) {
                console.error("Greška pri dohvaćanju podataka:", error);
            }
        };

        dohvatiPodatke();
    }, []);

    async function promjena(terminZaPromjenu) {
        console.log('Promjena termina:', terminZaPromjenu); // Dodano za dijagnostiku
        const odgovor = await TerminiService.promjena(routeParams.sifratermina, terminZaPromjenu);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.TERMINI_PREGLED); // Pretpostavljam da želite navigirati natrag na pregled
    }

    function obradiSubmit(e) {
        e.preventDefault();
        let podaci = new FormData(e.target);
        let terminZaPromjenu = {
            Vozila: parseInt(podaci.get('sifravozila')),
            Osobe: parseInt(podaci.get('sifraosoba')),
            vrijemetermina: podaci.get('vrijemetermina')
        };
        console.log('Podaci za promjenu:', terminZaPromjenu); // Dodano za dijagnostiku
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
                    <Form.Select name="sifravozila" defaultValue={termin.Vozila}>
                        <option value="">Odaberite vozilo</option>
                        {vozila.map(v => (
                            <option key={v.sifra} value={v.sifra}>{v.marka} {v.model}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="sifraosoba">
                    <Form.Label>Osoba</Form.Label>
                    <Form.Select name="sifraosoba" defaultValue={termin.Osobe}>
                        <option value="">Odaberite osobu</option>
                        {osobe.map(o => (
                            <option key={o.sifra} value={o.sifra}>{o.ime} {o.prezime}</option>
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

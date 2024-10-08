import { Button, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import OsobaService from "../../services/OsobaService"; // Pretpostavljam da je ovo ispravan put

export default function OsobePromjena() {
    const [osoba, setOsoba] = useState({});
    const navigate = useNavigate();
    const routeParams = useParams();

    async function dohvatiOsoba() {
        console.log('Dohvaćanje osobe s šifrom:', routeParams.sifra); // Dodano za dijagnostiku
        const odgovor = await OsobaService.getBySifra(routeParams.sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        setOsoba(odgovor.poruka);
        console.log('Dohvaćena osoba:', odgovor.poruka); // Dodano za dijagnostiku
    }

    useEffect(() => {
        dohvatiOsoba();
    }, []);

    async function promjena(osoba) {
        console.log('Promjena osobe:', osoba); // Dodano za dijagnostiku
        const odgovor = await OsobaService.promjena(routeParams.sifra, osoba);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.OSOBA_PREGLED); // Pretpostavljam da želite navigirati natrag na pregled
    }

    function obradiSubmit(e) {
        e.preventDefault();
        let podaci = new FormData(e.target);
        let osobaZaPromjenu = {
            email: podaci.get('email'),
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime')
        };
        console.log('Podaci za promjenu:', osobaZaPromjenu); // Dodano za dijagnostiku
        promjena(osobaZaPromjenu);
    }

    return (
        <>
            Promjena osobe
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        required
                        defaultValue={osoba.email}
                    />
                </Form.Group>

                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control
                        type="text"
                        name="ime"
                        required
                        defaultValue={osoba.ime}
                    />
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control
                        type="text"
                        name="prezime"
                        required
                        defaultValue={osoba.prezime}
                    />
                </Form.Group>

                <Row className="akcije">
                    <Col xs={6} sm={12} md={3} lg={6} xl={6} xxl={6}>
                        <Link to={RouteNames.OSOBA_PREGLED} className="btn btn-danger siroko">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={6} sm={12} md={9} lg={6} xl={6} xxl={6}>
                        <Button variant="success" type="submit" className="siroko">
                            Promjeni osobu
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
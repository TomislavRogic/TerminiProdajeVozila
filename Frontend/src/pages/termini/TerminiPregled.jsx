import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Pagination, Row } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import skicatermina from '../../assets/skicatermina.png';
import { APP_URL } from "../../constants";
import Service from "../../services/TerminiService"; // Prilagođen import servisa
import OsobaService from "../../services/OsobaService";
import { RouteNames } from "../../constants";
import moment from "moment-timezone";

function formatDate(dateString) {
    return moment(dateString).format('YYYY-MM-DD HH:mm');
}

export default function TerminiPregled() {
    const [termini, setTermini] = useState([]);
    const [stranica, setStranica] = useState(1);
    const [uvjet, setUvjet] = useState('');
    

    async function dohvatiTermine() {
        const odgovor = await Service.getStranicenje(stranica, uvjet);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        if (odgovor.poruka.length == 0) {
            setStranica(stranica - 1);
            return;
        }
        setTermini(odgovor.poruka);
    }

    async function dohvatiOsobe() {
        await OsobaService.get()
            .then((odgovor) => {
                if (!odgovor.greska) {
                    // Ovdje možete postaviti podatke o osobama
                    console.log(odgovor.poruka);
                }
            })
            .catch((e) => {
                console.error("Problem kod dohvaćanja osoba:", e);
            });
    }
    async function obrisiTermin(sifratermina) {
        try {
            const odgovor = await Service.obrisi(sifratermina);
            // console.log(odgovor);
            if (odgovor.greska) {
                alert(odgovor.poruka);
                return;
            }
            console.log('Termin obrisan');
            await dohvatiTermine();
        } catch (error) {
            console.error("Greška pri brisanju termina:", error);
            alert("Došlo je do greške prilikom brisanja termina.");
        }
    }
      

    useEffect(() => {
        dohvatiTermine();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stranica, uvjet]);

    function slika(termin) {
        if(termin.slika != null){
            return APP_URL + termin.slika + `?${Date.now()}`;
        }
        return skicatermina;
    }

    function promjeniUvjet(e) {
        if (e.nativeEvent.key == "Enter") {
            console.log('Enter');
            setStranica(1);
            setUvjet(e.nativeEvent.srcElement.value);
            setTermini([]);
        }
    }

    function povecajStranicu() {
        setStranica(stranica + 1);
    }

    function smanjiStranicu() {
        if (stranica == 1) {
            return;
        }
        setStranica(stranica - 1);
    }

    return (
        
        <Container>
            <Row>
            <Col key={1} sm={12} lg={4} md={4}>
                    <Form.Control
                    type='text'
                    name='trazilica'
                    placeholder='Dio imena i prezimena ili dio marke vozila [Enter]'
                    maxLength={255}
                    defaultValue=''
                    onKeyUp={promjeniUvjet}
                    />
                </Col>
                <Col key={2} sm={12} lg={4} md={4}>
                {termini && termini.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                    <Pagination size="lg">
                    <Pagination.Prev onClick={smanjiStranicu} />
                    <Pagination.Item disabled>{stranica}</Pagination.Item>
                    <Pagination.Next
                        onClick={povecajStranicu}
                    />
                </Pagination>
            </div>
                )}
                </Col>
                <Col key={3} sm={12} lg={4} md={4}>
            <Link to={RouteNames.TERMINI_DODAJ} className="btn btn-success gumb"> 
                <IoIosAdd 
                size={25} 
                /> Dodaj
            </Link>
            </Col>
             
            </Row>

            <Row>

                {termini && termini.map((termin) => (
                   <Col key={termin.sifratermina} sm={12} lg={3} md={3}>
                    <Card style={{ marginTop: '1rem' }}>
                        <Card.Img variant="top" src={slika(termin)} className="slika"/>
                        <Card.Body>
                            <Card.Title>{termin.sifratermina}</Card.Title>
                            <Card.Text>
                                {termin.sifraosoba}
                            </Card.Text>
                            <Card.Text>
                                {termin.sifravozila}
                            </Card.Text>
                            <Card.Text>
                                {formatDate(termin.vrijemetermina)}
                            </Card.Text>
                            
                            <Row>
                                <Col>
                                    <Link className="btn btn-primary gumb" to={`/termini/${termin.sifratermina}`}><FaEdit /></Link>
                                </Col>
                                <Col>
                                <Button variant="danger" className="gumb"  onClick={() => obrisiTermin(termin.sifratermina)}><FaTrash /></Button>
                                </Col>
            </Row>
        </Card.Body>
    </Card>
</Col>
                ))}
            </Row>
            <hr />
            {termini && termini.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Pagination size="lg">
                        <Pagination.Prev onClick={smanjiStranicu} />
                        <Pagination.Item disabled>{stranica}</Pagination.Item>
                        <Pagination.Next onClick={povecajStranicu} />
                    </Pagination>
                </div>
            )}
        </Container>
    );
}
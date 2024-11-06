import { Button, Card, Col, Form, Pagination, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { APP_URL, RouteNames } from "../../constants";
import { Link } from "react-router-dom";
import VozilaService from "../../services/VozilaService";
import skicavozila from '../../assets/skicavozila.png'; 
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function VozilaPregled() {
    const [vozila, setVozila] = useState([]);
    const [stranica, setStranica] = useState(1);
    const [uvjet, setUvjet] = useState('');

    async function dohvatiVozila() {
    
            const odgovor = await VozilaService.getStranicenje(stranica, uvjet);
            
            if(odgovor.greska){
                alert(odgovor.poruka);

                return;
            }
            if(odgovor.poruka.length==0){
                setStranica(stranica-1);
                return;
            }
            setVozila(odgovor.poruka);
    }


    useEffect(() => {
        dohvatiVozila();
    }, [stranica, uvjet]);

    async function obrisiAsync(sifravozila) {
        const odgovor = await VozilaService.obrisi(sifravozila);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        dohvatiVozila();
    }

    function obrisi(sifravozila) {
        obrisiAsync(sifravozila);
    }

    if (!Array.isArray(vozila)) {
        return <div>Podaci o vozilima nisu dostupni.</div>;
    }

    function slika(vozilo) {
        if (vozilo.slika != null) {
            return APP_URL + vozilo.slika + `?${Date.now()}`;
        }
        return skicavozila;
    }
    
    function promjeniUvjet(e) {
        if (e.nativeEvent.key == "Enter") {
            console.log('Enter');
            setStranica(1);
            setUvjet(e.nativeEvent.srcElement.value);
            setVozila([]); 
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
        <>
           <Row>
    <Col key={1} sm={12} lg={4} md={4}>
        <Form.Control
            type='text'
            name='trazilica'
            placeholder='Dio imena vozila [Enter]'
            maxLength={255}
            defaultValue=''
            onKeyUp={promjeniUvjet}
        />
    </Col>
    <Col key={2} sm={12} lg={4} md={4}>
        {vozila && vozila.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Pagination size="lg">
                    <Pagination.Prev onClick={smanjiStranicu} />
                    <Pagination.Item disabled>{stranica}</Pagination.Item>
                    <Pagination.Next onClick={povecajStranicu} />
                </Pagination>
            </div>
        )}
    </Col>
    <Col key={3} sm={12} lg={4} md={4}>
        <Link to={RouteNames.VOZILA_DODAJ} className="btn btn-success gumb">
            <IoIosAdd size={25} /> Dodaj
        </Link>
    </Col>
</Row>

<Row>
    {vozila && vozila.map((e) => (
        <Col key={e.sifravozila} sm={12} lg={3} md={3}>
            <Card style={{ marginTop: '1rem' }}>
                <Card.Img variant="top" src={slika(e)} className="slika" />
                <Card.Body>
                    <Card.Title>{e.marka}</Card.Title>
                    <Card.Text>
                        {e.opisvozila}
                    </Card.Text>
                    <Row>
                        <Col>
                            <Link className="btn btn-primary gumb" to={`/vozila/${e.sifravozila}`}><FaEdit /></Link>
                        </Col>
                        <Col>
                            <Button variant="danger" className="gumb" onClick={() => obrisi(e.sifravozila)}><FaTrash /></Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    ))}
</Row>
<hr />
{vozila && vozila.length > 0 && (
    <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination size="lg">
            <Pagination.Prev onClick={smanjiStranicu} />
            <Pagination.Item disabled>{stranica}</Pagination.Item>
            <Pagination.Next onClick={povecajStranicu} />
        </Pagination>
    </div>
)}
        </>
    );
}
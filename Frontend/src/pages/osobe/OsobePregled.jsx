import { useEffect, useState } from "react";
import OsobaService from "../../services/OsobaService";
import { Button, Card, Col, Form, Pagination, Row } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import skicaosoba from '../../assets/skicaosoba.png';
import { APP_URL, RouteNames } from "../../constants";
import { Link} from "react-router-dom";
import useLoading from "../../hooks/useLoading";


export default function OsobePregled() {
    
    const [osobe, setOsobe] = useState([]);
    const [stranica, setStranica] = useState(1);
    const [uvjet, setUvjet] = useState('');
    const {showLoading, hideLoading}=useLoading();

    async function dohvatiOsobe() {

        showLoading();
        const odgovor = await OsobaService.getStranicenje(stranica, uvjet);
        hideLoading();

        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        if (odgovor.poruka.length == 0) {
            setStranica(stranica - 1);
            return;
        }
        setOsobe(odgovor.poruka);
    }

    useEffect(() => {
        dohvatiOsobe();
    }, [stranica, uvjet]);

    function obrisi(sifraosoba) {
        console.log('Brisanje osobe s šifrom:', sifraosoba); // Dodano za dijagnostiku
        if (!confirm('Sigurno obrisati')) {
            return;
        }
        brisanjeOsoba(sifraosoba);
    }

    async function brisanjeOsoba(sifraosoba) {
        console.log('Poziv API-ja za brisanje s šifrom:', sifraosoba); // Dodano za dijagnostiku
        const odgovor = await OsobaService.brisanje(sifraosoba);
        showLoading();
        hideLoading();
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        dohvatiOsobe();
    }

    function slika(osoba) {
        if(osoba.slika != null){
            return APP_URL + osoba.slika + `?${Date.now()}`;
        }
        return skicaosoba;
    }

    function promjeniUvjet(e) {
        if (e.nativeEvent.key == "Enter") {
            console.log('Enter');
            setStranica(1);
            setUvjet(e.nativeEvent.srcElement.value);
            setOsobe([]);
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
                    placeholder='Dio imena i prezimena [Enter]'
                    maxLength={255}
                    defaultValue=''
                    onKeyUp={promjeniUvjet}
                    />
                </Col>
            <Col key={2} sm={12} lg={4} md={4}>
            {osobe && osobe.length > 0 && (
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
            <Link to={RouteNames.OSOBA_DODAJ} className="btn btn-success gumb">
            <IoIosAdd
                        size={25}
                        /> Dodaj
                    </Link>
                </Col>
            </Row>
           
            <Row>
            { osobe && osobe.map((osoba) => (
                <Col key={osoba.sifraosoba} sm={12} lg={3} md={3}>
                    <Card style={{ marginTop: '1rem' }}>
              <Card.Img variant="top" src={slika(osoba)} className="slika"/>
                <Card.Body>
                    <Card.Title>{osoba.ime} {osoba.prezime} </Card.Title>
                    <Card.Text>
                        {osoba.email}
                    </Card.Text>
                    <Row>
                        <Col>
                        <Link className="btn btn-primary gumb" to={`/osobe/${osoba.sifraosoba}`}><FaEdit /></Link>
                        </Col>
                        <Col>
                        <Button className="btn btn-danger gumb" onClick={() => obrisi(osoba.sifraosoba)}><FaTrash /></Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>

            ))
            }

            </Row>
            <hr />
            {osobe && osobe.length > 0 && (
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
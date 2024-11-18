import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { APP_URL, RouteNames } from "../../constants";
import { useEffect, useState, useRef } from "react";
import OsobaService from "../../services/OsobaService"; // Pretpostavljam da je ovo ispravan put
import useLoading from "../../hooks/useLoading";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import skicaosoba from '../../assets/skicaosoba.png';

export default function OsobePromjena() {
    const [osoba, setOsoba] = useState({});
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading(); // Dodano za dijagnostiku
    const routeParams = useParams();

    const [trenutnaSlika, setTrenutnaSlika] = useState('');
    const [slikaZaCrop, setSlikaZaCrop] = useState('');
    const [slikaZaServer, setSlikaZaServer] = useState('');
    const cropperRef = useRef(null);

    // fiksne dimenzije slike
    const dimenzije = { width: 200, height: 300 };



    async function dohvatiOsoba() {
        showLoading(); // Dodano za dijagnostiku
        console.log('Dohvaćanje osobe s šifrom:', routeParams.sifra); // Dodano za dijagnostiku
        const odgovor = await OsobaService.getBySifra(routeParams.sifra);
        hideLoading(); // Dodano za dijagnostiku
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        setOsoba(odgovor.poruka);
        console.log('Dohvaćena osoba:', odgovor.poruka); // Dodano za dijagnostiku

        if (odgovor.poruka.slika != null) {
            setTrenutnaSlika(`${APP_URL}${odgovor.poruka.slika}?${Date.now()}`);
        }
        else{
            setTrenutnaSlika(skicaosoba);
        }
    }

    useEffect(() => {
        dohvatiOsoba();
    }, []);

    async function promjena(osoba) {
        showLoading(); // Dodano za dijagnostiku
        console.log('Promjena osobe:', osoba); // Dodano za dijagnostiku
        const odgovor = await OsobaService.promjena(routeParams.sifra, osoba);
        hideLoading(); // Dodano za dijagnostiku
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

    function onCrop(){
        setSlikaZaServer(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
    }
    function onChangeImage(e){
        e.preventDefault();

        let files;
        if(e.dataTransfer){
            files = e.dataTransfer.files;
        }
        else if(e.target){
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setSlikaZaCrop(reader.result);
        };
        try {
            reader.readAsDataURL(files[0]);
        } catch (error) {
            console.error(error);
            
        }
    }

    async function spremiSliku(){
        showLoading();
        const base64 = slikaZaServer;
        const odgovor = await OsobaService.postaviSliku(routeParams.sifra, {Base64: base64.replace('data:image/png;base64,', '')});
        hideLoading();
        if(odgovor.greska){
            alert(odgovor.podaci);
           
        }
        setTrenutnaSlika(slikaZaServer);
    }

    return (
        <>
            Promjena osobe
            <Row>
            <Col key='1' sm={12} lg={6} md={6}>
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

                <Row className='mb-4'>
              <Col key='1' sm={12} lg={6} md={12}>
                <p className='form-label'>Trenutna slika</p>
                <Image
                  //za lokalni development
                  //src={'https://tomislavrogic-001-site1.ftempurl.com/osobe/' + trenutnaSlika}
                  src={trenutnaSlika}
                  className='slika'
                />
              </Col>
              <Col key='2' sm={12} lg={6} md={12}>
                {slikaZaServer && (
                  <>
                    <p className='form-label'>Nova slika</p>
                    <Image
                      src={slikaZaServer || slikaZaCrop}
                      className='slika'
                    />
                  </>
                )}
              </Col>
            </Row>


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
            </Col>
        <Col key='2' sm={12} lg={6} md={6}>
        <input className='mb-3' type='file' onChange={onChangeImage} />
              <Button disabled={!slikaZaServer} onClick={spremiSliku}>
                Spremi sliku
              </Button>
              <Cropper
                src={slikaZaCrop}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                guides={true}
                viewMode={1}
                minCropBoxWidth={50}
                minCropBoxHeight={50}
                cropBoxResizable={false}
                background={false}
                responsive={true}
                checkOrientation={false}
                cropstart={onCrop}
                cropend={onCrop}
                ref={cropperRef}
              />
        </Col>
      </Row>
        </>
    )
}
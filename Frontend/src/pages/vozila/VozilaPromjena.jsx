import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { APP_URL, RouteNames } from "../../constants";
import VozilaService from "../../services/VozilaService";
import { useEffect, useState, useRef } from "react";
import useLoading from "../../hooks/useLoading";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import skicavozila from '../../assets/skicavozila.png';


export default function VozilaPromjena() {
    const [vozilo, setVozilo] = useState({});
    const navigate = useNavigate();
    const {showLoading, hideLoading} = useLoading();
    const routeParams = useParams();
    

    const [trenutnaSlika, setTrenutnaSlika] = useState('');
    const [slikaZaCrop, setSlikaZaCrop] = useState('');
    const [slikaZaServer, setSlikaZaServer] = useState('');
    const cropperRef = useRef(null);


    async function dohvatiVozilo() {
        showLoading();
        const odgovor = await VozilaService.getBySifra(routeParams.sifravozila);
        hideLoading();
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        setVozilo(odgovor.poruka);

        if(odgovor.poruka.slika!=null){
            setTrenutnaSlika(APP_URL + odgovor.poruka.slika + `?${Date.now()}`); // ovaj Date je da uvijek dovuče zadnju sliku
        } else{
            setTrenutnaSlika(skicavozila);
        }
    }
    useEffect(() => {
        dohvatiVozilo();
    }, []);
    async function promjena(e) {
        showLoading();
        const odgovor = await VozilaService.promjena(routeParams.sifravozila, e);
        hideLoading();
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.VOZILA_PREGLED);
    }
    function obradiSubmit(e) { 
        e.preventDefault();

        const podaci = new FormData(e.target);

        promjena({
            marka: podaci.get('marka'),
            opisvozila: podaci.get('opisvozila'),
            cijena: podaci.get('cijena')
        });
    }

    function onCrop(){
        setSlikaZaServer(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
    }
    function onChangeImage(e) {
        e.preventDefault();

        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        }
        else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setSlikaZaCrop(reader.result);
        };
        try{
            reader.readAsDataURL(files[0]);
         } catch (error){
            console.error(error);
         }
    }

    async function spremiSliku(){
        showLoading();
        const base64 = slikaZaServer;
        const odgovor = await VozilaService.postaviSliku(routeParams.sifravozila, {Base64: base64.replace('data:image/png;base64,', '')});
        hideLoading();
        if(odgovor.greska){
            alert(odgovor.podaci);
        }
        setTrenutnaSlika(slikaZaServer);
    }
    return (
        <>
            Promjena Vozila
            <Row>
            <Col key='1' sm={12} lg={6} md={6}>
            <Form onSubmit={obradiSubmit}>
                <Form.Group controlId="marka">
                    <Form.Label>Marka</Form.Label>
                    <Form.Control type="text" name="marka" required defaultValue={vozilo.marka} />
                </Form.Group>
                <Form.Group controlId="opisvozila">
                    <Form.Label>Opis Vozila</Form.Label>
                    <Form.Control type="text" name="opisvozila" required defaultValue={vozilo.opisvozila} />
                </Form.Group>
                <Form.Group controlId="cijena">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control type="text" name="cijena" required defaultValue={vozilo.cijena} />
                </Form.Group>

                <Row className='mb-4'>
              <Col key='1' sm={12} lg={6} md={12}>
                <p className='form-label'>Trenutna slika</p>
                <Image
                  //za lokalni development
                  //src={'https://https://tomislavrogic-001-site1.ftempurl.com/vozila' + trenutnaSlika}
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
                <hr />
                <Row>
                    <Col xs={6}>
                        <Link to={RouteNames.VOZILA_PREGLED} className="btn btn-danger siroko">
                            Odustani
                        </Link>
                    </Col>
                    <Col xs={6}>
                        <Button variant="primary" type="submit" className="siroko">
                            Promjeni vozilo
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
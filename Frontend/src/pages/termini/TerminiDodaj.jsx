import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TerminiService from '../../services/TerminiService';
import VozilaService from '../../services/VozilaService';
import { RouteNames } from '../../constants';

export default function TerminiDodaj() {
  const navigate = useNavigate();
  const [vozila, setVozila] = useState([]);
  const [voziloSifra, setVoziloSifra] = useState(0);

  async function dohvatiVozila() {
    const odgovor = await VozilaService.get();
    setVozila(odgovor.poruka);
    setVoziloSifra(odgovor.poruka[0].sifra);
  }

  useEffect(() => {
    dohvatiVozila();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function dodaj(e) {
    const odgovor = await TerminiService.dodaj(e);
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    navigate(RouteNames.VOZILA_PREGLED);
  }

  function obradiSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    dodaj({
      naziv: podaci.get('naziv'),
      voziloSifra: parseInt(voziloSifra),
      predavac: podaci.get('predavac'),
      maksimalnopolaznika: parseInt(podaci.get('maksimalnopolaznika'))
    });
  }

  return (
    <>
      Dodavanje novog termina

      <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="naziv">
          <Form.Label>Naziv</Form.Label>
          <Form.Control type="text" name="naziv" required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='vozilo'>
          <Form.Label>Vozilo</Form.Label>
          <Form.Select 
            onChange={(e) => { setVoziloSifra(e.target.value) }}
          >
            {vozila && vozila.map((v, index) => (
              <option key={index} value={v.voziloSifra}>
                {v.naziv}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="predavac">
          <Form.Label>Predavač</Form.Label>
          <Form.Control type="text" name="predavac" required />
        </Form.Group>
        <Form.Group controlId="maksimalnopolaznika">
          <Form.Label>Maksimalno polaznika</Form.Label>
          <Form.Control type="number" name="maksimalnopolaznika" min={5} max={30} />
        </Form.Group>
        <hr />
        <Row>
          <Col xs={6} sm={6} md={3} lg={6} xl={6} xxl={6}>
            <Link to={RouteNames.VOZILA_PREGLED}
              className="btn btn-danger siroko">
              Odustani
            </Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={6} xl={6} xxl={6}>
            <Button variant="primary" type="submit" className="siroko">
              Dodaj novi termin
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
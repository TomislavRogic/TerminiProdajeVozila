import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TerminiService from '../../services/TerminiService';
import VozilaService from '../../services/VozilaService';
import OsobaService from '../../services/OsobaService';
import { RouteNames } from '../../constants';

export default function TerminiDodaj() {
  const navigate = useNavigate();
  const [vozila, setVozila] = useState([]);
  const [osobe, setOsobe] = useState([]);
  const [sifravozila, setVoziloSifra] = useState(0);
  const [sifraosoba, setOsobaSifra] = useState(0);
  const [vrijemeTermina, setVrijemeTermina] = useState('');

  async function dohvatiVozila() {
    const odgovor = await VozilaService.get();
    if (odgovor && odgovor.poruka) {
      setVozila(odgovor.poruka);
      if (odgovor.poruka.length > 0) {
        setVoziloSifra(odgovor.poruka[0].sifra); // Ensure 'sifra' exists
      }
    } else {
      console.error("Vozila not fetched correctly:", odgovor);
    }
  }

  async function dohvatiOsobe() {
    const odgovor = await OsobaService.get();
    if (odgovor && odgovor.poruka) {
      setOsobe(odgovor.poruka);
      if (odgovor.poruka.length > 0) {
        setOsobaSifra(odgovor.poruka[0].sifra); // Ensure 'sifra' exists
      }
    } else {
      console.error("Osobe not fetched correctly:", odgovor);
    }
  }

  useEffect(() => {
    dohvatiVozila();
    dohvatiOsobe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function dodaj(termin) {
    console.log("Podaci koji se šalju:", termin); // For debugging
    const odgovor = await TerminiService.dodaj(termin);
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    navigate(RouteNames.TERMINI_PREGLED);
  }

  function obradiSubmit(e) {
    e.preventDefault();
    const podaci = e.target.elements;
    dodaj({
      Vozila: parseInt(sifravozila), 
      Osobe: parseInt(sifraosoba),    
      Vrijemetermina: podaci.vrijemetermina.value 
    });
  }

  return (
    <Container>
      <h3>Dodavanje novog termina</h3>
      <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="vozilo" className="mb-3">
          <Form.Label>Vozilo</Form.Label>
          <Form.Select
            onChange={(e) => setVoziloSifra(e.target.value)}
            required
          >
            {vozila.map((v, index) => (
              <option key={index} value={v.sifravozila}>
                {v.naziv}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="osoba" className="mb-3">
          <Form.Label>Osoba</Form.Label>
          <Form.Select
            onChange={(e) => setOsobaSifra(e.target.value)}
            required
          >
            {osobe.map((o, index) => (
              <option key={index} value={o.sifraosoba}>
                {o.ime} {o.prezime}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="vrijemetermina" className="mb-3">
          <Form.Label>Vrijeme termina</Form.Label>
          <Form.Control
            type="datetime-local"
            name="vrijemetermina"
            onChange={(e) => setVrijemeTermina(e.target.value)}
            required
          />
        </Form.Group>
        <hr />
        <Row>
          <Col xs={6}>
            <Link to={RouteNames.TERMINI_PREGLED} className="btn btn-danger siroko">
              Odustani
            </Link>
          </Col>
          <Col xs={6}>
            <Button variant="primary" type="submit" className="siroko">
              Dodaj novi termin
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

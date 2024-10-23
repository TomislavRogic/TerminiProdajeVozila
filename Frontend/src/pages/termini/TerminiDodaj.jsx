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
  const [sifravozila, setVoziloSifra] = useState('');
  const [sifraosoba, setOsobaSifra] = useState('');
  const [vrijemeTermina, setVrijemeTermina] = useState('');

  useEffect(() => {
    const dohvatiPodatke = async () => {
      try {
        const [vozilaOdgovor, osobeOdgovor] = await Promise.all([
          VozilaService.get(),
          OsobaService.get()
        ]);

        if (vozilaOdgovor && !vozilaOdgovor.greska && Array.isArray(vozilaOdgovor.poruka)) {
          setVozila(vozilaOdgovor.poruka);
          setVoziloSifra(vozilaOdgovor.poruka?.[0]?.sifra || '');
        }

        if (osobeOdgovor && !osobeOdgovor.greska && Array.isArray(osobeOdgovor.poruka)) {
          setOsobe(osobeOdgovor.poruka);
          setOsobaSifra(osobeOdgovor.poruka?.[0]?.sifraosoba || '');
        }

      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      }
    };

    dohvatiPodatke();
  }, []);

  async function dodajTermin(termin) {
    console.log("Podaci koji se šalju:", termin); // For debugging
    try {
      const odgovor = await TerminiService.dodaj(termin);
      console.log("Odgovor servera:", odgovor); // For debugging
      if (odgovor.greska) {
        alert(odgovor.poruka);
        return;
      }
      navigate(RouteNames.TERMINI_PREGLED);
    } catch (error) {
      console.error("Greška pri dodavanju termina:", error);
      alert("Došlo je do greške pri dodavanju termina.");
    }
  }

  function obradiSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    const noviTermin = {
      Vozila: parseInt(sifravozila, 10),
      Osobe: parseInt(sifraosoba, 10),
      Vrijemetermina: new Date(podaci.get('vrijemetermina'))
    };

    // Dodatne provjere
    if (isNaN(noviTermin.Vozila) || noviTermin.Vozila < 1 || noviTermin.Vozila > 2147483647) {
      alert("Neispravna vrijednost za šifru vozila.");
      return;
    }
    if (isNaN(noviTermin.Osobe) || noviTermin.Osobe < 1 || noviTermin.Osobe > 2147483647) {
      alert("Neispravna vrijednost za šifru osobe.");
      return;
    }

    dodajTermin(noviTermin);
  }

  if (!vozila.length || !osobe.length) {
    return <div>Učitavanje...</div>;
  }

  return (
    <Container>
      <h3>Dodavanje novog termina</h3>
      <Form onSubmit={obradiSubmit}>
        <Form.Group controlId="vozilo" className="mb-3">
          <Form.Label>Vozilo</Form.Label>
          <Form.Select
            value={sifravozila || ''}
            onChange={(e) => setVoziloSifra(e.target.value)}
            required
          >
            <option value="">Odaberite vozilo</option>
            {vozila.map((v) => (
              <option key={v.sifravozila} value={v.sifravozila}>
                {v.sifravozila}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="osoba" className="mb-3">
          <Form.Label>Osoba</Form.Label>
          <Form.Select
            value={sifraosoba || ''}
            onChange={(e) => setOsobaSifra(e.target.value)}
            required
          >
            <option value="">Odaberite osobu</option>
            {osobe.map((o) => (
              <option key={o.sifraosoba} value={o.sifraosoba}>
                {o.sifraosoba}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="vrijemetermina" className="mb-3">
          <Form.Label>Vrijeme termina</Form.Label>
          <Form.Control
            type="datetime-local"
            name="vrijemetermina"
            value={vrijemeTermina}
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
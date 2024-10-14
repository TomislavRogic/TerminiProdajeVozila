import { Button, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import VozilaService from "../../services/VozilaService";

export default function VozilaPregled() {
    const [vozila, setVozila] = useState([]);
    const navigate = useNavigate();

    async function dohvatiVozila() {
        try {
            const odgovor = await VozilaService.get();
            if (Array.isArray(odgovor.poruka)) {
                setVozila(odgovor.poruka);
            } else {
                console.error("Podaci nisu u očekivanom formatu:", odgovor);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        dohvatiVozila();
    }, []);

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

    return (
        <>
            <Link to={RouteNames.VOZILA_DODAJ}className="btn btn-success siroko">Dodaj novo vozilo </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Marka</th>
                        <th>Opis</th>
                        <th>Cijena</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {vozila.map((e, index) => (
                        <tr key={index}>
                            <td>{e.marka}</td>
                            <td>{e.opisvozila}</td>
                            <td>{e.cijena}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/vozila/${e.sifravozila}`)}>
                                    Promjena
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => obrisi(e.sifravozila)}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
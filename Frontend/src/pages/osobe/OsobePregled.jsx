import { useEffect, useState } from "react";
import OsobaService from "../../services/OsobaService";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function OsobePregled() {
    const navigate = useNavigate();
    const [osobe, setOsobe] = useState([]);

    async function dohvatiOsobe() {
        const odgovor = await OsobaService.get();
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        setOsobe(odgovor.poruka);
    }

    useEffect(() => {
        dohvatiOsobe();
    }, []);

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
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        dohvatiOsobe();
    }

    return (
        <>
            <Link to={RouteNames.OSOBA_DODAJ} className="btn btn-success siroko">
                Dodaj novu osobu
            </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {osobe && osobe.map((osoba, index) => {
                        console.log('Osoba:', osoba); // Dodano za dijagnostiku
                        return (
                            <tr key={index}>
                                <td>{osoba.email}</td>
                                <td>{osoba.ime}</td>
                                <td>{osoba.prezime}</td>
                                <td>
                                    <Button variant="danger" size="sm" className="w-100 mb-2" onClick={() => obrisi(osoba.sifraosoba)}>Obriši</Button>
                                    <Button variant="primary" size="sm" className="w-100" onClick={() => navigate(`/osobe/${osoba.sifraosoba}`)}>Promjena</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
}
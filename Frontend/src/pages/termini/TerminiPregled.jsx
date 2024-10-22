import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Service from "../../services/TerminiService"; // Prilagođen import servisa
import OsobaService from "../../services/OsobaService";
import { RouteNames } from "../../constants";
import moment from "moment";

function formatDate(dateString) {
    return moment(dateString).format('YYYY-MM-DD');
}

export default function TerminiPregled() {
    const [termini, setTermini] = useState([]);
    let navigate = useNavigate();

    async function dohvatiTermine() {
        await Service.get()
        .then((odgovor)=>{
            //console.log(odgovor);
            setTermini(odgovor);
        })
        .catch((e)=>{console.log(e)});
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
    }, []);

    return (
        <Container>
            <Link to={RouteNames.TERMINI_DODAJ} className="btn btn-success siroko">
                <IoIosAdd 
                size={25}
                 /> Dodaj
            </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                       <th>Marka</th>
                          <th>Ime</th>
                            <th>Datum</th>
                    </tr>
                </thead>
                <tbody>
                    {termini && termini.map((termin, index) => (
                        <tr key={index}>
                            <td>{termin.vozilaMarka}</td>
                            <td>{termin.osobaIme}</td>
                            <td>{formatDate(termin.Vrijemetermina)}</td>
                            
                            <td className="sredina">
                                <Button
                                    variant='primary'
                                    onClick={() => { navigate(`/termini/${termin.sifratermina}`) }}
                                >
                                    <FaEdit 
                                    size={25} 
                                    />
                                </Button>

                                &nbsp;&nbsp;&nbsp;
                                <Button
                                    variant='danger'
                                    onClick={() => obrisiTermin(termin.sifratermina)}
                                >
                                    <FaTrash size={25} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
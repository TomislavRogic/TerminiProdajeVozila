import { HttpService } from "./HttpService";

async function get() {
    return await HttpService.get('/Osoba')
        .then((odgovor) => {
            return { greska: false, poruka: odgovor.data };
        })
        .catch((e) => {
            return { greska: true, poruka: 'Problem kod dohvaćanja osoba' };
        });
}

async function brisanje(sifra) {
    return await HttpService.delete('/Osoba/' + sifra)
        .then(() => {
            return { greska: false, poruka: 'Obrisano' };
        })
        .catch(() => {
            return { greska: true, poruka: 'Problem kod brisanja osobe' };
        });
}

async function dodaj(osoba) {
    return await HttpService.post('/Osoba', osoba)
        .then(() => {
            return { greska: false, poruka: 'Dodano' };
        })
        .catch(() => {
            return { greska: true, poruka: 'Problem kod dodavanja osobe' };
        });
}

async function promjena(sifra, osoba) {
    return await HttpService.put('/Osoba/' + sifra, osoba)
        .then(() => {
            return { greska: false, poruka: 'Promijenjeno' };
        })
        .catch(() => {
            return { greska: true, poruka: 'Problem kod promjene osobe' };
        });
}

async function getBySifra(sifra) {
    return await HttpService.get('/Osoba/' + sifra)
        .then((odgovor) => {
            return { greska: false, poruka: odgovor.data };
        })
        .catch((e) => {
            return { greska: true, poruka: 'Problem kod dohvaćanja osobe s šifrom ' + sifra };
        });
}

export default {
    get,
    brisanje,
    dodaj,
    getBySifra,
    promjena
};

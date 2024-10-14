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
        .then((odgovor) => {
            return { greska: false, poruka: odgovor.data };
        })
        .catch((e) => {
            switch (e.status) {
                case 400:
                    let poruke = '';
                    for (const kljuc in e.response.data.errors) {
                        poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + '\n';
                    }
                    return { greska: true, poruka: poruke };
                default:
                    return { greska: true, poruka: 'Osoba se ne može dodati!' };
            }
        });
}

async function promjena(sifra, osoba) {
    return await HttpService.put('/Osoba/' + sifra, osoba)
        .then((odgovor) => {
            return { greska: false, poruka: odgovor.data };
        })
        .catch((e) => {
            switch (e.status) {
                case 400:
                    let poruke = '';
                    for (const kljuc in e.response.data.errors) {
                        poruke += kljuc + ': ' + e.response.data.errors[kljuc][0] + '\n';
                    }
                    console.log(poruke);
                    return { greska: true, poruka: poruke };
                default:
                    return { greska: true, poruka: 'Osoba se ne može promijeniti!' };
            }
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
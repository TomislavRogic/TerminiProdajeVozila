import { HttpService } from "./HttpService";

async function get() {
    try {
        const odgovor = await HttpService.get('/Vozila');
        if (odgovor.headers['content-type'].includes('application/json')) {
            return { greska: false, poruka: odgovor.data };
        } else {
            console.error("API nije vratio JSON podatke:", odgovor);
            return { greska: true, poruka: 'API nije vratio JSON podatke' };
        }
    } catch (e) {
        return { greska: true, poruka: 'Problem kod dohvaćanja vozila' };
    }
}

async function getBySifra(sifra) {
    try {
        const odgovor = await HttpService.get(`/Vozila/${sifra}`);
        return { greska: false, poruka: odgovor.data };
    } catch (e) {
        return { greska: true, poruka: `Problem kod dohvaćanja vozila s šifrom ${sifra}` };
    }
}

async function obrisi(sifra) {
    try {
        await HttpService.delete(`/Vozila/${sifra}`);
        return { greska: false, poruka: 'Obrisano' };
    } catch (e) {
        return { greska: true, poruka: 'Problem kod brisanja vozila' };
    }
}

async function dodaj(vozilo) {
    try {
        const odgovor = await HttpService.post('/Vozila', vozilo);
        return { greska: false, poruka: odgovor.data };
    } catch (e) {
        if (e.response && e.response.status === 400) {
            let poruke = '';
            for (const kljuc in e.response.data.errors) {
                poruke += `${kljuc}: ${e.response.data.errors[kljuc][0]}\n`;
            }
            return { greska: true, poruka: poruke };
        } else {
            return { greska: true, poruka: 'Vozilo se ne može dodati!' };
        }
    }
}

async function promjena(sifra, vozilo) {
    try {
        const odgovor = await HttpService.put(`/Vozila/${sifra}`, vozilo);
        return { greska: false, poruka: odgovor.data };
    } catch (e) {
        if (e.response && e.response.status === 400) {
            let poruke = '';
            for (const kljuc in e.response.data.errors) {
                poruke += `${kljuc}: ${e.response.data.errors[kljuc][0]}\n`;
            }
            console.log(poruke);
            return { greska: true, poruka: poruke };
        } else {
            return { greska: true, poruka: 'Vozilo se ne može promijeniti!' };
        }
    }
}

export default {
    get,
    getBySifra,
    obrisi,
    dodaj,
    promjena
};
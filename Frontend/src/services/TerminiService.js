import { HttpService } from "./HttpService";

async function get() {
    return await HttpService.get('/Termin')
    .then((odgovor)=>{
        //console.table(odgovor.data);
        return odgovor.data;
    })
    .catch((e)=>{console.error(e)})
}

async function getBySifra(sifratermina){
    return await HttpService.get(`/Termin/` + sifratermina)
    .then((odgovor)=>{
        return {greska: false, poruka: odgovor.data}
        })
        .catch(()=>{
            return {greska: true, poruka: "Ne postoji termin s tom šifrom"}
        })
    }

        async function obrisi(sifratermina){
            return await HttpService.delete(`/Termin/` + sifratermina)
            .then((odgovor)=>{
                return {greska: false, poruka: odgovor.data}
            })
            .catch(()=>{
                return {greska: true, poruka: "Termin se ne može obrisati"}
            })
        }
        async function dodaj(Termin) {
            return await HttpService.post('/Termin', Termin)
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
                            return { greska: true, poruka: "Termin se ne može dodati" };
                    }
                })
        }
        async function promjena(sifratermina, Termin) {
            return await HttpService.put('/Termin/' + sifratermina, Termin)
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
                            console.log(poruke)
                            return { greska: true, poruka: poruke };
                        default:
                            return { greska: true, poruka: "Termin se ne može promijeniti" };
                    }
                })
            
        }

        export default {
             get, 
             getBySifra, 
             obrisi, 
             dodaj, 
             promjena
             



}

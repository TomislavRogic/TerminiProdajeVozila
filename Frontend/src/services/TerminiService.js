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
            try {
              const odgovor = await HttpService.post('/Termin', Termin);
              console.log("Odgovor servera:", odgovor); // For debugging
              return { greska: false, poruka: odgovor.data };
            } catch (e) {
              if (e.response && e.response.status === 400) {
                let poruke = '';
                for (const kljuc in e.response.data.errors) {
                  poruke += `${kljuc}: ${e.response.data.errors[kljuc][0]}\n`;
                }
                return { greska: true, poruka: poruke };
              } else {
                return { greska: true, poruka: 'Termin se ne može dodati!' };
              }
            }
          }
        async function promjena(sifratermina, Termin) {
            try {
              const odgovor = await HttpService.post('/Termin', Termin);
              console.log("Odgovor servera:", odgovor); // For debugging
              return { greska: false, poruka: odgovor.data };
            } catch (e) {
              if (e.response && e.response.status === 400) {
                let poruke = '';
                for (const kljuc in e.response.data.errors) {
                  poruke += `${kljuc}: ${e.response.data.errors[kljuc][0]}\n`;
                }
                return { greska: true, poruka: poruke };
              } else {
                return { greska: true, poruka: 'Termin se ne može dodati!' };
              }
            }
          }

        export default {
             get, 
             getBySifra, 
             obrisi, 
             dodaj, 
             promjena
             



}

function dajPort(korime) {
	var os = require("os");
	const HOST = os.hostname();
	let port = null;
	if (HOST != "spider.foi.hr") {
		port = 12222;
	} else {
		const portovi = require("/var/www/OWT/2024/portovi.js");
		port = portovi[korime];
	}
	return port;
}

const port = dajPort("nrastija22"); // vaše korisničko ime

const express = require("express");
const ds = require("fs");
const server = express();
const path = require("path");

const putanja = __dirname;

console.log(putanja);

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(path.join(putanja, 'public')));

server.use('/css', express.static(path.join(putanja, 'css')));
server.use('/jsk', express.static(path.join(putanja, 'js')));
server.use('/slike', express.static(path.join(putanja, 'resursi/slike')));

server.get("/jskobrazac", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja +  "/js/klijent/nrastija22_obrazac.js");
});

server.get("/jskekran", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/js/klijent/nrastija22.js");
});

// Rute za posluživanje HTML datoteka 
server.get("/", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/index.html");
});

server.get("/val", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/obrazac.html");
});

server.get("/izl", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/obrazacIzlozba.html");
});

server.get("/eks", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/eksponati.html");
});

server.get("/gal", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/galerija.html");
});

server.get("/oau", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/oAutoru.html");
});

server.get("/dok", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/dokumentacija.html");
});


const mojModul = require("./js/server/dajListu.js");
const dajIzlozbu = require("./js/server/DajIzlozbu.js");

const izlozbe = new dajIzlozbu();

server.get("/popis", (zahtjev, odgovor) => {
    const popuniValue = zahtjev.query.popuni;

    if (popuniValue === 'true'){
        izlozbe.kopirajJSONuCSV();
        odgovor.type("html");
        odgovor.send(`
            <html>
                <head>
                    <meta http-equiv="refresh" content="0; url=/popis?popuni=false" />
                </head>
            </html>
        `);
        return;
    }

	let zaglavlje = ds.readFileSync("resursi/zaglavlje.txt", "utf-8");
	let podnozje = ds.readFileSync("resursi/podnozje.txt", "utf-8");
	odgovor.type("html"); // moramo "reći" da je to html
	odgovor.write(zaglavlje);
	odgovor.write("Dinamična stranica");
	odgovor.write(mojModul.dajListu());
	odgovor.write(podnozje);
	odgovor.end();
});


server.get('/brisi', (req, res) => {
    const naziv = req.query.naziv;
    if (!naziv) {
        res.status(400).send('Naziv nije definiran.');
        return;
    }

    console.log('Brisanje elementa:', naziv); 

    ds.readFile('resursi/izlozba.csv', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            res.status(500).send('Greška na serveru.');
            return;
        }

        const rows = data.split('\n');
        const filteredRows = rows.filter(row => !row.startsWith(naziv + '#'));

        ds.writeFile('resursi/izlozba.csv', filteredRows.join('\n'), 'utf-8', (err) => {
            if (err) {
                console.error('Error writing CSV file:', err);
                res.status(500).send('Greška na serveru.');
                return;
            }
            res.redirect('/popis');
        });
    });
});

server.post("/ispisObrazac", (zahtjev, odgovor) => {
	odgovor.write(JSON.stringify(zahtjev.body));
	odgovor.end();
});


server.get("/owt/izlozba", (zahtjev, odgovor) => {
	odgovor.type("json");
	let data = izlozbe.dajIzlozbe();
	if (data == undefined) {
		odgovor.status(417);
		odgovor.send(JSON.stringify({ poruka: "Greška kod učitavanja podataka!" }));
	} else {
		odgovor.status(200);
		odgovor.send(JSON.stringify(data));
	}
});

server.get("/owt/izlozba/:id", (zahtjev, odgovor) => {
    odgovor.type("json");
    let id = zahtjev.params.id;
    let data = izlozbe.dajIzlozbe();

    if (data == undefined) {
        odgovor.status(417).send(JSON.stringify({ poruka: "Nema resursa!" }));
    } else if (data[id] == undefined) {
        odgovor.status(404).send(JSON.stringify({ poruka: "Nije definirano" }));
    } else {
        odgovor.status(200).send(JSON.stringify(data[id]));
    }
});

server.post("/owt/izlozba", (zahtjev, odgovor) => {
    const { Naziv, Opis, Datum, Autor } = zahtjev.body;
        if (!Naziv) {
            odgovor.status(417).json({ greska: 'prazan naziv!' });
            return;
        }
        else if (!Opis){
            odgovor.status(417).json({ greska: 'prazan opis!' });
            return;
        }
        else if (!Datum){
            odgovor.status(417).json({ greska: 'prazan datum!' });
            return;
        }
        else if (!Autor){
            {
                odgovor.status(417).json({ greska: 'prazan autor!' });
                return;
            }
        }
    
        const noviRedak = `\n${Naziv}#${Opis}#${Datum}#${Autor}`;
    
        try {
            ds.appendFileSync('resursi/izlozba.csv', noviRedak, 'utf-8');
            odgovor.status(200).json({ message: 'Podatak dodan u .CSV datoteku!' });
        } catch (error) {
            odgovor.status(500).json({ greska: 'Greša pri dodavanju podataka u .CSV datoteku!' });
        }
});
server.delete("/owt/izlozba", (zahtjev, odgovor) => {   
    odgovor.type("json");
    odgovor.status(501).send(JSON.stringify({ error: "Metoda nije implementirana." }));      
});

server.put('/owt/izlozba',(zahtjev,odgovor) => {
	odgovor.type("json");
    odgovor.status(501).send(JSON.stringify({ error: "Metoda nije implementirana." }));
});


server.post("/owt/izlozba/:id", (zahtjev, odgovor) => {   
    odgovor.type("json");
    odgovor.status(405).send(JSON.stringify({ error: "Metoda nije dopuštena." }));      
});

server.put('/owt/izlozba/:id',(zahtjev,odgovor) => {
	odgovor.type("json");
    odgovor.status(501).send(JSON.stringify({ error: "Metoda nije implementirana." }));
});

server.delete('/owt/izlozba/:naziv', (zahtjev, odgovor) => {
    const naziv = zahtjev.params.naziv;
    const obrisano = izlozbe.brisi(naziv);
    if (obrisano) {
        odgovor.status(200).json({ message: 'podatak izbrisan' });
    } else {
        odgovor.status(417).json({ greska: 'brisanje neuspješno provjerite naziv' });
    }
    
});

server.use((zahtjev, odgovor) => {
	odgovor.status(404).send('Stranica nije pronađena! <a href="/">Povratak na početnu stranicu</a>');
});

server.listen(port, () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
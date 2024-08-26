const ds = require("fs");

class DajIzlozbu {
	dajIzlozbe = function(){
		var podaci = ds.readFileSync("resursi/izlozba.json","utf-8");
		return JSON.parse(podaci);
	}

	dajIzlozbeCSV = function(){
		var podaci = ds.readFileSync("resursi/izlozba.csv","utf-8");
		return podaci;
	}

	dodaj = function(predmet) {
		var izlozbe = this.dajIzlozbe();
		izlozbe.push(predmet);
		var noviPredmetDodan = JSON.stringify(predmet);
		ds.writeFile('resursi/izlozba.json',noviPredmetDodan,{flag: 'w'}, (greska) => { 
			if(greska) console.log(greska);
		});
	}

	brisi = function(id){
		let data = ds.readFileSync("resursi/izlozba.csv", 'utf-8');
        let redovi = data.split('\n');
        let noviRedovi = redovi.filter(red => {
            let kolone = red.split('#');
            return kolone[0] !== id;
        });
        if (redovi.length === noviRedovi.length) {
            return false;
        } else {
            ds.writeFileSync("resursi/izlozba.csv", noviRedovi.join('\n'), 'utf-8');
            return true;
        }
	}

	azuriraj = function(id,noviPodaci){
		var izlozbe = this.dajIzlozbe();
		for(var index in izlozbe){
			if(index==id){
				valute[index]=noviPodaci;
				break;
			}
		}
		ds.writeFile('resursi/izlozba.json',JSON.stringify(izlozbe),{flag: 'w'}, (greska) => { 
			if(greska) console.error("Greška"); 
		});
	}	

	ucitajCSVIDajJSON = function() {
		ds.readFile('resursi/izlozba.csv', 'utf8', (err, data) => {
			if (err) {
				console.error('Greška pri čitanju CSV datoteke:', err);
				return;
			}
	
			const lines = data.split('\n');
			const header = lines[0]; // Prvi redak je header
			const csvRedovi = lines[1]; // Drugi redak je prvi zapis (možete promijeniti indeks za druge redove)
	
			try {
				const jsonResult = prebaciCSVuJSON(csvRedovi, header);
				console.log('JSON objekt:\n', jsonResult);
			} catch (error) {
				console.error('Greška pri konverziji CSV-a u JSON:', error.message);
			}
		});
	}
	
	kopirajJSONuCSV= function() {
		ds.readFile('resursi/izlozba.json', 'utf8', (err, data) => {
			if (err) {
				console.error('Error pri citanju JSON datoteke:', err);
				return;
			}
			const izlozbaData = JSON.parse(data);
			const csvData = izlozbaData.map(entry => {
				const Naziv = entry['Naziv'] || 'undefined';
				const Opis = entry['Opis'] || 'undefined';
				const Datum = entry['Datum'] || 'undefined';
				const Autor = entry['Autor'] || 'undefined';
				return `${Naziv}#${Opis}#${Datum}#${Autor}`;
			}).join('\n');
	
			ds.writeFile('resursi/izlozba.csv', csvData, (err) => {
				if (err) {
					console.error('Error pri kopiranju JSON u CSV:', err);
					return;
				}
			});
		});
	}
	
	prebaciJSONuCSV = function(newItem) {
		const Naziv = newItem['Naziv'] || 'undefined';
		const Opis = newItem['Opis'] || 'undefined';
		const Datum = newItem['Datum'] || 'undefined';
		const Autor = newItem['Autor'] || 'undefined';
		return `${Naziv}#${Opis}#${Datum}#${Autor}`;
	}
}

module.exports = DajIzlozbu;

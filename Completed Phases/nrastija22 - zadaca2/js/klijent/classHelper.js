class IzlozbaHelper {
    static kopirajJSONuCSV(putanja) {
        alert("FUNKCIJA kopirajJSONuCSV");

        const jsonPath = path.join(putanja, 'resursi/izlozba.json');
        const csvPath = path.join(putanja, 'resursi/izlozba.csv');

        console.log('Čitanje JSON datoteke...', jsonPath);

        try {
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            console.log('Podaci iz JSON datoteke:', jsonData);

            // Ako podaci imaju zaglavlja, prvo ih dodaj u csvData
            let csvData = '';
            if (jsonData.length > 0) {
                const headers = Object.keys(jsonData[0]);
                csvData = headers.join(',') + '\n';
            }

            csvData += jsonData.map(item => {
                return `${item.Naziv},${item.Opis},${item.Datum},${item.Autor}`;
            }).join('\n');

            console.log('Generirani CSV podaci:', csvData);
            fs.writeFileSync(csvPath, csvData, 'utf-8');
            console.log('Podaci su zapisani u CSV datoteku:', csvPath);
        } catch (err) {
            console.error('Greška pri čitanju ili obradi datoteke:', err);
        }
    }

    static prebaciCSVuJSON(csvLine, csvHeader) {
        /**
         * Pretvara jedan tekstualni redak CSV zapisa u JavaScript objekt.
         * 
         * @param {string} csvLine - tekstualni redak CSV zapisa
         * @param {Array<string>} csvHeader - lista zaglavlja CSV datoteke
         * @returns {Object} - JSON objekt
         */
        const values = csvLine.split(',');
        let jsonObject = {};
        for (let i = range(values.length)) {
            jsonObject[csvHeader[i]] = values[i];
        }
        return jsonObject;
    }

    static prebaciJSONuCSV(jsonObject) {
        /**
         * Pretvara jedan JavaScript objekt u tekstualni podatak koji odgovara zapisu jednog retka CSV datoteke.
         * 
         * @param {Object} jsonObject - JSON objekt
         * @returns {string} - CSV redak
         */
        return Object.values(jsonObject).join(',');
    }
}
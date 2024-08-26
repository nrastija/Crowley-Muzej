import '../klijent/nrastija22.js';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pocetakObrasca');
    form.addEventListener('submit', function (event) {
        let valid = 0;
        const textPattern = /^[a-zA-Z\s]+$/;
        const regexTextArea = /^(?!.*[<>#-])(?:[A-Z][^.!?]*[.!?]\s*){1,4}$/;

        function showInputError(elementId) {
            const errorElement = document.getElementById(elementId);
            errorElement.classList.add('label-error');
        }

        function clearInputError(elementId) {
            const errorElement = document.getElementById(elementId);
            errorElement.classList.remove('label-error');
        }

        function showEmptyError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            valid++;
        }

        function clearEmptyError(elementId) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = '';
        }

        const l_prez_ime = document.getElementById('ime_prezime');
        if (l_prez_ime.value.trim() === "") {
            showEmptyError('ime_prezime_error', 'Molimo unesite Vaše ime i prezime.');
        } else {
            if (!textPattern.test(l_prez_ime.value.trim())) {
                showEmptyError('ime_prezime_error', 'Molimo unesite tekst.');
                showInputError('ime_prezime');
            } else {
                clearEmptyError('ime_prezime_error');
                clearInputError('ime_prezime');
            }
        }

        const l_naziv = document.getElementById('naziv_proizvoda');
        if (l_naziv.value.trim() === "") {
            showEmptyError('naziv_proizvoda_error', 'Molimo unesite naziv proizvoda.');
        } else {
            if (!textPattern.test(l_naziv.value.trim())) {
                showEmptyError('naziv_proizvoda_error', 'Molimo unesite tekst.');
                showInputError('naziv_proizvoda');
            } else {
                clearEmptyError('naziv_proizvoda_error');
                clearInputError('naziv_proizvoda');
            }
        }

        const l_opis = document.getElementById('opis_proizvoda');
        if (l_opis.value.trim() === "") {
            showEmptyError('opis_proizvoda_error', 'Molimo unesite opis proizvoda.');
            showInputError('opis_proizvoda');
        } else {
            if (!regexTextArea.test(l_opis.value.trim())) {
                showEmptyError('opis_proizvoda_error', 'Tekst mora početi velikim slovom, završiti točkom i sadržavati najviše 4 rečenice. Svaka rečenica mora početi velikim slovom i završiti točkom, upitnikom ili uskličnikom. Znakovi <, >, # i - nisu dozvoljeni.');
                showInputError('opis_proizvoda');
            } else {
                clearEmptyError('opis_proizvoda_error');
                clearInputError('opis_proizvoda');
            }
        }

        const l_datum = document.getElementById('datum_preuzimanja');

        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 1);

        const maxDate = new Date(today);
        maxDate.setMonth(today.getMonth() + 1);

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        l_datum.min = formatDate(minDate);
        l_datum.max = formatDate(maxDate);

        if (l_datum.value === "") {
            showEmptyError('datum_preuzimanja_error', 'Molimo unesite datum preuzimanja proizvoda.');
        } else {
            const datum = new Date(l_datum.value);
            if (datum < minDate || datum > maxDate) {
                showEmptyError('datum_preuzimanja_error', 'Molimo unesite datum unutar dozvoljenog raspona.');
                showInputError('datum_preuzimanja');
            } else {
                clearEmptyError('datum_preuzimanja_error');
                clearInputError('datum_preuzimanja');
            }
        }

        const kategorijaSelect = document.getElementById('kategorija');
        const optgroups = kategorijaSelect.getElementsByTagName('optgroup');
        let optgroup1Selected = false;
        let optgroup2Selected = false;

        for (let i = 0; i < optgroups[0].children.length; i++) {
            if (optgroups[0].children[i].selected) {
                optgroup1Selected = true;
                break;
            }
        }

        for (let i = 0; i < optgroups[1].children.length; i++) {
            if (optgroups[1].children[i].selected) {
                optgroup2Selected = true;
                break;
            }
        }

        if (!optgroup1Selected) {
            showEmptyError('kategorija_error', 'Molimo odaberite opciju iz grupe "Vojna oprema".');
            showInputError('kategorija');
        } else if (!optgroup2Selected) {
            showEmptyError('kategorija_error', 'Molimo odaberite opciju iz grupe "Povijesni artefakti".');
            showInputError('kategorija');
        } else {
            clearEmptyError('kategorija_error');
            clearInputError('kategorija');
        }

        // Provjera numeričkog unosa za "godina_proizvodnje"
        const godinaProizvodnje = document.getElementById('godina_proizvodnje');
        const godinaProizvodnjeValue = parseInt(godinaProizvodnje.value, 10);
        const minGodinaProizvodnje = 0;
        const maxGodinaProizvodnje = 2024;

        if (isNaN(godinaProizvodnjeValue) || godinaProizvodnjeValue < minGodinaProizvodnje || godinaProizvodnjeValue > maxGodinaProizvodnje) {
            showEmptyError('godina_proizvodnje_error', `Molimo unesite ispravnu godinu proizvodnje (između ${minGodinaProizvodnje} i ${maxGodinaProizvodnje}).`);
            showInputError('godina_proizvodnje');
        } else {
            clearEmptyError('godina_proizvodnje_error');
            clearInputError('godina_proizvodnje');
        }

        // Provjera checkboxova
        const CheckBox_opcija1 = document.getElementById('opcija1');
        const CheckBox_opcija2 = document.getElementById('opcija2');
        const CheckBox_opcija3 = document.getElementById('opcija3');

        if (!CheckBox_opcija1.checked && !CheckBox_opcija2.checked && !CheckBox_opcija3.checked) {
            showEmptyError('izlozba_error', 'Molimo označite barem jednu vrstu izložbe.');
        } else {
            clearEmptyError('izlozba_error');
        }

        // Provjera materijala proizvoda
        const l_materijal = document.getElementById('materijal');
        if (l_materijal.value.trim() === "") {
            showEmptyError('materijal_error', 'Molimo unesite materijal proizvoda.');
        } else {
            if (!textPattern.test(l_materijal.value.trim())) {
                showEmptyError('materijal_error', 'Molimo unesite tekst.');
                showInputError('materijal');
            } else {
                clearEmptyError('materijal_error');
                clearInputError('materijal');
            }
        }

        const procjenjenaVrijednost = document.getElementById('procjenjena_vrijednost');
        const procjenjenaVrijednostValue = parseFloat(procjenjenaVrijednost.value);
        const minVrijednost = 0;
        const maxVrijednost = 1000000;

        if (isNaN(procjenjenaVrijednostValue) || procjenjenaVrijednostValue < minVrijednost || procjenjenaVrijednostValue > maxVrijednost) {
            showEmptyError('procjenjena_vrijednost_error', `Molimo unesite ispravnu procijenjenu vrijednost (između ${minVrijednost} i ${maxVrijednost}).`);
            showInputError('procjenjena_vrijednost');
        } else {
            clearEmptyError('procjenjena_vrijednost_error');
            clearInputError('procjenjena_vrijednost');
        }

        const l_stanje1 = document.getElementById('odlicno');
        const l_stanje2 = document.getElementById('dobro');
        const l_stanje3 = document.getElementById('potrebno_restauriranje');
        if (!l_stanje1.checked && !l_stanje2.checked && !l_stanje3.checked) {
            showEmptyError('stanje_error', 'Molimo odaberite stanje proizvoda.');
        } else {
            clearEmptyError('stanje_error');
        }

        const l_datoteka = document.getElementById('datoteka');
        if (l_datoteka.files.length === 0) {
            showEmptyError('datoteka_error', 'Molimo priložite datoteku.');
        } else {
            clearEmptyError('datoteka_error');
        }

        // Provjera kontakt informacija
        const l_kontakt = document.getElementById('kontakt');
        if (l_kontakt.value.trim() === "") {
            showEmptyError('kontakt_error', 'Molimo unesite kontakt informacije.');
        } else {
            clearEmptyError('kontakt_error');
        }

        // Provjera telefonskog broja
        const l_telefon = document.getElementById('telefon');
        const telPattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
        if (!telPattern.test(l_telefon.value)) {
            showEmptyError('telefon_error', 'Molimo unesite ispravan telefonski broj u formatu 09x-xxx-xxxx.');
        } else {
            clearEmptyError('telefon_error');
        }

        if (valid > 0) {
            event.preventDefault();
        }
    });
});

const ds = require('fs');

exports.dajListu = function () {
    let data = ds.readFileSync('resursi/izlozba.csv', 'utf-8');
    let lista = '';

    lista += `
        <form action="/popis" method="get">
            <button type="submit" name="popuni" value="true">Popuni</button>
        </form>
    `;

    var redovi = data.split('\n');
    lista += '<ul>';
    for (var red of redovi) {
        if (red.trim() === '') continue; // Skip empty rows
        var kolone = red.split('#'); // Assuming `#` as the delimiter
        const naziv = kolone[0];
        const ostaliPodaci = kolone.slice(1).join(' - ');
        lista += `<li><a href="#" onclick="obrisiElement('${naziv}')">${naziv}</a> - ${ostaliPodaci}</li>`;
    }
    lista += '</ul>';

    lista += `
        <script>
            function obrisiElement(naziv) {
                if (confirm('Želite li obrisati ovaj element: ' + naziv + '?')) {
                    window.location.href = '/brisi?naziv=' + encodeURIComponent(naziv);
                }
            }
        </script>
    `;

    return lista;
};
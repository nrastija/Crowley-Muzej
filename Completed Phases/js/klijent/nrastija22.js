/* kod za gumb za promjenu ekrana u desktop/mobile prikaz */

function postaviKolacice(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function dohvatiKolacice(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function promjenaEkrana() {
    var body = document.body;
    var button = document.getElementById('toggleButton');
    var currentVersion = dohvatiKolacice('version');

    if (currentVersion === 'mobile') {
        body.classList.remove('mobile-version');
        body.classList.add('desktop-version');
        button.textContent = 'Prebaci na mobilnu verziju';
        postaviKolacice('version', 'desktop', 7);
    } else {
        body.classList.remove('desktop-version');
        body.classList.add('mobile-version');
        button.textContent = 'Prebaci na stolnu verziju';
        postaviKolacice('version', 'mobile', 7);
    }
}

window.onload = function() {
    var body = document.body;
    var button = document.getElementById('toggleButton');
    var currentVersion = dohvatiKolacice('version');

    if (currentVersion === 'mobile') {
        body.classList.add('mobile-version');
        body.classList.remove('desktop-version');
        button.textContent = 'Prebaci na stolnu verziju';
    } else {
        body.classList.add('desktop-version');
        body.classList.remove('mobile-version');
        button.textContent = 'Prebaci na mobilnu verziju';
    }

    button.addEventListener('click', promjenaEkrana);
}
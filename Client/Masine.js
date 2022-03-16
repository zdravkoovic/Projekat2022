export class Masine
{
    constructor(id, naziv, potrosnja, cenaGoriva, klasa)
    {
        this.id = id;
        this.naziv = naziv;
        this.potrosnja = potrosnja;
        this.cenaGoriva = cenaGoriva;
        this.klasa = klasa;
    }
    crtajMasine(host)
    {
        var naziv = document.createElement("td");
        naziv.innerHTML = this.naziv;
        host.appendChild(naziv);

        var potrosnja = document.createElement("td");
        potrosnja.innerHTML = this.potrosnja;
        host.appendChild(potrosnja);

        var cenaGoriva = document.createElement("td");
        cenaGoriva.innerHTML = this.cenaGoriva;
        host.appendChild(cenaGoriva);

        var ikon = document.createElement("td");
        var div = document.createElement("div");
        div.className = this.klasa;
        div.classList.add("Masina" + this.id);
        div.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
        ikon.appendChild(div);
        host.appendChild(ikon);
        host.title = this.email;
    }
}
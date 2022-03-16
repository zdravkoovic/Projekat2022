export class Materijal
{
    constructor(id, naziv, klasa, kolicina, cena, drugaKlasa)
    {
        this.id = id;
        this.naziv = naziv;
        this.klasa = klasa;
        this.kolicina = kolicina;
        this.cena = cena;
        this.drugaKlasa = drugaKlasa;
    }
    crtajMaterijale(host)
    {
        var naziv = document.createElement("td");
        naziv.innerHTML = this.naziv;
        host.appendChild(naziv);

        var klasa = document.createElement("td");
        klasa.innerHTML = this.klasa;
        host.appendChild(klasa);

        var kolicina = document.createElement("td");
        kolicina.innerHTML = this.kolicina;
        host.appendChild(kolicina);

        var cena = document.createElement("td");
        cena.innerHTML = this.cena;
        host.appendChild(cena);

        var ikon = document.createElement("td");
        var div = document.createElement("div");
        div.className = this.drugaKlasa;
        div.classList.add("Materijal" + this.id);
        div.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
        ikon.appendChild(div);
        host.appendChild(ikon);
    }
}
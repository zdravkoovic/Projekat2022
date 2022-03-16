export class Radnici
{
    constructor(id, ime, prezime, dnevnica, iskustvo, email, klasa)
    {
        this.id = id;
        this.ime = ime;
        this.prezime = prezime;
        this.dnevnica = dnevnica;
        this.iskustvo = iskustvo;
        this.email = email;
        this.klasa = klasa;
    }
    crtajRadnika(host)
    {
        var imeIPrezime = document.createElement("td");
        var a = document.createElement("a");
        a.innerHTML = this.ime + " " + this.prezime;
        a.href="mailto:"+this.email;
        imeIPrezime.appendChild(a);
        host.appendChild(imeIPrezime);

        var dnevnica = document.createElement("td");
        dnevnica.innerHTML = this.dnevnica;
        host.appendChild(dnevnica);

        var td = document.createElement("td");

        var span = document.createElement("span");
        span.innerHTML = this.iskustvo;
        if(this.iskustvo <= 5)
        {
            span.className = "crveno";
        }
        else if(this.iskustvo > 5 && this.iskustvo <= 7)
        {
            span.className = "zuto";
        }
        else
        {
            span.className = "zeleno"
        }
        td.appendChild(span);
        host.appendChild(td);
        var ikon = document.createElement("td");
        var div = document.createElement("div");
        div.className = this.klasa;
        div.classList.add("Radnik" + this.id);
        div.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
        ikon.appendChild(div);
        host.appendChild(ikon);
        host.title = this.email;
    }
}
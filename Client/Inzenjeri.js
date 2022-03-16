export class Inzenjeri
{
    constructor(id, ime, prezime, dnevnica, licenca, email, klasa)
    {
        this.id = id;
        this.ime = ime;
        this.prezime = prezime;
        this.dnevnica = dnevnica;
        this.licenca = licenca;
        this.email = email;
        this.klasa = klasa;
    }
    crtajInzenjera(host)
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
        span.innerHTML = this.licenca;
        if(this.licenca >= 300 && this.licenca < 400)
        {
            span.className = "crveno";
            span.title = "Arhitekta";
        }
        else if(this.licenca >=400 && this.licenca < 500)
        {
            span.className = "zeleno";
            span.title = "Građevinski inženjer";
        }
        td.appendChild(span);
        host.appendChild(td);

        var ikon = document.createElement("td");
        var div = document.createElement("div");
        div.className = this.klasa;
        div.classList.add("Inzenjer" + this.id);
        div.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
        ikon.appendChild(div);
        host.appendChild(ikon);
        host.title = this.email;
    }
}
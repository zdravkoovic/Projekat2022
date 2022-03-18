import { Inzenjeri } from "./Inzenjeri.js";
import { Radnici } from "./Radnici.js";
import { Materijal } from "./Materijal.js";
import { Masine } from "./Masine.js";

export class Projekti {
    constructor() {
        this.kont = null;
    }
    crtaj(host) {

        this.kont = document.createElement("div");
        this.kont.className = "PrikazProjekata";
        host.appendChild(this.kont);

        var div = document.createElement("div");
        div.className = "Tekst0";
        this.kont.appendChild(div);

        var tekst0 = document.createElement("label");
        tekst0.innerHTML = "- Građevinski projekti -"
        tekst0.className = "Gradjevina";
        div.appendChild(tekst0);

        var prikaz = document.createElement("div");
        prikaz.className = "DivProjekata";
        this.kont.appendChild(prikaz);

        var projekti = document.createElement("div");
        projekti.className = "projekti";
        prikaz.appendChild(projekti);

        this.ponudiProjekte(projekti);
    }
    ponudiProjekte(host) {
        var div = document.createElement("div");
        div.className = "Projekat";
        host.appendChild(div);

        fetch("https://localhost:5001/Projekti/NazivProjekta", {
            method: "GET"
        }).then(p => {
            p.json().then(datas => {
                datas.forEach(element => {
                    var divZaLabel = document.createElement("div");
                    divZaLabel.className = "divZaLabel";
                    div.appendChild(divZaLabel);

                    var label = document.createElement("label");
                    label.className = "LabelProjekat";
                    label.innerHTML = element.naziv + " - " + element.adresa;
                    divZaLabel.appendChild(label);

                    var datum = new Date(element.datumPocetka);
                    datum = datum.toLocaleDateString("en-UK");

                    label.onclick = () => this.OtvoriProjekat(element.id);
                    label.addEventListener("mouseover", function(){
                        label.innerHTML = datum;
                    });
                    label.addEventListener("mouseleave", function(){
                        label.innerHTML = element.naziv + " - " + element.adresa;
                    });
                })
                var divZaLabel = document.createElement("div");
                divZaLabel.className = "divZaLabel";
                div.appendChild(divZaLabel);

                var divIcon = document.createElement("div");
                divIcon.classList.add("divIcon");
                divIcon.innerHTML = '<ion-icon name="add-circle-sharp"></ion-icon>';
                divZaLabel.appendChild(divIcon);
                divIcon.onclick = () => this.NoviProjekat();
            })
        })
    }
    NoviProjekat()
    {
        var parent = this.kont.parentNode;
        parent.removeChild(this.kont);

        this.kont = document.createElement("div");
        this.kont.className = "noviProjekat";
        document.body.appendChild(this.kont);

        var divGoHome = document.createElement("div");
        divGoHome.innerHTML = '<ion-icon name="home"></ion-icon>';
        divGoHome.className = "goHome";
        divGoHome.classList.add("active");
        this.kont.appendChild(divGoHome);
        divGoHome.onclick = () => this.GoHome2();

        var div = document.createElement("div");
        div.className = "divZaNoviProjekat";
        this.kont.appendChild(div);

        var ikona = document.createElement("div");
        ikona.className = "noviProjekatIkona";
        ikona.innerHTML = '<ion-icon name="add-outline"></ion-icon>';
        div.appendChild(ikona);

        var divZaPodatke = document.createElement("div");
        divZaPodatke.className = "noviDivZaPodatke";

        var Lista = ["Projekat", "Adresa", "Datum"];
        Lista.forEach(el=>{
            var podaci = document.createElement("div");
            podaci.className = "noviProjekatPodaci";
            
            var label = document.createElement("label");
            label.innerHTML = el;

            var input = document.createElement("input");
            if(el == "Datum")
                input.type = "date";
            else
                input.type = "text";
            
            podaci.appendChild(label);
            podaci.appendChild(input);
            divZaPodatke.appendChild(podaci);
        })
        var divZaBtn = document.createElement("div");
        divZaBtn.className = "noviDivZaBtn";

        var btn = document.createElement("button");
        btn.innerHTML = "Done";

        btn.onclick = () => this.OtvoriNoviProjekat();

        divZaBtn.appendChild(btn);
        div.appendChild(divZaPodatke);
        div.appendChild(divZaBtn);
    }
    OtvoriNoviProjekat()
    {
        var val = [];
        var vrednosti = this.kont.querySelectorAll(".noviDivZaPodatke input");
        vrednosti.forEach(el=>{
            val.push(el.value);
        })
        if(val[0] == ""){
            alert("Popunite polje Projekat!");
            return;
        }
        if(val[1] == ""){
            alert("Popunite polje Adresa!");
            return;
        }
        if(val[2] == ""){
            alert("Popunite polje Datum!");
            return;
        }
        fetch("https://localhost:5001/Projekti/DodajProjekat/"+val[0]+"/"+val[1]+"/"+val[2],{
            method: "POST"
        }).then(p=>{
            if(p.ok)
            {
                p.json().then(data=>{
                    this.OtvoriProjekat(data);
                })
            }
        })
    }
    DodajUSpisak(brojVrednost, tekst, ikonaHtml){

        var opis = this.kont.querySelector(".opis"+tekst);

        var broj = document.createElement("label");
        broj.className = "broj";
        if(tekst == "Inzenjera")
        {
            broj.classList.add("brojInzenjera");
            tekst = "Inženjera";
        }
        else if(tekst == "Radnika")
        {
            broj.classList.add("brojRadnika");
        }
        else if(tekst == "Materijala")
        {
            broj.classList.add("brojMaterijala");
        }
        else
        {
            broj.classList.add("brojMasina");
        }
        if(brojVrednost >= 1000)
        {
            broj.innerHTML = parseFloat(brojVrednost/1000).toFixed(1);
        }
        else
        broj.innerHTML = brojVrednost;

        opis.appendChild(broj);

        if (tekst == "Materijala") {
            var brojJedinica = document.createElement("label");
            brojJedinica.className = "broj jedinica";
            if(brojVrednost >= 1000)
            brojJedinica.innerHTML = "t";
            else
            brojJedinica.innerHTML = "kg";
            broj.appendChild(brojJedinica);
        }

        var naziv = document.createElement("label");
        naziv.className = "labelNaziv";
        naziv.innerHTML = tekst;
        opis.appendChild(naziv);

        var ikona = this.kont.querySelector(".ikona"+tekst);
        ikona.innerHTML = ikonaHtml;
    }
    OtvoriProjekat(IDProjekta) {
        var parent = this.kont.parentNode;
        parent.removeChild(this.kont);
        this.kont = document.createElement("div");
        this.kont.className = "OtvoriProjekat";
        document.body.appendChild(this.kont);

        var divZaIkonice = document.createElement("div");
        divZaIkonice.className = "problematicneIkonice";

        var divGoHome = document.createElement("div");
        divGoHome.innerHTML = '<ion-icon name="home"></ion-icon>';
        divGoHome.className = "goHome";
        divZaIkonice.appendChild(divGoHome);
        divGoHome.onclick = () => this.GoHome();

        var btn = document.createElement("button");
        btn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
        btn.className = "obrisiProjekat";
        divZaIkonice.appendChild(btn);

        btn.onclick = () => this.obrisiProjekat(IDProjekta);

        var div = document.createElement("div");
        div.className = "divZaNaslov";
        this.kont.appendChild(div);
        this.kont.appendChild(divZaIkonice);

        var divZaStanje = document.createElement("div");
        divZaStanje.className = "BrojnoStanje";
        this.kont.appendChild(divZaStanje);

        var divZaBS = document.createElement("div");
        divZaBS.className = "divZaBS";
        divZaStanje.appendChild(divZaBS);

        var opis = document.createElement("div");
        opis.className = "opisInzenjera";
        opis.classList.add("opis");
        divZaBS.appendChild(opis);

        var ikona = document.createElement("div");
        ikona.className = "ikonaInženjera";
        ikona.classList.add("ikona");
        divZaBS.appendChild(ikona);

        var divZaBS = document.createElement("div");
        divZaBS.className = "divZaBS";
        divZaStanje.appendChild(divZaBS);

        var opis = document.createElement("div");
        opis.className = "opisRadnika";
        opis.classList.add("opis");
        divZaBS.appendChild(opis);

        var ikona = document.createElement("div");
        ikona.className = "ikonaRadnika";
        ikona.classList.add("ikona");
        divZaBS.appendChild(ikona);

        var divZaBS = document.createElement("div");
        divZaBS.className = "divZaBS";
        divZaStanje.appendChild(divZaBS);

        var opis = document.createElement("div");
        opis.className = "opisMaterijala";
        opis.classList.add("opis");
        divZaBS.appendChild(opis);

        var ikona = document.createElement("div");
        ikona.className = "ikonaMaterijala";
        ikona.classList.add("ikona");
        divZaBS.appendChild(ikona);

        var divZaBS = document.createElement("div");
        divZaBS.className = "divZaBS";
        divZaStanje.appendChild(divZaBS);

        var opis = document.createElement("div");
        opis.className = "opisMašina";
        opis.classList.add("opis");
        divZaBS.appendChild(opis);

        var ikona = document.createElement("div");
        ikona.className = "ikonaMašina";
        ikona.classList.add("ikona");
        divZaBS.appendChild(ikona);

        fetch("https://localhost:5001/Projekti/Projekat/" + IDProjekta, {
            method: "GET"
        }).then(p => {
            p.json().then(data => {
                var naslov = document.createElement("h2");
                naslov.className = "Naslov";
                naslov.innerHTML = data.naziv + " - " + data.adresa;
                div.appendChild(naslov);
                naslov.onclick = () => this.PromeniNaziv(IDProjekta);
            })
        })

        divZaStanje.appendChild(divZaBS);

        fetch("https://localhost:5001/Inzenjer/Brojevi/" + IDProjekta, {
            method: "GET"
        }).then(p => {
            p.json().then(broj => {
                this.DodajUSpisak(broj, "Inzenjera", '<ion-icon name="construct-outline"></ion-icon>');
            })
        })
        fetch("https://localhost:5001/Radnici/Brojevi/" + IDProjekta, {
            method: "GET"
        }).then(p => {
            p.json().then(broj => {
                this.DodajUSpisak(broj, "Radnika", '<ion-icon name="people-outline"></ion-icon>');
            })
        })
        fetch("https://localhost:5001/Materijal/Brojevi/" + IDProjekta, {
            method: "GET"
        }).then(p => {
            p.json().then(broj => {
                this.DodajUSpisak(broj, "Materijala", '<ion-icon name="attach-outline"></ion-icon>');
            })
        })
        fetch("https://localhost:5001/Masine/Brojevi/" + IDProjekta, {
            method: "GET"
        }).then(p => {
            p.json().then(broj => {
                this.DodajUSpisak(broj,"Mašina",'<ion-icon name="speedometer-outline"></ion-icon>');
            })
        })

        this.DodajLjude(this.kont, IDProjekta);
        this.crtajRadnike(this.kont, IDProjekta);
        this.DodajResurse(this.kont, IDProjekta);
        this.crtajResurse(this.kont, IDProjekta);
    }
    obrisiProjekat(IDProjekta)
    {
        if(confirm("Da li ste sigurni da želite obrisati projekat?") == true)
        {
            fetch("https://localhost:5001/Projekti/ObrisiProjekat/"+IDProjekta,{
                method: "DELETE"
            }).then(p=>{
                if(p.ok)
                {
                    console.log("Projekat je obrisan!");
                    this.GoHome();   
                }
            })
        }
    }
    GoHome()
    {
        this.kont.remove();
        this.crtaj(document.body);
    }
    GoHome2()
    {
        var goHome = this.kont.querySelector(".goHome.active");
        goHome.classList.remove('active');
        this.GoHome();
    }
    DodajLjude(host, IDProjekta) {
        var divDodaj = document.createElement("div");
        divDodaj.className = "divDodajRadnika";
        host.appendChild(divDodaj);

        var divZaInzenjere = document.createElement("div");
        divZaInzenjere.className = "Dodaj";
        divDodaj.appendChild(divZaInzenjere);

        var divInzenjer = document.createElement("div");
        divInzenjer.innerHTML = '<ion-icon name="construct-outline"></ion-icon>';
        divZaInzenjere.appendChild(divInzenjer);

        var divZaKasnije = document.createElement("div");
        divZaKasnije.className = "divZaKasnije";
        divZaInzenjere.appendChild(divZaKasnije);

        var div = this.divPodaci("Ime");
        var ime = document.createElement("input");
        ime.type = "text";
        ime.className = "inputIme";
        div.appendChild(ime);
        divZaKasnije.appendChild(div);

        var div = this.divPodaci("Prezime");
        var prezime = document.createElement("input");
        prezime.type = "text";
        prezime.className = "inputPrezime";
        div.appendChild(prezime);
        divZaKasnije.appendChild(div);

        var div = this.divPodaci("Email");
        var email = document.createElement("input");
        email.type = "text";
        email.className = "inputEmail";
        div.appendChild(email);
        divZaKasnije.appendChild(div);

        var div = this.divPodaci("Dnevnica");
        var dnevnica = document.createElement("input");
        dnevnica.type = "number";
        dnevnica.className = "inputDnevnica";
        dnevnica.placeholder = "1000 - 10000";
        dnevnica.min = 1000;
        dnevnica.max = 10000;
        dnevnica.step = 100;
        div.appendChild(dnevnica);
        divZaKasnije.appendChild(div);

        var div = this.divPodaci("Licenca");
        var radio = document.createElement("div");
        radio.className = "divRadio";
        
        var label = document.createElement("label");
        label.innerHTML = 310 + " ";
        var rd = document.createElement("input");
        rd.type = "radio";
        rd.value = 310;
        rd.name = "radio";
        rd.checked = true;   
        label.appendChild(rd);
        radio.appendChild(label);
        // radio.appendChild(input);

        var label = document.createElement("label");
        label.innerHTML = 410 + " ";
        var r = document.createElement("input");
        r.type = "radio";
        r.value = 410;
        r.name = "radio";
        label.appendChild(r);
        radio.appendChild(label);
        // radio.appendChild(r);

        div.appendChild(radio);
        divZaKasnije.appendChild(div);

        var divPodaci = document.createElement("div");
        divZaKasnije.appendChild(divPodaci);

        var btn = document.createElement("button");
        btn.innerHTML = "Dodaj";
        divPodaci.appendChild(btn);

        btn.onclick = () => this.DodajInzenjera(IDProjekta, ime.value, prezime.value, email.value, dnevnica.value);

        // ===============================================================

        var divZaRadnike = document.createElement("div");
        divZaRadnike.className = "Dodaj";
        divZaRadnike.classList.add("dodajRadnika");
        divDodaj.appendChild(divZaRadnike);

        var div = document.createElement("div");
        div.innerHTML = '<ion-icon name="person-outline"></ion-icon>';
        divZaRadnike.appendChild(div);

        var divZaKasnije = document.createElement("div");
        divZaKasnije.className = "divZaKasnije";
        divZaRadnike.appendChild(divZaKasnije);

        var div = this.divPodaci("Ime");
        var imeRadnika = document.createElement("input");
        imeRadnika.type = "text";
        imeRadnika.className = "inputImeRadnika";
        div.appendChild(imeRadnika);
        divZaKasnije.appendChild(div);

        var div = this.divPodaci("Prezime");
        var prezimeRadnika = document.createElement("input");
        prezimeRadnika.type = "text";
        prezimeRadnika.className = "inputPrezimeRadnika";
        div.appendChild(prezimeRadnika);
        divZaKasnije.appendChild(div);

        var div = this.divPodaci("Email");
        var emailRadnika = document.createElement("input");
        emailRadnika.type = "text";
        emailRadnika.className = "inputEmailRadnika";
        div.appendChild(emailRadnika);
        divZaKasnije.appendChild(div);

        var div = this.divPodaci("Dnevnica");
        var dnevnicaRadnika = document.createElement("input");
        dnevnicaRadnika.type = "number";
        dnevnicaRadnika.className = "inputDnevnica";
        dnevnicaRadnika.classList.add("inputDnevnicaRadnika");
        dnevnicaRadnika.placeholder = "1000 - 4000";
        dnevnicaRadnika.min = 1000;
        dnevnicaRadnika.max = 4000;
        dnevnicaRadnika.step = 100;
        div.appendChild(dnevnicaRadnika);
        divZaKasnije.appendChild(div);

        var div = this.divPodaci("Iskustvo");
        var range = document.createElement("div");
        range.className = "range";
        var input = document.createElement("input");
        input.type = "range";
        input.className = "range";
        input.min = 1;
        input.max = 10;
        input.value = 6;
        var val = document.createElement("label");
        val.innerHTML = input.value
        input.addEventListener("mousemove", function(){
            val.innerHTML = input.value;
        })
        range.appendChild(input);
        range.appendChild(val);
        div.appendChild(range);
        divZaKasnije.appendChild(div);

        var divPodaci = document.createElement("div");
        div.appendChild(divPodaci);

        var btn = document.createElement("button");
        btn.innerHTML = "Dodaj";
        divPodaci.appendChild(btn);
        divZaKasnije.appendChild(divPodaci);

        btn.onclick = () => this.DodajRadnika(IDProjekta, imeRadnika.value, prezimeRadnika.value, emailRadnika.value, dnevnicaRadnika.value, input.value);
    }
    DodajInzenjera(IDProjekta, ime, prezime, email, dnevnica)
    {
        if(ime == "")
        {
            alert("Ime inženjera je neispravno uneto");
            return;
        }
        if(prezime == "")
        {
            alert("Prezime inženjera je neispravno uneto");
            return;
        }
        var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(email == "" || !email.match(mailFormat))
        {
            alert("Email inženjera je neispravno unet");
            return;
        }
        if(dnevnica == "" || dnevnica < 1000 || dnevnica > 10000)
        {
            alert("Dnevnica inženjera je neispravno uneta");
            return;
        }
        var dodaj = this.kont.querySelector(".Dodaj");
        var vrednost = dodaj.querySelector("input[name=radio]:checked").value;
        fetch("https://localhost:5001/Inzenjer/InzenjerProjekat/"+IDProjekta+"/"+ime+"/"+prezime+"/"+email+"/"+dnevnica+"/"+vrednost,{
            method: "POST"
        }).then(p=>{
            if(p.ok)
            {
                p.json().then(data=>{
                    if(data != 1)
                        this.RefreshInzenjera(IDProjekta, 1, "delInzenjera");
                })
            }
        })
    }
    DodajRadnika(IDProjekta, ime, prezime, email, dnevnica, iskustvo)
    {
        if(ime == "" || ime.includes("/"))
        {
            alert("Ime radnika je neispravno uneto");
            return;
        }
        if(prezime == "" || ime.includes("/"))
        {
            alert("Prezime radnika je neispravno uneto");
            return;
        }
        if(email == "")
        {
            alert("Email radnika je neispravno unet");
            return;
        }
        if(dnevnica == "" || dnevnica < 1000 || dnevnica > 4000)
        {
            alert("Dnevnica radnika je neispravno uneta");
            return;
        }
        var dodaj = this.kont.querySelector(".dodajRadnika");
        fetch("https://localhost:5001/Radnici/RadnikProjekat/"+IDProjekta+"/"+ime+"/"+prezime+"/"+email+"/"+dnevnica+"/"+iskustvo,{
            method: "POST"
        }).then(p=>{
            if(p.ok)
            {
                p.json().then(data=>{
                    if(data == 1)
                        this.RefreshRadnika(IDProjekta, 1, "delRadnika");
                })
            }
        })
    }
    RefreshRadnika(IDProjekta, num, klasa)
    {
        var tbody = this.kont.querySelector(".TabelaPodatakaRadnika");
        var parent = tbody.parentNode;
        parent.removeChild(tbody);

        var tbody = document.createElement("tbody");
        tbody.className = "TabelaPodatakaRadnika";

        var div = this.kont.querySelector(".divZaRadnike");
        this.Tabela(div, tbody, IDProjekta, klasa);

        var broj = this.kont.querySelector(".brojRadnika");
        broj.innerHTML = parseInt(broj.innerHTML) + num;

        var input = this.kont.querySelector(".inputImeRadnika");
        input.value = "";
        var input = this.kont.querySelector(".inputPrezimeRadnika");
        input.value = "";
        var input = this.kont.querySelector(".inputEmailRadnika");
        input.value = "";
        var input = this.kont.querySelector(".inputDnevnicaRadnika");
        input.value = "";
        var input = this.kont.querySelector(".range");
        input.value = 6;

        parent.appendChild(tbody);
    }
    RefreshInzenjera(IDProjekta, num, klasa)
    {
        var tbodyInzenjera = this.kont.querySelector(".TabelaPodatakaInzenjera");
        var parent = tbodyInzenjera.parentNode;
        parent.removeChild(tbodyInzenjera);

        var tbodyInzenjera = document.createElement("tbody");
        tbodyInzenjera.className = "TabelaPodatakaInzenjera";

        var div = this.kont.querySelector(".divZaInzenjere");
        this.Tabela(div, tbodyInzenjera, IDProjekta, klasa);

        var broj = this.kont.querySelector(".brojInzenjera");
        broj.innerHTML = parseInt(broj.innerHTML) + num;

        var input = this.kont.querySelector(".inputIme");
        input.value = "";
        var input = this.kont.querySelector(".inputPrezime");
        input.value = "";
        var input = this.kont.querySelector(".inputEmail");
        input.value = "";
        var input = this.kont.querySelector(".inputDnevnica");
        input.value = "";

        parent.appendChild(tbodyInzenjera);
    }
    divPodaci(el)
    {
        var divPodaci = document.createElement("div");
        divPodaci.className = "Podaci";

        var label = document.createElement("label");
        label.innerHTML = el;
        divPodaci.appendChild(label);

        return divPodaci;
    }
    PromeniNaziv(IDProjekta) {
        var child = this.kont.querySelector(".Naslov");
        child.classList.add("active");

        var div = this.kont.querySelector(".divZaNaslov");

        var input = document.createElement("input");
        input.type = "text";
        input.className = "noviNaslov";
        input.placeholder = "Projekat - adresa";
        div.appendChild(input);

        input.addEventListener("keypress", function (e) {
            if (e.key == "Enter") {
                div.removeChild(input);
                if(input.value.includes(" - "))
                {
                    var nazivAdresa = input.value.split(" - ");
                    fetch("https://localhost:5001/Projekti/PromeniNazivProjekta/"+IDProjekta
                    +"/"+nazivAdresa[0]+"?adresa="+nazivAdresa[1],{
                        method: "PUT"
                    }).then(p=>{
                        if(p.ok)
                        {
                            child.innerHTML = input.value;
                        }
                    })
                }
                else
                {
                    alert("Format je neispravan!\nFormat: projekat - adresa");
                    child.classList.remove("active");
                }

                child.classList.remove("active");
            }
            else if(e.key == "q")
            {
                div.removeChild(input);
                child.classList.remove("active");   
            }
        });

    }
    crtajRadnike(host, IDProjekta) {
        var divZaTabele = document.createElement("div");
        divZaTabele.className = "divZaTabele";
        host.appendChild(divZaTabele);

        var divZaInzenjere = document.createElement("div");
        divZaInzenjere.className = "divZaInzenjere";
        divZaTabele.appendChild(divZaInzenjere);

        var divZaNaslov = document.createElement("div");
        divZaNaslov.className = "naslovInzenjeri";
        divZaInzenjere.appendChild(divZaNaslov);

        var label = document.createElement("h3");
        label.className = "labelInzenjera";
        label.innerHTML = "Inženjeri"
        divZaNaslov.appendChild(label);

        var divZaRadnike = document.createElement("div");
        divZaRadnike.className = "divZaRadnike";
        divZaTabele.appendChild(divZaRadnike);

        var divZaNaslov = document.createElement("div");
        divZaNaslov.className = "naslovRadnici";
        divZaRadnike.appendChild(divZaNaslov);

        var label = document.createElement("h3");
        label.className = "labelRadnika";
        label.innerHTML = "Radnici"
        divZaNaslov.appendChild(label);

        this.NapraviTabeleLjudi(divZaInzenjere, IDProjekta);
        this.NapraviTabeleLjudi(divZaRadnike, IDProjekta);
    }
    NapraviTabeleLjudi(host, IDProjekta) {

        var tabela = document.createElement("table");
        tabela.className = "Tabela";
        host.appendChild(tabela);

        var thead = document.createElement("thead");
        thead.className = "zaglavljeTabele";
        tabela.appendChild(thead);

        var tableBody = document.createElement("tbody");
        tabela.appendChild(tableBody);

        var tr = document.createElement("tr");
        thead.appendChild(tr);

        if (host.className == "divZaRadnike") {
            var Lista = ["Radnik", "Dnevnica", "Iskustvo"];
            Lista.forEach(el => {
                var th = document.createElement("th");
                th.innerHTML = el;
                tr.appendChild(th);
            })
            var deleteRadnika = document.createElement("div");
            deleteRadnika.className = "deleteRadnika";
            deleteRadnika.innerHTML = '<ion-icon name="close"></ion-icon>';
            deleteRadnika.title = "Izbriši radnika";
            var th = document.createElement("th");
            th.appendChild(deleteRadnika);
            tr.appendChild(th);
            deleteRadnika.onclick = () => this.izbrisiRadnika();

            tableBody.className = "TabelaPodatakaRadnika";
            this.Tabela(host, tableBody, IDProjekta, "delRadnika");
        }
        else {
            var Lista = ["Inženjer", "Dnevnica", "Licenca"];
            Lista.forEach(el => {
                var th = document.createElement("th");
                th.innerHTML = el;
                tr.appendChild(th);
            })
            var deleteInzenjera = document.createElement("div");
            deleteInzenjera.className = "deleteInzenjera";
            deleteInzenjera.innerHTML = '<ion-icon name="close"></ion-icon>';
            deleteInzenjera.title = "Izbriši inženjera";
            var th = document.createElement("th");
            th.appendChild(deleteInzenjera);
            tr.appendChild(th);
            deleteInzenjera.onclick = () => this.izbrisiInzenjera();

            tableBody.className = "TabelaPodatakaInzenjera";
            this.Tabela(host, tableBody, IDProjekta, "delInzenjera");
        }
    }
    Tabela(host, tableBody, IDProjekta, klasa)
    {
        if(host.className == "divZaRadnike")
        {

            fetch("https://localhost:5001/Radnici/Radnici/"+IDProjekta,{
                    method: "GET"
                }).then(p=>{
                    p.json().then(datas=>{
                        datas.forEach(element=>{
                            var newtr = document.createElement("tr");
                            tableBody.appendChild(newtr);
                            var radnici = new Radnici(element.id, element.ime, element.prezime, element.dnevnica,
                                element.iskustvo, element.email, klasa);
                            radnici.crtajRadnika(newtr);
                            var del = this.kont.querySelector(".Radnik"+element.id);
                            del.onclick = () => this.OtpustiRadnika(IDProjekta, element.id);
                        })
                    })
                })
        }
        else
        {
            fetch("https://localhost:5001/Inzenjer/Inzenjeri/"+IDProjekta,{
                method: "GET"
            }).then(p=>{
                p.json().then(datas=>{
                    datas.forEach(element=>{
                        var newtr = document.createElement("tr");
                        tableBody.appendChild(newtr);
                        var inzenjer = new Inzenjeri(element.id, element.ime, element.prezime, element.dnevnica,
                            element.licenca, element.email, klasa);
                        inzenjer.crtajInzenjera(newtr);
                        var del = this.kont.querySelector(".Inzenjer"+element.id);
                        del.onclick = () => this.OtpustiInzenjera(IDProjekta, element.id);
                    })
                })
            })
        }
    }
    OtpustiInzenjera(IDProjekta, IDInzenjera)
    {
        fetch("https://localhost:5001/Inzenjer/OtpustiInzenjera/"+IDProjekta+"/"+IDInzenjera,{
            method: "DELETE"
        }).then(p=>{
            if(p.ok)
            {
                this.RefreshInzenjera(IDProjekta, -1, "delInzenjera active");
            }
        })
    }
    izbrisiInzenjera()
    {
        var del = this.kont.querySelectorAll(".delInzenjera");
        del.forEach(el=>{
            el.classList.add('active');
        })
        var delInzenjera = document.querySelector(".deleteInzenjera");
        delInzenjera.classList.toggle('active');
        delInzenjera.innerHTML = '<ion-icon name="checkmark-sharp"></ion-icon>';
        delInzenjera.onclick = () => this.closeInzenjera();
    }
    closeInzenjera()
    {
        var del = this.kont.querySelectorAll(".delInzenjera");
        del.forEach(el=>{
            el.classList.remove('active');
        })

        var delInzenjera = document.querySelector(".deleteInzenjera");
        delInzenjera.innerHTML = '<ion-icon name="close"></ion-icon>';
        delInzenjera.classList.remove('active');
        delInzenjera.onclick = () => this.izbrisiInzenjera();
    }
    OtpustiRadnika(IDProjekta, IDRadnika)
    {
        fetch("https://localhost:5001/Radnici/OtpustiRadnika/"+IDRadnika,{
            method: "DELETE"
        }).then(p=>{
            if(p.ok)
            {
                this.RefreshRadnika(IDProjekta, -1, "delRadnika active");
            }
        })
    }
    izbrisiRadnika()
    {
        var del = this.kont.querySelectorAll(".delRadnika");
        del.forEach(el=>{
            el.classList.add('active');
        })
        var delRadnika = document.querySelector(".deleteRadnika");
        delRadnika.classList.toggle('active');
        delRadnika.innerHTML = '<ion-icon name="checkmark-sharp"></ion-icon>';
        delRadnika.onclick = () => this.closeRadnika();
    }
    closeRadnika()
    {
        var del = this.kont.querySelectorAll(".delRadnika");
        del.forEach(el=>{
            el.classList.remove('active');
        })

        var delRadnika = document.querySelector(".deleteRadnika");
        delRadnika.innerHTML = '<ion-icon name="close"></ion-icon>';
        delRadnika.classList.remove('active');
        delRadnika.onclick = () => this.izbrisiRadnika();
    }
    divZaTekst(tekst)
    {
        var Podaci = document.createElement("div");
        Podaci.className = "podaciResursa";
        // var label = document.createElement("label");
        // label.innerHTML = tekst;
        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = tekst;
        // Podaci.appendChild(label);
        Podaci.appendChild(input);
        return Podaci;
    }
    divZaBroj(tekst)
    {
        var Podaci = document.createElement("div");
        Podaci.className = "podaciResursa";
        // var label = document.createElement("label");
        // label.innerHTML = tekst;
        var input = document.createElement("input");
        input.type = "number";
        input.placeholder = tekst;
        // Podaci.appendChild(label);
        Podaci.appendChild(input);
        return Podaci;
    }
    DodajResurse(host, IDProjekta) 
    {
        var divZaDodaj = document.createElement("div");
        divZaDodaj.className = "divZaDodajResurse";

        var divZaMaterijal = document.createElement("div");
        divZaMaterijal.className = "divZaIkonuMaterijala active";

        var ikona = document.createElement("div");
        ikona.innerHTML = '<ion-icon name="attach-outline"></ion-icon>';
        divZaMaterijal.appendChild(ikona);
        divZaDodaj.appendChild(divZaMaterijal);
        host.appendChild(divZaDodaj);

        // ===================================================================
        var divMasine = document.createElement("div");
        divMasine.className = "divZaIkonuMasine";

        var ikonaMasine = document.createElement("div");
        ikonaMasine.innerHTML = '<ion-icon name="speedometer-outline"></ion-icon>';
        divMasine.appendChild(ikonaMasine);
        divZaDodaj.appendChild(divMasine);
        host.appendChild(divZaDodaj);

        var divZa = document.createElement("div");
        divZa.className = "divZa";
        var divM = this.divZaTekst("Materijal");
        divZa.appendChild(divM);
        var divK = this.divZaTekst("Klasa");
        divZa.appendChild(divK);
        var divKol = this.divZaBroj("Kolicina");
        divZa.appendChild(divKol);
        var divC = this.divZaBroj("Cena");
        divZa.appendChild(divC);
        var btn = document.createElement("button");
        btn.innerHTML = "Done";
        divZa.appendChild(btn);
        btn.onclick = () => this.DodajMaterijal(IDProjekta);
        divZaMaterijal.appendChild(divZa);
        // ========================================================================================
        var divZaDodajMasinu = document.createElement("div");
        divZaDodajMasinu.className = "divZaDodajMasinu";
        var divM = this.divZaTekst("Masina");
        divZaDodajMasinu.appendChild(divM);
        var divK = this.divZaBroj("Potrosnja");
        divZaDodajMasinu.appendChild(divK);
        var divKol = this.divZaBroj("Cena");
        divZaDodajMasinu.appendChild(divKol);
        var btn = document.createElement("button");
        btn.innerHTML = "Done";
        divZaDodajMasinu.appendChild(btn);
        btn.onclick = () => this.DodajMasinu(IDProjekta);
        divMasine.appendChild(divZaDodajMasinu);

        ikonaMasine.addEventListener("click", function(){
            divMasine.classList.add('active');
            divZaMaterijal.classList.remove('active');
        })
        ikona.addEventListener("click", function(){
            divMasine.classList.remove('active');
            divZaMaterijal.classList.add('active');
        })
        // this.unosResursa(host);
    }
    DodajMaterijal(IDProjekta)
    {
        var vrednosti = this.kont.querySelectorAll(".divZaIkonuMaterijala input");
        var numbers = [];
        vrednosti.forEach(data=>{
            numbers.push(data.value);
        })
        if(numbers[0] == "")
        {
            alert("Unesite naziv materijala!");
            return;
        }
        if(numbers[1] == "" || (new String(numbers[1])).length > 3 || numbers[1].includes("/"))
        {
            alert("Klasa materijala je neispravna!");
            return;
        }
        if(numbers[2] == "" || numbers[2] < 1 || numbers[2] > 500)
        {
            alert("Količina je neispravna!");
            return;
        }
        if(numbers[3] == "" || numbers[3] < 50 || numbers[3] > 1000)
        {
            alert("Unesite cenu materijala!");
            return;
        }
        console.log(numbers);
        fetch("https://localhost:5001/Materijal/DodajMaterijal/"+IDProjekta+"/"+numbers[0]+"/"+numbers[1]
        +"/"+numbers[2]+"/"+numbers[3],{
            method: "POST"
        }).then(p=>{
            if(p.ok)
            {
                this.RefreshMaterijal(IDProjekta, numbers[2], "delMaterijala");
            }
        })
        vrednosti.forEach(el=>{
            el.value = null;
        })
    }
    DodajMasinu(IDProjekta)
    {
        var vrednosti = this.kont.querySelectorAll(".divZaIkonuMasine input");
        var numbers = [];
        vrednosti.forEach(data=>{
            numbers.push(data.value);
        }) 
        if(numbers[0] == "")
        {
            alert("Unesite naziv mašine!");
            return;
        }
        if(numbers[1] < 1 || numbers[1] > 30)
        {
            alert("Neispravna potrošnja!");
            return;
        }
        if(numbers[2] < 50 || numbers[2] > 300)
        {
            alert("Neispravna cena goriva!");
            return;
        }
        fetch("https://localhost:5001/Masine/DodajMasinu/"+IDProjekta+"/"+numbers[0]+
        "/"+numbers[1]+"/"+numbers[2],{
            method: "POST"
        }).then(p=>{
            if(p.ok){
                this.RefreshMasine(IDProjekta, 1, "delMasina");
            }
        })
        vrednosti.forEach(el=>{
            el.value = null;
        })
    }
    crtajResurse(host, IDProjekta) {
        var divZaTabele = document.createElement("div");
        divZaTabele.className = "divZaTabele";
        divZaTabele.classList.add("divZaTabeleResursa");
        host.appendChild(divZaTabele);

        var divZaMaterijal = document.createElement("div");
        divZaMaterijal.className = "divZaMaterijal";
        divZaTabele.appendChild(divZaMaterijal);

        var divZaNaslov = document.createElement("div");
        divZaNaslov.className = "naslovMaterijal";
        divZaMaterijal.appendChild(divZaNaslov);

        var label = document.createElement("h3");
        label.className = "labelMaterijal";
        label.innerHTML = "Materijal"
        divZaNaslov.appendChild(label);

        var divZaMasine = document.createElement("div");
        divZaMasine.className = "divZaMasine";
        divZaTabele.appendChild(divZaMasine);

        var divZaNaslov = document.createElement("div");
        divZaNaslov.className = "naslovMasine";
        divZaMasine.appendChild(divZaNaslov);

        var label = document.createElement("h3");
        label.className = "labelMasine";
        label.innerHTML = "Mašine"
        divZaNaslov.appendChild(label);

        this.NapraviTabeleResursa(divZaMaterijal, IDProjekta);
        this.NapraviTabeleResursa(divZaMasine, IDProjekta);
    }
    NapraviTabeleResursa(host, IDProjekta) {
        var tabela = document.createElement("table");
        tabela.className = "Tabela";
        host.appendChild(tabela);

        var thead = document.createElement("thead");
        thead.className = "zaglavljeTabele";
        tabela.appendChild(thead);

        var tableBody = document.createElement("tbody");
        tabela.appendChild(tableBody);

        var tr = document.createElement("tr");
        thead.appendChild(tr);

        if (host.className == "divZaMaterijal") {
            var Lista = ["Materijal", "Klasa", "Kolicina", "Cena"];
            Lista.forEach(el => {
                var th = document.createElement("th");
                th.innerHTML = el;
                tr.appendChild(th);
            })
            var deleteMaterijal = document.createElement("div");
            deleteMaterijal.className = "deleteMaterijal";
            deleteMaterijal.innerHTML = '<ion-icon name="close"></ion-icon>';
            deleteMaterijal.title = "Izbriši inženjera";
            var th = document.createElement("th");
            th.appendChild(deleteMaterijal);
            tr.appendChild(th);
            deleteMaterijal.onclick = () => this.izbrisiMaterijal();
            tableBody.className = "TabelaPodatakaMaterijala";
            this.TabelaResursa(host, tableBody, IDProjekta, "delMaterijala");
        }
        else {
            var Lista = ["Masina", "Potrosnja", "Cena"];
            Lista.forEach(el => {
                var th = document.createElement("th");
                th.innerHTML = el;
                tr.appendChild(th);
            })
            var deleteMasine = document.createElement("div");
            deleteMasine.className = "deleteMasine";
            deleteMasine.innerHTML = '<ion-icon name="close"></ion-icon>';
            deleteMasine.title = "Izbriši inženjera";
            var th = document.createElement("th");
            th.appendChild(deleteMasine);
            tr.appendChild(th);
            deleteMasine.onclick = () => this.izbrisiMasine();
            tableBody.className = "TabelaPodatakaMasina";
            this.TabelaResursa(host, tableBody, IDProjekta, "delMasina");
        }
    }
    TabelaResursa(host, tableBody, IDProjekta, drugaKlasa)
    {
        if(host.className == "divZaMaterijal")
        {

            fetch("https://localhost:5001/Materijal/Materijali/"+IDProjekta,{
                    method: "GET"
                }).then(p=>{
                    p.json().then(datas=>{
                        datas.forEach(element=>{
                            var newtr = document.createElement("tr");
                            tableBody.appendChild(newtr);
                            var materijal = new Materijal(element.id, element.naziv, element.klasa, element.kolicina, element.cena, drugaKlasa);
                            materijal.crtajMaterijale(newtr);
                            var delMaterijala = this.kont.querySelector(".Materijal"+element.id);
                            delMaterijala.onclick = () => this.UkloniMaterijal(IDProjekta, element.id);
                        })
                    })
                })
        }
        else
        {
            fetch("https://localhost:5001/Masine/Masine/"+IDProjekta,{
                method: "GET"
            }).then(p=>{
                p.json().then(datas=>{
                    datas.forEach(element=>{
                        var newtr = document.createElement("tr");
                        tableBody.appendChild(newtr);
                        var masine = new Masine(element.id, element.naziv, element.potrosnja, element.cenaGoriva, drugaKlasa);
                        masine.crtajMasine(newtr);
                        var del = this.kont.querySelector(".Masina"+element.id);
                        del.onclick = () => this.UkloniMasine(IDProjekta, element.id);
                    })
                })
            })
        }
    }
    UkloniMaterijal(IDProjekta, IDMaterijala)
    {
        fetch("https://localhost:5001/Materijal/UkloniMaterijal/"+IDProjekta+"/"+IDMaterijala,{
            method: "DELETE"
        }).then(p=>{
            if(p.ok)
            {
                p.json().then(data=>{
                    this.RefreshMaterijal(IDProjekta, data*(-1), "delMaterijala active");
                })
            }
        })
    }
    UkloniMasine(IDProjekta, IDMasine)
    {
        fetch("https://localhost:5001/Masine/SkloniMasinu/"+IDMasine,{
            method: "DELETE"
        }).then(p=>{
            if(p.ok)
            {
                    this.RefreshMasine(IDProjekta, -1, "delMasina active");
            }
        })
    }
    RefreshMaterijal(IDProjekta, num, klasa)
    {
        var tbodyMaterijal = this.kont.querySelector(".TabelaPodatakaMaterijala");
        var parent = tbodyMaterijal.parentNode;
        parent.removeChild(tbodyMaterijal);

        var tbodyMaterijal = document.createElement("tbody");
        tbodyMaterijal.className = "TabelaPodatakaMaterijala";

        var divZaMaterijal = this.kont.querySelector(".divZaMaterijal");
        this.TabelaResursa(divZaMaterijal, tbodyMaterijal, IDProjekta, klasa);
        var jedinica = this.kont.querySelector(".broj.jedinica");
        var broj = this.kont.querySelector(".brojMaterijala");
        parseInt(broj.innerHTML);
        console.log(parseInt(num));
        if(jedinica.innerHTML == "t")
        {
            console.log("Broj" + (parseFloat(broj.innerHTML)*1000 + parseInt(num)));
        }
        if(jedinica.innerHTML == "t" && (parseFloat(broj.innerHTML)*1000 + parseInt(num)) < 1000)
        {
            console.log("1 uslov");
            broj.innerHTML = parseFloat(broj.innerHTML)*1000 + parseInt(num);
            jedinica.innerHTML = "kg";
            broj.appendChild(jedinica);
        }
        else if(jedinica.innerHTML == "kg" && (parseInt(broj.innerHTML) + parseInt(num)) < 1000)
        {
            console.log("2 uslov");
            console.log(parseInt(num));
            broj.innerHTML = parseInt(broj.innerHTML) + parseInt(num);
            jedinica.innerHTML = "kg";
            broj.appendChild(jedinica);
        }
        else if(jedinica.innerHTML == "kg" && (parseInt(broj.innerHTML) + parseInt(num)) >= 1000)
        {
            console.log("3 uslov");
            broj.innerHTML = parseFloat((parseInt(num) + parseFloat(broj.innerHTML))/1000).toFixed(1);
            var jedinica = document.createElement("label");
            jedinica.className = "broj jedinica";
            jedinica.innerHTML = "t";
            broj.appendChild(jedinica);
        }
        else
        {
            console.log("4 uslov");
            console.log(parseInt(broj.innerHTML) + parseInt(num));
            broj.innerHTML = parseFloat((parseInt(num) + parseFloat(broj.innerHTML)*1000)/1000).toFixed(1);
            var jedinica = document.createElement("label");
            jedinica.className = "broj jedinica";
            jedinica.innerHTML = "t";
            broj.appendChild(jedinica);
        }

        parent.appendChild(tbodyMaterijal);
    }
    RefreshMasine(IDProjekta, num, klasa)
    {
        var tbodyMasine = this.kont.querySelector(".TabelaPodatakaMasina");
        var parent = tbodyMasine.parentNode;
        parent.removeChild(tbodyMasine);

        var tbodyMasine = document.createElement("tbody");
        tbodyMasine.className = "TabelaPodatakaMasina";

        var divZaMasine = this.kont.querySelector(".divZaMasine");
        this.TabelaResursa(divZaMasine, tbodyMasine, IDProjekta, klasa);
        var broj = this.kont.querySelector(".brojMasina");
        broj.innerHTML = parseInt(broj.innerHTML) + num;

        parent.appendChild(tbodyMasine);
    }
    izbrisiMasine()
    {
        var del = this.kont.querySelectorAll(".delMasina");
        del.forEach(el=>{
            el.classList.add('active');
        })
        var delMaterijal = document.querySelector(".deleteMasine");
        delMaterijal.classList.toggle('active');
        delMaterijal.innerHTML = '<ion-icon name="checkmark-sharp"></ion-icon>';
        delMaterijal.onclick = () => this.closeMasine();
    }
    closeMasine()
    {
        var del = this.kont.querySelectorAll(".delMasina");
        del.forEach(el=>{
            el.classList.remove('active');
        })
        
        var delMaterijal = document.querySelector(".deleteMasine");
        delMaterijal.innerHTML = '<ion-icon name="close"></ion-icon>';
        delMaterijal.classList.remove('active');
        delMaterijal.onclick = () => this.izbrisiMasine();
    }
    izbrisiMaterijal()
    {
        var delMaterijala = this.kont.querySelectorAll(".delMaterijala");
        delMaterijala.forEach(el=>{
            el.classList.add('active');
        })
        
        var delMaterijal = document.querySelector(".deleteMaterijal");
        delMaterijal.classList.toggle('active');
        delMaterijal.innerHTML = '<ion-icon name="checkmark-sharp"></ion-icon>';
        delMaterijal.onclick = () => this.closeMaterijal();
    }
    closeMaterijal()
    {
        var delMaterijala = this.kont.querySelectorAll(".delMaterijala");
        delMaterijala.forEach(el=>{
            el.classList.remove('active');
        })

        var delMaterijal = document.querySelector(".deleteMaterijal");
        delMaterijal.classList.remove('active');
        delMaterijal.innerHTML = '<ion-icon name="close"></ion-icon>';
        delMaterijal.onclick = () => this.izbrisiMaterijal();
    }
}
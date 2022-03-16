import { Projekti } from "./Projekti.js";

var Prikaz = document.createElement("div");
Prikaz.className = "Prikaz";
document.body.appendChild(Prikaz);

var projekti = new Projekti();
projekti.crtaj(document.body);
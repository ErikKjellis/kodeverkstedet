/* ==========================================================================
   Dialog og Banner
   Bit er hjelperen som snakker til spilleren.
   Teksten skrives ut bokstav for bokstav - trykk for å få den med én gang.
   ========================================================================== */

var Dialog = (function () {

  var boks, avatarEl, navnEl, tekstEl, videreEl;

  var linjer = [];
  var linjeNr = 0;
  var naarFerdig = null;
  var sisteKnapp = "Videre ▸";   /* teksten på knappen når det ikke kommer mer */

  var maalTekst = "";
  var visteTegn = 0;
  var skriveTimer = null;

  function start() {
    boks = document.getElementById("dialog");
    avatarEl = document.getElementById("dialog-avatar");
    navnEl = document.getElementById("dialog-navn");
    tekstEl = document.getElementById("dialog-tekst");
    videreEl = document.getElementById("dialog-videre");

    boks.addEventListener("click", function (e) {
      if (e.target === videreEl) return;
      if (visteTegn < maalTekst.length) fullforSkriving();
    });

    videreEl.addEventListener("click", function () {
      if (visteTegn < maalTekst.length) { fullforSkriving(); return; }
      neste();
    });
  }

  /*
    si(linjer, nårFerdig, valg)
      linjer     - liste med tekster, én om gangen
      nårFerdig  - kalles når siste linje er lest
      valg       - { knapp: "Prøv igjen", avatar: "🎉", navn: "Bit", feiring: true }
  */
  function si(nyeLinjer, ferdig, valg) {
    valg = valg || {};
    linjer = Array.isArray(nyeLinjer) ? nyeLinjer.slice() : [nyeLinjer];
    linjeNr = 0;
    naarFerdig = ferdig || null;

    avatarEl.textContent = valg.avatar || "🤖";
    navnEl.textContent = valg.navn || "Bit";
    sisteKnapp = valg.knapp || "Videre ▸";
    boks.classList.toggle("feiring", !!valg.feiring);

    Banner.skjul();
    boks.classList.remove("skjult");
    visLinje();
  }

  function feire(nyeLinjer, ferdig, knapp) {
    Effekter.konfetti();
    si(nyeLinjer, ferdig, { avatar: "🎉", feiring: true, knapp: knapp || "Videre ▸" });
  }

  function visLinje() {
    maalTekst = linjer[linjeNr];
    visteTegn = 0;
    tekstEl.textContent = "";

    /* «Prøv igjen» skal bare stå på knappen når det faktisk er det neste som
       skjer. Kommer det flere linjer først, heter den «Videre». */
    var erSiste = (linjeNr === linjer.length - 1);
    videreEl.textContent = erSiste ? sisteKnapp : "Videre ▸";

    skriv();
  }

  function skriv() {
    if (skriveTimer) clearTimeout(skriveTimer);
    if (visteTegn >= maalTekst.length) return;
    visteTegn++;
    tekstEl.textContent = maalTekst.slice(0, visteTegn);
    skriveTimer = setTimeout(skriv, 18);
  }

  function fullforSkriving() {
    if (skriveTimer) clearTimeout(skriveTimer);
    visteTegn = maalTekst.length;
    tekstEl.textContent = maalTekst;
  }

  function neste() {
    linjeNr++;
    if (linjeNr < linjer.length) {
      visLinje();
      return;
    }
    skjul();
    var f = naarFerdig;
    naarFerdig = null;
    if (f) f();
  }

  function skjul() {
    if (skriveTimer) clearTimeout(skriveTimer);
    boks.classList.add("skjult");
  }

  function erSynlig() {
    return !boks.classList.contains("skjult");
  }

  return {
    start: start,
    si: si,
    feire: feire,
    skjul: skjul,
    erSynlig: erSynlig
  };

})();


var Banner = (function () {

  var el = null;
  var timer = null;

  function sikreElement() {
    if (!el) el = document.getElementById("banner");
    return el;
  }

  function vis(tekst, valg) {
    valg = valg || {};
    sikreElement();
    if (timer) { clearTimeout(timer); timer = null; }
    el.textContent = tekst;
    el.classList.toggle("viktig", !!valg.viktig);
    el.classList.remove("skjult");
    if (valg.varighet) {
      timer = setTimeout(skjul, valg.varighet);
    }
  }

  function skjul() {
    sikreElement();
    if (timer) { clearTimeout(timer); timer = null; }
    el.classList.add("skjult");
  }

  return { vis: vis, skjul: skjul };

})();

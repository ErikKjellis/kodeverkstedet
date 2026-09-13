/* ==========================================================================
   Tegneboka
   Tegneprogrammet på datamaskinen.

   Et rutenett på 16 x 16. Han velger en farge og maler med fingeren.
   Tegningen lagres under et navn, og kan settes inn i rommet med
   tegnBilde("navn", x, y, størrelse).

   Hemmeligheten Tegneboka skal avsløre: en tegning er bare tall. Hver rute
   er ett siffer - 0 er tom, 3 er rød, 5 er gul. Trykker han på «Tall», ser
   han de 256 sifrene i stedet for fargene. Og tegnBilde leser nøyaktig den
   samme lista.

   Selve verktøyet bygger han ikke - det får han, som Kodeverkstedet.
   Det han bygger selv, er ikonet som åpner det.
   ========================================================================== */

var Tegneboka = (function () {

  var STORRELSE = 16;

  /* Ett siffer per farge, så tallene står pent i rutenettet. */
  var FARGER = [
    { navn: "tom",   farge: null },
    { navn: "svart", farge: "#1b1b1f" },
    { navn: "hvit",  farge: "#f4f4f6" },
    { navn: "rød",   farge: "#e8503a" },
    { navn: "rosa",  farge: "#ff8fc8" },
    { navn: "gul",   farge: "#ffd23f" },
    { navn: "grønn", farge: "#3ecb7a" },
    { navn: "blå",   farge: "#4f9dff" },
    { navn: "brun",  farge: "#9a6b3f" },
    { navn: "hud",   farge: "#e8b58c" }
  ];

  var el, rutenettEl, fargerEl, navnEl, hintEl, mineEl, tallKnapp;

  var ruter = tomme();
  var valgtFarge = 3;
  var maler = false;
  var tallModus = false;

  function tomme() {
    var liste = [];
    for (var i = 0; i < STORRELSE * STORRELSE; i++) liste.push(0);
    return liste;
  }

  /* ---------- Oppsett ---------- */

  function start() {
    el = document.getElementById("tegneboka");
    rutenettEl = document.getElementById("tb-rutenett");
    fargerEl = document.getElementById("tb-farger");
    navnEl = document.getElementById("tb-navn");
    hintEl = document.getElementById("tb-hint");
    mineEl = document.getElementById("tb-mine");
    tallKnapp = document.getElementById("tb-tall");

    byggRutenett();
    byggFarger();

    /* Maling: trykk ned og dra. Vi finner ruta under fingeren selv, fordi en
       finger som drar «tilhører» ruta den startet på. */
    rutenettEl.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      maler = true;
      malUnder(e);
    });
    rutenettEl.addEventListener("pointermove", function (e) {
      if (maler) malUnder(e);
    });
    window.addEventListener("pointerup", function () { maler = false; });
    window.addEventListener("pointercancel", function () { maler = false; });

    fargerEl.addEventListener("click", function (e) {
      var knapp = e.target.closest("[data-farge]");
      if (!knapp) return;
      valgtFarge = parseInt(knapp.getAttribute("data-farge"), 10);
      tegnFarger();
    });

    mineEl.addEventListener("click", function (e) {
      var knapp = e.target.closest("[data-tegning]");
      if (knapp) apneTegning(knapp.getAttribute("data-tegning"));
    });

    tallKnapp.addEventListener("click", function () {
      tallModus = !tallModus;
      tegnRuter();
    });
    document.getElementById("tb-lagre").addEventListener("click", lagreTegningen);
    document.getElementById("tb-tom").addEventListener("click", function () {
      ruter = tomme();
      tegnRuter();
    });
    document.getElementById("tb-lukk").addEventListener("click", lukk);
  }

  function byggRutenett() {
    var html = "";
    for (var i = 0; i < STORRELSE * STORRELSE; i++) {
      html += '<div class="tb-rute" data-rute="' + i + '"></div>';
    }
    rutenettEl.innerHTML = html;
  }

  function byggFarger() {
    var html = "";
    for (var i = 0; i < FARGER.length; i++) {
      var f = FARGER[i];
      html += '<button type="button" class="tb-farge' + (f.farge ? "" : " tb-viskelaer") +
              '" data-farge="' + i + '" title="' + f.navn + '"' +
              (f.farge ? ' style="background:' + f.farge + '"' : "") +
              "><span>" + i + "</span></button>";
    }
    fargerEl.innerHTML = html;
    tegnFarger();
  }

  /* ---------- Tegning ---------- */

  function malUnder(e) {
    var treff = document.elementFromPoint(e.clientX, e.clientY);
    if (!treff || !treff.hasAttribute || !treff.hasAttribute("data-rute")) return;
    var i = parseInt(treff.getAttribute("data-rute"), 10);
    if (ruter[i] === valgtFarge) return;
    ruter[i] = valgtFarge;
    tegnRute(treff, i);
  }

  function tegnRute(celle, i) {
    var v = ruter[i];
    celle.style.background = FARGER[v].farge || "";
    celle.classList.toggle("tb-tom", !FARGER[v].farge);
    celle.textContent = tallModus ? String(v) : "";
    /* Lyse farger får mørke tall, mørke farger får lyse. */
    celle.classList.toggle("tb-morkt-tall", tallModus && (v === 2 || v === 4 || v === 5 || v === 9));
  }

  function tegnRuter() {
    var celler = rutenettEl.children;
    for (var i = 0; i < celler.length; i++) tegnRute(celler[i], i);
    el.classList.toggle("tb-tallmodus", tallModus);
    tallKnapp.textContent = tallModus ? "🎨 Farger" : "🔢 Tall";
  }

  function tegnFarger() {
    var knapper = fargerEl.children;
    for (var i = 0; i < knapper.length; i++) {
      knapper[i].classList.toggle("valgt", i === valgtFarge);
    }
  }

  function tegnMine() {
    var navn = Fremdrift.tegningsnavn();
    if (navn.length === 0) {
      mineEl.innerHTML = '<span class="tb-ingen">Ingen lagrede tegninger ennå.</span>';
      return;
    }
    mineEl.innerHTML = navn.map(function (n) {
      return '<button type="button" class="tb-min" data-tegning="' + n + '">' + n + "</button>";
    }).join("");
  }

  /* ---------- Lagre og åpne ---------- */

  /* Navn uten mellomrom og rare tegn, så de kan brukes i koden. */
  function ryddNavn(tekst) {
    var rent = String(tekst || "").toLowerCase().replace(/[^a-zæøå0-9]/g, "").slice(0, 12);
    return rent || "bilde";
  }

  function antallMalt(liste) {
    return (liste || []).filter(function (v) { return v !== 0; }).length;
  }

  function lagreTegningen() {
    if (antallMalt(ruter) === 0) {
      settHint("Tegningen er tom. Tegn noe først! 🎨");
      return;
    }
    var navn = ryddNavn(navnEl.value);
    navnEl.value = navn;
    Fremdrift.lagreTegning(navn, ruter.slice());
    Fremdrift.settTilstand("sisteTegning", navn);
    settHint("💾 Lagret som «" + navn + "»");
    tegnMine();
  }

  function apneTegning(navn) {
    var data = Fremdrift.hentTegning(navn);
    if (!data) return;
    ruter = data.slice();
    navnEl.value = navn;
    Fremdrift.settTilstand("sisteTegning", navn);
    tegnRuter();
    settHint("Åpnet «" + navn + "». Husk å lagre når du har endret noe.");
  }

  /* ---------- Åpne og lukke ---------- */

  function apne() {
    /* Er rutenettet tomt (f.eks. etter at spillet er startet på nytt), åpner vi
       tegningen han sist jobbet med - han skal møte sin egen tegning, ikke et
       tomt ark. */
    var siste = Fremdrift.hentTilstand("sisteTegning");
    if (antallMalt(ruter) === 0 && siste && Fremdrift.hentTegning(siste)) {
      var hint = hintEl.textContent;
      apneTegning(siste);
      if (hint) settHint(hint);
    }
    tegnRuter();
    tegnMine();
    if (!navnEl.value) navnEl.value = "blomst";
    el.classList.remove("skjult");
  }

  function lukk() {
    el.classList.add("skjult");
    maler = false;
  }

  function erApen() {
    return !!el && !el.classList.contains("skjult");
  }

  function settHint(tekst) {
    hintEl.textContent = tekst || "";
  }

  return {
    STORRELSE: STORRELSE,
    FARGER: FARGER,
    start: start,
    apne: apne,
    lukk: lukk,
    erApen: erApen,
    settHint: settHint,
    erTallModus: function () { return tallModus; },
    antallMalt: antallMalt
  };

})();

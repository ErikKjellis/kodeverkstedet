/* ==========================================================================
   Kjorer
   Leser elevens program og gjør det som står der.

   Programmet er IKKE tekst som kjøres med eval. Det er en liste med
   kodelinjer (vanlige objekter), og denne filen går gjennom lista og kaller
   riktig kjor-funksjon fra api.js. Det er trygt, og det lar oss gi hyggelige
   norske feilmeldinger i stedet for tekniske.

   "eier" er navnet på programmet, f.eks. "musepeker". Alt et program lager
   merkes med eieren, slik at vi kan bytte ut ett program uten å røre resten.
   ========================================================================== */

var Kjorer = (function () {

  var funksjoner = {};    /* eier -> { navn: { parametre, kropp } } */
  var globaler = {};      /* eier -> { variabelnavn: verdi } */
  var flater = {};        /* eier -> "rom" eller "skjerm" */
  var hendelser = [];     /* { type, eier, parametre, kropp, lag } */
  var lagTeller = 0;
  var feilmeldinger = [];
  var MAKS_DYBDE = 25;

  /* ---------- Installere og fjerne programmer ---------- */

  function avinstaller(eier) {
    delete funksjoner[eier];
    delete globaler[eier];
    delete flater[eier];
    hendelser = hendelser.filter(function (h) { return h.eier !== eier; });
    Verden.fjernLagFor(eier);
    Skjerm.fjernIkonerFor(eier);
    Knapper.fjernFor(eier);
    Figur.nullstillFor(eier);
  }

  /*
    flate sier om programmet hører hjemme i rommet eller inne i datamaskinen.
    Alt programmet lager - tegninger, ikoner, hendelser - havner der.
  */
  function installer(eier, program, flate) {
    avinstaller(eier);
    feilmeldinger = [];

    funksjoner[eier] = {};
    globaler[eier] = {};
    flater[eier] = flate || "rom";
    samleFunksjoner(eier, program);

    var miljo = nyttMiljo(eier, nyttLag(eier));
    miljo.erToppniva = true;
    kjorLinjer(program, miljo);

    /* Hvis programmet lyttet etter fingeren, kjører vi den én gang med
       en gang, slik at man ser resultatet uten å måtte røre skjermen først. */
    var punkt = Input.posisjon();
    utlos("fingerFlytter", [punkt.x, punkt.y], eier);

    return feilmeldinger;
  }

  function samleFunksjoner(eier, linjer) {
    for (var i = 0; i < linjer.length; i++) {
      var l = linjer[i];
      if (l.type === "funksjonDefinisjon") {
        funksjoner[eier][l.args.navn] = {
          parametre: l.args.parametre || [],
          kropp: l.barn || []
        };
      }
    }
  }

  /* ---------- Miljø og lag ---------- */

  function nyttMiljo(eier, lag, variabler, dybde) {
    return {
      eier: eier,
      lag: lag,
      farge: "hvit",
      variabler: variabler || {},
      dybde: dybde || 0
    };
  }

  function nyttLag(eier) {
    var navn = eier + "#" + (lagTeller++);
    Verden.sikreLag(navn, eier, flater[eier] || "rom");
    return navn;
  }

  function flatenTil(eier) {
    return flater[eier] || "rom";
  }

  /* ---------- Kjøring ---------- */

  function kjorLinjer(linjer, miljo) {
    for (var i = 0; i < linjer.length; i++) {
      var linje = linjer[i];
      var def = Api.hent(linje.type);
      if (!def) {
        feil("Jeg kjenner ikke igjen kodebiten «" + linje.type + "».");
        continue;
      }
      try {
        def.kjor(miljo, linje);
      } catch (e) {
        feil("Noe gikk galt i en kodelinje.");
      }
    }
  }

  function kallFunksjon(miljo, navn, argumenter, linje) {
    var tabell = funksjoner[miljo.eier] || {};
    var f = tabell[navn];

    if (!f) {
      feil("Det finnes ingen funksjon som heter " + navn + " ennå.");
      return;
    }
    if (miljo.dybde >= MAKS_DYBDE) {
      feil(navn + " kaller seg selv om og om igjen, og kommer aldri i mål.");
      return;
    }

    var variabler = {};
    for (var i = 0; i < f.parametre.length; i++) {
      variabler[f.parametre[i]] = verdi(miljo, argumenter[i]);
    }

    var indre = nyttMiljo(miljo.eier, miljo.lag, variabler, miljo.dybde + 1);
    indre.farge = miljo.farge;
    kjorLinjer(f.kropp, indre);
  }

  /*
    Finner den faktiske verdien av et tall, en tekst eller en variabel.
    Variabler letes først etter der vi står nå, så blant dem som er laget
    øverst i programmet - de kan brukes overalt.
  */
  function verdi(miljo, v) {
    if (!v) return 0;
    if (v.k === "tall" || v.k === "tekst") return v.v;
    if (v.k === "var") {
      if (Object.prototype.hasOwnProperty.call(miljo.variabler, v.v)) {
        return miljo.variabler[v.v];
      }
      var felles = globaler[miljo.eier] || {};
      if (Object.prototype.hasOwnProperty.call(felles, v.v)) {
        return felles[v.v];
      }
      feil("Variabelen " + v.v + " finnes ikke her.");
      return 0;
    }
    return 0;
  }

  /*
    Endrer en variabel som finnes fra før: den nærmeste først, ellers den
    som ble laget øverst i programmet. Slik virker det i ekte JavaScript også.
  */
  function tilordne(miljo, navn, nyVerdi) {
    if (Object.prototype.hasOwnProperty.call(miljo.variabler, navn)) {
      miljo.variabler[navn] = nyVerdi;
      return;
    }
    if (!globaler[miljo.eier]) globaler[miljo.eier] = {};
    globaler[miljo.eier][navn] = nyVerdi;
  }

  /* Lagrer en variabel. Er vi øverst i programmet, kan alle bruke den. */
  function settVariabel(miljo, navn, nyVerdi) {
    if (miljo.erToppniva) {
      if (!globaler[miljo.eier]) globaler[miljo.eier] = {};
      globaler[miljo.eier][navn] = nyVerdi;
    } else {
      miljo.variabler[navn] = nyVerdi;
    }
  }

  /* ---------- Hendelser ---------- */

  function registrerHendelse(hendelse) {
    hendelse.lag = nyttLag(hendelse.eier);
    hendelser.push(hendelse);
  }

  /*
    Utløser alle hendelser av en type.
    Hver hendelse tegner i sitt eget lag, og laget tømmes først - derfor
    "flytter" musepekeren seg i stedet for å etterlate seg et spor.
  */
  function utlos(type, verdier, kunEier, mal) {
    /* Vi går gjennom en kopi. Lager en hendelse nye hendelser mens den kjører
       (f.eks. en hendelse som havnet inni en funksjon den selv kaller), skal de
       ikke kjøres i samme runde - ellers kan det gå i ring og låse nettbrettet. */
    var liste = hendelser.slice();
    for (var i = 0; i < liste.length; i++) {
      var h = liste[i];
      if (h.type !== type) continue;
      if (kunEier && h.eier !== kunEier) continue;
      if (type === "trykk" && mal && h.mal !== mal) continue;

      Verden.tomLag(h.lag);

      var variabler = {};
      for (var j = 0; j < h.parametre.length; j++) {
        variabler[h.parametre[j]] = verdier[j];
      }

      var miljo = nyttMiljo(h.eier, h.lag, variabler, 0);
      kjorLinjer(h.kropp, miljo);
    }
  }

  function harHendelse(type) {
    for (var i = 0; i < hendelser.length; i++) {
      if (hendelser[i].type === type) return true;
    }
    return false;
  }

  /* ---------- Feil ---------- */

  function feil(melding) {
    if (feilmeldinger.indexOf(melding) === -1) feilmeldinger.push(melding);
  }

  function hentFeil() { return feilmeldinger.slice(); }
  function tomFeil() { feilmeldinger = []; }

  function nullstillAlt() {
    funksjoner = {};
    globaler = {};
    flater = {};
    hendelser = [];
    lagTeller = 0;
    feilmeldinger = [];
    Verden.tomAlleLag();
  }

  return {
    installer: installer,
    avinstaller: avinstaller,
    kallFunksjon: kallFunksjon,
    registrerHendelse: registrerHendelse,
    utlos: utlos,
    harHendelse: harHendelse,
    verdi: verdi,
    settVariabel: settVariabel,
    tilordne: tilordne,
    flatenTil: flatenTil,
    hentFeil: hentFeil,
    tomFeil: tomFeil,
    nullstillAlt: nullstillAlt
  };

})();

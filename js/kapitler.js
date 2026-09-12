/* ==========================================================================
   Kapitler og Kapittelmotor

   Et kapittel er en liste med steg. Motoren går gjennom stegene ett om
   gangen og husker hvor langt man er kommet.

   Tre slags steg:
     { type: "dialog", linjer: [...] }        Bit sier noe
     { type: "kode",   oppgave: {...} }       programmeringsvinduet åpnes
     { type: "egen",   start: function(neste) {...} }   du styrer selv
   ========================================================================== */

var Kapitler = (function () {

  var liste = [];

  function leggTil(kapittel) {
    liste.push(kapittel);
  }

  function hent(indeks) {
    return liste[indeks] || null;
  }

  return {
    leggTil: leggTil,
    hent: hent,
    antall: function () { return liste.length; },
    liste: function () { return liste; }
  };

})();


/* --------------------------------------------------------------------------
   Kode - små hjelpere til å se hva eleven har skrevet.
   Brukes i sjekk-funksjonene til oppgavene.
   -------------------------------------------------------------------------- */

var Kode = (function () {

  /* Alle linjer av en type, på ett nivå (ikke inni blokker). */
  function paNiva(liste, type) {
    var treff = [];
    for (var i = 0; i < (liste || []).length; i++) {
      if (liste[i].type === type) treff.push(liste[i]);
    }
    return treff;
  }

  function forste(liste, type) {
    var t = paNiva(liste, type);
    return t.length ? t[0] : null;
  }

  function indeksAvType(liste, type) {
    for (var i = 0; i < (liste || []).length; i++) {
      if (liste[i].type === type) return i;
    }
    return -1;
  }

  function finnFunksjon(program, navn) {
    for (var i = 0; i < program.length; i++) {
      if (program[i].type === "funksjonDefinisjon" && program[i].args.navn === navn) {
        return program[i];
      }
    }
    return null;
  }

  function finnKall(liste, navn) {
    for (var i = 0; i < (liste || []).length; i++) {
      var l = liste[i];
      if (l.type === "kallEgenFunksjon" && l.args.navn === navn) return l;
    }
    return null;
  }

  return {
    paNiva: paNiva,
    forste: forste,
    indeksAvType: indeksAvType,
    finnFunksjon: finnFunksjon,
    finnKall: finnKall
  };

})();


/* --------------------------------------------------------------------------
   Kapittelmotor - kjører stegene i rekkefølge.
   -------------------------------------------------------------------------- */

var Kapittelmotor = (function () {

  var kapittelNr = 0;
  var stegNr = 0;
  var stoppNaavaerende = null;   /* rydder opp etter et "egen"-steg */

  function start(fraKapittel, fraSteg) {
    kapittelNr = fraKapittel || 0;
    stegNr = fraSteg || 0;
    kjorSteg();
  }

  function kjorSteg() {
    ryddOpp();

    var kapittel = Kapitler.hent(kapittelNr);
    if (!kapittel) { alleKapitlerFerdige(); return; }

    var steg = kapittel.steg[stegNr];
    if (!steg) {
      kapittelNr++;
      stegNr = 0;
      Fremdrift.settPosisjon(kapittelNr, stegNr);
      kjorSteg();
      return;
    }

    Fremdrift.settPosisjon(kapittelNr, stegNr);
    utfor(steg);
  }

  function utfor(steg) {
    if (steg.type === "dialog") {
      Dialog.si(steg.linjer, neste, steg.valg);
      return;
    }
    if (steg.type === "kode") {
      /* Fra og med kapittel 3 går veien til koden gjennom datamaskinen:
         trykk på maskinen, trykk på ikonet, kod. */
      if (steg.viaMaskinen) {
        gaaViaMaskinen(function () { KodeEditor.apne(steg.oppgave, neste); });
      } else {
        KodeEditor.apne(steg.oppgave, neste);
      }
      return;
    }
    if (steg.type === "egen") {
      stoppNaavaerende = steg.start(neste) || null;
      return;
    }
    /* Ukjent steg - hopp videre i stedet for å låse spillet. */
    neste();
  }

  /*
    Venter til han har gått inn i maskinen og åpnet Kodeverkstedet.
    Programmet åpnes av HANS egen kode fra kapittel 2 - vi venter bare.
  */
  function gaaViaMaskinen(naarKlar) {
    if (Skjerm.programErApent()) { naarKlar(); return; }

    Banner.vis("Gå til datamaskinen og åpne Kodeverkstedet 💻", {});
    if (Skjerm.erLukket()) Verden.blink("datamaskin", 900);

    (function vent() {
      if (Skjerm.programErApent()) {
        Banner.skjul();
        naarKlar();
        return;
      }
      requestAnimationFrame(vent);
    })();
  }

  function neste() {
    ryddOpp();
    stegNr++;
    Fremdrift.settPosisjon(kapittelNr, stegNr);
    kjorSteg();
  }

  function ryddOpp() {
    if (stoppNaavaerende) {
      stoppNaavaerende();
      stoppNaavaerende = null;
    }
  }

  function alleKapitlerFerdige() {
    Dialog.si([
      "Der var alt jeg har å vise deg for nå.",
      "Men spillet ditt er ikke ferdig – det er så vidt begynt!",
      "Neste gang lager vi en person som kan bo i rommet. 👋"
    ], function () {
      Banner.vis("Flere kapitler kommer snart!", {});
    });
  }

  return { start: start };

})();

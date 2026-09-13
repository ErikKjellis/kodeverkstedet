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

  /* Alle linjer i hele koden, også de inni blokker. */
  function alleLinjer(linjer, ut) {
    ut = ut || [];
    for (var i = 0; i < (linjer || []).length; i++) {
      ut.push(linjer[i]);
      if (linjer[i].barn) alleLinjer(linjer[i].barn, ut);
    }
    return ut;
  }

  function finnVariabel(program, navn) {
    var alle = alleLinjer(program);
    for (var i = 0; i < alle.length; i++) {
      if (alle[i].type === "variabel" && alle[i].args.navn === navn) return alle[i];
    }
    return null;
  }

  /* Navnene på alle menyknappene, i den rekkefølgen de lages. */
  function knappenavn(program) {
    return alleLinjer(program)
      .filter(function (l) { return l.type === "lagKnapp"; })
      .map(function (l) { return l.args.navn.v; });
  }

  /* En hendelse ytterst i koden. mal er knappenavnet for nårManTrykkerPå. */
  function hendelse(program, type, mal) {
    for (var i = 0; i < program.length; i++) {
      var l = program[i];
      if (l.type !== type) continue;
      if (mal !== undefined && l.args.mal.v !== mal) continue;
      return l;
    }
    return null;
  }

  /* Finnes hendelsen et sted - også inni noe den ikke skal være inni? */
  function hendelseHvorSomHelst(program, type, mal) {
    return alleLinjer(program).some(function (l) {
      return l.type === type && (mal === undefined || l.args.mal.v === mal);
    });
  }

  /*
    Gjør koden inni en blokk om til en flat liste med steg, i rekkefølge.
    Kaller den en egen hjelpefunksjon (som tegnPåNytt), legges innholdet i den
    inn i stedet. tegnFigur pakkes ikke ut - den ER steget «tegn på nytt».
    Mangler en funksjon, noteres det i «problemer».
  */
  function utvid(program, linjer, problemer, dybde) {
    dybde = dybde || 0;
    var ut = [];
    for (var i = 0; i < (linjer || []).length; i++) {
      var l = linjer[i];
      if (l.type === "kallEgenFunksjon" && l.args.navn !== "tegnFigur") {
        var f = finnFunksjon(program, l.args.navn);
        if (!f) {
          if (problemer) problemer.push({ feil: "funksjonFinnesIkke", navn: l.args.navn });
          continue;
        }
        if (dybde < 5) ut = ut.concat(utvid(program, f.barn, problemer, dybde + 1));
        continue;
      }
      ut.push(l);
    }
    return ut;
  }

  function indeksI(steg, test) {
    for (var i = 0; i < steg.length; i++) if (test(steg[i])) return i;
    return -1;
  }

  return {
    paNiva: paNiva,
    forste: forste,
    indeksAvType: indeksAvType,
    finnFunksjon: finnFunksjon,
    finnKall: finnKall,
    alleLinjer: alleLinjer,
    finnVariabel: finnVariabel,
    knappenavn: knappenavn,
    hendelse: hendelse,
    hendelseHvorSomHelst: hendelseHvorSomHelst,
    utvid: utvid,
    indeksI: indeksI
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
        /* Han er fremme - maskinen skal ikke fortsette å rope på ham
           mens han prøver det han har laget ute i rommet. */
        Verden.stoppBlink("datamaskin");
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

  /* Vises når han har spilt gjennom alle kapitlene som finnes. Skal ikke
     love noe bestemt om neste kapittel - da blir teksten gammel med en gang. */
  var alleFerdige = false;

  function alleKapitlerFerdige() {
    alleFerdige = true;
    /* Står programvinduet fortsatt åpent fra siste oppgave, lukker vi det -
       neste gang han åpner det, skal det være verkstedet. */
    Skjerm.lukkProgram();
    Dialog.si([
      "Der var alt jeg har å vise deg for nå.",
      "Men spillet ditt er ikke ferdig – det er så vidt begynt!",
      "Gå til datamaskinen og åpne Kodeverkstedet når du vil. Alle programmene dine ligger der, og du kan endre dem som du vil. 🛠️"
    ], function () {
      Banner.vis("Flere kapitler kommer snart!", { varighet: 5000 });
    });
  }

  /* Er han ferdig med alle kapitlene som finnes, er han fri til å kode som han vil. */
  function erFri() { return alleFerdige; }

  return { start: start, erFri: erFri };

})();

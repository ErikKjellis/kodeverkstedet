/* ==========================================================================
   Kapittel 7 - Veggen

   Figuren går rett gjennom veggen. Den vet jo ikke at veggen finnes.
   Nå skal spillet stille et spørsmål, hvert eneste bilde:
   har figuren gått for langt?

   To oppgaver:
     A) Venstre vegg. if (figurX < 110) { figurX = 110; }
        Han får prøve å gå gjennom veggen før Bit forklarer hvorfor det går.
     B) Høyre vegg. Samme mønster - men kodebiten kommer med feil tegn.
        Han må selv tenke over at høyre vegg spør «større enn».

   Nytt begrep: if - et spørsmål i koden, og at koden kan ta valg.
   ========================================================================== */

(function () {

  var VEGGER = {
    venstre: {
      grense: 110, riktig: "<", feil: ">",
      knapp: "Venstre", pil: "👈",
      bort: "Høyre", bortPil: "👉",
      gikkGjennom: function (x) { return x < 60; },
      holder: function (x, fart) { return fart < 0 && x <= 110; },
      sporsmal: "MINDRE enn", motsatt: "STØRRE enn"
    },
    hoyre: {
      grense: 890, riktig: ">", feil: "<",
      knapp: "Høyre", pil: "👉",
      bort: "Venstre", bortPil: "👈",
      gikkGjennom: function (x) { return x > 940; },
      holder: function (x, fart) { return fart > 0 && x >= 890; },
      sporsmal: "STØRRE enn", motsatt: "MINDRE enn"
    }
  };


  /* ======================================================================
     Hjelpere
     ====================================================================== */

  function les(navn) {
    return Kjorer.verdi({ eier: "figur", variabler: {} }, { k: "var", v: navn });
  }

  function erVeggsporsmal(l, grense) {
    return l.type === "hvis" &&
           l.args.a.k === "var" && l.args.a.v === "figurX" &&
           l.args.b.k === "tall" && l.args.b.v === grense;
  }

  /*
    Holder veggen? Svarer med det første som mangler, én ting om gangen.
  */
  function vurderVegg(program, side) {
    var v = VEGGER[side];
    var lokke = Kode.hendelse(program, "hvertBilde");
    if (!lokke) return { feil: "ingenLokke" };

    var iLokka = Kode.alleLinjer(lokke.barn).filter(function (l) { return erVeggsporsmal(l, v.grense); });
    if (iLokka.length === 0) {
      var andreSteder = Kode.alleLinjer(program).some(function (l) { return erVeggsporsmal(l, v.grense); });
      return { feil: andreSteder ? "utenforLokka" : "ingenHvis" };
    }

    var hvis = iLokka[0];
    if (hvis.args.op.v !== v.riktig) return { feil: "feilTegn" };

    var inni = Kode.utvid(program, hvis.barn, []);
    var settinger = inni.filter(function (s) { return s.type === "tilordning" && s.args.navn === "figurX"; });
    if (settinger.length === 0) return { feil: inni.length === 0 ? "tomHvis" : "ingenSetting" };

    var ny = settinger[settinger.length - 1].args.verdi;
    if (!(ny.k === "tall" && ny.v === v.grense)) return { feil: "feilGrense" };

    return { feil: null };
  }

  function gaaInnIVeggen(side) {
    var v = VEGGER[side];
    return {
      instruks: "Gå helt inn i " + side + " vegg med «" + v.knapp + "»! " + v.pil,
      sjekk: function () { return v.gikkGjennom(Number(les("figurX"))); }
    };
  }

  function beskjed(svar, side) {
    var v = VEGGER[side];
    var sett = "figurX = " + v.grense + ";";
    var sporsmal = "if (figurX " + v.riktig + " " + v.grense + ")";

    switch (svar.feil) {
      case "ingenLokke":
        return { melding: [
          "Spilløkka er borte! Uten hvertBilde går figuren ingen steder – og ingen sjekker noe.",
          "Sett inn hvertBilde igjen, med figurX = figurX + fart; viskUt(); og tegnFigur inni."
        ] };
      case "ingenHvis":
        return { provForst: gaaInnIVeggen(side), melding: [
          "Den gikk rett gjennom veggen! 🧱",
          "Spilløkka flytter figuren hvert bilde – men ingen sjekker om den har kommet til veggen.",
          "Vi trenger noe som spør: HVIS figuren har gått for langt, sett den tilbake. Det heter if.",
          "Sett inn " + sporsmal + " inni spilløkka."
        ] };
      case "utenforLokka":
        return { provForst: gaaInnIVeggen(side), melding: [
          "Den gikk rett gjennom likevel!",
          "if-en står utenfor spilløkka. Da stilles spørsmålet bare én gang – i det øyeblikket spillet starter.",
          "Den må spørre hvert eneste bilde. Slett den med ✕, og sett den inn i hvertBilde, rett under figurX = figurX + fart;"
        ] };
      case "tomHvis":
        return { provForst: gaaInnIVeggen(side), melding: [
          "Den gikk rett gjennom!",
          "if-en merker at figuren har kommet til veggen – men det er tomt inni klammene, så den gjør ingenting med det.",
          "Sett inn " + sett + " inni if-en."
        ] };
      case "ingenSetting":
        return { provForst: gaaInnIVeggen(side), melding: [
          "Den gikk rett gjennom!",
          "if-en slår til ved veggen, men det som står inni den flytter ikke figuren tilbake.",
          "Sett inn " + sett + " inni if-en."
        ] };
      case "feilTegn":
        /* Med feil tegn slår if-en til nesten hele tiden. Står figuren allerede
           forbi grensen, merkes det først når han prøver å gå BORT fra veggen -
           så det er det han skal prøve. */
        return { provForst: {
          instruks: "Prøv å gå bort fra veggen med «" + v.bort + "»! " + v.bortPil,
          forbered: Knapper.nullstillTrykk,
          sjekk: function () { return Knapper.antallTrykk(v.bort) > 0; }
        }, melding: [
          "Den sitter fast ved veggen! 😄",
          "Tegnet " + v.feil + " betyr " + v.motsatt + ". Figuren står nesten alltid på et tall som er " +
            v.motsatt.toLowerCase() + " " + v.grense + " – så if-en slår til hele tiden, og setter den tilbake til veggen.",
          "Her er spørsmålet om figurX er " + v.sporsmal + " " + v.grense + ". Trykk på tegnet og bytt til " + v.riktig + "."
        ] };
      case "feilGrense":
        return { provForst: gaaInnIVeggen(side), melding: [
          "if-en slo til – men figuren ble satt et helt annet sted enn ved veggen.",
          "Når den har gått for langt, skal den tilbake akkurat til veggen: " + sett
        ] };
    }
    return { melding: ["Noe er ikke helt riktig ennå. Trykk på Hint for et lite dytt."] };
  }


  /* ======================================================================
     Kodebitene
     ====================================================================== */

  /* Legg merke til at spørsmålet for høyre vegg kommer med tegnet < -
     altså feil. Han må selv tenke over hva høyre vegg skal spørre om. */
  function sporsmal(grense) {
    return {
      type: "hvis",
      args: {
        a: { k: "var", v: "figurX" },
        op: { k: "op", v: "<", valg: ["<", ">"] },
        b: { k: "tall", v: grense }
      },
      barn: []
    };
  }

  function settTil(grense) {
    return { type: "tilordning", args: { navn: "figurX", verdi: { k: "tall", v: grense } } };
  }

  /* Markøren starter rett under «figurX = figurX + fart;» i spilløkka. */
  function underFlyttingen(program) {
    var lokke = Kode.hendelse(program, "hvertBilde");
    if (!lokke) return null;
    var flytt = (lokke.barn || []).filter(function (l) {
      return l.type === "tilordning" && l.args.navn === "figurX";
    })[0];
    return flytt ? flytt.id : lokke.id;
  }

  /* ... og i B rett under venstre vegg, hvis den står der. */
  function underVenstreVegg(program) {
    var lokke = Kode.hendelse(program, "hvertBilde");
    var vegg = lokke && (lokke.barn || []).filter(function (l) { return erVeggsporsmal(l, 110); })[0];
    return vegg ? vegg.id + ":slutt" : underFlyttingen(program);
  }


  /* ======================================================================
     OPPGAVE A - venstre vegg
     ====================================================================== */

  var oppgaveVenstre = {
    id: "vegg-venstre",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Venstre vegg",

    instruks:
      "Figuren går gjennom veggen fordi ingen sjekker om den har gått for langt. " +
      "Lag en <b>if</b> i spilløkka: <b>hvis</b> figurX er mindre enn 110, sett den tilbake til 110.",

    valgtVedStart: underFlyttingen,
    seTid: 1500,

    startProgram: function () { return Fremdrift.hentInstallert("figur") || []; },

    palett: [sporsmal(110), settTil(110)],

    hint: [
      "if-en må spørre hvert eneste bilde – så den må stå inni hvertBilde. Markøren står allerede på riktig sted.",
      "Inni if-en: sett figuren tilbake til veggen med figurX = 110;",
      "< betyr «mindre enn». if (figurX < 110) spør: har figuren gått lenger mot venstre enn veggen?"
    ],

    bekreftIVerden: {
      instruks: "Gå inn i venstre vegg med «Venstre»! 👈",
      sjekk: function () { return VEGGER.venstre.holder(Number(les("figurX")), Number(les("fart"))); },
      pause: 1200
    },

    sjekk: function (program) {
      var svar = vurderVegg(program, "venstre");
      if (svar.feil) {
        var b = beskjed(svar, "venstre");
        return { ok: false, provForst: b.provForst, melding: b.melding };
      }
      return {
        ok: true,
        ros: [
          "Den stoppet ved veggen! 🧱",
          "Det du lagde heter en if. Den stiller et spørsmål hvert eneste bilde: er figurX mindre enn 110?",
          "Er svaret ja, gjør den det som står inni klammene. Er svaret nei, hopper den bare over.",
          "Nå kan spillet ditt ta valg."
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE B - høyre vegg
     ====================================================================== */

  var oppgaveHoyre = {
    id: "vegg-hoyre",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Høyre vegg",

    instruks:
      "Nå høyre vegg. Den står ved <b>890</b>. Bruk samme mønster som venstre vegg – " +
      "men tenk over hvilket spørsmål høyre vegg må stille.",

    valgtVedStart: underVenstreVegg,
    seTid: 1500,

    startProgram: function () { return Fremdrift.hentInstallert("figur") || []; },

    palett: [sporsmal(890), settTil(890), sporsmal(110), settTil(110)],

    hint: [
      "Nøyaktig samme mønster som venstre vegg, men med 890.",
      "Pass på tegnet! Ved høyre vegg har figuren gått for langt når figurX er STØRRE enn 890. Trykk på < for å bytte."
    ],

    bekreftIVerden: {
      instruks: "Gå inn i høyre vegg med «Høyre»! 👉",
      sjekk: function () { return VEGGER.hoyre.holder(Number(les("figurX")), Number(les("fart"))); },
      pause: 1200
    },

    sjekk: function (program) {
      /* Venstre vegg må fortsatt holde. */
      var venstre = vurderVegg(program, "venstre");
      if (venstre.feil) {
        var bv = beskjed(venstre, "venstre");
        return { ok: false, provForst: bv.provForst, melding: ["Venstre vegg holder ikke lenger!"].concat(bv.melding) };
      }

      var svar = vurderVegg(program, "hoyre");
      if (svar.feil) {
        var b = beskjed(svar, "hoyre");
        return { ok: false, provForst: b.provForst, melding: b.melding };
      }

      return {
        ok: true,
        ros: [
          "Begge veggene holder! 🎉",
          "Legg merke til forskjellen: venstre vegg spør «mindre enn», høyre vegg spør «større enn».",
          "Samme idé – bare speilvendt."
        ]
      };
    }
  };


  /* ======================================================================
     KAPITTELET
     ====================================================================== */

  Kapitler.leggTil({

    id: "veggen",
    tittel: "Veggen",

    steg: [

      {
        type: "dialog",
        linjer: [
          "Husker du? Figuren går rett gjennom veggen. 🧱",
          "Se på kantene av rommet – der står veggene.",
          "Nå skal spillet sjekke, hvert eneste bilde: har figuren gått for langt?",
          "Til det trenger vi noe helt nytt: et spørsmål i koden."
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveVenstre },

      {
        type: "dialog",
        linjer: [
          "Venstre vegg holder. Men prøv å gå mot høyre …",
          "Den går rett gjennom den andre veggen. Samme problem – bare på den andre siden."
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveHoyre },

      {
        type: "dialog",
        linjer: [
          "Nå er rommet et ordentlig rom. Figuren kan gå, stoppe – og den går ikke gjennom vegger.",
          "Husk å trykke Lagre, så husker spillet hvor den står. 💾",
          "Det du lærte i dag – if – er en av de aller viktigste tingene i programmering. Den kommer du til å bruke hele tiden."
        ]
      }

    ]

  });

  /* Det han har lært her, får han bruke fritt i Kodeverkstedet. */
  Verksted.leggTilBiter("figur", [sporsmal(110), settTil(110), sporsmal(890), settTil(890)]);

})();

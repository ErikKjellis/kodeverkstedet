/* ==========================================================================
   Kapittel 4 - Menyen

   Figuren står der den står. Vil han endre den, må han inn i koden igjen.
   I ekte spill finnes det menyer for sånt - så han lager en.

   Menyen ligger ute i rommet, ikke inne i maskinen: han må SE figuren mens
   han trykker, ellers er det ingen vits. Han programmerer den fortsatt inne
   i maskinen, akkurat som figuren.

   To oppgaver:
     A) Én knapp. Her ligger hele leksjonen, og han får prøve hvert steg selv:
        - trykker han og ingenting skjer, er det fordi variabelen er endret,
          men ingen har tegnet figuren på nytt
        - tegner han på nytt, står det plutselig TO figurer, fordi en
          datamaskin bare maler oppå det som er der fra før
        - først med viskUt() virker det
     B) Resten av menyen. Samme mønster igjen, nå som han kan det.

   Nye begreper: å endre en variabel, å viske ut og tegne på nytt.
   Det siste er selve grunnlaget for bevegelse i neste kapittel.
   ========================================================================== */

(function () {

  /* Figuren står her fra kapittel 3. tegnFigur må kalles med de samme tallene. */
  var STED_X = 810;
  var STED_Y = 560;

  /* Hva hver knapp skal gjøre. Knappenavn med stor forbokstav, verdier med liten. */
  var KNAPPER = {
    "Høy":   { variabel: "hoyde",    verdi: "høy" },
    "Lav":   { variabel: "hoyde",    verdi: "lav" },
    "Blond": { variabel: "harfarge", verdi: "blond" },
    "Brun":  { variabel: "harfarge", verdi: "brun" },
    "Svart": { variabel: "harfarge", verdi: "svart" },
    "Rød":   { variabel: "harfarge", verdi: "rød" }
  };
  var KNAPPENAVN = ["Lav", "Høy", "Blond", "Brun", "Svart", "Rød"];
  var HARKNAPPER = ["Blond", "Brun", "Svart", "Rød"];


  /* ======================================================================
     Hjelpere til å lese koden hans
     ====================================================================== */

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

  function knapperI(program) {
    return alleLinjer(program)
      .filter(function (l) { return l.type === "lagKnapp"; })
      .map(function (l) { return l.args.navn.v; });
  }

  function hendelseFor(program, navn) {
    for (var i = 0; i < program.length; i++) {
      var l = program[i];
      if (l.type === "naarManTrykkerPa" && l.args.mal.v === navn) return l;
    }
    return null;
  }

  function hendelseNestetFor(program, navn) {
    return alleLinjer(program).some(function (l) {
      return l.type === "naarManTrykkerPa" && l.args.mal.v === navn;
    });
  }

  /*
    Gjør koden inni en knapp om til en flat liste med steg. Kaller den en egen
    hjelpefunksjon (som tegnPåNytt), legges innholdet i den inn i stedet -
    da ser vi hva som faktisk skjer, i riktig rekkefølge.
  */
  function utvid(program, linjer, dybde, problemer) {
    var ut = [];
    for (var i = 0; i < (linjer || []).length; i++) {
      var l = linjer[i];
      if (l.type === "kallEgenFunksjon" && l.args.navn !== "tegnFigur") {
        var f = Kode.finnFunksjon(program, l.args.navn);
        if (!f) {
          problemer.push({ feil: "funksjonFinnesIkke", navn: l.args.navn });
          continue;
        }
        if (dybde < 5) ut = ut.concat(utvid(program, f.barn, dybde + 1, problemer));
        continue;
      }
      ut.push(l);
    }
    return ut;
  }

  function indeks(steg, test) {
    for (var i = 0; i < steg.length; i++) if (test(steg[i])) return i;
    return -1;
  }

  /*
    Virker knappen? Svarer med den FØRSTE tingen som mangler, slik at han
    bare får én ting å tenke på om gangen.
  */
  function vurderKnapp(program, navn) {
    var forventet = KNAPPER[navn];

    if (knapperI(program).indexOf(navn) === -1) return { feil: "ingenKnapp" };

    var hendelse = hendelseFor(program, navn);
    if (!hendelse) {
      return { feil: hendelseNestetFor(program, navn) ? "hendelseInni" : "ingenHendelse" };
    }

    var problemer = [];
    var steg = utvid(program, hendelse.barn, 0, problemer);
    if (problemer.length) return problemer[0];

    var iTil = indeks(steg, function (s) { return s.type === "tilordning"; });
    var iVisk = indeks(steg, function (s) { return s.type === "viskUt"; });
    var iTegn = indeks(steg, function (s) {
      return s.type === "kallEgenFunksjon" && s.args.navn === "tegnFigur";
    });

    if (iTil === -1) return { feil: "ingenTilordning", tom: steg.length === 0 };

    var til = steg[iTil];
    if (til.args.navn !== forventet.variabel || til.args.verdi.v !== forventet.verdi) {
      return { feil: "feilVerdi", tilordning: til, forventet: forventet };
    }

    if (iTegn === -1) return { feil: "ingenTegning" };
    if (iTegn < iTil) return { feil: "tegnForTilordning" };
    if (iVisk === -1) return { feil: "ingenViskUt" };
    if (iVisk > iTegn) return { feil: "viskUtEtter" };

    return { feil: null };
  }

  /*
    Gjør svaret fra vurderKnapp om til noe Bit kan si. Feil man best
    forstår ved å prøve, får «provForst»: han trykker selv før Bit forklarer.
  */
  function beskjedFor(svar, navn) {
    var v = KNAPPER[navn];
    var tegnKode = "tegnFigur(" + STED_X + ", " + STED_Y + ");";
    var provNa = {
      instruks: "Trykk på «" + navn + "» i menyen oppe til venstre! 👆",
      forbered: Knapper.nullstillTrykk,
      sjekk: function () { return Knapper.antallTrykk(navn) > 0; }
    };

    switch (svar.feil) {

      case "ingenKnapp":
        return { melding: [
          "Det mangler en knapp som heter «" + navn + "».",
          "Sett inn lagKnapp(\"" + navn + "\"); nederst i koden."
        ] };

      case "ingenHendelse":
        return { provForst: provNa, melding: [
          "Knappen blinker når du trykker – så selve trykket virker. 👍",
          "Men ingenting annet skjer. Kjenner du igjen dette?",
          "Akkurat som ikonet på skrivebordet: ingen har sagt hva som skal skje.",
          "Sett inn nårManTrykkerPå(\"" + navn + "\", ...) nederst."
        ] };

      case "hendelseInni":
        return { melding: [
          "Hendelsen for «" + navn + "» havnet inni en funksjon.",
          "Da blir den laget på nytt hver gang funksjonen kjører – og det blir fort kaos.",
          "Slett den med ✕, trykk på den aller nederste linja i koden, og sett den inn der i stedet."
        ] };

      case "funksjonFinnesIkke":
        return { melding: [
          "Knappen kaller " + svar.navn + "() – men jeg finner ikke den funksjonen.",
          "En funksjon må lages på egen linje helt ytterst i koden, ikke inni en knapp.",
          "Slett den med ✕ og sett den inn nederst i stedet."
        ] };

      case "ingenTilordning":
        if (svar.tom) {
          return { provForst: provNa, melding: [
            "Nå lytter maskinen på knappen – men det er tomt inni klammene, så den gjør ingenting.",
            "Vi vil endre en variabel. Sett inn " + v.variabel + " = \"" + v.verdi + "\"; der."
          ] };
        }
        return { provForst: provNa, melding: [
          "Figuren tegnes på nytt – men ingenting er endret, så den ser helt lik ut.",
          "Sett inn " + v.variabel + " = \"" + v.verdi + "\"; først inni klammene."
        ] };

      case "feilVerdi":
        return { melding: [
          "Knappen heter «" + navn + "», men den setter " + svar.tilordning.args.navn +
            " til «" + svar.tilordning.args.verdi.v + "». 🤔",
          "Den skulle satt " + v.variabel + " til «" + v.verdi + "».",
          "Trykk på den gule verdien i koden og bytt den."
        ] };

      case "ingenTegning":
        return { provForst: provNa, melding: [
          "Du trykket – og ingenting skjedde. Men noe skjedde faktisk! 🕵️",
          "Variabelen " + v.variabel + " ble endret til «" + v.verdi + "». Figuren er bare ikke tegnet på nytt.",
          "Skjermen forandrer seg aldri av seg selv. Be datamaskinen tegne igjen: " + tegnKode
        ] };

      case "tegnForTilordning":
        return { provForst: provNa, melding: [
          "Figuren ble tegnet på nytt – men FØR variabelen ble endret. Derfor så den lik ut.",
          "Koden leses ovenfra og ned. Flytt " + v.variabel + " = \"" + v.verdi + "\"; opp, så den kommer først."
        ] };

      case "ingenViskUt":
        /* Hva han faktisk ser, avhenger av om den nye figuren er mindre eller større. */
        var hvaHanSer = (v.verdi === "lav")
          ? ["Så du det? 😄 Nå har figuren plutselig to hoder!",
             "Det er fordi det står TO figurer oppå hverandre – den gamle, og en ny, lav en foran."]
          : ["Figuren ble høyere – men se nøye nederst. Ser du ekstra armer og bein som stikker ut? 🤔",
             "Det er den gamle figuren. Den står der fortsatt, bak den nye."];
        return { provForst: provNa, melding: hvaHanSer.concat([
          "Den gamle ble aldri visket ut. En datamaskin tegner bare OPPÅ det som er der fra før – som maling.",
          "Sett inn viskUt(); rett FØR tegnFigur."
        ]) };

      case "viskUtEtter":
        return { provForst: provNa, melding: [
          "Hvor ble figuren av? 👻",
          "viskUt(); står ETTER tegnFigur – så den visket ut den nye figuren også.",
          "Flytt viskUt(); opp, så den kommer før tegnFigur."
        ] };
    }
    return null;
  }


  /* ======================================================================
     Kodebitene
     ====================================================================== */

  function lagKnapp(navn, medValg) {
    var bit = { type: "lagKnapp", args: { navn: { k: "tekst", v: navn } } };
    if (medValg) bit.args.navn.valg = KNAPPENAVN;
    return bit;
  }

  function trykkPa(navn, medValg) {
    var bit = { type: "naarManTrykkerPa", args: { mal: { k: "tekst", v: navn } }, barn: [] };
    if (medValg) bit.args.mal.valg = KNAPPENAVN;
    return bit;
  }

  function endre(variabel, verdi, valg) {
    var bit = { type: "tilordning", args: { navn: variabel, verdi: { k: "tekst", v: verdi } } };
    if (valg) bit.args.verdi.valg = valg;
    return bit;
  }

  var VISK_UT = { type: "viskUt", args: {} };

  var TEGN_FIGUR = {
    type: "kallEgenFunksjon",
    args: { navn: "tegnFigur", argumenter: [{ k: "tall", v: STED_X }, { k: "tall", v: STED_Y }] }
  };

  var HJELPEFUNKSJON = {
    type: "funksjonDefinisjon",
    args: { navn: "tegnPåNytt", parametre: [] },
    barn: []
  };

  var KALL_HJELPER = {
    type: "kallEgenFunksjon",
    args: { navn: "tegnPåNytt", argumenter: [] }
  };


  /* ======================================================================
     Hvilken knapp skal han lage først?

     «Lav», så sant det går. Glemmer han viskUt(), tegnes en MINDRE figur
     oppå den gamle, og det gamle hodet stikker tydelig opp over det nye -
     to hoder, umulig å ta feil av. Andre veien skjuler den nye, store
     figuren nesten hele den gamle, og leksjonen blir borte.

     Gjorde han figuren lav i kapittel 3, må det bli «Høy» - ellers ville
     det ikke skjedd noe synlig når han trykker.
     ====================================================================== */

  function forsteKnapp() {
    var program = Fremdrift.hentInstallert("figur") || [];
    var hoyde = finnVariabel(program, "hoyde");
    return (hoyde && hoyde.args.verdi.v === "lav") ? "Høy" : "Lav";
  }

  function andreHoydeknapp() {
    return forsteKnapp() === "Høy" ? "Lav" : "Høy";
  }


  /* ======================================================================
     OPPGAVE A - én knapp
     ====================================================================== */

  var oppgaveKnappen = {
    id: "meny-knapp",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Lag en knapp",

    instruks: function () {
      var navn = forsteKnapp();
      return "Lag en knapp som heter <b>" + navn + "</b> i en meny ute i rommet. " +
             "Når man trykker på den, skal figuren bli <b>" + KNAPPER[navn].verdi + "</b>. " +
             "Tips: kjør koden og prøv knappen underveis – da ser du hva som mangler.";
    },

    valgtVedStart: "siste",

    startProgram: function () {
      var program = Fremdrift.hentInstallert("figur") || [];

      /* Høyden kan ikke bytte med de gule verdiene i dette kapittelet lenger -
         nå er det menyen som skal gjøre det. Ellers kunne han byttet den
         underveis, og knappen ville plutselig ikke gjort noen forskjell. */
      var hoyde = finnVariabel(program, "hoyde");
      if (hoyde) delete hoyde.args.verdi.valg;

      return program;
    },

    palett: function () {
      var navn = forsteKnapp();
      return [
        lagKnapp(navn),
        trykkPa(navn),
        endre("hoyde", KNAPPER[navn].verdi),
        TEGN_FIGUR,
        VISK_UT
      ];
    },

    hint: [
      "Begynn med selve knappen: lagKnapp. Kjør, og se at den dukker opp oppe til venstre.",
      "En knapp gjør ingenting før du sier hva som skal skje. Det gjør nårManTrykkerPå.",
      "Inni klammene: endre høyden. Prøv knappen – skjer det noe? Hvorfor ikke?",
      "Skjermen forandrer seg aldri av seg selv. Noen må tegne figuren på nytt – og det gamle må viskes ut først."
    ],

    bekreftIVerden: {
      instruks: "Trykk på knappen din! 👆",
      forbered: Knapper.nullstillTrykk,
      sjekk: function () { return Knapper.antallTrykk(forsteKnapp()) > 0; },
      pause: 900
    },

    sjekk: function (program) {
      var navn = forsteKnapp();
      var svar = vurderKnapp(program, navn);

      if (svar.feil) {
        var beskjed = beskjedFor(svar, navn);
        return { ok: false, provForst: beskjed.provForst, melding: beskjed.melding };
      }

      return {
        ok: true,
        ros: [
          "Der skjedde det! 📏",
          "Tre ting måtte til: endre variabelen, viske ut det gamle, og tegne på nytt.",
          "Det er nøyaktig sånn alle spill virker. Skjermen forandrer seg aldri av seg selv – noen må tegne den på nytt.",
          "Husk det. Det blir viktig når figuren skal lære å gå."
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE B - resten av menyen
     ====================================================================== */

  var oppgaveMenyen = {
    id: "meny-flere",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Bygg ut menyen",

    instruks: function () {
      return "Én knapp er en start. Lag <b>" + andreHoydeknapp() + "</b> også, og minst én knapp " +
             "for hårfarge. De gule verdiene lar deg bytte navn og verdi, så samme kodebit " +
             "kan bli mange forskjellige knapper. Trykker du på en <b>});</b>, havner neste " +
             "kodebit under den i stedet for inni.";
    },

    valgtVedStart: "siste",

    startProgram: function () {
      return Fremdrift.hentInstallert("figur") || [];
    },

    palett: function () {
      var navn = andreHoydeknapp();
      return [
        lagKnapp(navn, true),
        trykkPa(navn, true),
        endre("hoyde", KNAPPER[navn].verdi, ["lav", "vanlig", "høy"]),
        endre("harfarge", "blond", ["blond", "brun", "svart", "rød"]),
        VISK_UT,
        TEGN_FIGUR,
        HJELPEFUNKSJON,
        KALL_HJELPER
      ];
    },

    hint: [
      "Det er nøyaktig samme mønster som den første knappen: lagKnapp, nårManTrykkerPå, endre, viskUt, tegnFigur.",
      "Trykk på de gule verdiene for å gi knappen og hendelsen samme navn – de MÅ hete likt.",
      "Lei av å skrive viskUt(); og tegnFigur(...); i hver eneste knapp? Lag function tegnPåNytt() nederst, med de to linjene inni. Så kan hver knapp bare si tegnPåNytt();"
    ],

    bekreftIVerden: {
      instruks: "Prøv menyen din – trykk på minst to forskjellige knapper! 👆",
      forbered: Knapper.nullstillTrykk,
      sjekk: function () { return Knapper.ulikeTrykket() >= 2; },
      pause: 900
    },

    sjekk: function (program) {
      var navnene = knapperI(program);

      /* To knapper med samme navn blir til én - og det er forvirrende. */
      for (var i = 0; i < navnene.length; i++) {
        if (navnene.indexOf(navnene[i]) !== i) {
          return { ok: false, melding: [
            "Du har to knapper som begge heter «" + navnene[i] + "». Da blir det bare én av dem i menyen.",
            "Trykk på navnet i den ene og bytt det til noe annet."
          ] };
        }
      }

      /* En hendelse som venter på en knapp som ikke finnes, gjør aldri noe. */
      for (var j = 0; j < program.length; j++) {
        var l = program[j];
        if (l.type === "naarManTrykkerPa" && navnene.indexOf(l.args.mal.v) === -1 &&
            KNAPPER[l.args.mal.v]) {
          return { ok: false, melding: [
            "Du venter på at noen skal trykke på «" + l.args.mal.v + "» – men det finnes ingen knapp som heter det.",
            "Enten må du lage lagKnapp(\"" + l.args.mal.v + "\"); – eller så bytter du navnet i hendelsen."
          ] };
        }
      }

      /* Begge høydeknappene må virke. */
      var hoydeknapper = [forsteKnapp(), andreHoydeknapp()];
      for (var h = 0; h < hoydeknapper.length; h++) {
        var svar = vurderKnapp(program, hoydeknapper[h]);
        if (svar.feil) {
          return { ok: false, melding: beskjedFor(svar, hoydeknapper[h]).melding };
        }
      }

      /* Og minst én for håret. */
      var harknapper = navnene.filter(function (n) { return HARKNAPPER.indexOf(n) !== -1; });
      if (harknapper.length === 0) {
        return { ok: false, melding: [
          "Høyden virker begge veier! 🎉",
          "Nå mangler bare en knapp for hårfarge.",
          "Sett inn en lagKnapp til, og trykk på navnet til det står for eksempel «Blond»."
        ] };
      }
      for (var k = 0; k < harknapper.length; k++) {
        var harSvar = vurderKnapp(program, harknapper[k]);
        if (harSvar.feil) {
          return { ok: false, melding: beskjedFor(harSvar, harknapper[k]).melding };
        }
      }

      var ros = [
        "Nå har spillet ditt en ekte meny! 🎛️",
        navnene.length + " knapper – og hver eneste en gjør det samme: endrer en variabel, visker ut, tegner på nytt."
      ];
      if (Kode.finnFunksjon(program, "tegnPåNytt")) {
        ros.push("Og du lagde tegnPåNytt() så du slapp å gjenta deg selv. Det er akkurat sånn programmerere tenker. 👏");
      } else {
        ros.push("Så du at viskUt(); og tegnFigur(...); står likt i hver eneste knapp? Programmerere liker ikke å gjenta seg selv – det finnes en snarvei, og den kommer du til å møte igjen.");
      }
      return { ok: true, ros: ros };
    }
  };


  /* ======================================================================
     KAPITTELET
     ====================================================================== */

  Kapitler.leggTil({

    id: "menyen",
    tittel: "Menyen",

    steg: [

      {
        type: "dialog",
        linjer: [
          "Figuren din står der den står.",
          "Vil du gjøre den høyere eller gi den nytt hår, må du inn i koden igjen. Litt tungvint, ikke sant?",
          "I ekte spill finnes det menyer for sånt: knapper du trykker på, som endrer ting.",
          "Nå lager vi en. 🎛️"
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveKnappen },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveMenyen },

      {
        type: "dialog",
        linjer: [
          "Menyen blir liggende. Du kan bruke den når du vil.",
          "Legg merke til hva som skjer hver gang du trykker: en variabel endres, alt viskes ut, og figuren tegnes på nytt.",
          "Neste gang skal figuren lære å gå.",
          "Og vet du hva? Da gjør vi akkurat det samme – bare seksti ganger i sekundet. 🏃"
        ]
      }

    ]

  });

  /* Det han har lært her, får han bruke fritt i Kodeverkstedet.
     (tegnFigur med fast plass meldes ikke inn - fra kapittel 5 står figuren på figurX.) */
  Verksted.leggTilBiter("figur", [
    lagKnapp("Lav", true),
    trykkPa("Lav", true),
    endre("hoyde", "lav", ["lav", "vanlig", "høy"]),
    endre("harfarge", "blond", ["blond", "brun", "svart", "rød"]),
    VISK_UT,
    HJELPEFUNKSJON,
    KALL_HJELPER
  ]);

})();

/* ==========================================================================
   Kapittel 5 - Bevegelse

   Figuren får endelig gå. Tre steg, én ny idé i hvert:

     A) Ett steg. «Venstre» flytter figuren 20 punkter per trykk.
        Nytt: figurX = figurX - 20 - en linje som ser rar ut første gang.
     B) Hvert bilde. Datamaskinen «trykker» for ham, seksti ganger i sekundet.
        Nytt: spilløkka. Figuren går av seg selv - rett ut av rommet.
     C) Styr den. Knappene flytter ikke lenger figuren, de setter bare farten.
        Nytt: en variabel som styrer en annen, hvert eneste bilde.

   Alt bygger på kapittel 4: endre en variabel, visk ut, tegn på nytt.
   Spilløkka gjør nøyaktig det samme - bare så fort at det blir bevegelse.
   ========================================================================== */

(function () {

  /* Figuren har stått her siden kapittel 3. */
  var START_X = 810;
  var GULV_Y = 560;

  var FIGURX = { k: "var", v: "figurX" };


  /* ======================================================================
     Hjelpere
     ====================================================================== */

  /* Hva står en variabel i figurprogrammet til akkurat nå, mens spillet går? */
  function les(navn) {
    return Kjorer.verdi({ eier: "figur", variabler: {} }, { k: "var", v: navn });
  }

  function erFlytting(s) {
    return s.type === "tilordning" && s.args.navn === "figurX";
  }

  function erTegnFigur(s) {
    return s.type === "kallEgenFunksjon" && s.args.navn === "tegnFigur";
  }

  function erViskUt(s) {
    return s.type === "viskUt";
  }

  function tegnerDerFigurXEr(s) {
    var forste = (s.args.argumenter || [])[0];
    return !!forste && forste.k === "var" && forste.v === "figurX";
  }

  /*
    Til nå har figuren stått på et fast tall. Nå skal plassen kunne endre seg,
    så vi lager variabelen figurX og bytter ut tallet med den overalt. Bit sier
    fra om dette før han åpner koden, så det skjer ikke i det skjulte.
  */
  function medFigurX(program) {
    Kode.alleLinjer(program).forEach(function (l) {
      if (!erTegnFigur(l)) return;
      var forste = (l.args.argumenter || [])[0];
      if (forste && forste.k === "tall" && forste.v === START_X) {
        l.args.argumenter[0] = { k: "var", v: "figurX" };
      }
    });
    if (!Kode.finnVariabel(program, "figurX")) {
      program.unshift({
        type: "variabel",
        laast: true,
        args: { navn: "figurX", verdi: { k: "tall", v: START_X } }
      });
    }
    return program;
  }

  /* Samme vurdering av «tegn på nytt» som i kapittel 4: visk ut, så tegn - der figurX er. */
  function vurderTegning(steg) {
    var iTegn = Kode.indeksI(steg, erTegnFigur);
    if (iTegn === -1) return { feil: "ingenTegning", iTegn: -1 };
    if (!tegnerDerFigurXEr(steg[iTegn])) return { feil: "tegnerFast", iTegn: iTegn };
    var iVisk = Kode.indeksI(steg, erViskUt);
    if (iVisk === -1) return { feil: "ingenViskUt", iTegn: iTegn };
    if (iVisk > iTegn) return { feil: "viskUtEtter", iTegn: iTegn };
    return { feil: null, iTegn: iTegn };
  }


  /* ======================================================================
     Kodebitene
     ====================================================================== */

  function flytt(op, tall, valg) {
    return {
      type: "tilordning",
      args: {
        navn: "figurX",
        verdi: { k: "regn", a: FIGURX, op: op, b: { k: "tall", v: tall, valg: valg } }
      }
    };
  }

  var FLYTT_MED_FART = {
    type: "tilordning",
    args: { navn: "figurX", verdi: { k: "regn", a: FIGURX, op: "+", b: { k: "var", v: "fart" } } }
  };

  var TEGN_FIGUR_HER = {
    type: "kallEgenFunksjon",
    args: { navn: "tegnFigur", argumenter: [FIGURX, { k: "tall", v: GULV_Y }] }
  };

  var VISK_UT = { type: "viskUt", args: {} };

  var HVERT_BILDE = { type: "hvertBilde", args: {}, barn: [] };

  var KALL_HJELPER = { type: "kallEgenFunksjon", args: { navn: "tegnPåNytt", argumenter: [] } };

  var STYRENAVN = ["Høyre", "Stopp", "Venstre"];

  function lagKnapp(navn, valg) {
    var bit = { type: "lagKnapp", args: { navn: { k: "tekst", v: navn } } };
    if (valg) bit.args.navn.valg = valg;
    return bit;
  }

  function trykkPa(navn, valg) {
    var bit = { type: "naarManTrykkerPa", args: { mal: { k: "tekst", v: navn } }, barn: [] };
    if (valg) bit.args.mal.valg = valg;
    return bit;
  }

  var SETT_FART = {
    type: "tilordning",
    args: { navn: "fart", verdi: { k: "tall", v: 3, valg: [3, 0, -3] } }
  };

  /* Har han laget tegnPåNytt() i kapittel 4, får han bruke den her også. */
  function medHjelperHvisDenFinnes(biter) {
    var program = Fremdrift.hentInstallert("figur") || [];
    if (Kode.finnFunksjon(program, "tegnPåNytt")) biter.push(KALL_HJELPER);
    return biter;
  }


  /* ======================================================================
     OPPGAVE A - ett steg
     ====================================================================== */

  function vurderSteg(program) {
    var navn = "Venstre";

    if (Kode.knappenavn(program).indexOf(navn) === -1) return { feil: "ingenKnapp" };

    var hendelse = Kode.hendelse(program, "naarManTrykkerPa", navn);
    if (!hendelse) {
      return { feil: Kode.hendelseHvorSomHelst(program, "naarManTrykkerPa", navn) ? "hendelseInni" : "ingenHendelse" };
    }

    var problemer = [];
    var steg = Kode.utvid(program, hendelse.barn, problemer);
    if (problemer.length) return problemer[0];

    var iFlytt = Kode.indeksI(steg, erFlytting);
    if (iFlytt === -1) return { feil: "ingenFlytting" };

    var tegning = vurderTegning(steg);
    if (tegning.feil === "ingenTegning" || tegning.feil === "tegnerFast") return tegning;
    if (tegning.iTegn < iFlytt) return { feil: "tegnForFlytting" };
    return tegning;
  }

  function trykkNaa(antall) {
    return {
      instruks: antall > 1 ? "Trykk på «Venstre» noen ganger! 👆" : "Trykk på «Venstre» i menyen! 👆",
      forbered: Knapper.nullstillTrykk,
      sjekk: function () { return Knapper.antallTrykk("Venstre") >= antall; }
    };
  }

  function beskjedSteg(svar) {
    switch (svar.feil) {
      case "ingenKnapp":
        return { melding: [
          "Vi begynner med en knapp som heter «Venstre».",
          "Sett inn lagKnapp(\"Venstre\"); nederst i koden."
        ] };
      case "ingenHendelse":
        return { melding: [
          "Knappen er der, men den gjør ingenting ennå – og du vet hvorfor. 😉",
          "Sett inn nårManTrykkerPå(\"Venstre\", ...) nederst."
        ] };
      case "hendelseInni":
        return { melding: [
          "Hendelsen havnet inni noe annet. Den må stå helt ytterst i koden.",
          "Slett den med ✕, trykk på en }); helt nederst, og sett den inn der."
        ] };
      case "funksjonFinnesIkke":
        return { melding: [
          "Knappen kaller " + svar.navn + "() – men jeg finner ikke den funksjonen.",
          "En funksjon må stå på egen linje helt ytterst i koden, ikke inni en knapp."
        ] };
      case "ingenFlytting":
        return { provForst: trykkNaa(1), melding: [
          "Knappen virker – men figuren står stille. 🧍",
          "Plassen til figuren ligger i variabelen figurX. Den må endres for at figuren skal flytte seg.",
          "Sett inn figurX = figurX - 20; inni knappen."
        ] };
      case "ingenTegning":
        return { provForst: trykkNaa(1), melding: [
          "figurX ble endret – men ingen tegnet figuren på nytt, så den står der den stod.",
          "Kjenner du igjen denne? Legg til viskUt(); og tegnFigur(figurX, " + GULV_Y + ");"
        ] };
      case "tegnerFast":
        return { provForst: trykkNaa(1), melding: [
          "Figuren tegnes på nytt – men alltid på plass " + START_X + ", uansett hva figurX er.",
          "Bruk tegnFigur(figurX, " + GULV_Y + "); i stedet. Da tegnes den der figurX sier."
        ] };
      case "tegnForFlytting":
        return { provForst: trykkNaa(3), melding: [
          "Merket du at det første trykket ikke gjorde noe – og at figuren hele tiden henger ett steg etter?",
          "Den tegnes FØR plassen endres. Flytt figurX = figurX - 20; opp, så den kommer først."
        ] };
      case "ingenViskUt":
        return { provForst: trykkNaa(3), melding: [
          "Se! 😄 En hel rekke med figurer!",
          "Hvert trykk tegnet en ny figur ett steg lenger bort – men ingen av de gamle ble visket ut.",
          "Sett inn viskUt(); rett før tegnFigur."
        ] };
      case "viskUtEtter":
        return { provForst: trykkNaa(1), melding: [
          "Hvor ble figuren av? 👻",
          "viskUt(); står etter tegnFigur – så den visker ut den nye figuren også.",
          "Flytt viskUt(); opp, så den kommer før tegnFigur."
        ] };
    }
    return { melding: ["Noe er ikke helt riktig ennå. Trykk på Hint for et lite dytt."] };
  }

  var oppgaveSteg = {
    id: "bevegelse-steg",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Ta et steg",

    instruks:
      "Øverst i koden ligger en ny variabel: <b>figurX</b>. Den er plassen til figuren – " +
      "hvor langt den står fra venstre kant. Lag en knapp <b>Venstre</b> som flytter " +
      "figuren et lite stykke hver gang du trykker.",

    valgtVedStart: "siste",

    startProgram: function () {
      return medFigurX(Fremdrift.hentInstallert("figur") || []);
    },

    palett: function () {
      return medHjelperHvisDenFinnes([
        lagKnapp("Venstre"),
        trykkPa("Venstre"),
        flytt("-", 20, [10, 20, 50]),
        VISK_UT,
        TEGN_FIGUR_HER
      ]);
    },

    hint: [
      "Samme mønster som menyknappene: lagKnapp, nårManTrykkerPå, og inni den: endre noe, visk ut, tegn på nytt.",
      "Det som skal endres er plassen: figurX = figurX - 20;",
      "Mot venstre blir tallet mindre. x er hvor langt figuren står fra venstre kant."
    ],

    bekreftIVerden: {
      instruks: "Trykk på «Venstre» noen ganger! 👆",
      forbered: Knapper.nullstillTrykk,
      sjekk: function () { return Knapper.antallTrykk("Venstre") >= 3; },
      pause: 700
    },

    sjekk: function (program) {
      var svar = vurderSteg(program);
      if (svar.feil) {
        var b = beskjedSteg(svar);
        return { ok: false, provForst: b.provForst, melding: b.melding };
      }
      return {
        ok: true,
        ros: [
          "Den går! 🚶 Ett steg for hvert trykk.",
          "Linja figurX = figurX - 20 ser kanskje rar ut. Hvordan kan noe være lik seg selv minus 20?",
          "Den betyr: ta tallet som ligger i figurX, trekk fra 20, og legg svaret tilbake i esken.",
          "Og legg merke til retningen: mot venstre blir tallet mindre, mot høyre blir det større."
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE B - hvert bilde
     ====================================================================== */

  function vurderLokke(program) {
    var lokke = Kode.hendelse(program, "hvertBilde");
    if (!lokke) {
      return { feil: Kode.hendelseHvorSomHelst(program, "hvertBilde") ? "lokkeInni" : "ingenLokke" };
    }

    var problemer = [];
    var steg = Kode.utvid(program, lokke.barn, problemer);
    if (problemer.length) return problemer[0];

    if (Kode.indeksI(steg, erFlytting) === -1) return { feil: "ingenFlytting", tom: steg.length === 0 };

    /* I en spilløkke spiller det ingen rolle om plassen endres før eller etter
       tegningen - neste bilde kommer om en sekstidels sekund uansett. */
    return vurderTegning(steg);
  }

  function beskjedLokke(svar) {
    switch (svar.feil) {
      case "ingenLokke":
        return [
          "Figuren går fortsatt bare når du trykker.",
          "Vi trenger noe som skjer av seg selv, hele tiden. Sett inn hvertBilde(function () { ... }); helt nederst."
        ];
      case "lokkeInni":
        return [
          "hvertBilde havnet inni noe annet. Da startes en ny spilløkke hver gang den koden kjører – og figuren går fortere og fortere.",
          "Den må stå helt ytterst. Slett den med ✕, trykk på en }); nederst, og sett den inn der."
        ];
      case "funksjonFinnesIkke":
        return [
          "Spilløkka kaller " + svar.navn + "() – men jeg finner ikke den funksjonen.",
          "En funksjon må stå på egen linje helt ytterst i koden."
        ];
      case "ingenFlytting":
        if (svar.tom) {
          return [
            "Spilløkka går – seksti ganger i sekundet! Men den er tom inni, så den gjør ingenting.",
            "Hva skal skje hvert bilde? Endre plassen litt, visk ut, tegn på nytt."
          ];
        }
        return [
          "Spilløkka går – men figuren står helt stille.",
          "Den tegnes seksti ganger i sekundet på nøyaktig samme sted. Plassen må endres litt hver gang: figurX = figurX - 2;"
        ];
      case "ingenTegning":
        return [
          "figurX endres seksti ganger i sekundet – det går fort! Men figuren står stille.",
          "Ingen tegner den på nytt. Legg til viskUt(); og tegnFigur(figurX, " + GULV_Y + "); i spilløkka."
        ];
      case "tegnerFast":
        return [
          "Spilløkka tegner figuren – men alltid på plass " + START_X + ", uansett hva figurX er.",
          "Bruk tegnFigur(figurX, " + GULV_Y + "); i stedet."
        ];
      case "ingenViskUt":
        return [
          "Figuren ble til en lang orm! 🐛",
          "Hvert bilde tegnet en ny figur litt lenger bort – men ingen av de gamle ble visket ut. Seksti nye figurer i sekundet!",
          "Sett inn viskUt(); før tegnFigur i spilløkka."
        ];
      case "viskUtEtter":
        return [
          "Hvor ble figuren av? 👻",
          "viskUt(); står etter tegnFigur – så hvert eneste bilde visker den ut igjen med en gang.",
          "Flytt viskUt(); opp, så den kommer før tegnFigur."
        ];
    }
    return ["Noe er ikke helt riktig ennå. Trykk på Hint for et lite dytt."];
  }

  var oppgaveLokka = {
    id: "bevegelse-lokke",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Hvert bilde",

    instruks:
      "Å trykke hundre ganger er slitsomt. <b>hvertBilde</b> kjører koden inni seg " +
      "<b>seksti ganger i sekundet</b> – helt av seg selv. Få figuren til å gå et " +
      "lite steg hver eneste gang.",

    valgtVedStart: "siste",

    /* Han skal få se figuren gå (eller ikke gå) en stund før Bit sier noe. */
    seTid: 2500,

    startProgram: function () {
      return Fremdrift.hentInstallert("figur") || [];
    },

    palett: function () {
      return medHjelperHvisDenFinnes([
        HVERT_BILDE,
        flytt("-", 2, [1, 2, 5]),
        VISK_UT,
        TEGN_FIGUR_HER
      ]);
    },

    hint: [
      "Sett inn hvertBilde helt nederst – trykk på den siste }); først, så havner den under.",
      "Inni hvertBilde: nøyaktig det samme som i Venstre-knappen, bare et mye mindre steg. figurX = figurX - 2;",
      "Et lite steg seksti ganger i sekundet blir til en jevn bevegelse. Sånn virker all animasjon."
    ],

    bekreftIVerden: {
      instruks: "Se på figuren din! 👀",
      sjekk: function () { return Number(les("figurX")) <= START_X - 300; },
      pause: 300
    },

    sjekk: function (program) {
      var svar = vurderLokke(program);
      if (svar.feil) return { ok: false, melding: beskjedLokke(svar) };
      return {
        ok: true,
        ros: [
          "DEN GÅR AV SEG SELV! 🚶",
          "Det du nettopp lagde, er hjertet i alle dataspill: spilløkka.",
          "Seksti ganger i sekundet: flytt litt, visk ut, tegn på nytt. Akkurat som menyknappen din – bare så fort at det ser ut som bevegelse.",
          "Men … den stopper jo ikke. Den går rett ut av rommet. 😅"
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE C - styr den
     ====================================================================== */

  var FORVENTET_FART = {
    "Høyre":   { test: function (f) { return f > 0; },   riktig: 3 },
    "Stopp":   { test: function (f) { return f === 0; }, riktig: 0 },
    "Venstre": { test: function (f) { return f < 0; },   riktig: -3 }
  };

  function vurderStyring(program) {
    var lokke = vurderLokke(program);
    if (lokke.feil && lokke.feil !== "ingenFlytting") return { feil: "lokke", lokke: lokke };

    var hendelse = Kode.hendelse(program, "hvertBilde");
    var flyttinger = Kode.utvid(program, hendelse.barn, []).filter(erFlytting);
    var medFart = flyttinger.filter(function (s) {
      return s.args.verdi.k === "regn" && s.args.verdi.b.k === "var" && s.args.verdi.b.v === "fart";
    });
    if (medFart.length === 0) return { feil: "ikkeFart" };
    if (flyttinger.length > medFart.length) return { feil: "toFlyttinger" };

    var navnene = Kode.knappenavn(program);
    for (var i = 0; i < navnene.length; i++) {
      if (navnene.indexOf(navnene[i]) !== i) return { feil: "dobbelKnapp", navn: navnene[i] };
    }

    for (var n = 0; n < STYRENAVN.length; n++) {
      var navn = STYRENAVN[n];
      if (navnene.indexOf(navn) === -1) return { feil: "ingenKnapp", navn: navn };

      var h = Kode.hendelse(program, "naarManTrykkerPa", navn);
      if (!h) {
        return {
          feil: Kode.hendelseHvorSomHelst(program, "naarManTrykkerPa", navn) ? "hendelseInni" : "ingenHendelse",
          navn: navn
        };
      }

      var steg = Kode.utvid(program, h.barn, []);
      var farter = steg.filter(function (s) { return s.type === "tilordning" && s.args.navn === "fart"; });
      if (farter.length === 0) {
        return { feil: "ingenFart", navn: navn, flytterFortsatt: steg.some(erFlytting) };
      }

      var fart = Number(farter[farter.length - 1].args.verdi.v);
      if (!FORVENTET_FART[navn].test(fart)) return { feil: "feilFart", navn: navn, fart: fart };
    }

    return { feil: null };
  }

  function beskjedStyring(svar) {
    var riktig = svar.navn ? FORVENTET_FART[svar.navn].riktig : 0;

    switch (svar.feil) {
      case "lokke":
        return beskjedLokke(svar.lokke);
      case "ikkeFart":
        return [
          "Nå skal knappene bestemme farten – men spilløkka bryr seg ikke om fart ennå.",
          "Den flytter figuren like mye hvert eneste bilde. Bytt figurX = figurX - 2; med figurX = figurX + fart;"
        ];
      case "toFlyttinger":
        return [
          "Nesten! Men spilløkka flytter figuren TO ganger hvert bilde: én gang med fart, og én gang med et fast tall.",
          "Slett linja med det faste tallet, så er det bare farten som bestemmer."
        ];
      case "dobbelKnapp":
        return [
          "Du har to knapper som begge heter «" + svar.navn + "». Da blir det bare én av dem i menyen.",
          "Trykk på navnet i den ene og bytt det."
        ];
      case "ingenKnapp":
        return [
          "Det mangler en knapp som heter «" + svar.navn + "».",
          "Sett inn en lagKnapp til, og trykk på navnet til det står «" + svar.navn + "»."
        ];
      case "ingenHendelse":
        return [
          "Knappen «" + svar.navn + "» finnes, men ingen hendelse venter på den.",
          "Sett inn nårManTrykkerPå, og trykk på navnet til det står «" + svar.navn + "»."
        ];
      case "hendelseInni":
        return [
          "Hendelsen for «" + svar.navn + "» havnet inni noe annet. Den må stå helt ytterst i koden.",
          "Slett den med ✕, trykk på en }); nederst, og sett den inn der."
        ];
      case "ingenFart":
        if (svar.navn === "Venstre" && svar.flytterFortsatt) {
          return [
            "Venstre tar fortsatt bare ett hopp når du trykker.",
            "Nå som figuren går av seg selv, skal knappen bare bestemme retningen. Sett inn fart = -3; inni Venstre-knappen."
          ];
        }
        return [
          "Knappen «" + svar.navn + "» gjør ingenting med farten.",
          "Sett inn fart = " + riktig + "; inni den – trykk på tallet til det blir riktig."
        ];
      case "feilFart":
        if (svar.navn === "Høyre") {
          return [
            "Høyre setter fart til " + svar.fart + " – da går figuren ikke mot høyre!",
            "Mot høyre blir figurX større. Farten må være et positivt tall: 3."
          ];
        }
        if (svar.navn === "Stopp") {
          return [
            "Stopp setter fart til " + svar.fart + " – da stopper den jo ikke! 😄",
            "Å stå stille er fart 0. Trykk på tallet."
          ];
        }
        return [
          "Venstre setter fart til " + svar.fart + ".",
          "Mot venstre blir figurX mindre – så farten må være negativ: -3."
        ];
    }
    return ["Noe er ikke helt riktig ennå. Trykk på Hint for et lite dytt."];
  }

  var oppgaveStyr = {
    id: "bevegelse-styr",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Styr figuren",

    instruks:
      "Øverst ligger en ny variabel: <b>fart</b>. Nå skal knappene ikke flytte figuren " +
      "selv – de skal bare bestemme <b>farten</b>, og spilløkka gjør resten. " +
      "Du trenger tre knapper: <b>Høyre</b>, <b>Stopp</b> og <b>Venstre</b>.",

    valgtVedStart: "siste",

    startProgram: function () {
      var program = Fremdrift.hentInstallert("figur") || [];
      if (!Kode.finnVariabel(program, "fart")) {
        program.unshift({
          type: "variabel",
          laast: true,
          args: { navn: "fart", verdi: { k: "tall", v: 0 } }
        });
      }
      return program;
    },

    palett: function () {
      return [
        FLYTT_MED_FART,
        lagKnapp("Høyre", STYRENAVN),
        trykkPa("Høyre", STYRENAVN),
        SETT_FART,
        HVERT_BILDE,
        VISK_UT,
        TEGN_FIGUR_HER
      ];
    },

    hint: [
      "Begynn i spilløkka: bytt figurX = figurX - 2; med figurX = figurX + fart;",
      "fart er 0 fra start, så nå står figuren stille. Det er riktig!",
      "Høyre-knappen skal bare si fart = 3; – spilløkka tar seg av resten.",
      "Stopp er fart = 0; og Venstre er fart = -3; Trykk på de gule verdiene for å bytte navn og tall."
    ],

    bekreftIVerden: {
      instruks: "Styr figuren! Prøv Høyre, Stopp og Venstre. 🎮",
      forbered: Knapper.nullstillTrykk,
      sjekk: function () {
        return STYRENAVN.every(function (n) { return Knapper.antallTrykk(n) > 0; });
      },
      pause: 800
    },

    sjekk: function (program) {
      var svar = vurderStyring(program);
      if (svar.feil) return { ok: false, melding: beskjedStyring(svar) };
      return {
        ok: true,
        ros: [
          "Nå styrer DU figuren! 🎮",
          "Knappene flytter den ikke lenger. De bestemmer bare farten – og spilløkka gjør resten, seksti ganger i sekundet.",
          "fart = 3 betyr tre steg mot høyre hvert bilde. fart = -3 betyr tre mot venstre. fart = 0 betyr stå stille.",
          "Sånn virker nesten alle spill du noen gang har spilt."
        ]
      };
    }
  };


  /* ======================================================================
     KAPITTELET
     ====================================================================== */

  Kapitler.leggTil({

    id: "bevegelse",
    tittel: "Bevegelse",

    steg: [

      {
        type: "dialog",
        linjer: [
          "Menyen din kan gjøre figuren høy og lav. Men den står på nøyaktig samme sted hele tiden.",
          "Nå skal den lære å gå. 🚶",
          "Til nå har plassen vært et fast tall: " + START_X + ". Et tall kan ikke endre seg.",
          "Så jeg har laget en variabel til deg, figurX, og byttet ut " + START_X + " med den overalt i koden. Nå kan plassen endre seg."
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveSteg },

      {
        type: "dialog",
        linjer: [
          "Ett steg for hvert trykk. Men skal den gå over hele rommet, må du trykke veldig mange ganger.",
          "Hva om datamaskinen trykker for deg? Seksti ganger i sekundet? ⚡"
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveLokka },

      {
        type: "dialog",
        linjer: [
          "Vi må kunne styre den. Og den må kunne stoppe."
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveStyr },

      {
        type: "dialog",
        linjer: [
          "Figuren din kan gå. Og du styrer den.",
          "Men prøv å gå helt bort til kanten … Den går rett gjennom veggen og ut i ingenting. 🧱",
          "Den vet ikke at det finnes en vegg. Det skal den få lære.",
          "Men først skal spillet ditt lære å huske. 💾"
        ]
      }

    ]

  });

  /* Det han har lært her, får han bruke fritt i Kodeverkstedet. */
  Verksted.leggTilBiter("figur", [
    TEGN_FIGUR_HER,
    HVERT_BILDE,
    FLYTT_MED_FART,
    flytt("-", 20, [10, 20, 50]),
    lagKnapp("Høyre", STYRENAVN),
    trykkPa("Høyre", STYRENAVN),
    SETT_FART
  ]);

})();

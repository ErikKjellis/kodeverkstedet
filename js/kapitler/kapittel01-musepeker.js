/* ==========================================================================
   Kapittel 1 - Musepekeren

   To små steg, ikke ett stort:
     A) Tegn en musepeker. Den dukker opp - men står bom stille.
     B) Få den til å følge fingeren.

   Underveis møter han: funksjon, parameter, rekkefølge (sekvens),
   koordinater og hendelse. Ordene kommer etter at han har sett dem virke.
   ========================================================================== */

(function () {

  /* ---------- Kodebiter vi bruker i paletten ---------- */

  function farge(navn) {
    return { type: "fyllFarge", args: { farge: { k: "tekst", v: navn } } };
  }

  function form(hvilken, storrelse) {
    return {
      type: "tegnForm",
      args: {
        form: hvilken,
        x: { k: "var", v: "x" },
        y: { k: "var", v: "y" },
        storrelse: { k: "tall", v: storrelse }
      }
    };
  }

  var FARGEBITER = [
    farge("hvit"), farge("gul"), farge("rosa"),
    farge("grønn"), farge("blå"), farge("oransje")
  ];

  var FORMBITER = [
    form("trekant", 20),
    form("sirkel", 14),
    form("firkant", 18)
  ];

  var TEGN_MUSEPEKER_KALL = {
    type: "kallEgenFunksjon",
    args: {
      navn: "tegnMusepeker",
      argumenter: [{ k: "var", v: "x" }, { k: "var", v: "y" }]
    }
  };

  var FINGERHENDELSE = {
    type: "naarFingerenFlytterSeg",
    args: { parametre: ["x", "y"] },
    barn: []
  };


  /* ======================================================================
     OPPGAVE A - tegn musepekeren
     ====================================================================== */

  var oppgaveTegn = {
    id: "musepeker-tegn",
    installasjonsId: "musepeker",
    tittel: "Lag en musepeker",

    instruks:
      "Her står en <b>funksjon</b> som heter <b>tegnMusepeker</b>. En funksjon er " +
      "en oppskrift – men denne oppskriften er tom inni. " +
      "Den grønne streken viser hvor neste kodebit havner. Velg en farge og en form nedenfor.",

    valgtVedStart: "forste",

    startProgram: function () {
      return [
        {
          type: "funksjonDefinisjon",
          laast: true,
          args: { navn: "tegnMusepeker", parametre: ["x", "y"] },
          barn: []
        },
        {
          type: "kallEgenFunksjon",
          laast: true,
          args: {
            navn: "tegnMusepeker",
            argumenter: [{ k: "tall", v: 700 }, { k: "tall", v: 220 }]
          }
        }
      ];
    },

    palett: FARGEBITER.concat(FORMBITER),

    hint: [
      "Den grønne streken viser hvor kodebiten havner. Vil du flytte den, trykker du på en annen linje.",
      "En musepeker er som regel en trekant. Prøv tegnTrekant(x, y, 20).",
      "Vil du ha farge, må fyllFarge stå ØVERST – før tegningen. Datamaskinen leser ovenfra og ned."
    ],

    sjekk: function (program) {
      var funksjon = Kode.finnFunksjon(program, "tegnMusepeker");
      var kropp = funksjon ? (funksjon.barn || []) : [];

      var forsteForm = Kode.indeksAvType(kropp, "tegnForm");
      var forsteFarge = Kode.indeksAvType(kropp, "fyllFarge");

      if (forsteForm === -1 && forsteFarge === -1) {
        return {
          ok: false,
          melding: [
            "Det skjedde ingenting – for oppskriften er fortsatt helt tom.",
            "Trykk på linja «function tegnMusepeker(x, y) {», og så på en kodebit nederst. Du klarer dette! 🙂"
          ]
        };
      }

      if (forsteForm === -1) {
        return {
          ok: false,
          melding: [
            "Du har valgt en farge – fin farge! 🎨",
            "Men datamaskinen vet fortsatt ikke HVA den skal tegne. Den gjør bare nøyaktig det du sier.",
            "Prøv å legge til en form også, for eksempel tegnTrekant(x, y, 20)."
          ]
        };
      }

      if (forsteFarge > forsteForm) {
        return {
          ok: false,
          melding: [
            "Nesten! Men så du at pekeren ble hvit i stedet for fargen du valgte?",
            "Datamaskinen leser koden ovenfra og ned. Den rakk å tegne før den fikk vite fargen.",
            "Trykk på fyllFarge-linja og flytt den opp med ▲."
          ]
        };
      }

      return {
        ok: true,
        ros: [
          "SE DER! 🎉 Der er musepekeren din.",
          "Det er den aller første tingen som finnes i spillet ditt – og du lagde den.",
          "Men … legg merke til én ting. Den står helt stille midt i rommet.",
          "Den aner ikke hvor fingeren din er. Skal vi lære den det?"
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE B - få musepekeren til å følge fingeren
     ====================================================================== */

  var oppgaveFolg = {
    id: "musepeker-folg",
    installasjonsId: "musepeker",
    tittel: "Få den til å følge fingeren",

    instruks:
      "Linja nederst sier <b>tegnMusepeker(700, 220)</b> – tegn på nøyaktig dette stedet, én gang. " +
      "Derfor står den stille. Vi trenger noe som sier <b>«hver gang fingeren flytter seg»</b>. " +
      "Det heter en <b>hendelse</b>.",

    valgtVedStart: "siste",

    startProgram: function () {
      /* Vi fortsetter på det han lagde i forrige oppgave. */
      var fra = Fremdrift.hentInstallert("musepeker") || oppgaveTegn.startProgram();

      /* Kallet nederst låses opp, slik at han kan slette det. */
      for (var i = 0; i < fra.length; i++) {
        if (fra[i].type === "kallEgenFunksjon") fra[i].laast = false;
      }
      return fra;
    },

    palett: [FINGERHENDELSE, TEGN_MUSEPEKER_KALL].concat(FARGEBITER).concat(FORMBITER),

    hint: [
      "Trykk på den nederste linja, og sett så inn nårFingerenFlytterSeg.",
      "Inni nårFingerenFlytterSeg er x og y fingerens plass akkurat nå. Be den tegne musepekeren der: tegnMusepeker(x, y);",
      "Til slutt: slett den gamle linja tegnMusepeker(700, 220); med ✕ – den lager en ekstra peker som bare ligger igjen."
    ],

    bekreftIVerden: {
      instruks: "Flytt fingeren rundt på skjermen! 👆",
      sjekk: function () { return Input.bevegelseSiden() > 400; }
    },

    sjekk: function (program) {
      var hendelse = Kode.forste(program, "naarFingerenFlytterSeg");

      if (!hendelse) {
        return {
          ok: false,
          melding: [
            "Musepekeren blir fortsatt tegnet bare ÉN gang, helt i starten. Derfor står den stille.",
            "Vi trenger en kodebit som sier «gjør dette hver gang fingeren flytter seg».",
            "Prøv nårFingerenFlytterSeg nederst i paletten. 💪"
          ]
        };
      }

      var kall = Kode.finnKall(hendelse.barn || [], "tegnMusepeker");

      if (!kall) {
        return {
          ok: false,
          melding: [
            "Bra! Nå vet datamaskinen NÅR den skal gjøre noe.",
            "Men den vet ikke HVA. Det er tomt inni klammene.",
            "Trykk på nårFingerenFlytterSeg-linja, og sett inn tegnMusepeker(x, y);"
          ]
        };
      }

      var argumenter = kall.args.argumenter || [];
      if (!argumenter[0] || argumenter[0].k !== "var") {
        return {
          ok: false,
          melding: [
            "Nesten! Men tegnMusepeker(700, 220) betyr «tegn akkurat her» – hver eneste gang.",
            "x og y er der fingeren er nå. Bruk den varianten som sier tegnMusepeker(x, y)."
          ]
        };
      }

      /* Ligger det gamle kallet fortsatt igjen på toppnivå? */
      var gamleKall = Kode.paNiva(program, "kallEgenFunksjon");
      if (gamleKall.length > 0) {
        return {
          ok: false,
          melding: [
            "Nå følger den fingeren – veldig bra! 🎯",
            "Men ser du at det ligger igjen en ekstra musepeker midt i rommet?",
            "Den kommer fra den gamle linja tegnMusepeker(700, 220);. Slett den med ✕."
          ]
        };
      }

      return {
        ok: true,
        ros: [
          "DEN FØLGER DEG! 🎉🎉",
          "Det du nettopp lagde heter en hendelse: kode som venter på at noe skal skje.",
          "Og x og y kalles koordinater – to tall som forteller nøyaktig hvor noe er på skjermen.",
          "Dette er akkurat slik ekte dataspill er laget. Helt ekte."
        ]
      };
    }
  };


  /* ======================================================================
     KAPITTELET
     ====================================================================== */

  Kapitler.leggTil({

    id: "musepeker",
    tittel: "Musepekeren",

    steg: [

      {
        type: "dialog",
        linjer: [
          "Oi.",
          "Vi trenger visst en musepeker for å kunne klikke på noe.",
          "Det finnes ingen her ennå. Ingen har laget den.",
          "Men det kan vi fikse – vi lager en selv! 💪"
        ]
      },

      { type: "kode", oppgave: oppgaveTegn },

      { type: "kode", oppgave: oppgaveFolg },

      {
        type: "egen",
        start: function (neste) {
          Banner.vis("Prøv datamaskinen nå! 💻", { viktig: true });
          Verden.blink("datamaskin", 600);

          var stopp = Input.naarTrykk(function (x, y) {
            var gjenstand = Verden.trykketPa(x, y);
            if (!gjenstand || gjenstand.id !== "datamaskin") return;

            stopp();
            Banner.skjul();

            gjenstand.pa = true;
            Fremdrift.settTilstand("datamaskinPa", true);
            Effekter.konfetti(130);

            setTimeout(function () {
              Dialog.si([
                "Skjermen lyser! 💡",
                "Legg merke til hva som faktisk skjedde: datamaskinen virket hele tiden.",
                "Det som manglet, var noe å trykke MED. Og det lagde du.",
                "Slik er alt i et dataspill – noen har måttet lage hver eneste bit."
              ], neste, { avatar: "🎉", feiring: true });
            }, 700);
          });

          return stopp;
        }
      }

    ]

  });

})();

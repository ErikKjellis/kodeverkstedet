/* ==========================================================================
   Kapittel 2 - Skrivebordet

   Han trykker på datamaskinen, og vi zoomer inn i skjermen. Den er tom.
   Så bygger han et skrivebord med et programikon på - og oppdager at
   ikonet ikke gjør noe før han sier hva som skal skje når man trykker.
   Samme leksjon som musepekeren, men nå kjenner han den igjen selv.

   Til slutt åpner ikonet Kodeverkstedet 1.0. Fra nå av er det HER han
   programmerer: trykk på maskinen, trykk på ikonet, kod.

   Nye begreper: variabel, en hendelse som gjelder ÉN bestemt ting.
   ========================================================================== */

(function () {

  /* ---------- Kodebiter ---------- */

  var FARGER_SKRIVEBORD = ["mørkeblå", "grønn", "lilla", "svart", "brun", "rosa"];

  var VARIABEL_BAKGRUNN = {
    type: "variabel",
    laast: true,
    args: {
      navn: "bakgrunn",
      verdi: { k: "tekst", v: "mørkeblå", valg: FARGER_SKRIVEBORD }
    }
  };

  var FYLL_MED_VARIABEL = {
    type: "fyllFarge",
    args: { farge: { k: "var", v: "bakgrunn" } }
  };

  var FYLL_HELE = { type: "fyllHeleSkjermen", args: {} };

  /* Navnet kan byttes - og da MÅ hendelsen under bytte til det samme. */
  var IKONNAVN = ["Kode", "Verksted", "Byggeriet"];

  var LAG_IKON = {
    type: "lagIkon",
    args: {
      x: { k: "tall", v: 200, valg: [200, 500, 800] },
      y: { k: "tall", v: 200, valg: [200, 400] },
      navn: { k: "tekst", v: "Kode", valg: IKONNAVN }
    }
  };

  var TRYKK_PA_IKON = {
    type: "naarManTrykkerPa",
    args: { mal: { k: "tekst", v: "Kode", valg: IKONNAVN } },
    barn: []
  };

  var AAPNE_PROGRAM = { type: "aapneProgram", args: {} };

  function fyllFarge(navn) {
    return { type: "fyllFarge", args: { farge: { k: "tekst", v: navn } } };
  }

  /* ---------- Hjelpere til å lese hva koden hans faktisk gjør ---------- */

  /* Hva står variabelen til? */
  function variabelVerdi(program, navn) {
    for (var i = 0; i < program.length; i++) {
      var l = program[i];
      if (l.type === "variabel" && l.args.navn === navn) return l.args.verdi.v;
    }
    return null;
  }

  /*
    Hvilken farge gjelder når vi kommer til linje nummer «indeks»?
    fyllFarge virker jo videre nedover helt til noen setter en ny.
  */
  function fargeVed(program, indeks) {
    var farge = "hvit";
    for (var i = 0; i < indeks && i < program.length; i++) {
      if (program[i].type !== "fyllFarge") continue;
      var f = program[i].args.farge;
      farge = (f.k === "var") ? variabelVerdi(program, f.v) : f.v;
    }
    return farge;
  }


  /* ======================================================================
     OPPGAVE A - skrivebordet
     ====================================================================== */

  var oppgaveSkrivebord = {
    id: "skrivebord-bygg",
    installasjonsId: "skrivebord",
    flate: "skjerm",
    tittel: "Bygg et skrivebord",

    instruks:
      "Nå programmerer du <b>inne i maskinen</b>. Skjermen trenger to ting: " +
      "en <b>bakgrunn</b>, og et <b>ikon</b> å trykke på. " +
      "Den gule verdien øverst kan du trykke på for å bytte farge.",

    valgtVedStart: "siste",

    startProgram: function () {
      return [VARIABEL_BAKGRUNN];
    },

    palett: [
      FYLL_MED_VARIABEL,
      FYLL_HELE,
      LAG_IKON,
      fyllFarge("hvit"),
      fyllFarge("gul"),
      fyllFarge("grønn")
    ],

    hint: [
      "Først må skjermen males. Sett inn fyllFarge(bakgrunn); og så fyllHeleSkjermen();",
      "Legg merke til at fyllFarge(bakgrunn) ikke har anførselstegn. Den henter fargen fra variabelen øverst.",
      "Til slutt trenger du lagIkon(200, 200, \"Kode\"); – det er programikonet du skal trykke på.",
      "Står ikonet oppå bakgrunnen? Bakgrunnen må males FØR ikonet, ellers males den rett over.",
      "Ikonet trenger sin egen farge. Sett en fyllFarge rett før lagIkon, ellers arver det bakgrunnsfargen."
    ],

    sjekk: function (program) {
      var fyller = Kode.forste(program, "fyllHeleSkjermen");
      var ikon = Kode.forste(program, "lagIkon");

      if (!fyller && !ikon) {
        return {
          ok: false,
          melding: [
            "Skjermen er like tom som før. Vi har ikke sagt noe ennå.",
            "Begynn med fyllFarge(bakgrunn); og fyllHeleSkjermen(); – da får skjermen en farge."
          ]
        };
      }

      if (!fyller) {
        return {
          ok: false,
          melding: [
            "Ikonet er der! Men det svever i det svarte tomrommet. 🌌",
            "Et skrivebord trenger et underlag. Sett inn fyllFarge(bakgrunn); og fyllHeleSkjermen();"
          ]
        };
      }

      if (!ikon) {
        return {
          ok: false,
          melding: [
            "Fin farge! Nå har skjermen en bakgrunn. 🎨",
            "Men et skrivebord uten noe å trykke på er bare en vegg.",
            "Sett inn lagIkon(200, 200, \"Kode\"); nederst."
          ]
        };
      }

      /* Rekkefølgen igjen: males bakgrunnen sist, forsvinner ikonet under den. */
      var indeksFyll = Kode.indeksAvType(program, "fyllHeleSkjermen");
      var indeksIkon = Kode.indeksAvType(program, "lagIkon");
      if (indeksFyll > indeksIkon) {
        return {
          ok: false,
          melding: [
            "Hvor ble det av ikonet? 🤔",
            "Det er der – men bakgrunnen ble malt OVER det, fordi den står sist.",
            "Flytt fyllHeleSkjermen(); opp med ▲, så den kommer før lagIkon."
          ]
        };
      }

      /* fyllFarge gjelder videre nedover - så ikonet kan bli usynlig. */
      if (fargeVed(program, indeksIkon) === fargeVed(program, indeksFyll)) {
        return {
          ok: false,
          melding: [
            "Ikonet er der … men ser du det nesten ikke? 👻",
            "Det har fått nøyaktig samme farge som bakgrunnen.",
            "fyllFarge gjelder videre nedover i koden helt til noen sier noe annet.",
            "Sett en ny fyllFarge rett FØR lagIkon, så skiller ikonet seg ut."
          ]
        };
      }

      return {
        ok: true,
        ros: [
          "Du har et skrivebord! 🖥️",
          "Og se linja aller øverst: var bakgrunn = ... Det er en variabel.",
          "En variabel er en eske med navn på. Du putter noe i den én gang, og bruker det så mange ganger du vil.",
          "Neste gang du er inne i koden: trykk på verdien og velg en annen farge. Hele skrivebordet skifter."
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE B - få ikonet til å virke
     ====================================================================== */

  var oppgaveIkonet = {
    id: "skrivebord-ikon",
    installasjonsId: "skrivebord",
    flate: "skjerm",
    tittel: "Få ikonet til å virke",

    instruks:
      "Ikonet er foreløpig bare en tegning. Vi må fortelle maskinen hva som skal " +
      "skje <b>når man trykker på akkurat det ikonet</b>.",

    valgtVedStart: "siste",

    startProgram: function () {
      return Fremdrift.hentInstallert("skrivebord") || oppgaveSkrivebord.startProgram();
    },

    palett: [TRYKK_PA_IKON, AAPNE_PROGRAM, FYLL_MED_VARIABEL, FYLL_HELE, LAG_IKON],

    hint: [
      "Du har gjort dette før – med musepekeren. Da brukte vi nårFingerenFlytterSeg.",
      "Denne gangen venter vi ikke på fingeren, men på ÉN bestemt ting: nårManTrykkerPå(\"Kode\", ...)",
      "Og inni klammene: åpneProgram();"
    ],

    bekreftIVerden: {
      instruks: "Trykk på ikonet på skjermen! 👆",
      forbered: function () { Skjerm.lukkProgram(); },
      sjekk: function () { return Skjerm.programErApent(); }
    },

    sjekk: function (program) {
      var hendelse = Kode.forste(program, "naarManTrykkerPa");

      if (!hendelse) {
        return {
          ok: false,
          melding: [
            "Prøv å trykke på ikonet. Ingenting, ikke sant?",
            "Kjenner du igjen dette? Akkurat sånn var det med datamaskinen helt i starten.",
            "Ikonet er bare en tegning. Vi trenger nårManTrykkerPå(\"Kode\", ...)"
          ]
        };
      }

      var ikon = Kode.forste(program, "lagIkon");
      var ikonnavn = ikon ? ikon.args.navn.v : "Kode";
      if (hendelse.args.mal.v !== ikonnavn) {
        return {
          ok: false,
          melding: [
            "Nesten! Men du venter på noe som heter «" + hendelse.args.mal.v + "».",
            "Ikonet ditt heter «" + ikonnavn + "». Maskinen er veldig nøye på at navnet stemmer helt.",
            "Trykk på navnet i koden og bytt det."
          ]
        };
      }

      var aapner = Kode.forste(hendelse.barn || [], "aapneProgram");
      if (!aapner) {
        return {
          ok: false,
          melding: [
            "Bra! Nå vet maskinen NÅR den skal gjøre noe.",
            "Men det er tomt inni klammene, så den gjør ingenting.",
            "Sett inn åpneProgram(); der."
          ]
        };
      }

      return {
        ok: true,
        ros: [
          "DER ÅPNET DET SEG! 🎉",
          "Kodeverkstedet 1.0. Ditt eget program, på din egen maskin.",
          "Legg merke til forskjellen fra musepekeren: den ventet på fingeren uansett hvor du var.",
          "Denne venter på én bestemt ting. Det er sånn alle knapper i alle programmer virker."
        ]
      };
    }
  };


  /* ======================================================================
     KAPITTELET
     ====================================================================== */

  Kapitler.leggTil({

    id: "skrivebordet",
    tittel: "Skrivebordet",

    steg: [

      /* Inn i maskinen */
      {
        type: "egen",
        start: function (neste) {
          Banner.vis("Trykk på datamaskinen 💻", {});
          Verden.blink("datamaskin", 600);

          /*
            Selve innzoomingen gjør spillet alltid når man trykker på en
            datamaskin som står på (se paTrykk i spill.js). Her venter vi bare
            til vi faktisk ER inne. Vi lytter ikke på trykket selv - da ville
            to lyttere slåss om det samme trykket.
          */
          var aktiv = true;
          (function vent() {
            if (!aktiv) return;
            if (Skjerm.erApen()) {
              Banner.skjul();
              neste();
              return;
            }
            requestAnimationFrame(vent);
          })();

          return function () { aktiv = false; };
        }
      },

      {
        type: "dialog",
        linjer: [
          "Der er vi inne. 🖥️",
          "Og … det er ikke akkurat mye her.",
          "En datamaskin uten programmer er egentlig bare en veldig dyr lampe.",
          "Hittil har du lånt kodevinduet mitt. Det er siste gang.",
          "Nå lager du ditt eget verktøy – inne i maskinen, der det hører hjemme."
        ]
      },

      { type: "kode", oppgave: oppgaveSkrivebord },

      {
        type: "dialog",
        linjer: [
          "Da prøver vi det du har laget.",
          "Trykk på ikonet på skrivebordet ditt."
        ]
      },

      { type: "kode", oppgave: oppgaveIkonet },

      /* Fra nå av kan han gå fritt inn og ut av maskinen */
      {
        type: "egen",
        start: function (neste) {
          Skjerm.settKanLukkes(true);
          Fremdrift.settTilstand("kanForlateSkjermen", true);

          Dialog.si([
            "Fra nå av er det slik du programmerer:",
            "Gå til datamaskinen, trykk på ikonet, og kod.",
            "Se nederst til venstre – der kommer du deg ut i rommet igjen når du vil.",
            "Neste gang lager vi noen som kan bo i rommet. En ordentlig spillfigur. 🚶"
          ], neste);

          return null;
        }
      }

    ]

  });

  /* Det han har lært her, får han bruke fritt i Kodeverkstedet. */
  Verksted.navngi("skrivebord", "Skrivebordet", "🖥️", "Bakgrunnen og ikonene inne i maskinen");
  Verksted.leggTilBiter("skrivebord", [
    FYLL_MED_VARIABEL, FYLL_HELE, fyllFarge("hvit"), fyllFarge("gul"), fyllFarge("grønn"),
    fyllFarge("rosa"), LAG_IKON, TRYKK_PA_IKON, AAPNE_PROGRAM
  ]);

  /*
    Sletter han veien inn til Kodeverkstedet, kommer han aldri tilbake til
    koden sin. Da sier Bit nei før koden kjøres.
  */
  Verksted.beskytt("skrivebord", function (program) {
    var ikon = Kode.forste(program, "lagIkon");
    var hendelse = ikon && Kode.hendelse(program, "naarManTrykkerPa", ikon.args.navn.v);
    var aapner = hendelse && Kode.utvid(program, hendelse.barn).some(function (s) {
      return s.type === "aapneProgram";
    });
    if (aapner) return null;
    return [
      "Stopp litt! ✋ Kjører du denne koden, finnes det ikke lenger noen vei inn til Kodeverkstedet.",
      "Da kommer du aldri tilbake til koden din.",
      "Skrivebordet må ha et ikon, og en nårManTrykkerPå med samme navn som åpner programmet med åpneProgram();"
    ];
  });

})();

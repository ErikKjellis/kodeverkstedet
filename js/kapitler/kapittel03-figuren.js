/* ==========================================================================
   Kapittel 3 - Figuren

   Han programmerer inne i maskinen, men det han lager dukker opp UTE i
   rommet. Det er en oppdagelse verdt å gjøre.

   Tre steg, ikke ett:
     A) en strekmann - bare fire streker satt sammen
     B) en ordentlig kropp - første gang en variabel gis videre til en funksjon
     C) utseendet - høyde, hårfarge og frisyre, samme grep tre ganger

   Figuren kan ikke gå ennå. Det er meningen. Det kommer siden.
   ========================================================================== */

(function () {

  /*
    Der figuren skal stå: på gulvet til høyre for bordet, og langt nok bak
    til at dialogboksen nederst ikke dekker beina på en bred, lav skjerm.
  */
  var STED_X = 810;
  var STED_Y = 560;

  /* ---------- Kodebiter ---------- */

  function del(hvilken, ekstra, kjonn) {
    var bit = {
      type: "tegnKroppsdel",
      args: {
        del: hvilken,
        x: { k: "var", v: "x" },
        y: { k: "var", v: "y" }
      }
    };
    if (ekstra) bit.args.ekstra = { k: "var", v: ekstra };
    if (kjonn) bit.args.kjonn = { k: "var", v: kjonn };
    return bit;
  }

  function variabel(navn, verdi, valg, laast) {
    return {
      type: "variabel",
      laast: !!laast,
      args: { navn: navn, verdi: { k: "tekst", v: verdi, valg: valg } }
    };
  }

  var VAR_KROPPSFORM = variabel("kroppsform", "tynn", ["tynn", "vanlig", "tykk"]);
  var VAR_HOYDE = variabel("hoyde", "vanlig", ["lav", "vanlig", "høy"], true);
  var VAR_HARFARGE = variabel("harfarge", "brun", ["brun", "blond", "svart", "rød"], true);
  var VAR_KJONN = variabel("kjonn", "gutt", ["gutt", "jente"], true);

  function fyllFarge(navn) {
    return { type: "fyllFarge", args: { farge: { k: "tekst", v: navn } } };
  }

  var KLESFARGER = [
    fyllFarge("blå"), fyllFarge("grønn"), fyllFarge("rød"),
    fyllFarge("gul"), fyllFarge("lilla"), fyllFarge("hvit")
  ];

  /* ---------- Hjelpere til sjekkene ---------- */

  function kroppen(program) {
    return Kode.finnFunksjon(program, "tegnFigur");
  }

  /* Leter etter en variabel hvor som helst i koden - den virker
     både øverst og inni funksjonen, så vi skal ikke være vanskelige. */
  function finnVariabel(linjer, navn) {
    for (var i = 0; i < (linjer || []).length; i++) {
      var l = linjer[i];
      if (l.type === "variabel" && l.args.navn === navn) return l;
      if (l.barn) {
        var treff = finnVariabel(l.barn, navn);
        if (treff) return treff;
      }
    }
    return null;
  }

  function delerI(program) {
    var funksjon = kroppen(program);
    var funnet = {};
    var barn = funksjon ? (funksjon.barn || []) : [];
    for (var i = 0; i < barn.length; i++) {
      if (barn[i].type === "tegnKroppsdel") funnet[barn[i].args.del] = barn[i];
    }
    return funnet;
  }


  /* ======================================================================
     OPPGAVE A - strekmannen
     ====================================================================== */

  var oppgaveStrekmann = {
    id: "figur-strekmann",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Lag en strekmann",

    instruks:
      "En person er ikke én ting – den er mange deler satt sammen. " +
      "Sett inn alle fire delene inni <b>tegnFigur</b>: bein, kropp, armer og hode.",

    valgtVedStart: "forste",

    startProgram: function () {
      return [
        {
          type: "funksjonDefinisjon",
          laast: true,
          args: { navn: "tegnFigur", parametre: ["x", "y"] },
          barn: []
        },
        {
          type: "kallEgenFunksjon",
          laast: true,
          args: {
            navn: "tegnFigur",
            argumenter: [{ k: "tall", v: STED_X }, { k: "tall", v: STED_Y }]
          }
        }
      ];
    },

    palett: [del("bein"), del("kropp"), del("armer"), del("hode")]
      .concat(KLESFARGER),

    hint: [
      "Alle fire delene ligger i paletten nederst. Trykk dem inn én etter én.",
      "x og y er der figuren står. Alle delene bruker de samme to tallene – da havner de på samme sted.",
      "Rekkefølgen spiller ingen rolle her. Delene finner hverandre selv."
    ],

    sjekk: function (program) {
      var deler = delerI(program);
      var antall = Object.keys(deler).length;

      if (antall === 0) {
        return {
          ok: false,
          melding: [
            "Fortsatt ingen i rommet – oppskriften tegnFigur er tom.",
            "Trykk på en av delene nederst, så begynner det å ligne på noe."
          ]
        };
      }

      if (!deler.hode) {
        return {
          ok: false,
          melding: [
            "Det er noe der! Men den mangler hode. 😬",
            "Sett inn tegnHode(x, y);"
          ]
        };
      }

      if (!deler.kropp) {
        return {
          ok: false,
          melding: [
            "Et hode som svever i løse lufta! 👻",
            "Den trenger noe å henge fast i. Sett inn tegnKropp(x, y);"
          ]
        };
      }

      if (!deler.bein) {
        return {
          ok: false,
          melding: [
            "Nå har den hode og kropp – men ingenting å stå på.",
            "Sett inn tegnBein(x, y);"
          ]
        };
      }

      if (!deler.armer) {
        return {
          ok: false,
          melding: [
            "Nesten i mål! Men prøv å telle armene. 🤨",
            "Sett inn tegnArmer(x, y);"
          ]
        };
      }

      return {
        ok: true,
        ros: [
          "Det bor noen her nå! 🎉",
          "Og se hvor det skjedde: du skrev koden inne i maskinen – men figuren kom ut i rommet.",
          "Slik lages ekte spill. Man sitter i et program og bygger en verden utenfor.",
          "Men … dette er jo bare streker. Skal vi gi den en ordentlig kropp?"
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE B - en ordentlig kropp
     ====================================================================== */

  var oppgaveKroppen = {
    id: "figur-kropp",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Gi den en kropp",

    instruks:
      "Nå kommer et triks du får bruk for resten av livet: <b>gir du en funksjon " +
      "mer å jobbe med, gjør den mer</b>. " +
      "Lag variabelen <b>kroppsform</b>, og bytt ut tegnKropp med varianten som får den med seg.",

    valgtVedStart: "forste",

    startProgram: function () {
      return Fremdrift.hentInstallert("figur") || oppgaveStrekmann.startProgram();
    },

    palett: [VAR_KROPPSFORM, del("kropp", "kroppsform"), del("kropp")]
      .concat(KLESFARGER),

    hint: [
      "Først: sett inn var kroppsform = \"tynn\"; – linja må stå FØR tegnKropp.",
      "Så: slett den gamle tegnKropp(x, y); med ✕, og sett inn tegnKropp(x, y, kroppsform); i stedet.",
      "Når det virker: trykk på den gule verdien \"tynn\" og velg tykk. Kjør igjen og se."
    ],

    sjekk: function (program) {
      var variabelen = finnVariabel(program, "kroppsform");
      var deler = delerI(program);
      var kropp = deler.kropp;

      if (!variabelen) {
        return {
          ok: false,
          melding: [
            "Vi mangler noe å fortelle tegnKropp.",
            "Sett inn var kroppsform = \"tynn\"; – husk at linja må stå FØR tegnKropp, siden koden leses ovenfra og ned."
          ]
        };
      }

      if (!kropp) {
        return {
          ok: false,
          melding: [
            "Nå er kroppen borte helt! Du har slettet tegnKropp, men ikke satt inn noen ny.",
            "Sett inn tegnKropp(x, y, kroppsform); inni tegnFigur."
          ]
        };
      }

      if (!kropp.args.ekstra) {
        return {
          ok: false,
          melding: [
            "Variabelen er laget – men ingen bruker den ennå. 🤷",
            "tegnKropp(x, y) får fortsatt bare vite HVOR, ikke HVORDAN.",
            "Slett den linja med ✕, og sett inn tegnKropp(x, y, kroppsform); i stedet."
          ]
        };
      }

      return {
        ok: true,
        ros: [
          "Der ble det en ordentlig kropp! 💪",
          "Det du nettopp gjorde er å gi en funksjon et argument – noe å jobbe med.",
          "tegnKropp(x, y) tegnet en strek. tegnKropp(x, y, kroppsform) tegner en kropp.",
          "Samme funksjon. Mer å gå på."
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE C - utseendet
     ====================================================================== */

  var oppgaveUtseendet = {
    id: "figur-utseende",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Bestem utseendet",

    instruks:
      "Jeg har lagt inn tre variabler til: <b>hoyde</b>, <b>harfarge</b> og <b>kjonn</b>. " +
      "Gjør nå nøyaktig det samme som med kroppen – gi dem videre til <b>tegnBein</b> og <b>tegnHode</b>.",

    valgtVedStart: "forste",

    startProgram: function () {
      var fra = Fremdrift.hentInstallert("figur") || oppgaveKroppen.startProgram();

      /* De tre nye variablene legges øverst, låst, men med verdier han kan bla i. */
      return [
        Fremdrift.kopi(VAR_HOYDE),
        Fremdrift.kopi(VAR_HARFARGE),
        Fremdrift.kopi(VAR_KJONN)
      ].concat(fra);
    },

    palett: [
      del("bein", "hoyde"),
      del("hode", "harfarge", "kjonn"),
      del("bein"),
      del("hode")
    ].concat(KLESFARGER),

    hint: [
      "Slett tegnBein(x, y); og sett inn tegnBein(x, y, hoyde); i stedet.",
      "Så det samme med hodet: tegnHode(x, y, harfarge, kjonn);",
      "Når alt virker: trykk på de gule verdiene øverst og prøv deg fram. Den forandrer seg med én gang."
    ],

    sjekk: function (program) {
      var deler = delerI(program);

      if (!deler.bein || !deler.bein.args.ekstra) {
        return {
          ok: false,
          melding: [
            "Beina vet fortsatt ingenting om hvor høy figuren skal være.",
            "Slett tegnBein(x, y); med ✕, og sett inn tegnBein(x, y, hoyde); i stedet."
          ]
        };
      }

      if (!deler.hode || !deler.hode.args.ekstra) {
        return {
          ok: false,
          melding: [
            "Høyden virker! 📏 Men hodet er fortsatt en tom ring.",
            "Sett inn tegnHode(x, y, harfarge, kjonn); i stedet for den gamle."
          ]
        };
      }

      if (!deler.hode.args.kjonn) {
        return {
          ok: false,
          melding: [
            "Nå har den ansikt og hårfarge! 🎨",
            "Men frisyren mangler beskjed. Bruk varianten med fire ting: tegnHode(x, y, harfarge, kjonn);"
          ]
        };
      }

      return {
        ok: true,
        ros: [
          "DER ER FIGUREN DIN! 🎉🎉",
          "Fire variabler øverst bestemmer hvordan hele personen ser ut.",
          "Det er derfor variabler finnes: du endrer ett sted, og alt som bruker det følger etter.",
          "Prøv å bla i verdiene og kjør på nytt. Lag den akkurat som du vil ha den."
        ]
      };
    }
  };


  /* ======================================================================
     KAPITTELET
     ====================================================================== */

  Kapitler.leggTil({

    id: "figuren",
    tittel: "Figuren",

    steg: [

      {
        type: "dialog",
        linjer: [
          "Du har et rom. Du har en maskin. Du har et verktøy.",
          "Men det bor jo ingen her.",
          "Nå lager vi en person. 🚶",
          "Én ting til: du skriver koden inne i maskinen – men se nøye etter HVOR figuren dukker opp."
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveStrekmann },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveKroppen },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveUtseendet },

      {
        type: "dialog",
        linjer: [
          "Nå står det en person i rommet ditt.",
          "Du har kanskje lagt merke til én ting: den rører seg ikke.",
          "Den kan ikke gå, ikke vinke, ikke gjøre noe som helst.",
          "Det er fordi ingen har lært den det ennå. Og det er nettopp det vi skal gjøre. 👋"
        ]
      }

    ]

  });

})();

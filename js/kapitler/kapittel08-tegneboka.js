/* ==========================================================================
   Kapittel 8 - Tegneboka

   Han får et tegneprogram - men ikonet og åpningen bygger han selv, med det
   samme mønsteret som Kode-ikonet i kapittel 2.

   Så tegner han noe, og får se hemmeligheten: tegningen er bare tall.
   16 rader med 16 sifre. 0 er tom, 3 er rød, 5 er gul.

   Til slutt setter han tegningen inn i rommet med tegnBilde - og endrer den i
   Tegneboka. Da endrer den seg i rommet også, fordi koden leser de samme
   tallene. Det er koblingen mellom det han tegner og det han koder.

   Nye begreper: grafikk er data, og en tegning og et program er laget av
   det samme stoffet.
   ========================================================================== */

(function () {

  var IKONNAVN = "Tegning";


  /* ======================================================================
     Hjelpere
     ====================================================================== */

  function tegningerSomTekst() {
    var alle = {};
    Fremdrift.tegningsnavn().forEach(function (n) { alle[n] = Fremdrift.hentTegning(n); });
    return JSON.stringify(alle);
  }

  /*
    Et steg som venter på noe inne i Tegneboka. Står Tegneboka lukket, minner
    et banner ham om å åpne den - men banneret skjules mens han tegner, så det
    ikke ligger over knappene.
  */
  function ventITegneboka(hint, lukketTekst, erFerdig) {
    return {
      type: "egen",
      start: function (neste) {
        var aktiv = true;
        var visteBanner = false;
        Tegneboka.settHint(hint);

        (function vent() {
          if (!aktiv) return;

          var ferdig = erFerdig();
          if (ferdig) {
            Banner.skjul();
            setTimeout(function () { if (aktiv) neste(); }, ferdig === "straks" ? 0 : 900);
            return;
          }

          var bannerSkalVises = !Tegneboka.erApen();
          if (bannerSkalVises && !visteBanner) Banner.vis(lukketTekst, {});
          if (!bannerSkalVises && visteBanner) Banner.skjul();
          visteBanner = bannerSkalVises;

          requestAnimationFrame(vent);
        })();

        return function () { aktiv = false; };
      }
    };
  }


  /* ======================================================================
     Kodebitene
     ====================================================================== */

  function fyllFarge(navn) {
    return { type: "fyllFarge", args: { farge: { k: "tekst", v: navn } } };
  }

  var LAG_TEGNEIKON = {
    type: "lagIkon",
    args: {
      x: { k: "tall", v: 500, valg: [200, 500, 800] },
      y: { k: "tall", v: 200, valg: [200, 400] },
      navn: { k: "tekst", v: IKONNAVN }
    }
  };

  var TRYKK_TEGNING = {
    type: "naarManTrykkerPa",
    args: { mal: { k: "tekst", v: IKONNAVN } },
    barn: []
  };

  var AAPNE_TEGNEBOKA = { type: "aapneTegneboka", args: {} };

  /* Navnet kan bare være en tegning han faktisk har lagret. */
  function tegnBildeBit() {
    var navn = Fremdrift.tegningsnavn();
    var navnVerdi = { k: "tekst", v: navn[navn.length - 1] || "blomst" };
    if (navn.length > 1) navnVerdi.valg = navn;
    return {
      type: "tegnBilde",
      args: {
        navn: navnVerdi,
        x: { k: "tall", v: 200, valg: [200, 300, 500, 700] },
        y: { k: "tall", v: 600, valg: [560, 600, 660] },
        storrelse: { k: "tall", v: 160, valg: [96, 160, 240] }
      }
    };
  }


  /* ======================================================================
     OPPGAVE A - et nytt ikon
     ====================================================================== */

  /* Ikonet som åpner Kodeverkstedet - det skal ingen røre. */
  function kodeIkonet(program) {
    var ikoner = Kode.alleLinjer(program).filter(function (l) { return l.type === "lagIkon"; });
    for (var i = 0; i < ikoner.length; i++) {
      var h = Kode.hendelse(program, "naarManTrykkerPa", ikoner[i].args.navn.v);
      if (h && Kode.utvid(program, h.barn, []).some(function (s) { return s.type === "aapneProgram"; })) {
        return ikoner[i];
      }
    }
    return null;
  }

  function vurderIkon(program) {
    var kode = kodeIkonet(program);
    if (!kode) return { feil: "kodeIkonBorte" };

    var ikon = Kode.alleLinjer(program).filter(function (l) {
      return l.type === "lagIkon" && l.args.navn.v === IKONNAVN;
    })[0];
    if (!ikon) return { feil: "ingenIkon" };

    var dx = Math.abs(ikon.args.x.v - kode.args.x.v);
    var dy = Math.abs(ikon.args.y.v - kode.args.y.v);
    if (dx < 130 && dy < 130) return { feil: "overlapp" };

    var hendelse = Kode.hendelse(program, "naarManTrykkerPa", IKONNAVN);
    if (!hendelse) {
      return { feil: Kode.hendelseHvorSomHelst(program, "naarManTrykkerPa", IKONNAVN) ? "hendelseInni" : "ingenHendelse" };
    }

    var aapner = Kode.utvid(program, hendelse.barn, []).some(function (s) { return s.type === "aapneTegneboka"; });
    if (!aapner) return { feil: "ingenApning" };

    return { feil: null };
  }

  var BESKJED_IKON = {
    kodeIkonBorte: [
      "Oi – Kode-ikonet virker ikke lenger! Da kommer du ikke til koden din.",
      "Pass på at hendelsen for Kode-ikonet fortsatt har åpneProgram(); inni."
    ],
    ingenIkon: [
      "Skrivebordet trenger et nytt ikon for tegneprogrammet.",
      "Sett inn lagIkon(500, 200, \"" + IKONNAVN + "\"); nederst."
    ],
    overlapp: [
      "Det nye ikonet står rett oppå Kode-ikonet – da ser du bare ett av dem! 🙈",
      "Trykk på det første tallet i lagIkon og flytt ikonet til et annet sted."
    ],
    ingenHendelse: [
      "Ikonet er der – men ingenting skjer når du trykker. Kjenner du igjen dette? 😉",
      "Sett inn nårManTrykkerPå(\"" + IKONNAVN + "\", ...) nederst."
    ],
    hendelseInni: [
      "Hendelsen for ikonet havnet inni noe annet. Den må stå helt ytterst i koden.",
      "Slett den med ✕, trykk på en }); helt nederst, og sett den inn der."
    ],
    ingenApning: [
      "Nå lytter maskinen på ikonet – men ingenting åpnes.",
      "Sett inn åpneTegneboka(); inni nårManTrykkerPå(\"" + IKONNAVN + "\", ...)."
    ]
  };

  var oppgaveIkon = {
    id: "tegneboka-ikon",
    installasjonsId: "skrivebord",
    flate: "skjerm",
    tittel: "Et ikon til Tegneboka",

    instruks:
      "Tegneprogrammet ligger klart på maskinen – men det finnes ingen måte å åpne det på. " +
      "Lag et nytt ikon som heter <b>" + IKONNAVN + "</b>, og få det til å åpne programmet " +
      "med <b>åpneTegneboka()</b>. Du har gjort dette før!",

    valgtVedStart: "siste",

    startProgram: function () { return Fremdrift.hentInstallert("skrivebord") || []; },

    palett: [
      fyllFarge("rosa"), fyllFarge("grønn"), fyllFarge("hvit"),
      LAG_TEGNEIKON, TRYKK_TEGNING, AAPNE_TEGNEBOKA
    ],

    hint: [
      "Samme mønster som Kode-ikonet: lagIkon, nårManTrykkerPå med samme navn, og noe som åpnes inni.",
      "Vil du at ikonet skal ha en annen farge enn Kode-ikonet? Sett en fyllFarge rett før lagIkon.",
      "Står de to ikonene oppå hverandre? Trykk på det første tallet i lagIkon for å flytte det."
    ],

    bekreftIVerden: {
      instruks: "Trykk på " + IKONNAVN + "-ikonet! 🎨",
      forbered: function () { Tegneboka.lukk(); },
      sjekk: function () { return Tegneboka.erApen(); },
      pause: 800
    },

    sjekk: function (program) {
      var svar = vurderIkon(program);
      if (svar.feil) return { ok: false, melding: BESKJED_IKON[svar.feil] };
      return {
        ok: true,
        ros: [
          "Tegneboka er på plass! 🎨",
          "Legg merke til at du gjorde nøyaktig det samme som med Kode-ikonet: et ikon, en hendelse, og noe som åpnes.",
          "Det mønsteret kan du nå. Nesten hvert eneste program på en datamaskin åpnes sånn."
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE B - tegningen i rommet
     ====================================================================== */

  var oppgaveIRommet = {
    id: "tegneboka-rommet",
    installasjonsId: "pynt",
    flate: "rom",
    tittel: "Tegningen i rommet",

    instruks:
      "Dette er et helt nytt program: <b>Pynten</b>. Her skal tegningene dine inn i rommet. " +
      "<b>tegnBilde</b> trenger fire ting: navnet på tegningen, hvor den skal stå " +
      "(x og y), og hvor stor den skal være.",

    seTid: 1400,

    startProgram: function () { return Fremdrift.hentInstallert("pynt") || []; },

    palett: function () { return [tegnBildeBit()]; },

    hint: [
      "Trykk på tegnBilde nederst. Da står den i koden.",
      "De gule verdiene flytter bildet og endrer størrelsen. y er der bildet står – 600 er på gulvet."
    ],

    sjekk: function (program) {
      var ytterst = program.filter(function (l) { return l.type === "tegnBilde"; });
      var noenSted = Kode.alleLinjer(program).filter(function (l) { return l.type === "tegnBilde"; });

      if (ytterst.length === 0) {
        if (noenSted.length > 0) {
          return { ok: false, melding: [
            "tegnBilde havnet inni noe annet. Den må stå helt ytterst i koden."
          ] };
        }
        return { ok: false, melding: [
          "Rommet er like tomt som før. 🙂",
          "Sett inn tegnBilde fra paletten nederst."
        ] };
      }

      var finnes = ytterst.some(function (l) { return !!Fremdrift.hentTegning(l.args.navn.v); });
      if (!finnes) {
        return { ok: false, melding: [
          "Jeg finner ingen tegning med det navnet.",
          "Trykk på navnet i koden og velg en tegning du har lagret."
        ] };
      }

      return {
        ok: true,
        ros: [
          "Der står den! 🌼",
          "tegnBilde leser de 256 tallene, og tegner én liten firkant for hvert tall som ikke er 0.",
          "Og nå kommer det beste. Tegningen i rommet og tegningen i Tegneboka er ikke to forskjellige ting. Det er de samme tallene."
        ]
      };
    }
  };


  /* ======================================================================
     KAPITTELET
     ====================================================================== */

  Kapitler.leggTil({

    id: "tegneboka",
    tittel: "Tegneboka",

    steg: [

      {
        type: "dialog",
        linjer: [
          "Figuren din er laget av streker og former som koden tegner.",
          "Men i mange ekte spill er grafikken tegnet – rute for rute.",
          "Nå får du et tegneprogram på maskinen din. 🎨",
          "Men ikonet som åpner det, må du lage selv."
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveIkon },

      {
        type: "dialog",
        linjer: [
          "Dette er Tegneboka. Rutenettet er 16 ruter bredt og 16 ruter høyt.",
          "Velg en farge og mal med fingeren. Den rutete fargen er viskelæret.",
          "Tegn noe du vil ha i rommet ditt – en blomst, en sol, et hjerte … Gi det et navn, og trykk Lagre."
        ]
      },

      /* Han tegner og lagrer - noe som faktisk er en tegning. */
      (function () {
        var foer = null;
        var steg = ventITegneboka(
          "Velg en farge og mal. Gi tegningen et navn, og trykk 💾 Lagre.",
          "Åpne Tegneboka med ikonet ditt, og tegn noe. 🎨",
          function () {
            if (foer === null) foer = tegningerSomTekst();
            if (tegningerSomTekst() === foer) return false;
            foer = tegningerSomTekst();
            var bra = Fremdrift.tegningsnavn().some(function (n) {
              return Tegneboka.antallMalt(Fremdrift.hentTegning(n)) >= 12;
            });
            if (!bra) Tegneboka.settHint("Det var ikke mye! Tegn litt mer, og trykk Lagre igjen. 🙂");
            return bra;
          }
        );
        return steg;
      })(),

      {
        type: "dialog",
        linjer: [
          "Så fin! 🎨",
          "Nå skal jeg vise deg en hemmelighet om tegningen din."
        ]
      },

      ventITegneboka(
        "Trykk på «🔢 Tall» oppe til høyre.",
        "Åpne Tegneboka igjen med ikonet ditt. 🎨",
        function () { return Tegneboka.erApen() && Tegneboka.erTallModus() ? "straks" : false; }
      ),

      {
        type: "dialog",
        linjer: [
          "Se! Tegningen din er egentlig ikke farger. Den er tall. 🔢",
          "Hver rute har ett tall. 0 betyr tom. 3 betyr rød, 5 betyr gul – se på fargeknappene, tallet står på dem.",
          "16 rader med 16 tall hver. 256 tall til sammen. Det er alt en tegning er for en datamaskin.",
          "Og når spillet skal tegne bildet ditt, leser det nøyaktig de samme tallene – rute for rute.",
          "Lukk Tegneboka, og åpne Kodeverkstedet. Nå skal tegningen din ut i rommet."
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveIRommet },

      /* Koblingen: han endrer tegningen, og ser den endre seg i rommet. */
      {
        type: "egen",
        start: function (neste) {
          var aktiv = true;
          var linje = Kode.forste(Fremdrift.hentInstallert("pynt") || [], "tegnBilde");
          var navn = linje ? linje.args.navn.v : null;
          var foer = JSON.stringify(Fremdrift.hentTegning(navn));
          var endret = false;
          var visteBanner = null;

          Fremdrift.settTilstand("sisteTegning", navn);
          Tegneboka.settHint("Endre «" + navn + "» litt, trykk Lagre – og gå tilbake til rommet. (Står det en annen tegning her, trykker du på «" + navn + "» nederst.)");
          Verden.blink("datamaskin", 900);

          (function vent() {
            if (!aktiv) return;
            if (!endret && JSON.stringify(Fremdrift.hentTegning(navn)) !== foer) {
              endret = true;
              Tegneboka.settHint("💾 Lagret! Lukk Tegneboka, og gå tilbake til rommet for å se.");
            }
            if (endret && !Tegneboka.erApen() && Skjerm.erLukket()) {
              Banner.skjul();
              setTimeout(function () { if (aktiv) neste(); }, 1500);
              return;
            }

            var tekst = Tegneboka.erApen() ? null
              : endret ? "Gå tilbake til rommet og se på tegningen din. 👀"
              : "Gå til Tegneboka, endre «" + navn + "» litt, og lagre. 🔁";
            if (tekst !== visteBanner) {
              if (tekst) Banner.vis(tekst, {}); else Banner.skjul();
              visteBanner = tekst;
            }
            requestAnimationFrame(vent);
          })();

          return function () { aktiv = false; };
        }
      },

      {
        type: "dialog",
        linjer: [
          "Den endret seg i rommet også! 🔁",
          "Du rørte ikke koden. Du endret bare tallene i tegningen – og koden leser tallene.",
          "Det er koblingen mellom det du tegner og det du koder: de er laget av det samme stoffet.",
          "Neste gang skal vi bruke det til animasjon. 🚶"
        ]
      }

    ]

  });

  /* Det han har lært her, får han bruke fritt i Kodeverkstedet. */
  Verksted.leggTilBiter("skrivebord", [LAG_TEGNEIKON, TRYKK_TEGNING, AAPNE_TEGNEBOKA]);
  Verksted.navngi("pynt", "Pynten", "🌼", "Tegningene dine i rommet");
  Verksted.leggTilBiter("pynt", [tegnBildeBit]);

})();

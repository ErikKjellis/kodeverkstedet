/* ==========================================================================
   Kapittel 6 - Lagring

   Han leker med figuren. Så starter spillet på nytt - og alt er glemt.
   Variabler lever bare så lenge programmet kjører.

   To oppgaver:
     A) Lagre-knappen. Han lagrer høyde, hårfarge og plass når han trykker.
        Spillet starter på nytt igjen ... og alt er FORTSATT glemt.
     B) Hent det tilbake. Det lagrede ligger trygt - men ingen har sagt at
        spillet skal hente det når det starter. Et spill som husker, må
        både lagre og hente.

   Nye begreper: at programmer glemmer, å lagre, å hente, standardverdi.
   ========================================================================== */

(function () {

  /* Tingene menyen kan endre, og som derfor er verdt å huske. */
  var HUSKES = ["hoyde", "harfarge", "figurX"];


  /* ======================================================================
     Hjelpere
     ====================================================================== */

  function les(navn) {
    return Kjorer.verdi({ eier: "figur", variabler: {} }, { k: "var", v: navn });
  }

  /* Det koden sier at variabelen starter som: var hoyde = "vanlig"; */
  function startverdi(navn) {
    var v = Kode.finnVariabel(Fremdrift.hentInstallert("figur") || [], navn);
    return v ? v.args.verdi.v : undefined;
  }

  /* Er noe av det som huskes, forskjellig fra det koden starter med? */
  function figurenErEndret(hent) {
    return HUSKES.some(function (navn) {
      var verdi = hent(navn);
      return verdi !== undefined && String(verdi) !== String(startverdi(navn));
    });
  }

  /*
    Later som spillet slås av og på: skjermen blir svart et øyeblikk, og alle
    programmene hans starter på nytt fra toppen - akkurat som når nettbrettet
    har vært av.
  */
  function startSpilletPaNytt() {
    Effekter.blits();
    setTimeout(function () {
      Fremdrift.alleInstallerte().forEach(function (p) {
        Kjorer.installer(p.id, p.program, p.flate);
      });
    }, 250);
  }

  /* Et egen-steg som starter spillet på nytt med en liten forvarsel. */
  function omstartSteg(forvarsel) {
    return {
      type: "egen",
      start: function (neste) {
        var aktiv = true;
        Banner.vis(forvarsel, { viktig: true });
        setTimeout(function () {
          if (!aktiv) return;
          Banner.skjul();
          startSpilletPaNytt();
          setTimeout(function () { if (aktiv) neste(); }, 1100);
        }, 2600);
        return function () { aktiv = false; };
      }
    };
  }


  /* ======================================================================
     Kodebitene
     ====================================================================== */

  var LAG_LAGREKNAPP = { type: "lagKnapp", args: { navn: { k: "tekst", v: "Lagre" } } };

  var TRYKK_LAGRE = {
    type: "naarManTrykkerPa",
    args: { mal: { k: "tekst", v: "Lagre" } },
    barn: []
  };

  function lagreBit(navn) {
    return {
      type: "lagre",
      args: { navn: { k: "tekst", v: navn }, verdi: { k: "var", v: navn } }
    };
  }

  function hentBit(navn) {
    return {
      type: "tilordning",
      args: {
        navn: navn,
        verdi: { k: "hent", navn: { k: "tekst", v: navn }, standard: { k: "var", v: navn } }
      }
    };
  }


  /* ======================================================================
     OPPGAVE A - lagre-knappen
     ====================================================================== */

  function erLagring(s) { return s.type === "lagre"; }

  function lagredeNavn(steg) {
    return steg.filter(erLagring)
      .filter(function (s) { return s.args.verdi.k === "var" && s.args.verdi.v === s.args.navn.v; })
      .map(function (s) { return s.args.navn.v; });
  }

  function listeTekst(navn) {
    if (navn.length === 1) return navn[0];
    return navn.slice(0, -1).join(", ") + " og " + navn[navn.length - 1];
  }

  var oppgaveLagre = {
    id: "lagring-lagre",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Lag en Lagre-knapp",

    instruks:
      "Lag en knapp som heter <b>Lagre</b>. Når man trykker på den, skal spillet lagre " +
      "tre ting: <b>hoyde</b>, <b>harfarge</b> og <b>figurX</b> – hvordan figuren ser ut, " +
      "og hvor den står.",

    valgtVedStart: "siste",

    startProgram: function () {
      return Fremdrift.hentInstallert("figur") || [];
    },

    palett: [
      LAG_LAGREKNAPP,
      TRYKK_LAGRE,
      lagreBit("hoyde"),
      lagreBit("harfarge"),
      lagreBit("figurX")
    ],

    hint: [
      "Samme mønster som alle de andre knappene: lagKnapp og nårManTrykkerPå.",
      "Inni knappen: én lagre-linje for hver ting som skal huskes.",
      "Når koden kjører, starter figuren på nytt. Endre den med menyen FØR du trykker Lagre – ellers lagrer du bare det vanlige."
    ],

    bekreftIVerden: {
      instruks: "Gjør figuren annerledes med menyen – og trykk så «Lagre»! 💾",
      forbered: Knapper.nullstillTrykk,
      sjekk: function () {
        return Knapper.antallTrykk("Lagre") > 0 && figurenErEndret(Fremdrift.hentVerdi);
      },
      pause: 1400
    },

    sjekk: function (program) {
      if (Kode.knappenavn(program).indexOf("Lagre") === -1) {
        return { ok: false, melding: [
          "Vi begynner med selve knappen.",
          "Sett inn lagKnapp(\"Lagre\"); nederst i koden."
        ] };
      }

      var hendelse = Kode.hendelse(program, "naarManTrykkerPa", "Lagre");
      if (!hendelse) {
        if (Kode.hendelseHvorSomHelst(program, "naarManTrykkerPa", "Lagre")) {
          return { ok: false, melding: [
            "Hendelsen for Lagre havnet inni noe annet. Den må stå helt ytterst i koden.",
            "Slett den med ✕, trykk på en }); helt nederst, og sett den inn der."
          ] };
        }
        return { ok: false, melding: [
          "Knappen er der, men den gjør ingenting ennå. 😉",
          "Sett inn nårManTrykkerPå(\"Lagre\", ...) nederst."
        ] };
      }

      var lagres = lagredeNavn(Kode.utvid(program, hendelse.barn, []));

      if (lagres.length === 0) {
        /* Står lagre-linjene et annet sted enn i knappen? */
        var utenfor = Kode.alleLinjer(program).some(erLagring);
        if (utenfor) {
          return { ok: false, melding: [
            "lagre-linjene står ikke inni Lagre-knappen.",
            "Da lagres det bare når den koden kjører – ikke når du trykker Lagre.",
            "Slett dem med ✕, og sett dem inn i nårManTrykkerPå(\"Lagre\", ...)."
          ] };
        }
        return { ok: false, melding: [
          "Knappen lytter – men det er tomt inni, så ingenting blir lagret.",
          "Sett inn lagre(\"hoyde\", hoyde); inni knappen."
        ] };
      }

      var mangler = HUSKES.filter(function (n) { return lagres.indexOf(n) === -1; });
      if (mangler.length > 0) {
        return { ok: false, melding: [
          "Knappen lagrer " + listeTekst(lagres) + " – men ikke " + listeTekst(mangler) + ".",
          mangler.indexOf("figurX") !== -1
            ? "Skal spillet huske hvor figuren står, må figurX også lagres."
            : "Skal spillet huske hvordan figuren ser ut, må alt det menyen kan endre lagres.",
          "Sett inn " + mangler.map(function (n) { return "lagre(\"" + n + "\", " + n + ");"; }).join(" og ") + " i knappen."
        ] };
      }

      return {
        ok: true,
        ros: [
          "💾 Lagret!",
          "Legg merke til at lagre har to ting i parentesen: lagre(\"hoyde\", hoyde).",
          "Den første er navnet på lappen – i anførselstegn, fordi det bare er et navn. Den andre er variabelen: det som skal skrives på lappen.",
          "Nå ligger lappene trygt i nettleseren, selv om spillet slås av."
        ]
      };
    }
  };


  /* ======================================================================
     OPPGAVE B - hent det tilbake
     ====================================================================== */

  function erHenting(s, navn) {
    return s.type === "tilordning" && s.args.navn === navn &&
           s.args.verdi.k === "hent" && s.args.verdi.navn.v === navn;
  }

  var oppgaveHent = {
    id: "lagring-hent",
    installasjonsId: "figur",
    flate: "rom",
    tittel: "Hent det tilbake",

    instruks:
      "Det du lagret, ligger trygt. Nå skal spillet <b>hente</b> det når det starter. " +
      "<b>hentLagret(\"hoyde\", hoyde)</b> betyr: hent lappen som heter hoyde – " +
      "og finnes den ikke, bruk det som står i hoyde fra før.",

    valgtVedStart: "siste",

    /* Han skal få se figuren komme tilbake slik han lagret den, før Bit sier noe. */
    seTid: 1600,

    startProgram: function () {
      return Fremdrift.hentInstallert("figur") || [];
    },

    palett: [hentBit("hoyde"), hentBit("harfarge"), hentBit("figurX")],

    hint: [
      "Hentingen skal skje når spillet starter – altså helt ytterst i koden, ikke inni en knapp.",
      "Én linje for hver ting du lagret: hoyde, harfarge og figurX.",
      "Når du trykker Kjør, starter spillet på nytt. Da ser du med en gang om det virker."
    ],

    sjekk: function (program) {
      var lokke = Kode.hendelse(program, "hvertBilde");
      var iLokka = lokke ? Kode.utvid(program, lokke.barn, []) : [];

      /* Første ting som ikke er i orden, én om gangen. */
      for (var i = 0; i < HUSKES.length; i++) {
        var navn = HUSKES[i];
        var ytterst = program.some(function (l) { return erHenting(l, navn); });
        if (ytterst) continue;

        if (iLokka.some(function (s) { return erHenting(s, navn); })) {
          return { ok: false, melding: [
            "hentLagret(\"" + navn + "\", ...) står i spilløkka.",
            "Da hentes den gamle lappen seksti ganger i sekundet – og menyen din slutter å virke, fordi alt blir satt tilbake med en gang.",
            "Det skal bare hentes én gang, når spillet starter: helt ytterst i koden."
          ] };
        }

        if (Kode.alleLinjer(program).some(function (s) { return erHenting(s, navn); })) {
          return { ok: false, melding: [
            "hentLagret(\"" + navn + "\", ...) står inni noe annet – da hentes den bare når den koden kjører.",
            "Den skal hentes når spillet starter. Slett den med ✕, trykk på en }); helt nederst, og sett den inn der."
          ] };
        }

        return { ok: false, melding: [
          i === 0
            ? "Spillet startet på nytt – og glemte alt igjen. Ingen har sagt at det skal hente det du lagret."
            : "Nesten! Men " + navn + " blir fortsatt ikke hentet.",
          "Sett inn " + navn + " = hentLagret(\"" + navn + "\", " + navn + "); helt nederst i koden."
        ] };
      }

      return {
        ok: true,
        ros: [
          "DEN HUSKET! 🎉",
          "Når spillet starter, kjører koden fra toppen – og nå henter den lappene du lagret.",
          "Legg merke til den andre tingen i parentesen: hentLagret(\"hoyde\", hoyde). Finnes det ingen lapp, brukes det som står i hoyde fra før. Det kalles en standardverdi.",
          "Sånn virker Lagre og Fortsett i alle spill du har spilt."
        ]
      };
    }
  };


  /* ======================================================================
     KAPITTELET
     ====================================================================== */

  Kapitler.leggTil({

    id: "lagring",
    tittel: "Lagring",

    steg: [

      {
        type: "dialog",
        linjer: [
          "Figuren din kan gå, og du kan endre den med menyen.",
          "Prøv litt: gjør den annerledes, og gå et stykke med den. 🎛️"
        ]
      },

      /* Han leker til figuren faktisk er endret. */
      {
        type: "egen",
        start: function (neste) {
          var aktiv = true;
          Banner.vis("Endre figuren med menyen, og gå litt med den.", {});
          Knapper.nullstillTrykk();

          (function vent() {
            if (!aktiv) return;
            if (Knapper.ulikeTrykket() >= 2 && figurenErEndret(les)) {
              /* La ham kose seg litt før det skjer. */
              setTimeout(function () { if (aktiv) neste(); }, 2500);
              return;
            }
            requestAnimationFrame(vent);
          })();

          return function () { aktiv = false; };
        }
      },

      omstartSteg("Nå later vi som du slår av nettbrettet og slår det på igjen … 📴"),

      {
        type: "dialog",
        linjer: [
          "Alt ble glemt! 😱",
          "Jeg startet spillet på nytt – akkurat som når du lukker nettbrettet og åpner det igjen.",
          "Når et program starter, kjører det koden fra toppen: var hoyde = \"vanlig\"; … Alt du hadde gjort, er borte.",
          "Variabler lever bare så lenge programmet kjører. Vil du at spillet skal huske noe, må du LAGRE det."
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveLagre },

      omstartSteg("Da starter vi spillet på nytt igjen … 📴"),

      {
        type: "dialog",
        linjer: [
          "Hmm. Alt ble glemt igjen? 🤔",
          "Nei – det du lagret, ligger trygt. Men ingen har sagt at spillet skal HENTE det når det starter.",
          "Et spill som husker, må gjøre to ting: lagre når du ber om det, og hente når det starter."
        ]
      },

      { type: "kode", viaMaskinen: true, oppgave: oppgaveHent },

      {
        type: "dialog",
        linjer: [
          "Nå husker spillet ditt. 💾",
          "Trykk Lagre når du vil beholde det du har gjort. Neste gang du åpner spillet, er alt der.",
          "Prøv gjerne på ordentlig: lukk nettleseren helt, og åpne spillet igjen.",
          "Men figuren går fortsatt rett gjennom veggen … Det tar vi neste gang. 🧱"
        ]
      }

    ]

  });

  /* Det han har lært her, får han bruke fritt i Kodeverkstedet. */
  Verksted.leggTilBiter("figur", [
    LAG_LAGREKNAPP, TRYKK_LAGRE,
    lagreBit("hoyde"), lagreBit("harfarge"), lagreBit("figurX"),
    hentBit("hoyde"), hentBit("harfarge"), hentBit("figurX")
  ]);

})();

/* ==========================================================================
   Api
   Her står alle kodebitene eleven kan bruke.

   Hver kodebit har to sider:
     html(...)  - hvordan koden SER UT i programmeringsvinduet
     kjor(...)  - hva som FAKTISK SKJER når koden kjøres

   Vil du lage en ny kodebit til et senere kapittel, kopierer du én av disse
   og bytter ut innmaten.

   Noen verdier i koden kan trykkes på og byttes ut. Gi verdien en "valg"-liste,
   så blir den til en knapp eleven kan bla gjennom:
       farge: { k: "tekst", v: "blå", valg: ["blå", "grønn", "lilla"] }
   ========================================================================== */

var Api = (function () {

  var typer = {};

  function definer(definisjon) {
    typer[definisjon.type] = definisjon;
  }

  function hent(type) {
    return typer[type];
  }

  /* ---------- Små hjelpere som farger koden ---------- */

  function nokkel(t) { return '<span class="k-nokkel">' + t + "</span>"; }
  function funk(t)   { return '<span class="k-funk">' + t + "</span>"; }
  function tekst(t)  { return '<span class="k-tekst">' + t + "</span>"; }
  function tall(t)   { return '<span class="k-tall">' + t + "</span>"; }
  function vari(t)   { return '<span class="k-var">' + t + "</span>"; }
  function tegn(t)   { return '<span class="k-tegn">' + t + "</span>"; }

  /*
    En "verdi" er enten et tall, en tekst eller navnet på en variabel:
       { k: "tall",  v: 20 }
       { k: "tekst", v: "hvit" }
       { k: "var",   v: "x" }

    sti      - hvor verdien ligger i linje.args, f.eks. "farge" eller "argumenter.0"
    medValg  - false når vi tegner paletten (en knapp kan ikke stå inni en knapp)
  */
  function verdiHtml(v, sti, medValg) {
    if (!v) return tegn("?");

    var innhold;
    if (v.k === "tall") innhold = tall(String(v.v));
    else if (v.k === "tekst") innhold = tekst('"' + v.v + '"');
    else innhold = vari(v.v);

    if (medValg !== false && sti && v.valg && v.valg.length > 1) {
      return '<button type="button" class="kodeverdi" data-sti="' + sti + '">' +
             innhold + "</button>";
    }
    return innhold;
  }

  function listeHtml(verdier, sti, medValg) {
    var deler = [];
    for (var i = 0; i < verdier.length; i++) {
      deler.push(verdiHtml(verdier[i], sti + "." + i, medValg));
    }
    return deler.join(tegn(", "));
  }

  function parameterHtml(parametre) {
    var deler = [];
    for (var i = 0; i < parametre.length; i++) deler.push(vari(parametre[i]));
    return deler.join(tegn(", "));
  }

  function storForbokstav(ord) {
    return ord.charAt(0).toUpperCase() + ord.slice(1);
  }


  /* ======================================================================
     KODEBITENE
     ====================================================================== */

  /* ---- function tegnMusepeker(x, y) { ... } ------------------------------
     Å lage en egen funksjon: å gi et navn til noe man vil gjøre flere ganger. */
  definer({
    type: "funksjonDefinisjon",
    erBlokk: true,
    htmlStart: function (linje) {
      return nokkel("function") + " " + funk(linje.args.navn) +
             tegn("(") + parameterHtml(linje.args.parametre) + tegn(") {");
    },
    htmlSlutt: function () { return tegn("}"); },
    kjor: function () {
      /* Selve definisjonen gjør ingenting når den leses.
         Kjoreren har allerede notert seg funksjonen på forhånd. */
    }
  });

  /* ---- tegnMusepeker(x, y); ---------------------------------------------
     Å kalle sin egen funksjon: "gjør det der, nå." */
  definer({
    type: "kallEgenFunksjon",
    erBlokk: false,
    html: function (linje, medValg) {
      return funk(linje.args.navn) + tegn("(") +
             listeHtml(linje.args.argumenter || [], "argumenter", medValg) + tegn(");");
    },
    kjor: function (miljo, linje) {
      Kjorer.kallFunksjon(miljo, linje.args.navn, linje.args.argumenter || [], linje);
    }
  });

  /* ---- var bakgrunn = "blå"; --------------------------------------------
     En variabel: en eske med navn på, som du kan putte noe i.
     Lager du den øverst i programmet, kan alle bruke den. */
  definer({
    type: "variabel",
    erBlokk: false,
    html: function (linje, medValg) {
      return nokkel("var") + " " + vari(linje.args.navn) + tegn(" = ") +
             verdiHtml(linje.args.verdi, "verdi", medValg) + tegn(";");
    },
    kjor: function (miljo, linje) {
      Kjorer.settVariabel(miljo, linje.args.navn, Kjorer.verdi(miljo, linje.args.verdi));
    }
  });

  /* ---- fyllFarge("hvit"); ----------------------------------------------
     Setter fargen som brukes på alt som tegnes ETTER denne linja. */
  definer({
    type: "fyllFarge",
    erBlokk: false,
    html: function (linje, medValg) {
      return funk("fyllFarge") + tegn("(") +
             verdiHtml(linje.args.farge, "farge", medValg) + tegn(");");
    },
    kjor: function (miljo, linje) {
      miljo.farge = Kjorer.verdi(miljo, linje.args.farge);
    }
  });

  /* ---- tegnTrekant(x, y, 20); / tegnSirkel(...) / tegnFirkant(...) ------
     Tegner en form der du sier den skal være. */
  definer({
    type: "tegnForm",
    erBlokk: false,
    html: function (linje, medValg) {
      var a = linje.args;
      return funk("tegn" + storForbokstav(a.form)) + tegn("(") +
             verdiHtml(a.x, "x", medValg) + tegn(", ") +
             verdiHtml(a.y, "y", medValg) + tegn(", ") +
             verdiHtml(a.storrelse, "storrelse", medValg) + tegn(");");
    },
    kjor: function (miljo, linje) {
      var a = linje.args;
      Verden.tegnI(miljo.lag, {
        form: a.form,
        x: Kjorer.verdi(miljo, a.x),
        y: Kjorer.verdi(miljo, a.y),
        storrelse: Kjorer.verdi(miljo, a.storrelse),
        farge: miljo.farge
      });
    }
  });

  /* ---- fyllHeleSkjermen(); ----------------------------------------------
     Maler hele flaten i fargen som gjelder nå. */
  definer({
    type: "fyllHeleSkjermen",
    erBlokk: false,
    html: function () {
      return funk("fyllHeleSkjermen") + tegn("();");
    },
    kjor: function (miljo) {
      Verden.tegnI(miljo.lag, { form: "heleFlaten", farge: miljo.farge });
    }
  });

  /* ---- lagIkon(200, 200, "Kode"); --------------------------------------
     Tegner et programikon på skjermen OG gjør det mulig å trykke på det. */
  definer({
    type: "lagIkon",
    erBlokk: false,
    html: function (linje, medValg) {
      var a = linje.args;
      return funk("lagIkon") + tegn("(") +
             verdiHtml(a.x, "x", medValg) + tegn(", ") +
             verdiHtml(a.y, "y", medValg) + tegn(", ") +
             verdiHtml(a.navn, "navn", medValg) + tegn(");");
    },
    kjor: function (miljo, linje) {
      var a = linje.args;
      var x = Kjorer.verdi(miljo, a.x);
      var y = Kjorer.verdi(miljo, a.y);
      var navn = Kjorer.verdi(miljo, a.navn);
      var storrelse = a.storrelse ? Kjorer.verdi(miljo, a.storrelse) : 120;

      Verden.tegnI(miljo.lag, {
        form: "ikon",
        x: x, y: y,
        storrelse: storrelse,
        farge: miljo.farge,
        tekst: navn
      });
      Skjerm.leggTilIkon(miljo.eier, navn, x, y, storrelse);
    }
  });

  /* ---- åpneProgram(); ---------------------------------------------------
     Åpner kodeverktøyet inne på maskinen. */
  definer({
    type: "aapneProgram",
    erBlokk: false,
    html: function () {
      return funk("åpneProgram") + tegn("();");
    },
    kjor: function () {
      Skjerm.apneProgram();
    }
  });

  /* ---- nårFingerenFlytterSeg(function (x, y) { ... }); ------------------
     En HENDELSE: koden inni kjøres på nytt hver gang fingeren beveger seg.
     x og y er der fingeren er akkurat nå. */
  definer({
    type: "naarFingerenFlytterSeg",
    erBlokk: true,
    htmlStart: function (linje) {
      return funk("nårFingerenFlytterSeg") + tegn("(") + nokkel("function") + " " +
             tegn("(") + parameterHtml(linje.args.parametre) + tegn(") {");
    },
    htmlSlutt: function () { return tegn("});"); },
    kjor: function (miljo, linje) {
      Kjorer.registrerHendelse({
        type: "fingerFlytter",
        eier: miljo.eier,
        parametre: linje.args.parametre,
        kropp: linje.barn || []
      });
    }
  });

  /* ---- nårManTrykkerPå("Kode", function () { ... }); --------------------
     En hendelse som venter på at man trykker på én bestemt ting. */
  definer({
    type: "naarManTrykkerPa",
    erBlokk: true,
    htmlStart: function (linje, medValg) {
      return funk("nårManTrykkerPå") + tegn("(") +
             verdiHtml(linje.args.mal, "mal", medValg) +
             tegn(", ") + nokkel("function") + " " + tegn("() {");
    },
    htmlSlutt: function () { return tegn("});"); },
    kjor: function (miljo, linje) {
      Kjorer.registrerHendelse({
        type: "trykk",
        eier: miljo.eier,
        mal: Kjorer.verdi(miljo, linje.args.mal),
        parametre: [],
        kropp: linje.barn || []
      });
    }
  });

  return {
    definer: definer,
    hent: hent,
    verdiHtml: verdiHtml
  };

})();

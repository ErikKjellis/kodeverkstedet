/* ==========================================================================
   Api
   Her står alle kodebitene eleven kan bruke.

   Hver kodebit har to sider:
     html(...)  - hvordan koden SER UT i programmeringsvinduet
     kjor(...)  - hva som FAKTISK SKJER når koden kjøres

   Vil du lage en ny kodebit til et senere kapittel, kopierer du én av disse
   og bytter ut innmaten.
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

  /* En "verdi" er enten et tall, en tekst eller navnet på en variabel:
       { k: "tall",  v: 20 }
       { k: "tekst", v: "hvit" }
       { k: "var",   v: "x" }                                            */
  function verdiHtml(v) {
    if (!v) return tegn("?");
    if (v.k === "tall") return tall(String(v.v));
    if (v.k === "tekst") return tekst('"' + v.v + '"');
    return vari(v.v);
  }

  function listeHtml(verdier) {
    var deler = [];
    for (var i = 0; i < verdier.length; i++) deler.push(verdiHtml(verdier[i]));
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
    html: function (linje) {
      return funk(linje.args.navn) + tegn("(") +
             listeHtml(linje.args.argumenter || []) + tegn(");");
    },
    kjor: function (miljo, linje) {
      Kjorer.kallFunksjon(miljo, linje.args.navn, linje.args.argumenter || [], linje);
    }
  });

  /* ---- fyllFarge("hvit"); ----------------------------------------------
     Setter fargen som brukes på alt som tegnes ETTER denne linja. */
  definer({
    type: "fyllFarge",
    erBlokk: false,
    html: function (linje) {
      return funk("fyllFarge") + tegn("(") + verdiHtml(linje.args.farge) + tegn(");");
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
    html: function (linje) {
      var a = linje.args;
      return funk("tegn" + storForbokstav(a.form)) + tegn("(") +
             verdiHtml(a.x) + tegn(", ") + verdiHtml(a.y) + tegn(", ") +
             verdiHtml(a.storrelse) + tegn(");");
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

  /* ---- nårManTrykkerPa("datamaskinen") { ... } --------------------------
     Brukes fra og med kapittel 2. Ligger her allerede så du ser mønsteret. */
  definer({
    type: "naarManTrykkerPa",
    erBlokk: true,
    htmlStart: function (linje) {
      return funk("nårManTrykkerPå") + tegn("(") + verdiHtml(linje.args.mal) +
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

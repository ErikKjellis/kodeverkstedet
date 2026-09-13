/* ==========================================================================
   Knapper
   Menyen i rommet.

   En knapp er ikke en tegning - den er en TING. Tegninger er maling: viskUt()
   fjerner dem. Knapper blir stående til programmet som lagde dem byttes ut.
   Det er sånn menyer virker i ekte spill også: de ligger oppå spillverdenen,
   og forsvinner ikke selv om man tegner verden på nytt.

   Knappene ordner seg selv i en kolonne oppe til venstre, i den rekkefølgen
   koden lager dem. Da slipper han å regne ut plasseringer.

   Hver knapp blinker når man trykker på den - også når koden bak ikke gjør
   noe. Det er viktig: han skal kunne se at TRYKKET virket, og at det er
   koden som mangler noe.
   ========================================================================== */

var Knapper = (function () {

  var X = 30;
  var TOPP = 30;
  var BREDDE = 180;
  var HOYDE = 58;
  var AVSTAND = 70;
  var TITTELPLASS = 36;

  var knapper = [];   /* { eier, navn } i den rekkefølgen de ble laget */
  var trykk = {};     /* navn -> hvor mange ganger trykket */
  var blink = {};     /* navn -> hvor mange bilder den skal lyse */

  function leggTil(eier, navn) {
    for (var i = 0; i < knapper.length; i++) {
      if (knapper[i].eier === eier && knapper[i].navn === navn) return;
    }
    knapper.push({ eier: eier, navn: navn });
  }

  function fjernFor(eier) {
    knapper = knapper.filter(function (k) { return k.eier !== eier; });
  }

  /* Fem knapper i hver kolonne, så menyen ikke vokser helt ned til gulvet. */
  var PER_KOLONNE = 5;
  var KOLONNEBREDDE = BREDDE + 20;

  function omrade(nr) {
    var kolonne = Math.floor(nr / PER_KOLONNE);
    var rad = nr % PER_KOLONNE;
    return {
      x: X + kolonne * KOLONNEBREDDE,
      y: TOPP + TITTELPLASS + rad * AVSTAND,
      bredde: BREDDE,
      hoyde: HOYDE
    };
  }

  function knappPa(x, y) {
    for (var i = 0; i < knapper.length; i++) {
      var o = omrade(i);
      if (x >= o.x && x <= o.x + o.bredde && y >= o.y && y <= o.y + o.hoyde) {
        return knapper[i];
      }
    }
    return null;
  }

  function trykket(navn) {
    trykk[navn] = (trykk[navn] || 0) + 1;
    blink[navn] = 14;
  }

  function tegn() {
    if (knapper.length === 0) return;

    var kolonner = Math.ceil(knapper.length / PER_KOLONNE);
    var rader = Math.min(knapper.length, PER_KOLONNE);
    var panelBredde = (kolonner - 1) * KOLONNEBREDDE + BREDDE + 24;
    var panelHoyde = TITTELPLASS + rader * AVSTAND + 4;
    Tegning.avrundetFirkant(X - 12, TOPP - 8, panelBredde, panelHoyde, 16, "rgba(16, 18, 27, 0.72)");
    Tegning.tekst("MENY", X + 4, TOPP + 20, 18, "#a2abc4");

    for (var i = 0; i < knapper.length; i++) {
      var k = knapper[i];
      var o = omrade(i);
      var lyser = blink[k.navn] > 0;
      if (lyser) blink[k.navn]--;

      Tegning.avrundetFirkant(o.x, o.y, o.bredde, o.hoyde, 12, lyser ? "#4f9dff" : "#262c40");
      Tegning.ramme(o.x, o.y, o.bredde, o.hoyde, "#4f9dff", 3, 12);
      Tegning.tekst(k.navn, o.x + o.bredde / 2, o.y + o.hoyde / 2 + 9, 26, "#eef1f8", "center");
    }
  }

  /* ---------- Til oppgavesjekkene: hva har han faktisk trykket på? ---------- */

  function nullstillTrykk() { trykk = {}; }
  function antallTrykk(navn) { return trykk[navn] || 0; }
  function ulikeTrykket() { return Object.keys(trykk).length; }

  return {
    leggTil: leggTil,
    fjernFor: fjernFor,
    knappPa: knappPa,
    trykket: trykket,
    tegn: tegn,
    nullstillTrykk: nullstillTrykk,
    antallTrykk: antallTrykk,
    ulikeTrykket: ulikeTrykket
  };

})();

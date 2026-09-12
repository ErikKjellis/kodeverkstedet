/* ==========================================================================
   Input
   Leser finger og mus, og regner om til spillkoordinater.

   På et nettbrett finnes det ingen "sveving" - fingeren må røre skjermen.
   Derfor teller både trykk og dra som at pekeren flytter seg.
   ========================================================================== */

var Input = (function () {

  var x = Tegning.BREDDE / 2;
  var y = Tegning.HOYDE / 2;
  var nede = false;

  var trykkLyttere = [];
  var flyttLyttere = [];

  /* Brukes for å sjekke "har han faktisk flyttet fingeren?" */
  var bevegelse = 0;

  function start(element) {
    element.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      settPosisjon(e);
      nede = true;
      if (element.setPointerCapture) {
        try { element.setPointerCapture(e.pointerId); } catch (feil) { /* ikke viktig */ }
      }
      varsle(flyttLyttere);
      varsle(trykkLyttere);
    });

    element.addEventListener("pointermove", function (e) {
      e.preventDefault();
      settPosisjon(e);
      varsle(flyttLyttere);
    });

    element.addEventListener("pointerup", function () { nede = false; });
    element.addEventListener("pointercancel", function () { nede = false; });
    element.addEventListener("pointerleave", function () { nede = false; });

    /* Hindrer at nettbrettet zoomer eller markerer tekst ved lange trykk. */
    element.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    element.addEventListener("touchstart", function (e) { e.preventDefault(); }, { passive: false });
  }

  function settPosisjon(e) {
    var punkt = Tegning.skjermTilSpill(e.clientX, e.clientY);
    bevegelse += Math.abs(punkt.x - x) + Math.abs(punkt.y - y);
    x = punkt.x;
    y = punkt.y;
  }

  function varsle(lyttere) {
    /* Kopierer lista, i tilfelle en lytter fjerner seg selv underveis. */
    var kopi = lyttere.slice();
    for (var i = 0; i < kopi.length; i++) {
      kopi[i](x, y);
    }
  }

  /* Legger til en lytter. Returnerer en funksjon som fjerner den igjen. */
  function naarTrykk(fn) {
    trykkLyttere.push(fn);
    return function () { fjern(trykkLyttere, fn); };
  }

  function naarFlytt(fn) {
    flyttLyttere.push(fn);
    return function () { fjern(flyttLyttere, fn); };
  }

  function fjern(liste, fn) {
    var i = liste.indexOf(fn);
    if (i >= 0) liste.splice(i, 1);
  }

  function nullstillBevegelse() { bevegelse = 0; }
  function bevegelseSiden() { return bevegelse; }

  return {
    start: start,
    naarTrykk: naarTrykk,
    naarFlytt: naarFlytt,
    nullstillBevegelse: nullstillBevegelse,
    bevegelseSiden: bevegelseSiden,
    posisjon: function () { return { x: x, y: y }; },
    erNede: function () { return nede; }
  };

})();

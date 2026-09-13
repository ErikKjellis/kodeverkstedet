/* ==========================================================================
   Effekter
   Små visuelle godbiter: konfetti når noe lykkes, og ringer der man trykker.
   ========================================================================== */

var Effekter = (function () {

  var konfettibiter = [];
  var ringer = [];
  var KONFETTIFARGER = ["#ffd23f", "#3ecb7a", "#4f9dff", "#ff8fc8", "#ff9f43", "#b06ef0"];

  function konfetti(antall) {
    antall = antall || 90;
    for (var i = 0; i < antall; i++) {
      konfettibiter.push({
        x: Tegning.BREDDE / 2 + (Math.random() - 0.5) * 400,
        y: -20 - Math.random() * 240,
        fartX: (Math.random() - 0.5) * 2.6,
        fartY: 2 + Math.random() * 3.4,
        storrelse: 6 + Math.random() * 9,
        vinkel: Math.random() * Math.PI * 2,
        spinn: (Math.random() - 0.5) * 0.25,
        farge: KONFETTIFARGER[Math.floor(Math.random() * KONFETTIFARGER.length)]
      });
    }
  }

  /* Liten ring der spilleren trykket - viser at trykket ble registrert. */
  /* Skjermen blir svart et øyeblikk - som når nettbrettet slås av og på. */
  var blitsIgjen = 0;
  var BLITS_LENGDE = 40;

  function blits() {
    blitsIgjen = BLITS_LENGDE;
  }

  function tegnBlits() {
    if (blitsIgjen <= 0) return;
    blitsIgjen--;
    /* Mørkner raskt, lysner langsomt. */
    var t = blitsIgjen / BLITS_LENGDE;
    var styrke = t > 0.75 ? (1 - t) * 4 : t / 0.75;
    var o = Tegning.synligOmrade();
    var ctx = Tegning.ctx();
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, styrke));
    Tegning.firkant(o.venstre, o.topp, o.bredde, o.hoyde, "#000000");
    ctx.restore();
  }

  function ring(x, y) {
    ringer.push({ x: x, y: y, radius: 6, alder: 0 });
  }

  function oppdaterOgTegn() {
    var ctx = Tegning.ctx();
    var i;

    for (i = konfettibiter.length - 1; i >= 0; i--) {
      var k = konfettibiter[i];
      k.x += k.fartX;
      k.y += k.fartY;
      k.fartY += 0.04;
      k.vinkel += k.spinn;
      if (k.y > Tegning.HOYDE + 40) {
        konfettibiter.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(k.x, k.y);
      ctx.rotate(k.vinkel);
      ctx.fillStyle = k.farge;
      ctx.fillRect(-k.storrelse / 2, -k.storrelse / 4, k.storrelse, k.storrelse / 2);
      ctx.restore();
    }

    for (i = ringer.length - 1; i >= 0; i--) {
      var r = ringer[i];
      r.alder++;
      r.radius += 2.6;
      if (r.alder > 28) {
        ringer.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - r.alder / 28) * 0.7;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    tegnBlits();
  }

  function tom() {
    konfettibiter = [];
    ringer = [];
  }

  return {
    konfetti: konfetti,
    ring: ring,
    blits: blits,
    oppdaterOgTegn: oppdaterOgTegn,
    tom: tom
  };

})();

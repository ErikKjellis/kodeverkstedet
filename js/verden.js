/* ==========================================================================
   Verden
   Rommet, tingene som står i det, og lagene der elevens egen kode tegner.

   "Lag" er som gjennomsiktige plastark oppå rommet. Hvert program eleven
   lager får sine egne lag. Da kan vi viske ut ett program uten å røre resten.
   ========================================================================== */

var Verden = (function () {

  var gjenstander = [];   /* bord, datamaskin, stol, ... */
  var lag = [];           /* { navn, eier, operasjoner: [] } */
  var blinkende = {};      /* id -> hvor mange rammer den skal lyse */

  /* ---------- Gjenstander ---------- */

  function leggTil(gjenstand) {
    gjenstander.push(gjenstand);
    return gjenstand;
  }

  function finn(id) {
    for (var i = 0; i < gjenstander.length; i++) {
      if (gjenstander[i].id === id) return gjenstander[i];
    }
    return null;
  }

  function trykketPa(x, y) {
    /* Går bakfra, slik at det som er tegnet øverst vinner. */
    for (var i = gjenstander.length - 1; i >= 0; i--) {
      var g = gjenstander[i];
      if (!g.omrade) continue;
      var o = g.omrade;
      if (x >= o.x && x <= o.x + o.bredde && y >= o.y && y <= o.y + o.hoyde) return g;
    }
    return null;
  }

  function blink(id, rammer) {
    blinkende[id] = rammer || 90;
  }

  /* ---------- Lag (elevens tegninger) ---------- */

  function sikreLag(navn, eier) {
    var l = finnLag(navn);
    if (!l) {
      l = { navn: navn, eier: eier, operasjoner: [] };
      lag.push(l);
    }
    return l;
  }

  function finnLag(navn) {
    for (var i = 0; i < lag.length; i++) {
      if (lag[i].navn === navn) return lag[i];
    }
    return null;
  }

  function tomLag(navn) {
    var l = finnLag(navn);
    if (l) l.operasjoner = [];
  }

  function fjernLagFor(eier) {
    lag = lag.filter(function (l) { return l.eier !== eier; });
  }

  function tomAlleLag() {
    lag = [];
  }

  function tegnI(navn, operasjon) {
    var l = finnLag(navn);
    if (l) l.operasjoner.push(operasjon);
  }

  /* ---------- Standardrommet ---------- */

  function lagStandardrom() {
    gjenstander = [];

    leggTil({
      id: "bord",
      omrade: { x: 300, y: 428, bredde: 400, hoyde: 26 },
      tegn: tegnBord
    });

    leggTil({
      id: "datamaskin",
      navn: "datamaskinen",
      omrade: { x: 398, y: 272, bredde: 200, hoyde: 165 },
      tegn: tegnDatamaskin,
      pa: false
    });
  }

  var GULVHOYDE = 500;   /* der veggen slutter og gulvet begynner */

  function tegnRom() {
    /* Rommet tegnes helt ut til skjermkanten, uansett skjermformat. */
    var o = Tegning.synligOmrade();
    var venstre = o.venstre;
    var topp = o.topp;
    var bredde = o.bredde;
    var bunn = o.topp + o.hoyde;

    /* Vegg */
    Tegning.firkant(venstre, topp, bredde, GULVHOYDE - topp, "#252a3d");

    /* Litt lys nedover veggen, så den ikke blir helt flat */
    var ctx = Tegning.ctx();
    var grad = ctx.createLinearGradient(0, topp, 0, GULVHOYDE);
    grad.addColorStop(0, "rgba(255,255,255,0.05)");
    grad.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = grad;
    ctx.fillRect(venstre, topp, bredde, GULVHOYDE - topp);

    /* Gulvlist */
    Tegning.firkant(venstre, GULVHOYDE - 14, bredde, 14, "#1b1f2e");

    /* Gulv */
    Tegning.firkant(venstre, GULVHOYDE, bredde, bunn - GULVHOYDE, "#4a3a29");
    for (var x = venstre - 100; x < venstre + bredde + 240; x += 96) {
      Tegning.linje(x, GULVHOYDE, x - 70, bunn, "rgba(0,0,0,0.22)", 3);
    }
    Tegning.firkant(venstre, GULVHOYDE, bredde, 5, "rgba(0,0,0,0.3)");
  }

  function tegnBord() {
    /* Bordplate */
    Tegning.avrundetFirkant(300, 428, 400, 26, 6, "#8a5f3a");
    Tegning.firkant(300, 448, 400, 6, "rgba(0,0,0,0.28)");
    /* Bein */
    Tegning.firkant(322, 454, 20, 150, "#6f4a2c");
    Tegning.firkant(658, 454, 20, 150, "#6f4a2c");
  }

  function tegnDatamaskin() {
    var g = finn("datamaskin");
    var lyser = g && g.pa;

    /* Skjermkasse */
    Tegning.avrundetFirkant(408, 272, 184, 132, 12, "#171a26");
    Tegning.ramme(408, 272, 184, 132, "#39415c", 3, 12);
    /* Selve skjermen */
    Tegning.avrundetFirkant(420, 284, 160, 100, 6, lyser ? "#123a5c" : "#0b0d14");
    if (lyser) {
      Tegning.firkant(432, 300, 84, 7, "#7fd1ff");
      Tegning.firkant(432, 316, 116, 7, "#4f9dff");
      Tegning.firkant(432, 332, 62, 7, "#3ecb7a");
    }
    /* Fot */
    Tegning.firkant(484, 404, 32, 16, "#171a26");
    Tegning.avrundetFirkant(454, 418, 92, 10, 4, "#22273a");
    /* Tastatur på bordplaten */
    Tegning.avrundetFirkant(418, 432, 164, 16, 4, "#2c3247");
    for (var i = 0; i < 9; i++) {
      Tegning.firkant(426 + i * 17, 436, 11, 5, "#4b5372");
    }
  }

  /* ---------- Tegn hele verdenen ---------- */

  function tegn() {
    tegnRom();

    var i;
    for (i = 0; i < gjenstander.length; i++) {
      var g = gjenstander[i];
      if (g.skjult) continue;
      g.tegn(g);

      if (blinkende[g.id] > 0) {
        blinkende[g.id]--;
        var puls = 0.35 + 0.35 * Math.sin(Date.now() / 140);
        var o = g.omrade;
        var ctx = Tegning.ctx();
        ctx.save();
        ctx.globalAlpha = puls;
        Tegning.ramme(o.x - 8, o.y - 8, o.bredde + 16, o.hoyde + 16, "#ffd23f", 4, 14);
        ctx.restore();
      }
    }

    /* Elevens egne tegninger, lag for lag */
    for (i = 0; i < lag.length; i++) {
      var ops = lag[i].operasjoner;
      for (var j = 0; j < ops.length; j++) {
        tegnOperasjon(ops[j]);
      }
    }
  }

  function tegnOperasjon(op) {
    if (op.form === "trekant") {
      Tegning.pekertrekant(op.x, op.y, op.storrelse, op.farge);
    } else if (op.form === "sirkel") {
      Tegning.sirkel(op.x, op.y, op.storrelse, op.farge);
    } else if (op.form === "firkant") {
      Tegning.firkant(op.x, op.y, op.storrelse, op.storrelse, op.farge);
    }
  }

  return {
    leggTil: leggTil,
    finn: finn,
    trykketPa: trykketPa,
    blink: blink,
    sikreLag: sikreLag,
    tomLag: tomLag,
    fjernLagFor: fjernLagFor,
    tomAlleLag: tomAlleLag,
    tegnI: tegnI,
    lagStandardrom: lagStandardrom,
    tegn: tegn,
    antallTegninger: function () {
      var n = 0;
      for (var i = 0; i < lag.length; i++) n += lag[i].operasjoner.length;
      return n;
    }
  };

})();

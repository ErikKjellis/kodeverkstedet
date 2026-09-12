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

  /*
    "flate" sier hvor laget hører hjemme: "rom" er selve rommet,
    "skjerm" er inne i datamaskinen.
  */
  function sikreLag(navn, eier, flate) {
    var l = finnLag(navn);
    if (!l) {
      l = { navn: navn, eier: eier, flate: flate || "rom", operasjoner: [] };
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
      omrade: { x: 404, y: 264, bredde: 192, hoyde: 172 },
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

  /*
    Selve monitoren. Innholdet på skjermen tegnes ikke her - det gjør
    Skjerm, slik at det er nøyaktig det samme bildet enten skjermen er
    liten i rommet eller zoomet ut over hele nettbrettet.
  */
  function tegnDatamaskin() {
    /* Skjermkasse rundt glasset (420, 280, 160, 112) */
    Tegning.avrundetFirkant(408, 268, 184, 144, 12, "#171a26");
    Tegning.ramme(408, 268, 184, 144, "#39415c", 3, 12);
    Tegning.avrundetFirkant(420, 280, 160, 112, 4, "#0b0d14");
    /* Fot */
    Tegning.firkant(484, 412, 32, 12, "#171a26");
    Tegning.avrundetFirkant(454, 418, 92, 10, 4, "#22273a");
    /* Tastatur på bordplaten */
    Tegning.avrundetFirkant(418, 432, 164, 16, 4, "#2c3247");
    for (var i = 0; i < 9; i++) {
      Tegning.firkant(426 + i * 17, 436, 11, 5, "#4b5372");
    }
  }

  /* ---------- Tegn hele verdenen ---------- */

  /*
    Rekkefølgen betyr alt:
      1. rommet og møblene
      2. det som finnes inne i datamaskinen
      3. elevens tegninger i rommet - musepekeren ligger her, og den
         skal alltid ligge aller øverst
  */
  function tegn() {
    tegnRom();
    tegnGjenstander();

    var maskin = finn("datamaskin");
    if (maskin && maskin.pa) {
      Skjerm.tegn(function () { tegnLag("skjerm"); }, harInnholdPa("skjerm"));
    }

    tegnLag("rom");
  }

  function tegnGjenstander() {
    for (var i = 0; i < gjenstander.length; i++) {
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
  }

  function tegnLag(flate) {
    for (var i = 0; i < lag.length; i++) {
      if (lag[i].flate !== flate) continue;
      var ops = lag[i].operasjoner;
      for (var j = 0; j < ops.length; j++) {
        tegnOperasjon(ops[j]);
      }
    }
  }

  function harInnholdPa(flate) {
    for (var i = 0; i < lag.length; i++) {
      if (lag[i].flate === flate && lag[i].operasjoner.length > 0) return true;
    }
    return false;
  }

  function tegnOperasjon(op) {
    if (op.form === "trekant") {
      Tegning.pekertrekant(op.x, op.y, op.storrelse, op.farge);

    } else if (op.form === "sirkel") {
      Tegning.sirkel(op.x, op.y, op.storrelse, op.farge);

    } else if (op.form === "firkant") {
      Tegning.firkant(op.x, op.y, op.storrelse, op.storrelse, op.farge);

    } else if (op.form === "heleFlaten") {
      Tegning.firkant(0, 0, Skjerm.BREDDE, Skjerm.HOYDE, op.farge);

    } else if (op.form === "tekst") {
      Tegning.tekst(op.tekst, op.x, op.y, op.storrelse, op.farge, "center");

    } else if (op.form === "ikon") {
      tegnIkon(op);

    } else if (op.form === "figurdel") {
      Figur.tegnDel(op);
    }
  }

  /* Et programikon: en avrundet firkant med et lite kodetegn og en tekst under. */
  function tegnIkon(op) {
    var halv = op.storrelse / 2;
    Tegning.avrundetFirkant(op.x - halv, op.y - halv, op.storrelse, op.storrelse, 16, op.farge);
    Tegning.ramme(op.x - halv, op.y - halv, op.storrelse, op.storrelse, "rgba(0,0,0,0.35)", 3, 16);

    var ctx = Tegning.ctx();
    ctx.save();
    ctx.globalAlpha = 0.75;
    Tegning.tekst("< >", op.x, op.y + op.storrelse * 0.14, op.storrelse * 0.42, "#10121b", "center");
    ctx.restore();

    Tegning.tekst(op.tekst, op.x, op.y + halv + 32, 26, "#ffffff", "center");
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

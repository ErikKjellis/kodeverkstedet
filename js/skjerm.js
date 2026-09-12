/* ==========================================================================
   Skjerm
   Datamaskinens skjerm - verdenen inne i datamaskinen.

   Skjermen har sitt eget koordinatsystem, akkurat som rommet: 1000 x 700
   punkter. Når man trykker på datamaskinen, zoomer vi inn slik at skjermen
   fyller hele nettbrettet. Når man går ut igjen, krymper den tilbake ned i
   monitoren på bordet - og da ser man skrivebordet sitt i miniatyr der.

   Det er det samme bildet hele veien. Bare størrelsen endrer seg.
   ========================================================================== */

var Skjerm = (function () {

  var BREDDE = 1000;
  var HOYDE = 700;

  /* Glasset i monitoren, i romkoordinater. Samme forhold som 1000 x 700. */
  var GLASS = { x: 420, y: 280, bredde: 160, hoyde: 112 };

  var zoom = 0;          /* 0 = nede i monitoren, 1 = fyller nettbrettet */
  var mal = 0;
  var FART = 0.07;

  var ikoner = [];       /* { eier, navn, x, y, storrelse } */
  var programAapent = false;
  var kanLukkes = false; /* tilbakeknappen dukker først opp når han er ferdig */

  /* ---------- Åpne og lukke ---------- */

  function apne() { mal = 1; }
  function lukk() { mal = 0; }

  function erApen() { return zoom > 0.95; }
  function erLukket() { return zoom < 0.05; }
  function paVeiInn() { return mal === 1; }

  function oppdater() {
    if (zoom < mal) zoom = Math.min(mal, zoom + FART);
    else if (zoom > mal) zoom = Math.max(mal, zoom - FART);
  }

  function settKanLukkes(verdi) { kanLukkes = verdi; }

  /* ---------- Hvor skjermen er akkurat nå ---------- */

  /* Mykere bevegelse: starter og stopper rolig i stedet for å rykke. */
  function mykning(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function rektangel() {
    var o = Tegning.synligOmrade();
    var t = mykning(zoom);
    return {
      x: GLASS.x + (o.venstre - GLASS.x) * t,
      y: GLASS.y + (o.topp - GLASS.y) * t,
      bredde: GLASS.bredde + (o.bredde - GLASS.bredde) * t,
      hoyde: GLASS.hoyde + (o.hoyde - GLASS.hoyde) * t
    };
  }

  /* Regner om fra romkoordinater (der fingeren er) til skjermkoordinater. */
  function fraRom(x, y) {
    var r = rektangel();
    return {
      x: (x - r.x) / r.bredde * BREDDE,
      y: (y - r.y) / r.hoyde * HOYDE
    };
  }

  /* ---------- Ikoner ---------- */

  function leggTilIkon(eier, navn, x, y, storrelse) {
    /* Samme ikon to ganger skal ikke bli liggende dobbelt. */
    for (var i = 0; i < ikoner.length; i++) {
      if (ikoner[i].eier === eier && ikoner[i].navn === navn) {
        ikoner[i].x = x;
        ikoner[i].y = y;
        ikoner[i].storrelse = storrelse;
        return;
      }
    }
    ikoner.push({ eier: eier, navn: navn, x: x, y: y, storrelse: storrelse });
  }

  function fjernIkonerFor(eier) {
    ikoner = ikoner.filter(function (i) { return i.eier !== eier; });
  }

  function ikonPa(x, y) {
    for (var i = ikoner.length - 1; i >= 0; i--) {
      var ikon = ikoner[i];
      var halv = ikon.storrelse / 2;
      /* Litt ekstra å treffe på under ikonet, der teksten står. */
      if (x >= ikon.x - halv && x <= ikon.x + halv &&
          y >= ikon.y - halv && y <= ikon.y + halv + 40) {
        return ikon;
      }
    }
    return null;
  }

  function harIkoner() { return ikoner.length > 0; }

  /* ---------- Programmet han lager i kapittel 2 ---------- */

  function apneProgram() { programAapent = true; }
  function lukkProgram() { programAapent = false; }
  function programErApent() { return programAapent; }

  /* ---------- Tegning ---------- */

  /*
    Tegner alt som hører hjemme inne i maskinen, klippet til skjermflaten og
    skalert ned eller opp alt etter hvor vi er i zoomen.
  */
  function tegn(tegnLagene, harInnhold) {
    var r = rektangel();
    var ctx = Tegning.ctx();

    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.bredde, r.hoyde);
    ctx.clip();
    ctx.translate(r.x, r.y);
    ctx.scale(r.bredde / BREDDE, r.hoyde / HOYDE);

    /* Mørk skjerm i bunnen, i tilfelle han ikke har tegnet bakgrunn ennå. */
    Tegning.firkant(0, 0, BREDDE, HOYDE, "#0b1020");
    if (!harInnhold) tegnTomSkjerm();

    tegnLagene();

    if (programAapent) tegnProgramvindu();
    if (kanLukkes && zoom > 0.6) tegnTilbakeknapp();

    ctx.restore();

    /* Svak glans over glasset, så det ser ut som en skjerm. */
    if (zoom < 0.999) {
      ctx.save();
      ctx.globalAlpha = (1 - zoom) * 0.18;
      Tegning.firkant(r.x, r.y, r.bredde, r.hoyde * 0.45, "#ffffff");
      ctx.restore();
    }
  }

  /* Maskinen er på, men ingen har laget noe på den ennå. */
  function tegnTomSkjerm() {
    Tegning.firkant(0, 0, BREDDE, HOYDE, "#123a5c");
    Tegning.firkant(80, 180, 520, 42, "#7fd1ff");
    Tegning.firkant(80, 280, 720, 42, "#4f9dff");
    Tegning.firkant(80, 380, 380, 42, "#3ecb7a");
  }

  /* Programvinduet er verktøyet hans - det tegner vi, ikke han. */
  function tegnProgramvindu() {
    Tegning.avrundetFirkant(150, 130, 700, 440, 16, "#1b1f2e");
    Tegning.ramme(150, 130, 700, 440, "#4f9dff", 4, 16);
    Tegning.avrundetFirkant(150, 130, 700, 56, 16, "#262c40");
    Tegning.sirkel(180, 158, 9, "#ff6b57");
    Tegning.sirkel(208, 158, 9, "#ffd23f");
    Tegning.sirkel(236, 158, 9, "#3ecb7a");
    Tegning.tekst("Kodeverkstedet 1.0", 270, 167, 26, "#eef1f8");

    Tegning.tekst("Klar til bruk.", 190, 250, 30, "#3ecb7a");
    Tegning.tekst("Her lager du alt som skal finnes i spillet.", 190, 300, 24, "#a2abc4");

    /* Litt kode som "ligger åpen" i programmet */
    Tegning.firkant(190, 340, 300, 10, "#7fd1ff");
    Tegning.firkant(190, 372, 420, 10, "#b6f09c");
    Tegning.firkant(190, 404, 240, 10, "#ffc978");
    Tegning.firkant(190, 436, 360, 10, "#ff8fc8");
  }

  function tegnTilbakeknapp() {
    Tegning.avrundetFirkant(30, 610, 250, 60, 30, "rgba(16,18,27,0.85)");
    Tegning.ramme(30, 610, 250, 60, "#39415c", 3, 30);
    Tegning.tekst("⬅  Tilbake til rommet", 52, 650, 24, "#eef1f8");
  }

  function trykketPaTilbake(x, y) {
    if (!kanLukkes) return false;
    return x >= 30 && x <= 280 && y >= 610 && y <= 670;
  }

  return {
    BREDDE: BREDDE,
    HOYDE: HOYDE,
    apne: apne,
    lukk: lukk,
    erApen: erApen,
    erLukket: erLukket,
    paVeiInn: paVeiInn,
    oppdater: oppdater,
    settKanLukkes: settKanLukkes,
    rektangel: rektangel,
    fraRom: fraRom,
    leggTilIkon: leggTilIkon,
    fjernIkonerFor: fjernIkonerFor,
    ikonPa: ikonPa,
    harIkoner: harIkoner,
    apneProgram: apneProgram,
    lukkProgram: lukkProgram,
    programErApent: programErApent,
    tegn: tegn,
    trykketPaTilbake: trykketPaTilbake
  };

})();

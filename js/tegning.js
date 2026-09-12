/* ==========================================================================
   Tegning
   Alt som har med canvas og tegning å gjøre.

   Spillet tegnes alltid i et fast rutenett på 1000 x 700 "spillpunkter".
   Uansett hvor stor eller liten skjermen er, skalerer vi bildet slik at det
   passer. Da slipper vi å tenke på skjermstørrelse noe annet sted i koden.
   ========================================================================== */

var Tegning = (function () {

  var BREDDE = 1000;
  var HOYDE = 700;

  var lerret = null;
  var ctx = null;
  var skala = 1;
  var forskyvX = 0;
  var forskyvY = 0;
  var pikselForhold = 1;

  /* Norske fargenavn -> ekte farger. Brukes av elevens kode. */
  var FARGER = {
    "hvit":    "#ffffff",
    "svart":   "#111111",
    "rød":     "#e8503a",
    "rod":     "#e8503a",
    "blå":     "#4f9dff",
    "bla":     "#4f9dff",
    "mørkeblå": "#1d3461",
    "morkebla": "#1d3461",
    "grønn":   "#3ecb7a",
    "gronn":   "#3ecb7a",
    "gul":     "#ffd23f",
    "lilla":   "#b06ef0",
    "rosa":    "#ff8fc8",
    "oransje": "#ff9f43",
    "grå":     "#8a93ad",
    "gra":     "#8a93ad",
    "brun":    "#9a6b3f"
  };

  function start(element) {
    lerret = element;
    ctx = lerret.getContext("2d");
    tilpass();
    window.addEventListener("resize", tilpass);
    window.addEventListener("orientationchange", function () {
      setTimeout(tilpass, 250);
    });
  }

  /* Regner ut hvor stort bildet skal være på akkurat denne skjermen. */
  function tilpass() {
    var bredde = lerret.clientWidth || window.innerWidth;
    var hoyde = lerret.clientHeight || window.innerHeight;
    pikselForhold = window.devicePixelRatio || 1;

    lerret.width = Math.max(1, Math.round(bredde * pikselForhold));
    lerret.height = Math.max(1, Math.round(hoyde * pikselForhold));

    skala = Math.min(bredde / BREDDE, hoyde / HOYDE);

    /* Aller første bilde kan komme før nettleseren har målt opp flaten.
       Da er skalaen 0 eller uendelig, og alt vi regner ut blir tull. */
    if (!isFinite(skala) || skala <= 0) skala = 1;

    forskyvX = (bredde - BREDDE * skala) / 2;
    forskyvY = (hoyde - HOYDE * skala) / 2;
    if (!isFinite(forskyvX)) forskyvX = 0;
    if (!isFinite(forskyvY)) forskyvY = 0;
  }

  /* Kalles først i hver ramme: visker ut og setter opp koordinatsystemet. */
  function nyRamme(bakgrunnsfarge) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = bakgrunnsfarge || "#07080d";
    ctx.fillRect(0, 0, lerret.width, lerret.height);

    var s = pikselForhold * skala;
    ctx.setTransform(s, 0, 0, s, pikselForhold * forskyvX, pikselForhold * forskyvY);
  }

  function farge(navn) {
    if (!navn) return "#ffffff";
    return FARGER[navn] || navn;
  }

  /* ---------- Tegneformer ---------- */

  function firkant(x, y, bredde, hoyde, f) {
    ctx.fillStyle = farge(f);
    ctx.fillRect(x, y, bredde, hoyde);
  }

  function avrundetFirkant(x, y, bredde, hoyde, radius, f) {
    ctx.fillStyle = farge(f);
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, bredde, hoyde, radius);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + bredde, y, x + bredde, y + hoyde, radius);
      ctx.arcTo(x + bredde, y + hoyde, x, y + hoyde, radius);
      ctx.arcTo(x, y + hoyde, x, y, radius);
      ctx.arcTo(x, y, x + bredde, y, radius);
    }
    ctx.fill();
  }

  function sirkel(x, y, radius, f) {
    ctx.fillStyle = farge(f);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function linje(x1, y1, x2, y2, f, tykkelse) {
    ctx.strokeStyle = farge(f);
    ctx.lineWidth = tykkelse || 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function ramme(x, y, bredde, hoyde, f, tykkelse, radius) {
    ctx.strokeStyle = farge(f);
    ctx.lineWidth = tykkelse || 3;
    ctx.beginPath();
    if (radius && ctx.roundRect) {
      ctx.roundRect(x, y, bredde, hoyde, radius);
    } else {
      ctx.rect(x, y, bredde, hoyde);
    }
    ctx.stroke();
  }

  /* Musepeker-trekanten. (x, y) er tuppen av pilen. */
  function pekertrekant(x, y, storrelse, f) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + storrelse * 1.7);
    ctx.lineTo(x + storrelse * 0.44, y + storrelse * 1.28);
    ctx.lineTo(x + storrelse * 1.05, y + storrelse * 1.18);
    ctx.closePath();
    ctx.fillStyle = farge(f);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.75)";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }

  function tekst(innhold, x, y, storrelse, f, justering) {
    ctx.fillStyle = farge(f);
    ctx.font = "600 " + (storrelse || 22) + "px 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = justering || "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(innhold, x, y);
    ctx.textAlign = "left";
  }

  function gjennomsiktig(verdi, tegnefunksjon) {
    ctx.save();
    ctx.globalAlpha = verdi;
    tegnefunksjon();
    ctx.restore();
  }

  /*
    Hvor mye av spillet som faktisk er synlig på denne skjermen, i
    spillkoordinater. Et bredt nettbrett ser mer til sidene, et høyt ser mer
    opp og ned. Rommet tegnes ut til disse kantene, slik at vi slipper svarte
    felter oppe og nede.
  */
  function synligOmrade() {
    var bredde = (lerret.clientWidth || window.innerWidth) / skala;
    var hoyde = (lerret.clientHeight || window.innerHeight) / skala;
    return {
      venstre: -forskyvX / skala,
      topp: -forskyvY / skala,
      bredde: bredde,
      hoyde: hoyde
    };
  }

  /* Regner om fra skjermkoordinater (fingeren) til spillkoordinater. */
  function skjermTilSpill(klientX, klientY) {
    var boks = lerret.getBoundingClientRect();
    return {
      x: (klientX - boks.left - forskyvX) / skala,
      y: (klientY - boks.top - forskyvY) / skala
    };
  }

  return {
    BREDDE: BREDDE,
    HOYDE: HOYDE,
    start: start,
    nyRamme: nyRamme,
    farge: farge,
    firkant: firkant,
    avrundetFirkant: avrundetFirkant,
    sirkel: sirkel,
    linje: linje,
    ramme: ramme,
    pekertrekant: pekertrekant,
    tekst: tekst,
    gjennomsiktig: gjennomsiktig,
    synligOmrade: synligOmrade,
    skjermTilSpill: skjermTilSpill,
    ctx: function () { return ctx; }
  };

})();

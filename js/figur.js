/* ==========================================================================
   Figur
   Personen som skal bo i rommet.

   En figur bygges av fire deler: bein, kropp, armer og hode. Hver del tegnes
   av sin egen kodelinje, og delene må bli enige om hvor de skal være - en høy
   figur har jo hodet lenger opp enn en lav.

   Derfor deler alle delene på ÉN felles lapp med opplysninger. Lappen fylles
   ut mens koden leses, og selve tegningen skjer etterpå. Da spiller det ingen
   rolle hvilken rekkefølge han skriver delene i.

   Legg merke til trikset som går igjen: gir han en del mer å jobbe med,
   gjør den mer. tegnKropp(x, y) blir en strek. tegnKropp(x, y, kroppsform)
   blir en ordentlig kropp.
   ========================================================================== */

var Figur = (function () {

  /* Grunnmål, målt fra føttene og oppover. */
  var BEIN = 70;
  var KROPP = 80;
  var HALS = 30;
  var HODE = 26;
  var SKULDER = 23;
  var ARM = 44;

  /* Spennet er med vilje stort: når to figurer står oppå hverandre i
     kapittel 4, skal det synes tydelig at det er to. */
  var HOYDER = { "lav": 0.68, "vanlig": 0.9, "høy": 1.18 };
  var BREDDER = { "tynn": 0.62, "vanlig": 1, "tykk": 1.55 };

  var HUD = "#e8b58c";

  var lapper = {};   /* eier -> { nøkkel -> felles opplysninger } */

  /* ---------- Den felles lappen ---------- */

  function hentLapp(eier, lag, x, y) {
    var nokkel = lag + "|" + Math.round(x) + "|" + Math.round(y);
    if (!lapper[eier]) lapper[eier] = {};
    if (!lapper[eier][nokkel]) {
      lapper[eier][nokkel] = {
        hoyde: null,
        kroppsform: null,
        harfarge: null,
        kjonn: null
      };
    }
    return lapper[eier][nokkel];
  }

  function nullstillFor(eier) {
    delete lapper[eier];
  }

  /* ---------- Mål ---------- */

  function maal(lapp, x, y) {
    var s = HOYDER[lapp.hoyde] || HOYDER["vanlig"];
    var b = BREDDER[lapp.kroppsform] || BREDDER["vanlig"];

    var hofte = y - BEIN * s;
    var skulder = hofte - KROPP * s;

    return {
      s: s,
      b: b,
      fot: y,
      hofte: hofte,
      skulder: skulder,
      hodeSenter: skulder - HALS * s,
      hodeRadius: HODE * s,
      halvKropp: SKULDER * s * b,
      arm: ARM * s
    };
  }

  /* ---------- Tegning ---------- */

  function tegnDel(op) {
    var m = maal(op.lapp, op.x, op.y);
    if (op.del === "bein") tegnBein(op, m);
    else if (op.del === "kropp") tegnKropp(op, m);
    else if (op.del === "armer") tegnArmer(op, m);
    else if (op.del === "hode") tegnHode(op, m);
  }

  function tegnBein(op, m) {
    var tykkelse = 7 * m.s * (op.lapp.kroppsform === "tykk" ? 1.5 : 1);
    var spredning = 17 * m.s * m.b;
    Tegning.linje(op.x, m.hofte, op.x - spredning, m.fot, op.farge, tykkelse);
    Tegning.linje(op.x, m.hofte, op.x + spredning, m.fot, op.farge, tykkelse);
  }

  /*
    Uten kroppsform er kroppen bare en strek - en strekmann.
    Med kroppsform blir den en ordentlig kropp.
  */
  function tegnKropp(op, m) {
    if (!op.lapp.kroppsform) {
      Tegning.linje(op.x, m.hofte, op.x, m.skulder, op.farge, 7 * m.s);
      return;
    }
    var bredde = m.halvKropp * 2;
    var hoyde = m.hofte - m.skulder;
    Tegning.avrundetFirkant(
      op.x - m.halvKropp, m.skulder, bredde, hoyde,
      Math.min(bredde, hoyde) * 0.35, op.farge
    );
  }

  function tegnArmer(op, m) {
    var tykkelse = 6 * m.s * (op.lapp.kroppsform === "tykk" ? 1.4 : 1);
    var fra = m.skulder + 10 * m.s;
    var ut = m.halvKropp + m.arm * 0.55;
    var ned = fra + m.arm;
    Tegning.linje(op.x - m.halvKropp * 0.8, fra, op.x - ut, ned, op.farge, tykkelse);
    Tegning.linje(op.x + m.halvKropp * 0.8, fra, op.x + ut, ned, op.farge, tykkelse);
  }

  /*
    Uten hårfarge er hodet en tom ring - et strekmannshode.
    Med hårfarge får figuren ansikt og frisyre.
  */
  function tegnHode(op, m) {
    var cx = op.x;
    var cy = m.hodeSenter;
    var r = m.hodeRadius;

    if (!op.lapp.harfarge) {
      Tegning.ramme(cx - r, cy - r, r * 2, r * 2, op.farge, 7 * m.s, r);
      return;
    }

    var harfarge = Tegning.farge(op.lapp.harfarge);

    /* Langt hår tegnes bak hodet, så det henger ned langs sidene. */
    if (op.lapp.kjonn === "jente") {
      Tegning.avrundetFirkant(
        cx - r * 1.15, cy - r * 1.1, r * 2.3, r * 2.6, r * 0.9, harfarge
      );
    }

    /* Ansikt */
    Tegning.sirkel(cx, cy, r, HUD);

    /* Kort hår: en lugg over pannen */
    var ctx = Tegning.ctx();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    Tegning.firkant(cx - r, cy - r, r * 2, r * 0.85, harfarge);
    ctx.restore();

    /* Øyne og munn */
    Tegning.sirkel(cx - r * 0.33, cy + r * 0.08, r * 0.11, "#2b2118");
    Tegning.sirkel(cx + r * 0.33, cy + r * 0.08, r * 0.11, "#2b2118");
    ctx.save();
    ctx.strokeStyle = "#2b2118";
    ctx.lineWidth = Math.max(1.5, r * 0.08);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.24, r * 0.36, 0.25 * Math.PI, 0.75 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  return {
    hentLapp: hentLapp,
    nullstillFor: nullstillFor,
    tegnDel: tegnDel
  };

})();

/* ==========================================================================
   Fremdrift
   Husker hvor langt spilleren har kommet, og - viktigst av alt - alle
   programmene han har laget. De kjøres på nytt hver gang spillet starter,
   slik at det han har bygget fortsatt finnes der.

   Alt lagres i nettleseren (localStorage). Ingen server, ingen innlogging.
   ========================================================================== */

var Fremdrift = (function () {

  var NOKKEL = "kodeverkstedet.fremdrift.v1";

  var data = tomtStartpunkt();

  function tomtStartpunkt() {
    return {
      kapittel: 0,        /* hvilket kapittel han er på */
      steg: 0,            /* hvilket steg i kapittelet */
      utkast: {},         /* oppgaveId -> program han holder på med */
      installerte: [],    /* [{ id, program }] i den rekkefølgen de ble laget */
      tilstand: {},       /* småting verden må huske, f.eks. om maskinen står på */
      lagret: {}          /* det HAN har lagret med lagre("navn", verdi) */
    };
  }

  function last() {
    try {
      var raatekst = window.localStorage.getItem(NOKKEL);
      if (!raatekst) return;
      var lagret = JSON.parse(raatekst);
      if (lagret && typeof lagret === "object") {
        data = {
          kapittel: lagret.kapittel || 0,
          steg: lagret.steg || 0,
          utkast: lagret.utkast || {},
          installerte: lagret.installerte || [],
          tilstand: lagret.tilstand || {},
          lagret: lagret.lagret || {}
        };
      }
    } catch (feil) {
      /* Hvis noe er ødelagt eller lagring er slått av, starter vi bare på nytt. */
      data = tomtStartpunkt();
    }
  }

  function lagre() {
    try {
      window.localStorage.setItem(NOKKEL, JSON.stringify(data));
    } catch (feil) {
      /* Privat nettlesing kan blokkere lagring. Spillet skal virke likevel. */
    }
  }

  function settPosisjon(kapittel, steg) {
    data.kapittel = kapittel;
    data.steg = steg;
    lagre();
  }

  /* ---------- Utkast (programmet han holder på med akkurat nå) ---------- */

  function lagreUtkast(oppgaveId, program) {
    data.utkast[oppgaveId] = program;
    lagre();
  }

  function hentUtkast(oppgaveId) {
    var p = data.utkast[oppgaveId];
    return p ? kopi(p) : null;
  }

  /* ---------- Installerte programmer (det ferdige, som blir en del av spillet) ---------- */

  function installer(id, program, flate) {
    for (var i = 0; i < data.installerte.length; i++) {
      if (data.installerte[i].id === id) {
        data.installerte[i].program = kopi(program);
        data.installerte[i].flate = flate || "rom";
        lagre();
        return;
      }
    }
    data.installerte.push({ id: id, program: kopi(program), flate: flate || "rom" });
    lagre();
  }

  function hentInstallert(id) {
    for (var i = 0; i < data.installerte.length; i++) {
      if (data.installerte[i].id === id) return kopi(data.installerte[i].program);
    }
    return null;
  }

  function alleInstallerte() {
    return data.installerte;
  }

  /* ---------- Småting verden må huske ---------- */

  /* ---------- Det spilleren selv lagrer (kapittel 6) ---------- */

  function lagreVerdi(navn, verdi) {
    data.lagret[navn] = verdi;
    lagre();
  }

  /* Gir undefined hvis ingenting er lagret under det navnet. */
  function hentVerdi(navn) {
    return Object.prototype.hasOwnProperty.call(data.lagret, navn) ? data.lagret[navn] : undefined;
  }

  function settTilstand(nokkel, verdi) {
    data.tilstand[nokkel] = verdi;
    lagre();
  }

  function hentTilstand(nokkel) {
    return data.tilstand[nokkel];
  }

  function nullstill() {
    data = tomtStartpunkt();
    try { window.localStorage.removeItem(NOKKEL); } catch (feil) { /* ingenting */ }
  }

  function kopi(verdi) {
    return JSON.parse(JSON.stringify(verdi));
  }

  return {
    last: last,
    lagre: lagre,
    settPosisjon: settPosisjon,
    lagreUtkast: lagreUtkast,
    hentUtkast: hentUtkast,
    installer: installer,
    hentInstallert: hentInstallert,
    alleInstallerte: alleInstallerte,
    lagreVerdi: lagreVerdi,
    hentVerdi: hentVerdi,
    settTilstand: settTilstand,
    hentTilstand: hentTilstand,
    nullstill: nullstill,
    kopi: kopi,
    data: function () { return data; }
  };

})();

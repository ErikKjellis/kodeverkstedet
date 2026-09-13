/* ==========================================================================
   Spill
   Starter alt, og holder hovedløkka i gang.

   Hovedløkka tegner et nytt bilde ca. 60 ganger i sekundet. Det er slik alle
   dataspill virker: tegn alt på nytt, om og om igjen, veldig fort.
   ========================================================================== */

(function () {

  window.addEventListener("load", start);

  function start() {
    var lerret = document.getElementById("lerret");

    Tegning.start(lerret);
    Input.start(lerret);
    Dialog.start();
    KodeEditor.start();

    Verden.lagStandardrom();

    Fremdrift.last();
    gjenopprett();

    koblePaHendelser();

    ramme();

    Kapittelmotor.start(Fremdrift.data().kapittel, Fremdrift.data().steg);
  }

  /* Kjører alt spilleren har bygget tidligere, slik at det fortsatt finnes. */
  function gjenopprett() {
    var maskin = Verden.finn("datamaskin");
    if (maskin) maskin.pa = !!Fremdrift.hentTilstand("datamaskinPa");

    Skjerm.settKanLukkes(!!Fremdrift.hentTilstand("kanForlateSkjermen"));

    var installerte = Fremdrift.alleInstallerte();
    for (var i = 0; i < installerte.length; i++) {
      Kjorer.installer(installerte[i].id, installerte[i].program, installerte[i].flate);
    }
  }

  /* Kobler fingeren til hendelsene elevens kode kan lytte på. */
  function koblePaHendelser() {
    Input.naarFlytt(function (x, y) {
      Kjorer.utlos("fingerFlytter", [x, y]);
    });

    Input.naarTrykk(paTrykk);
  }

  /*
    Et trykk kan treffe to helt forskjellige steder: i rommet, eller inne på
    datamaskinens skjerm. Er skjermen oppe, gjelder den.
  */
  function paTrykk(x, y) {
    if (Skjerm.erApen()) {
      var punkt = Skjerm.fraRom(x, y);

      if (Skjerm.trykketPaTilbake(punkt.x, punkt.y)) {
        Skjerm.lukkProgram();
        Skjerm.lukk();
        return;
      }

      var ikon = Skjerm.ikonPa(punkt.x, punkt.y);
      if (ikon) Kjorer.utlos("trykk", [], null, ikon.navn);
      return;
    }

    var gjenstand = Verden.trykketPa(x, y);
    if (!gjenstand) return;

    /* Trykker man på en datamaskin som står på, går man inn i den.
       Men ikke midt i en samtale med Bit eller mens kodevinduet er oppe. */
    var opptatt = Dialog.erSynlig() || KodeEditor.erApen();
    if (gjenstand.id === "datamaskin" && gjenstand.pa && !opptatt) Skjerm.apne();

    Kjorer.utlos("trykk", [], null, gjenstand.navn || gjenstand.id);
  }

  function ramme() {
    Skjerm.oppdater();
    Tegning.nyRamme();
    Verden.tegn();
    Effekter.oppdaterOgTegn();
    requestAnimationFrame(ramme);
  }

  /* ------------------------------------------------------------------
     Til deg som lager spillet:
     Skriv nullstillSpillet() i konsollen (F12) for å starte helt forfra.
     ------------------------------------------------------------------ */
  window.nullstillSpillet = function () {
    Fremdrift.nullstill();
    window.location.reload();
  };

})();

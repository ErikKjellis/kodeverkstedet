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

    var installerte = Fremdrift.alleInstallerte();
    for (var i = 0; i < installerte.length; i++) {
      Kjorer.installer(installerte[i].id, installerte[i].program);
    }
  }

  /* Kobler fingeren til hendelsene elevens kode kan lytte på. */
  function koblePaHendelser() {
    Input.naarFlytt(function (x, y) {
      Kjorer.utlos("fingerFlytter", [x, y]);
    });

    Input.naarTrykk(function (x, y) {
      var gjenstand = Verden.trykketPa(x, y);
      if (gjenstand) {
        Kjorer.utlos("trykk", [], null, gjenstand.navn || gjenstand.id);
      }
    });
  }

  function ramme() {
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

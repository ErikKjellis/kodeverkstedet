/* ==========================================================================
   Verksted
   Kodeverkstedet når ingen oppgave venter - fri lek.

   Når han har spilt gjennom alle kapitlene, åpner Kode-ikonet på skrivebordet
   en liste over programmene hans. Han velger ett, endrer det som han vil, og
   trykker Kjør. Ingen sjekk, ingen feiring - bare han og koden.

   Hvert kapittel melder selv inn hvilke kodebiter det har lært ham:
       Verksted.leggTilBiter("figur", [ ...kodebiter... ]);
   Da får han bruke alt han har lært, og ingenting han ikke har lært ennå.
   ========================================================================== */

var Verksted = (function () {

  var programnavn = {};   /* installasjonsId -> { navn, ikon, beskrivelse } */
  var biter = {};         /* installasjonsId -> [kodebiter] */
  var vern = {};          /* installasjonsId -> function(program) som kan si nei */

  var el, listeEl;

  function start() {
    el = document.getElementById("verksted");
    listeEl = document.getElementById("verksted-liste");

    listeEl.addEventListener("click", function (e) {
      var knapp = e.target.closest("[data-program]");
      if (knapp) velg(knapp.getAttribute("data-program"));
    });
    document.getElementById("verksted-lukk").addEventListener("click", function () {
      lukk();
      Skjerm.lukkProgram();
    });
  }

  /* ---------- Innmelding fra kapitlene ---------- */

  function navngi(id, navn, ikon, beskrivelse) {
    programnavn[id] = { navn: navn, ikon: ikon, beskrivelse: beskrivelse || "" };
  }

  function leggTilBiter(id, nye) {
    var liste = biter[id] || [];
    var sett = liste.map(function (b) { return JSON.stringify(b); });
    nye.forEach(function (b) {
      var tekst = JSON.stringify(b);
      if (sett.indexOf(tekst) === -1) {
        liste.push(b);
        sett.push(tekst);
      }
    });
    biter[id] = liste;
  }

  /* Et program kan beskytte seg mot endringer som ville låst ham ute av spillet. */
  function beskytt(id, fn) {
    vern[id] = fn;
  }

  /* ---------- Lista over programmer ---------- */

  function apne() {
    var html = "";
    Fremdrift.alleInstallerte().forEach(function (p) {
      var info = programnavn[p.id];
      if (!info) return;
      html += '<button type="button" class="verksted-program" data-program="' + p.id + '">' +
              '<span class="verksted-ikon">' + info.ikon + "</span>" +
              '<span class="verksted-tekst"><b>' + info.navn + "</b>" +
              "<small>" + info.beskrivelse + "</small></span></button>";
    });
    listeEl.innerHTML = html || "<p>Du har ingen programmer ennå.</p>";
    el.classList.remove("skjult");
  }

  function lukk() {
    el.classList.add("skjult");
  }

  function erApen() {
    return el && !el.classList.contains("skjult");
  }

  /* ---------- Fri koding i ett program ---------- */

  function velg(id) {
    lukk();
    var installert = null;
    Fremdrift.alleInstallerte().forEach(function (p) { if (p.id === id) installert = p; });
    if (!installert) return;

    var info = programnavn[id];
    var oppgaveId = "fri-" + id;

    /* Fri lek starter alltid fra det som faktisk kjører nå, ikke fra et gammelt utkast. */
    Fremdrift.lagreUtkast(oppgaveId, null);

    KodeEditor.apne({
      id: oppgaveId,
      installasjonsId: id,
      flate: installert.flate,
      tittel: info.ikon + "  " + info.navn,
      instruks: "Fri lek. Endre det du vil, og trykk <b>Kjør</b>. " +
                "Ingen oppgaver – bare du og koden. Ombestemmer du deg, trykker du <b>Lukk</b>.",
      fri: true,
      valgtVedStart: "siste",
      startProgram: function () { return Fremdrift.hentInstallert(id) || []; },
      palett: biter[id] || [],
      hint: [],
      sjekk: function (program) {
        var nei = vern[id] ? vern[id](program) : null;
        if (nei) return { ok: false, melding: nei };
        return { ok: true };
      }
    }, function () {
      Skjerm.lukkProgram();
    });
  }

  return {
    start: start,
    navngi: navngi,
    leggTilBiter: leggTilBiter,
    beskytt: beskytt,
    apne: apne,
    lukk: lukk,
    erApen: erApen
  };

})();

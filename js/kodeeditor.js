/* ==========================================================================
   KodeEditor
   Programmeringsvinduet.

   Eleven trykker på ferdige kodebiter i paletten nederst, og de settes inn
   som ekte kodetekst. Ingen skjermtastatur - men det som står på skjermen er
   ekte JavaScript.

   Trykk på en linje for å velge hvor neste kodebit skal havne. Er den valgte
   linja starten på en blokk, havner kodebiten INNI blokka.
   ========================================================================== */

var KodeEditor = (function () {

  var el, kodeEl, palettEl, tittelEl, instruksEl, hintKnapp, kjorKnapp;

  var program = [];
  var oppgave = null;
  var palett = [];
  var valgtId = null;
  var hintNr = 0;
  var nesteId = 1;
  var naarFerdig = null;
  var venterPaVerden = false;

  function start() {
    el = document.getElementById("editor");
    kodeEl = document.getElementById("kodelinjer");
    palettEl = document.getElementById("palett");
    tittelEl = document.getElementById("oppgave-tittel");
    instruksEl = document.getElementById("oppgave-instruks");
    hintKnapp = document.getElementById("knapp-hint");
    kjorKnapp = document.getElementById("knapp-kjor");

    kodeEl.addEventListener("click", paKodeTrykk);
    palettEl.addEventListener("click", paPalettTrykk);
    hintKnapp.addEventListener("click", visHint);
    kjorKnapp.addEventListener("click", kjor);
  }

  /* ---------- Åpne og lukke ---------- */

  function apne(nyOppgave, ferdig) {
    oppgave = nyOppgave;
    naarFerdig = ferdig || null;
    hintNr = 0;
    valgtId = null;

    var lagret = Fremdrift.hentUtkast(oppgave.id);
    program = lagret ? lagret : oppgave.startProgram();
    giIderTilAlle(program);
    velgVedStart();

    tittelEl.textContent = oppgave.tittel;
    /* Palett og instruks kan være funksjoner, slik at en oppgave kan ta
       hensyn til det han har laget tidligere. De regnes ut én gang her. */
    palett = verdiEllerFunksjon(oppgave.palett) || [];
    instruksEl.innerHTML = verdiEllerFunksjon(oppgave.instruks) || "";
    hintKnapp.classList.toggle("skjult", !oppgave.hint || oppgave.hint.length === 0);

    /* Programmerer han inne i maskinen, skal skjermen være oppe bak vinduet. */
    if (oppgave.flate === "skjerm") Skjerm.apne();

    Banner.skjul();
    Dialog.skjul();
    tegnPalett();
    tegnOpp();
    el.classList.remove("skjult");
  }

  /*
    En oppgave kan si hvor den grønne innsettingsstreken skal stå når vinduet
    åpnes, slik at den første kodebiten havner et fornuftig sted av seg selv.
  */
  function velgVedStart() {
    if (!program.length) { valgtId = null; return; }
    if (oppgave.valgtVedStart === "forste") {
      valgtId = program[0].id;
    } else if (oppgave.valgtVedStart === "siste") {
      /* Er siste linje en blokk, skal nye ting havne under den, ikke inni. */
      var siste = program[program.length - 1];
      valgtId = Api.hent(siste.type).erBlokk ? siste.id + SLUTT : siste.id;
    } else {
      valgtId = null;
    }
  }

  function vis() { el.classList.remove("skjult"); }
  function skjul() { el.classList.add("skjult"); }

  /* ---------- Tegne koden ---------- */

  function tegnOpp() {
    var rader = [];
    flat(program, 0, rader);

    var html = "";

    for (var i = 0; i < rader.length; i++) {
      var r = rader[i];

      if (r.rolle === "tom") {
        /* Er blokka valgt, viser vi innsettingsmerket i stedet. */
        if (valgtId !== r.blokk.id) {
          html += '<div class="tomplass" data-velg="' + r.blokk.id + '" style="--dybde:' + r.dybde + '">' +
                  "<span>tomt – trykk på en kodebit nedenfor</span></div>";
        }
        continue;
      }

      /* Slutten av en blokk kan også velges: da havner neste kodebit rett
         UNDER blokka, ikke inni den. */
      if (r.rolle === "slutt") {
        var sluttId = r.linje.id + SLUTT;
        var sluttValgt = (valgtId === sluttId);
        html += '<div class="kodelinje kanvelges' + (sluttValgt ? " valgt" : "") +
                '" data-velg="' + sluttId + '" style="--dybde:' + r.dybde + '"><span class="kode">' +
                r.html + "</span></div>";
        if (sluttValgt) {
          html += '<div class="settes-inn-her" style="--dybde:' + r.dybde + '"></div>';
        }
        continue;
      }

      var valgt = (valgtId === r.linje.id);
      var klasser = "kodelinje kanvelges";
      if (valgt) klasser += " valgt";
      if (r.linje.laast) klasser += " laast";

      html += '<div class="' + klasser + '" data-velg="' + r.linje.id + '" data-id="' + r.linje.id +
              '" style="--dybde:' + r.dybde + '">';
      html += '<span class="kode">' + r.html + "</span>";

      if (valgt && !r.linje.laast) {
        html += '<span class="verktoy">' +
                '<button type="button" data-handling="opp" aria-label="Flytt opp">▲</button>' +
                '<button type="button" data-handling="ned" aria-label="Flytt ned">▼</button>' +
                '<button type="button" data-handling="slett" aria-label="Slett">✕</button>' +
                "</span>";
      }
      html += "</div>";

      /* Innsettingsmerket rett etter den valgte linja */
      if (valgt) {
        var merkeDybde = (r.rolle === "start") ? r.dybde + 1 : r.dybde;
        html += '<div class="settes-inn-her" style="--dybde:' + merkeDybde + '"></div>';
      }
    }

    if (!valgtId) {
      html += '<div class="settes-inn-her" style="--dybde:0"></div>';
    }

    kodeEl.innerHTML = html;
  }

  /* Gjør kodetreet om til en flat liste med rader vi kan tegne. */
  function flat(liste, dybde, rader) {
    for (var i = 0; i < liste.length; i++) {
      var l = liste[i];
      var def = Api.hent(l.type);
      if (!def) continue;

      if (def.erBlokk) {
        rader.push({ rolle: "start", linje: l, dybde: dybde, html: def.htmlStart(l, true) });
        if (!l.barn || l.barn.length === 0) {
          rader.push({ rolle: "tom", blokk: l, dybde: dybde + 1 });
        } else {
          flat(l.barn, dybde + 1, rader);
        }
        rader.push({ rolle: "slutt", linje: l, dybde: dybde, html: def.htmlSlutt(l, true) });
      } else {
        rader.push({ rolle: "linje", linje: l, dybde: dybde, html: def.html(l, true) });
      }
    }
  }

  /* ---------- Paletten ---------- */

  function tegnPalett() {
    var html = "";
    var biter = palett;
    for (var i = 0; i < biter.length; i++) {
      var mal = biter[i];
      var def = Api.hent(mal.type);
      /* false = ingen trykkbare verdier her; en knapp kan ikke stå inni en knapp. */
      var visning = def.erBlokk
        ? def.htmlStart(mal, false) + ' <span class="k-komm">…</span> ' + def.htmlSlutt(mal, false)
        : def.html(mal, false);
      html += '<button type="button" class="palettknapp" data-nr="' + i + '">' + visning + "</button>";
    }
    palettEl.innerHTML = html;
  }

  /* ---------- Trykk ---------- */

  function paPalettTrykk(e) {
    var knapp = e.target.closest(".palettknapp");
    if (!knapp) return;
    var mal = palett[parseInt(knapp.getAttribute("data-nr"), 10)];
    settInn(fraMal(mal));
  }

  function paKodeTrykk(e) {
    var knapp = e.target.closest("button[data-handling]");
    if (knapp) {
      var rad = knapp.closest("[data-id]");
      utforHandling(knapp.getAttribute("data-handling"), rad.getAttribute("data-id"));
      return;
    }

    /* Trykk på en verdi i koden: bla til neste valg. */
    var verdiknapp = e.target.closest("button.kodeverdi");
    if (verdiknapp) {
      var eier = verdiknapp.closest("[data-id]");
      blaVerdi(eier.getAttribute("data-id"), verdiknapp.getAttribute("data-sti"));
      return;
    }

    var velgbar = e.target.closest("[data-velg]");
    if (!velgbar) return;
    valgtId = velgbar.getAttribute("data-velg");
    tegnOpp();
  }

  /* Bytter en verdi til den neste i lista si, og begynner forfra på slutten. */
  function blaVerdi(linjeId, sti) {
    var sted = finnSted(program, linjeId);
    if (!sted) return;

    var verdi = hentArg(sted.linje.args, sti);
    if (!verdi || !verdi.valg || verdi.valg.length < 2) return;

    var na = verdi.valg.indexOf(verdi.v);
    verdi.v = verdi.valg[(na + 1) % verdi.valg.length];

    lagreUtkast();
    tegnOpp();
  }

  /* Finner en verdi inne i args ut fra en sti som "farge" eller "argumenter.0". */
  function hentArg(args, sti) {
    var deler = sti.split(".");
    var node = args;
    for (var i = 0; i < deler.length && node; i++) {
      node = node[deler[i]];
    }
    return node;
  }

  function utforHandling(handling, id) {
    var sted = finnSted(program, id);
    if (!sted || sted.linje.laast) return;

    if (handling === "slett") {
      sted.liste.splice(sted.indeks, 1);
      valgtId = null;
    } else if (handling === "opp" && sted.indeks > 0) {
      bytt(sted.liste, sted.indeks, sted.indeks - 1);
    } else if (handling === "ned" && sted.indeks < sted.liste.length - 1) {
      bytt(sted.liste, sted.indeks, sted.indeks + 1);
    }

    lagreUtkast();
    tegnOpp();
  }

  function bytt(liste, a, b) {
    var midlertidig = liste[a];
    liste[a] = liste[b];
    liste[b] = midlertidig;
  }

  function settInn(nyLinje) {
    var underBlokk = erSlutt(valgtId);
    var sted = valgtId ? finnSted(program, underBlokk ? utenSlutt(valgtId) : valgtId) : null;

    if (!sted) {
      program.push(nyLinje);
    } else if (underBlokk) {
      sted.liste.splice(sted.indeks + 1, 0, nyLinje);
    } else if (Api.hent(sted.linje.type).erBlokk) {
      sted.linje.barn = sted.linje.barn || [];
      sted.linje.barn.unshift(nyLinje);
    } else {
      sted.liste.splice(sted.indeks + 1, 0, nyLinje);
    }

    valgtId = nyLinje.id;
    lagreUtkast();
    tegnOpp();
    rullTilValgt();
  }

  function rullTilValgt() {
    var valgt = kodeEl.querySelector(".valgt");
    if (valgt && valgt.scrollIntoView) {
      valgt.scrollIntoView({ block: "nearest" });
    }
  }

  /* ---------- Hint ---------- */

  function visHint() {
    if (!oppgave.hint || oppgave.hint.length === 0) return;
    var tekst = oppgave.hint[Math.min(hintNr, oppgave.hint.length - 1)];
    hintNr++;
    Banner.vis("💡 " + tekst, { varighet: 9000 });
  }

  /* ---------- Kjøre programmet ---------- */

  function kjor() {
    lagreUtkast();
    Banner.skjul();
    skjul();

    /* Lager han noe som hører hjemme i rommet, trekker kameraet seg ut av
       maskinen så han ser det skje der ute. */
    if (oppgave.flate !== "skjerm") {
      Skjerm.lukkProgram();
      Skjerm.lukk();
    }

    Kjorer.tomFeil();
    Kjorer.installer(oppgave.installasjonsId, program, oppgave.flate);

    /* Liten pause, så han rekker å se hva som skjedde før Bit sier noe. */
    setTimeout(vurder, 750);
  }

  function vurder() {
    var resultat = oppgave.sjekk(program, Kjorer.hentFeil());

    if (!resultat.ok) {
      if (resultat.provForst) {
        provForst(resultat);
      } else {
        visFeil(resultat);
      }
      return;
    }

    Fremdrift.installer(oppgave.installasjonsId, program, oppgave.flate);

    if (oppgave.bekreftIVerden) {
      ventPaVerden(resultat);
      return;
    }

    fullfor(resultat);
  }

  function visFeil(resultat) {
    Dialog.si(somListe(resultat.melding), function () {
      vis();
    }, { knapp: "Prøv igjen ↺" });
  }

  /*
    Noen feil forstår man best ved å prøve dem. Da får han trykke selv først -
    og SE at ingenting skjer, eller at det dukker opp to figurer - før Bit
    forklarer hvorfor. Sjekken returnerer da:
      { ok: false, provForst: { instruks, sjekk, forbered? }, melding: [...] }
  */
  function provForst(resultat) {
    var prov = resultat.provForst;
    venterPaVerden = true;
    if (prov.forbered) prov.forbered();
    Banner.vis(prov.instruks, { viktig: true });

    (function sjekkNa() {
      if (!venterPaVerden) return;
      if (prov.sjekk()) {
        venterPaVerden = false;
        Banner.skjul();
        /* Pause, så han rekker å se hva som (ikke) skjedde. */
        setTimeout(function () { visFeil(resultat); }, 1200);
        return;
      }
      requestAnimationFrame(sjekkNa);
    })();
  }

  /* Noen oppgaver er ikke ferdige før spilleren har prøvd noe i rommet. */
  function ventPaVerden(resultat) {
    venterPaVerden = true;
    Input.nullstillBevegelse();

    /* Noen oppgaver må nullstille noe først, så han faktisk må prøve på nytt. */
    if (oppgave.bekreftIVerden.forbered) oppgave.bekreftIVerden.forbered();

    Banner.vis(oppgave.bekreftIVerden.instruks, { viktig: true });

    function sjekkNa() {
      if (!venterPaVerden) return;
      if (oppgave.bekreftIVerden.sjekk()) {
        venterPaVerden = false;
        Banner.skjul();
        /* Liten pause, så han rekker å se det skje før feiringen dekker det. */
        setTimeout(function () { fullfor(resultat); }, oppgave.bekreftIVerden.pause || 0);
        return;
      }
      requestAnimationFrame(sjekkNa);
    }
    requestAnimationFrame(sjekkNa);
  }

  function fullfor(resultat) {
    var ferdig = naarFerdig;
    naarFerdig = null;
    Dialog.feire(somListe(resultat.ros), function () {
      if (ferdig) ferdig();
    });
  }

  /* ---------- Småting ---------- */

  /* Valgt slutt på en blokk skrives som "<id>:slutt". */
  var SLUTT = ":slutt";
  function erSlutt(id) { return !!id && id.slice(-SLUTT.length) === SLUTT; }
  function utenSlutt(id) { return id.slice(0, -SLUTT.length); }

  function verdiEllerFunksjon(v) {
    return (typeof v === "function") ? v() : v;
  }

  function somListe(verdi) {
    if (!verdi) return ["Bra jobbet!"];
    return Array.isArray(verdi) ? verdi : [verdi];
  }

  function lagreUtkast() {
    Fremdrift.lagreUtkast(oppgave.id, program);
  }

  function finnSted(liste, id) {
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].id === id) return { liste: liste, indeks: i, linje: liste[i] };
      if (liste[i].barn) {
        var treff = finnSted(liste[i].barn, id);
        if (treff) return treff;
      }
    }
    return null;
  }

  function fraMal(mal) {
    var linje = Fremdrift.kopi(mal);
    giIder(linje);
    return linje;
  }

  function giIderTilAlle(liste) {
    for (var i = 0; i < liste.length; i++) giIder(liste[i]);
  }

  function giIder(linje) {
    linje.id = "l" + (nesteId++);
    if (linje.barn) giIderTilAlle(linje.barn);
  }

  return {
    start: start,
    apne: apne,
    erApen: function () { return el && !el.classList.contains("skjult"); }
  };

})();

/* ==========================================================================
   Kapittel 0 - Rommet

   Spilleren kommer inn i et tomt rom. Det står en datamaskin på bordet.
   Han blir bedt om å trykke på den ... men ingenting skjer.

   Det er meningen. Det finnes jo ingen musepeker ennå.
   ========================================================================== */

Kapitler.leggTil({

  id: "rommet",
  tittel: "Rommet",

  steg: [

    {
      type: "dialog",
      linjer: [
        "Hei, Sigurd! 👋",
        "Dette er et programmeringsspill som pappa har laget til deg.",
        "Akkurat nå er det ganske tomt her. Bare et rom, et bord og en datamaskin.",
        "Alt annet skal DU lage.",
        "Vi begynner enkelt: trykk på datamaskinen."
      ]
    },

    {
      type: "egen",
      start: function (neste) {

        var trykkPaMaskin = 0;
        var bomtrykk = 0;

        Banner.vis("Trykk på datamaskinen 💻", {});

        var stopp = Input.naarTrykk(function (x, y) {
          Effekter.ring(x, y);

          var gjenstand = Verden.trykketPa(x, y);

          /* Trykket han et helt annet sted? Gi ham et lite dytt. */
          if (!gjenstand || gjenstand.id !== "datamaskin") {
            bomtrykk++;
            if (bomtrykk === 2 || bomtrykk === 5) {
              Banner.vis("Datamaskinen står på bordet, midt i rommet.", { varighet: 4500 });
              Verden.blink("datamaskin", 150);
            }
            return;
          }

          trykkPaMaskin++;

          if (trykkPaMaskin === 1) {
            Banner.vis("… ingenting skjer.", {});
          } else if (trykkPaMaskin === 2) {
            Banner.vis("Fortsatt ingenting.", {});
          } else if (trykkPaMaskin === 3) {
            Banner.vis("Hmm. Den bryr seg ikke i det hele tatt.", {});
          } else {
            Banner.skjul();
            stopp();
            neste();
          }
        });

        return stopp;
      }
    }

  ]

});

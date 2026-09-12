# Kodeverkstedet – forståelse og plan

Dette dokumentet er min forståelse av hva vi holder på med, hvilke valg du har
tatt, hva som er bygget, og hva som står for tur. **Planen er styrt av dine valg.**
Der jeg foreslår noe på egen hånd, står det uttrykkelig.

Sist oppdatert: 13. september 2026.

---

## 1. Hva dette er

Et programmeringsspill på norsk til sønnen din på ti år.

Spillet starter tomt. Man kommer inn i et rom med en datamaskin på et bord, blir
bedt om å trykke på den – og ingenting skjer. Det finnes ingen musepeker. Ingen
har laget den. Så lager man den selv, og derfra bygges spillet bit for bit mens
man spiller det.

Det er ikke et spill *om* programmering. Det er et spill som **ikke virker før
han programmerer det**.

## 2. Hvem det er for

**Spilleren:** ti år, smart for alderen, men ingen forkunnskaper. Har ikke PC –
bare et Android-nettbrett. Det betyr berøringsskjerm, ikke noe tastatur å snakke
om, og korte økter.

**Du:** begrenset programmeringserfaring. Maskinen din var tom for
utviklingsverktøy da vi begynte. Alt i prosjektet er valgt slik at du kan endre
det selv, også om to år, uten at noe må installeres eller oppdateres først.

## 3. Målet

To ting, og de er like viktige:

1. **De grunnleggende programmeringsbegrepene** – sekvens, funksjon, variabel,
   argument, hendelse, løkke, valg, tilstand.
2. **Hva som faktisk skal til for å lage et dataspill** – at noen har måttet lage
   hver eneste bit av alt han noen gang har spilt.

Sluttbildet: han har bygget et lite, ekte spill, og vet hvorfor hver del av det
finnes.

## 4. Valg du har tatt

Disse ligger fast med mindre du sier noe annet.

| Valg | Hva det betyr |
|---|---|
| **Vanlig HTML/CSS/JS i nettleser** | Ingen spillmotor, ingen Node, ingen npm, intet byggesteg. Endre fil → oppdater side. |
| **Trykk-og-bygg-editor** | Han trykker på ferdige kodebiter. Ingen skjermtastatur – men det som står på skjermen er ekte kode. |
| **Ekte JavaScript-syntaks, norske navn** | `function`, `var`, `if` beholdes. Alt vi navngir selv er norsk: `tegnMusepeker`, `fyllFarge`. |
| **GitHub Pages** | Han åpner en nettadresse i Chrome og legger den på startsiden. |
| **Én bit om gangen** | Aldri alt på en gang. Strekmann før kropp, kropp før utseende. |
| **Figuren kan ikke bevege seg ennå** | Med vilje. Bevegelse er en egen leksjon, ikke noe han får gratis. |

## 5. Bærende prinsipper

Disse har vokst fram underveis og har vist seg å bære godt:

* **Han ser resultatet før han får beskjed.** Koden kjøres alltid, også når den er
  feil. Først etterpå sier Bit noe.
* **Feil er ikke feil – det er neste hint.** Hver beskjed sier hva som faktisk
  skjedde og hvorfor. Aldri bare «prøv igjen».
* **Ordene kommer etter opplevelsen.** Han lager en hendelse først, og får vite at
  den heter «hendelse» etterpå.
* **Alt han lager blir værende.** Musepekeren fra kapittel 1 er den han bruker i
  kapittel 8.
* **Leksjonene gjentas i ny drakt.** Ikonet som ikke virker i kapittel 2 er samme
  leksjon som datamaskinen i kapittel 0 – og Bit sier det rett ut, slik at han
  kjenner den igjen selv.
* **Han skal kunne leke.** Gule verdier i koden kan trykkes på og blas gjennom, så
  han kan prøve seg fram uten å skrive noe.

## 6. Hva vi har gjort

### Kapittel 0 – Rommet
Tomt rom, bord, datamaskin. Han blir bedt om å trykke, og ingenting skjer.
Etter fjerde forsøk kommer beskjeden om at det mangler en musepeker.
**Lærer:** at noen må ha laget hver eneste bit.

### Kapittel 1 – Musepekeren
Han tegner en musepeker og kobler den til fingeren.
**Lærer:** sekvens, funksjon, parameter, koordinater, **hendelse**.

### Kapittel 2 – Skrivebordet
Kameraet zoomer inn i skjermen. Han bygger bakgrunn og programikon, og oppdager
at ikonet ikke gjør noe før han sier hva som skal skje når man trykker på det.
Til slutt åpner ikonet Kodeverkstedet 1.0.
**Lærer:** **variabel**, hendelse knyttet til én bestemt ting, rekkefølge.
**Etablerer:** fra nå av går all programmering via maskinen – trykk på
datamaskinen, trykk på ikonet, kod.

### Kapittel 3 – Figuren
Han koder inne i maskinen, men figuren dukker opp ute i rommet. Tre steg:
strekmann, så ordentlig kropp, så utseende (høyde, kroppsform, hårfarge,
frisyre, klesfarge).
**Lærer:** **argument** – å gi en funksjon noe å jobbe med. `tegnKropp(x, y)`
er en strek, `tegnKropp(x, y, kroppsform)` er en kropp.

### Motoren slik den står nå
To flater, `"rom"` og `"skjerm"`, begge med koordinatsystem 1000 × 700. Elevens
program lagres som data og tolkes – ikke `eval`. Alt et program lager merkes med
programmets navn, så ett program kan byttes ut uten at noe annet røres. Fremdrift
og alle programmene hans lagres i nettleseren og kjøres på nytt ved oppstart.

---

## 7. Hva vi skal gjøre

### Kapittel 4 – Menyen  ← neste

**Problemet det løser:** når en oppgave er ferdig, finnes det i dag ingen vei
tilbake for å leke med verdiene. Han kan gjøre figuren blond mens han holder på,
men ikke dagen etter.

**Løsningen:** han bygger en meny. Et nytt ikon på skrivebordet – *Figur* – som
åpner en skjerm med knapper: høyere, lavere, tykkere, tynnere, nytt hår.

```javascript
lagKnapp(200, 200, "Høyere");

nårManTrykkerPå("Høyere", function () {
  hoyde = "høy";
});
```

**Lærer:** at en variabel kan **endres** etterpå, ikke bare settes én gang. At en
meny bare er knapper som forandrer variabler – og at det er sånn alle
innstillingsskjermer i alle spill virker.

**Motoren må lære seg:** flate må bestemmes av *kodebiten*, ikke av programmet.
`lagKnapp` hører alltid hjemme på skjermen, `tegnKropp` alltid i rommet – og da
kan ett og samme program ha deler begge steder og dele variabler mellom dem.
Vi trenger også en kodebit for å tilordne en ny verdi (`hoyde = "høy";`), som er
noe annet enn å lage variabelen.

### Kapittel 5 – Tegneprogrammet

**Din idé:** et program på skrivebordet der man kan tegne enkle tegninger, som vi
siden bruker som grafikk i spillet.

Et nytt ikon – *Tegneboka* – åpner et rutenett han kan male i med fingeren, en
fargepalett, og et navn å lagre tegningen under. Selve tegneverktøyet er noe vi
gir ham, på samme måte som Kodeverkstedet 1.0. Det han bygger selv, er ikonet og
åpningen – slik han gjorde i kapittel 2.

Så kommer poenget. En ny kodebit:

```javascript
tegnBilde("blomst", 300, 520, 80);
```

Blomsten han nettopp tegnet står nå i rommet.

Og deretter avsløringen: Bit viser ham at tegningen hans **bare er en liste med
tall**. Hver rute er et tall, hvert tall er en farge. Koden leser den samme lista.

**Lærer:** koblingen mellom det visuelle og koden. At grafikk er data. At en
tegning og et program er laget av det samme stoffet.

**Åpent spørsmål til deg:** hvor stort rutenett? Jeg foreslår 16 × 16 – stort nok
til å tegne noe gjenkjennelig, lite nok til å fylle uten å gi opp, og stort nok
til at poenget om at det er tall bak blir håndfast.

### Kapittel 6 – Bevegelse

Nå får figuren endelig gå.

```javascript
hvertBilde(function () {
  if (gårTilHøyre) {
    figurX = figurX + 2;
  }
});
```

**Lærer:** **spilløkka** – at et spill tegner alt på nytt seksti ganger i
sekundet, og at bevegelse bare er en variabel som endrer seg litt for hvert
bilde. Dette er det største enkeltbegrepet i hele spillet, og det er derfor det
har fått vente.

**Og så knyttes kapittel 5 inn:** han tegner to bilder av figuren – ett med
venstre fot fram, ett med høyre – og bytter mellom dem mens hun går. Det er
animasjon, og han har laget begge bildene selv.

### Videre – skissen

Rekkefølgen er ikke spikret, og begrepene bestemmer den mer enn møblene gjør.

| Det han bygger | Begrepet det bærer |
|---|---|
| Lys som kan slås av og på | `if`/`else`, sant og usant |
| En stol å sitte på | kollisjon, tilstand |
| Et vindu å se ut av | lag og dybde |
| Flere ikoner på skrivebordet | **løkke** – gjør det samme for hver ting i en liste |
| Figuren blir sulten | variabler som endrer seg over tid, tid som begrep |
| En fiende | flere figurer, kollisjon som betyr noe |
| Poeng og mål | tilstand, vinne og tape – **et spill** |

---

## 8. Ting jeg vil at du skal bestemme

1. **Rutenettet i tegneprogrammet** – 16 × 16, eller noe annet?
2. **Hvor mange knapper i menyen** i kapittel 4? Jeg foreslår å begynne med to
   (høyere/lavere), la ham se at det virker, og så la ham legge til resten selv.
3. **Skal Bit ha en annen stemme etter hvert?** Han er ganske ivrig nå. Det
   passer for en tiåring som er fersk, men kan bli mye om et år.
4. **Har han prøvd det ennå?** Alt over er mine antagelser om hva som treffer.
   Ett kvarter med ham foran nettbrettet er verdt mer enn hele dette dokumentet.

## 9. Det jeg er usikker på

* **Tempoet.** Kapittel 3 har tre oppgaver. Det kan være én for mye i strekk.
* **Om paletten blir for full.** Den vokser for hvert kapittel. På et tidspunkt
  må kodebitene sorteres i grupper, eller så drukner han i valg.
* **Om han kommer til å ville lese koden i det hele tatt**, eller bare trykke til
  det virker. Begge deler er greit i starten – men leksjonene om rekkefølge er
  bygget på at han faktisk ser hva som står.

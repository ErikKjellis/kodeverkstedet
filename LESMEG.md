# Kodeverkstedet

Et programmeringsspill på norsk, laget for å spilles på nettbrett.

Man starter i et tomt rom med en datamaskin på et bord. Man blir bedt om å
trykke på den – men ingenting skjer. Det finnes jo ingen musepeker. Så lager
man en. Og slik bygges spillet, bit for bit, mens man spiller det.

---

## Hva du trenger

| Programvare | Hva den brukes til | Hvor |
|---|---|---|
| **Visual Studio Code** | redigere filene | https://code.visualstudio.com/ |
| **Git for Windows** | legge spillet ut på nett | https://git-scm.com/download/win |
| **GitHub-konto** | gratis nettadresse til spillet | https://github.com/signup |
| **Edge eller Chrome på PC** | teste mens du lager | allerede installert |
| **Chrome på nettbrettet** | spille | allerede installert |

**Ingen andre avhengigheter.** Ikke Node, ikke npm, ikke noe rammeverk, ingen
spillmotor, intet byggesteg. Spillet er bare tekstfiler nettleseren leser direkte.

---

## Kjøre spillet på PC-en mens du lager

Dobbeltklikk på **`index.html`**. Det er alt.

Har du endret en fil, trykker du `Ctrl + F5` i nettleseren for å laste på nytt.

Trykk `F12` for utviklerverktøyene. Der finner du:

* **Console** – feilmeldinger havner her hvis noe er galt i koden
* **Toggle device toolbar** (ikonet med telefon og nettbrett) – lar deg teste
  hvordan spillet ser ut på en nettbrettskjerm med berøring

### Starte spillet helt forfra

Fremdriften lagres i nettleseren. For å nullstille, skriv dette i Console (`F12`):

```
nullstillSpillet()
```

---

## Legge spillet ut på nett (GitHub Pages)

Gjør dette **én gang**:

1. Lag et nytt, **offentlig** repository på https://github.com/new.
   Kall det for eksempel `kodeverkstedet`. Ikke huk av for noe ekstra.

2. Fortell Git hvem du er (bare første gang på maskinen):

```bash
git config --global user.name "Ditt Navn"
```

```bash
git config --global user.email "din@epost.no"
```

3. Stå i prosjektmappen og kjør:

```bash
git init -b main
```

```bash
git add .
```

```bash
git commit -m "Kodeverkstedet - kapittel 0 og 1"
```

```bash
git remote add origin https://github.com/BRUKERNAVN/kodeverkstedet.git
```

```bash
git push -u origin main
```

Bytt ut `BRUKERNAVN` med ditt eget GitHub-brukernavn.

4. På GitHub: gå til repoet → **Settings** → **Pages** →
   under *Build and deployment*, velg **Deploy from a branch**,
   branch **main**, mappe **/ (root)** → **Save**.

5. Etter et par minutter ligger spillet på:

```
https://BRUKERNAVN.github.io/kodeverkstedet/
```

### Senere, når du har endret noe

```bash
git add .
```

```bash
git commit -m "Kort beskrivelse av det du endret"
```

```bash
git push
```

Endringen er på nett etter et halvt minutt eller så.

---

## På nettbrettet

1. Åpne adressen i Chrome.
2. Trykk på de tre prikkene oppe til høyre → **Legg til på startsiden**.
3. Nå ligger spillet som et ikon sammen med appene hans, og åpner seg i
   fullskjerm uten adresselinje.

**Hvis du ikke vil bruke GitHub:** kopier hele mappen over til nettbrettet med
USB-kabel eller Google Drive, og åpne `index.html` med en filbehandler. Spillet
virker like godt – men du må kopiere på nytt hver gang du endrer noe.

---

## Hvordan spillet er satt sammen

```
index.html                      starter alt
css/stil.css                    utseende
js/
  tegning.js                    canvas og tegning
  effekter.js                   konfetti og trykk-ringer
  input.js                      finger og mus
  verden.js                     rommet, møblene, elevens tegnelag
  skjerm.js                     verdenen inne i datamaskinen
  figur.js                      personen: mål, kroppsdeler og utseende
  knapper.js                    menyknappene i rommet
  dialog.js                     Bit som snakker, og banneret nederst
  fremdrift.js                  lagring i nettleseren
  api.js                        ALLE kodebitene eleven kan bruke
  kjorer.js                     kjører elevens program
  kodeeditor.js                 programmeringsvinduet
  kapitler.js                   kapittelmotoren + hjelpere til oppgavesjekk
  kapitler/
    kapittel00-rommet.js        det tomme rommet
    kapittel01-musepeker.js     musepekeren
    kapittel02-skrivebordet.js  skrivebordet inne i maskinen
    kapittel03-figuren.js       personen som bor i rommet
    kapittel04-menyen.js        knapper som endrer figuren
    kapittel05-bevegelse.js     figuren går, og knappene styrer den
```

### To steder å være

Spillet har **to flater**: `"rom"` og `"skjerm"`. Rommet er der møblene står.
Skjermen er verdenen inne i datamaskinen, og har sitt eget koordinatsystem på
1000 x 700 – akkurat som rommet.

Det er det samme bildet uansett hvor man er. Når man trykker på datamaskinen,
vokser skjermen ut over hele nettbrettet. Når man går ut igjen, krymper den ned
i monitoren på bordet – og da ser man skrivebordet sitt i miniatyr der.

En oppgave sier hvilken flate den hører til med `flate: "skjerm"`. Alt programmet
lager – tegninger, ikoner, hendelser – havner der.

**Fra og med kapittel 2 er dette veien til all programmering:** trykk på
datamaskinen, trykk på ikonet, kod. Et kodesteg som skal gå den veien, merkes
med `viaMaskinen: true`. Lager oppgaven noe som hører hjemme i rommet, trekker
kameraet seg automatisk ut av maskinen når han kjører koden – så han ser det
skje der ute.

### Figuren

Personen bygges av fire deler som hver har sin egen kodelinje. Delene må bli
enige om målene – en høy figur har jo hodet lenger opp enn en lav – så de deler
på **én felles lapp** med opplysninger (`figur.js`). Lappen fylles ut mens koden
leses, og selve tegningen skjer etterpå. Derfor spiller det ingen rolle hvilken
rekkefølge han skriver delene i.

Trikset som bærer hele kapittelet: **gir han en del mer å jobbe med, gjør den
mer.** `tegnKropp(x, y)` blir en strek. `tegnKropp(x, y, kroppsform)` blir en
ordentlig kropp. Samme funksjon, mer å gå på.

### Hvordan elevens kode virker

Programmet han bygger er **ikke tekst som kjøres med `eval`**. Det er en liste
med kodelinjer (helt vanlige objekter), og `kjorer.js` går gjennom lista og
kaller riktig funksjon fra `api.js`. Det er trygt, og det er grunnen til at
spillet kan gi hyggelige norske beskjeder i stedet for tekniske feilmeldinger.

Alt et program lager – tegninger og hendelser – merkes med programmets navn
(`installasjonsId`). Når han går videre til neste steg, byttes hele programmet
ut uten at noe annet i rommet blir rørt.

---

## Lage et nytt kapittel

1. Kopier `js/kapitler/kapittel01-musepeker.js` til
   `js/kapitler/kapittel02-navn.js`.
2. Legg til en linje i `index.html` som laster den nye filen – **etter** de
   andre kapitlene.
3. Bytt ut innholdet. Et kapittel er en liste med steg:

```javascript
Kapitler.leggTil({
  id: "stol",
  tittel: "Stolen",
  steg: [
    { type: "dialog", linjer: ["Han trenger noe å sitte på."] },
    { type: "kode",   oppgave: minOppgave },
    { type: "egen",   start: function (neste) { /* du styrer selv */ } }
  ]
});
```

En **oppgave** ser slik ut:

```javascript
{
  id: "stol-bygg",              // unik, brukes til å lagre utkastet hans
  installasjonsId: "stol",      // programmer med samme id erstatter hverandre
  tittel: "Bygg en stol",
  instruks: "Forklaringen som står øverst i vinduet.",
  flate: "skjerm",              // "rom" eller "skjerm"
  valgtVedStart: "forste",      // "forste", "siste" eller utelatt
  startProgram: function () { return [ /* kodelinjer som står der fra før */ ]; },
  palett: [ /* kodebitene han kan velge mellom */ ],
  hint: [ "Vises ett om gangen når han trykker på Hint." ],
  sjekk: function (program) {
    // returner { ok: false, melding: "..." }  eller  { ok: true, ros: "..." }
  },
  bekreftIVerden: {             // valgfritt: han må prøve før feiringen
    instruks: "Trykk på knappen din! 👆",
    sjekk: function () { return /* har han gjort det? */ true; },
    pause: 900                  // millisekunder å se resultatet i
  }
}
```

`seTid` (millisekunder) gir ham tid til å se på før Bit sier noe – nyttig når
det som skjer tar litt tid, som en figur som går. Standard er 750.

`instruks` og `palett` kan også være **funksjoner**. Da regnes de ut når vinduet
åpnes, og oppgaven kan ta hensyn til det han har laget tidligere (kapittel 4
bruker det til å velge hvilken knapp han skal lage først).

### La ham prøve før Bit forklarer

Noen feil forstår man best ved å prøve dem. Da returnerer `sjekk` en
`provForst` i tillegg til meldingen:

```javascript
return {
  ok: false,
  provForst: {
    instruks: "Trykk på «Lav» i menyen! 👆",
    forbered: Knapper.nullstillTrykk,
    sjekk: function () { return Knapper.antallTrykk("Lav") > 0; }
  },
  melding: ["Du trykket – og ingenting skjedde. Men noe skjedde faktisk!"]
};
```

Banneret ber ham prøve, Bit er stille, og først når han har trykket – og selv
sett at ingenting skjer – kommer forklaringen.

Trenger kapittelet en kodebit som ikke finnes ennå, legger du den til i
`js/api.js`. Kopier en av de som står der, og bytt ut `html` (hvordan koden ser
ut) og `kjor` (hva som faktisk skjer).

### Verdier han kan trykke på

Gir du en verdi i en kodebit en `valg`-liste, blir den til en gul knapp han kan
bla gjennom rett i koden:

```javascript
farge: { k: "tekst", v: "blå", valg: ["blå", "grønn", "lilla"] }
```

Det er slik han kan endre farger, plasseringer og navn uten å taste noe. Bruk
det mye – det er den billigste måten å gi ham noe å leke med på.

### Regnestykker

En verdi kan være et lite regnestykke. Begge sider kan ha sine egne gule verdier:

```javascript
verdi: { k: "regn", a: { k: "var", v: "figurX" }, op: "-", b: { k: "tall", v: 20, valg: [10, 20, 50] } }
```

### Spilløkka og maling

`hvertBilde(function () { ... })` kjøres nøyaktig seksti ganger i sekundet, uansett
hvor fort skjermen til nettbrettet tegner.

Det som tegnes, blir stående til noen visker det ut – også inni hendelser og
spilløkka. **Eneste unntak er musepekeren** (`nårFingerenFlytterSeg`), som visker
ut sitt eget forrige bilde av seg selv. Det er med vilje: glemmer han `viskUt()`
i spilløkka, skal han få se figuren bli til en orm.

### Hjelpere til oppgavesjekker

`Kode` i `js/kapitler.js` har ferdige hjelpere som går igjen fra kapittel til
kapittel: `alleLinjer`, `finnVariabel`, `knappenavn`, `hendelse`,
`hendelseHvorSomHelst`, `utvid` (legger innholdet i egne hjelpefunksjoner inn i
steget som kaller dem) og `indeksI`. Se `kapittel05-bevegelse.js` for bruk.

### Test med ekte trykk

Test med ekte museklikk eller fingertrykk, ikke med `element.click()` fra
konsollen. Programmerte klikk hopper over at knappen trykkes ned og slippes, og
det var nettopp der den første store feilen satt: trykk-effekten flyttet knappen,
og knappen gled bort fra musepekeren før man slapp.

Av samme grunn: **trykk-effekter i CSS skal aldri flytte noe** (ingen
`transform` på `:active`). Bruk farge eller skygge.

---

## Prinsipper spillet er bygget på

* **Han skal se resultatet før han får beskjed.** Koden kjøres alltid, også når
  den er feil. Først etterpå sier Bit noe.
* **Feil er ikke feil, det er neste hint.** Hver beskjed sier hva som faktisk
  skjedde, og hvorfor – aldri bare «prøv igjen».
* **Ordene kommer etter opplevelsen.** Han lager en hendelse først, og får vite
  at den heter «hendelse» etterpå.
* **Alt han lager blir værende.** Musepekeren han bygget i kapittel 1 er den
  han bruker i kapittel 8.

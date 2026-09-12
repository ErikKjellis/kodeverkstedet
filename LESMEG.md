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
  dialog.js                     Bit som snakker, og banneret nederst
  fremdrift.js                  lagring i nettleseren
  api.js                        ALLE kodebitene eleven kan bruke
  kjorer.js                     kjører elevens program
  kodeeditor.js                 programmeringsvinduet
  kapitler.js                   kapittelmotoren + hjelpere til oppgavesjekk
  kapitler/
    kapittel00-rommet.js        det tomme rommet
    kapittel01-musepeker.js     musepekeren
```

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
  valgtVedStart: "forste",      // "forste", "siste" eller utelatt
  startProgram: function () { return [ /* kodelinjer som står der fra før */ ]; },
  palett: [ /* kodebitene han kan velge mellom */ ],
  hint: [ "Vises ett om gangen når han trykker på Hint." ],
  sjekk: function (program) {
    // returner { ok: false, melding: "..." }  eller  { ok: true, ros: "..." }
  }
}
```

Trenger kapittelet en kodebit som ikke finnes ennå, legger du den til i
`js/api.js`. Kopier en av de som står der, og bytt ut `html` (hvordan koden ser
ut) og `kjor` (hva som faktisk skjer).

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

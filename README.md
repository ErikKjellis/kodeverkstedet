# Kodeverkstedet

Et programmeringsspill på norsk, laget til en tiåring med et nettbrett.

---

Du kommer inn i et tomt rom. Det står en datamaskin på et bord.

> 🤖 **Hei! Dette er et programmeringsspill. Trykk på datamaskinen for å begynne.**

Du trykker på datamaskinen. Ingenting skjer.

Du trykker igjen. Fortsatt ingenting.

> 🤖 **Oi. Vi trenger visst en musepeker for å kunne klikke på noe.**
> **Det finnes ingen her ennå. Ingen har laget den.**
> **Men det kan vi fikse – vi lager en selv!**

Og det er hele spillet.

---

## Ideen

De fleste spill som skal lære barn å programmere gir deg en ferdig verden og ber
deg flytte en figur rundt i den. Dette spillet gjør det motsatte: **verden er tom,
og alt som finnes i den må spilleren bygge selv.**

Musepekeren virker fordi han programmerte den. Datamaskinen kan slås på fordi han
lagde noe å trykke med. Personen i rommet står der fordi han satte henne sammen av
fire deler. Ingenting er gitt.

Målet er todelt: lære de grunnleggende programmeringsbegrepene, og forstå hva som
faktisk skal til for å lage et dataspill.

## Slik ser koden ut

Spilleren har ikke tastatur – bare en berøringsskjerm. Han **trykker på ferdige
kodebiter** i en palett, og de settes inn som ekte kodetekst:

```javascript
var kroppsform = "tynn";

function tegnFigur(x, y) {
  tegnBein(x, y, hoyde);
  tegnKropp(x, y, kroppsform);
  tegnArmer(x, y);
  tegnHode(x, y, harfarge, kjonn);
}

tegnFigur(810, 560);
```

Nøkkelordene er ekte JavaScript. Alt vi navngir selv er norsk. De gule verdiene
kan han trykke på og bla gjennom, så han kan prøve seg fram uten å skrive et
eneste tegn.

## Hva han lærer

| Kapittel | Han bygger | Han lærer |
|---|---|---|
| 0 · Rommet | ingenting – klikk som ikke virker | at noen må lage hver eneste bit |
| 1 · Musepekeren | en musepeker som følger fingeren | sekvens, funksjon, parameter, koordinater, **hendelse** |
| 2 · Skrivebordet | bakgrunn og programikon inne i maskinen | **variabel**, hendelse på én bestemt ting, rekkefølge |
| 3 · Figuren | en person, fra strekmann til ferdig utseende | **argument** – å gi en funksjon noe å jobbe med |
| 4 · Menyen | knapper i rommet som endrer figuren | å **endre** en variabel, og å **viske ut og tegne på nytt** |
| 5 · Bevegelse | en figur som går, og knapper som styrer den | **spilløkka** – seksti ganger i sekundet, og å regne med variabler |
| 6 · Lagring | en Lagre-knapp, og at spillet henter det lagrede når det starter | at programmer **glemmer**, å lagre og hente, standardverdi |
| 7 · Veggen | vegger figuren ikke kan gå gjennom | **`if`** – et spørsmål i koden, og forskjellen på `<` og `>` |

Når alle kapitlene er spilt, blir Kodeverkstedet et fritt verktøy: han velger et
av programmene sine og endrer det som han vil, med alle kodebitene han har lært.

Begrepene kommer alltid *etter* at han har sett dem virke. Han lager en hendelse
først, og får vite at den heter «hendelse» etterpå.

## Prøv det

Spillet ligger på **https://ErikKjellis.github.io/kodeverkstedet/**

Åpne adressen i Chrome på nettbrettet, og legg den til på startsiden – da får du
et appikon og fullskjerm uten adresselinje.

På PC virker det like godt. Merk at det ikke finnes noen musepeker før du har
laget en, heller ikke der. Det er meningen.

## Kjøre det selv

Last ned mappen og **dobbeltklikk på `index.html`**. Det er alt.

Ingen installasjon, ingen kompilering, ingen `npm install`. Spillet er ren
HTML, CSS og JavaScript med vanlige `<script>`-tagger, så nettleseren leser
filene direkte fra disk.

Vil du starte forfra, skriv `nullstillSpillet()` i konsollen (`F12`).

## Ingen avhengigheter

Med vilje. Ikke Node, ikke npm, ikke React, ikke Phaser, ingen spillmotor, intet
byggesteg. Prosjektet er skrevet av en forelder med begrenset
programmeringserfaring, og skal fortsatt kunne endres om to år uten at noe må
oppdateres først.

Én fil endres, nettleseren lastes på nytt, ferdig.

## Hvordan det virker

Programmet spilleren bygger er **ikke tekst som kjøres med `eval`**. Det er en
liste med kodelinjer som vanlige objekter, og `js/kjorer.js` går gjennom lista og
kaller riktig funksjon. Det er trygt, og det er grunnen til at spillet kan svare
med

> 🤖 **Du har valgt en farge – fin farge! Men datamaskinen vet fortsatt ikke HVA
> den skal tegne.**

i stedet for `TypeError: undefined is not a function`.

Alt han lager blir værende. Musepekeren fra kapittel 1 er den samme han bruker i
kapittel 8.

## Mer

* **[LESMEG.md](LESMEG.md)** – utviklerhåndbok: oppsett, publisering til GitHub
  Pages, og hvordan man lager nye kapitler og kodebiter
* **[project_understanding.md](project_understanding.md)** – hva prosjektet er,
  hvilke valg som er tatt, og hva som kommer

## Lisens

Laget til én bestemt tiåring. Ta den gjerne, endre navnene, og lag den om til
ditt eget barns spill.

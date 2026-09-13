# Kodeverkstedet – forståelse og plan

Dette dokumentet er min forståelse av hva vi holder på med, hvilke valg du har
tatt, hva som er bygget, og hva som står for tur. **Planen er styrt av dine valg.**
Der jeg foreslår noe på egen hånd, står det uttrykkelig.

Sist oppdatert: 13. september 2026 (etter kapittel 7).

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
| **All programmering går via datamaskinen** | Trykk på maskinen, trykk på ikonet, kod. |
| **Figuren kan ikke bevege seg før vi lærer det** | Bevegelse er en egen leksjon, ikke noe han får gratis. |
| **Rekkefølgen: meny, så bevegelse** | Menyen først, deretter bevegelse. Tegneprogrammet kommer etter det. |
| **Styring med knapper først** | Figuren styres med knapper i menyen. Å dra med fingeren kan komme senere. |
| **Lagreknappen programmerer han selv** | Ikke en ferdig knapp: han oppdager at spillet glemmer, og lager lagring og henting. |
| **Veggen før tegneprogrammet** | Meny, bevegelse, lagring, vegg – så tegneprogram og animasjon. |
| **Tegneprogrammet** | Et program på skrivebordet der han tegner enkle tegninger, som senere blir grafikk og animasjon i spillet. |
| **16 × 16 i tegneprogrammet** | Til å begynne med. Vi ser om det er avansert nok når han har prøvd. |

## 5. Bærende prinsipper

Disse har vokst fram underveis og har vist seg å bære godt:

* **Han ser resultatet før han får beskjed.** Koden kjøres alltid, også når den er
  feil. Fra kapittel 4 går vi et steg lenger: når en feil best forstås ved å prøve
  den, ber Bit ham trykke selv først – og forklarer først etter at han har *sett*
  at ingenting skjer.
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
* **Det han ser, må bære leksjonen.** Er den visuelle effekten svak, blir
  leksjonen borte – selv om koden er riktig. Kapittel 4 byttet rekkefølge på
  knappene av akkurat den grunnen.

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

### Kapittel 4 – Menyen
Han bygger en meny med knapper som endrer figuren. To oppgaver:

**Én knapp.** Hele leksjonen ligger her, og han får prøve hvert steg selv:

```javascript
lagKnapp("Lav");

nårManTrykkerPå("Lav", function () {
  hoyde = "lav";
  viskUt();
  tegnFigur(810, 560);
});
```

1. Han endrer variabelen og trykker. **Ingenting skjer.** Bit forklarer at
   variabelen faktisk *ble* endret – men skjermen forandrer seg aldri av seg selv.
2. Han tegner figuren på nytt og trykker. **Figuren får to hoder.** Den gamle ble
   aldri visket ut; en datamaskin maler bare oppå det som er der fra før.
3. Med `viskUt()` først virker det.

**Resten av menyen.** Samme mønster igjen: høy, lav og hårfarger. Bit peker på at
de samme to linjene går igjen i hver knapp, og tilbyr en snarvei –
`function tegnPåNytt()`. Frivillig, men rost om han tar den.

**Lærer:** å **endre** en variabel, ikke bare lage den. Å **viske ut og tegne på
nytt** – som er selve grunnlaget for bevegelse i neste kapittel.

**Mine valg underveis, som avviker fra forrige versjon av planen:**
* **Menyen ligger i rommet, ikke inne i maskinen.** Han må *se* figuren mens han
  trykker – ellers er det ingen vits. Han programmerer den fortsatt inne i
  maskinen, akkurat som figuren. Menyer i ekte spill ligger også oppå
  spillverdenen.
* **Knappene heter «Høy» og «Lav», ikke «Høyere» og «Lavere».** «Høyere» betyr
  «litt mer enn nå», og det krever `if` eller regning, som ikke er lært ennå.
* **Første knapp er «Lav».** Glemmer han `viskUt()`, tegnes en *mindre* figur oppå
  den gamle, og det gamle hodet stikker opp over – to hoder, umulig å ta feil av.
  Andre veien skjuler den nye, store figuren nesten hele den gamle, og leksjonen
  forsvinner.
* **Menyvalg lagres ikke** – i kapittel 4. Laster han spillet på nytt, er figuren tilbake slik
  koden sier. Det er slik ekte programmer virker også; å lagre er et eget begrep,
  og det lærer han i kapittel 6.

### Rettet etter din første testing
* Palettknapper lot seg ikke velge med mus. Trykk-effekten flyttet knappen 2
  piksler, paletten ble rullbar, og knappene hoppet bort fra musepekeren.
* Knappen i Bits beskjeder sa «Prøv igjen» på hver linje, også når det kom mer.
* Kapittel 2 stoppet helt når man trykket på datamaskinen – to trykk-lyttere
  slåss om samme trykk.
* Figuren ble tegnet oppå skrivebordet når man zoomet inn i maskinen.

**Lærdom:** jeg testet med programmerte klikk, og de hopper over nettopp det som
gikk galt. Nå tester jeg med ekte museklikk der det betyr noe.

### Kapittel 5 – Bevegelse
Figuren får endelig gå, og han styrer den med knapper i menyen. Tre oppgaver,
én ny idé i hver:

**Ett steg.** En «Venstre»-knapp flytter figuren 20 punkter per trykk.
`figurX = figurX - 20` ser rart ut første gang – Bit forklarer at det betyr
«ta tallet i esken, trekk fra 20, legg svaret tilbake». Glemmer han `viskUt()`,
får han en hel rekke med figurer.

**Hvert bilde.** Å trykke hundre ganger er slitsomt, så datamaskinen gjør det for
ham – seksti ganger i sekundet:

```javascript
hvertBilde(function () {
  figurX = figurX - 2;
  viskUt();
  tegnFigur(figurX, 560);
});
```

Figuren går av seg selv, foran bordet og rett ut av rommet. Glemmer han
`viskUt()` her, blir figuren til en lang orm – seksti nye figurer i sekundet.

**Styr den.** Knappene flytter ikke lenger figuren; de setter bare `fart`, og
spilløkka gjør resten: `figurX = figurX + fart`. Høyre er 3, Stopp er 0,
Venstre er −3.

**Lærer:** **spilløkka**, å regne med variabler, og at én variabel (farten) kan
styre en annen (plassen) hvert eneste bilde.

**Mine valg underveis:**
* **Bit bytter ut tallet 810 med `figurX` overalt i koden hans** før første
  oppgave, og sier det rett ut. Ellers ville de gamle menyknappene fra kapittel 4
  kastet figuren tilbake til 810 hver gang han trykket – en ekte feil, men ikke
  dette kapittelets leksjon.
* **«Venstre» først.** Figuren står helt til høyre, så det er der det er plass å gå.
* **Spillet visker ikke lenger ut i det skjulte.** Før visket motoren stille ut
  det en hendelse tegnet sist, før den tegnet på nytt. Da ville spilløkka sett
  riktig ut *uten* `viskUt()`, og leksjonen fra kapittel 4 ville vært juks. Nå
  gjelder malingsregelen for alt – bortsett fra musepekeren, som er en ting som
  følger fingeren og kom lenge før han lærte `viskUt()`.
* **Venstre-knappen får beholde hoppet** fra første oppgave når den får fart.
  Den hopper 20 og begynner å gå. Det er ikke pent, men det er hans kode, og det
  virker.

### Kodeverkstedet – fri lek
**Rettet etter din testing:** etter siste kapittel åpnet Kode-ikonet bare et bilde
av et program. Nå åpner det en liste over programmene hans – Musepekeren,
Skrivebordet og Figuren. Han velger ett, endrer det som han vil, og trykker Kjør.
Ingen sjekk, ingen feiring. «Lukk» går ut uten å kjøre.

Paletten har akkurat det han har lært: hvert kapittel melder inn sine kodebiter.
Skrivebordet er beskyttet – sletter han veien inn til Kodeverkstedet, sier Bit nei
før koden gjelder, så han ikke låser seg ute av sin egen kode.

Fri lek åpner seg bare når alle kapitlene som finnes er spilt. Kommer det nye
kapitler, fortsetter spillet der.

### Kapittel 6 – Lagring
**Ditt valg:** han programmerer lagreknappen selv.

Han leker med figuren – og så startes spillet på nytt, med et kort svart blink
som når nettbrettet slås av og på. Alt er glemt. Variabler lever bare så lenge
programmet kjører.

**Lagre-knappen.** `lagre("hoyde", hoyde);` for høyde, hårfarge og plass. Det
teller ikke å lagre en figur han ikke har endret. Spillet startes på nytt igjen –
og alt er *fortsatt* glemt.

**Hent det tilbake.** Det lagrede ligger trygt, men ingen har sagt at spillet skal
hente det. Helt ytterst i koden:

```javascript
hoyde = hentLagret("hoyde", hoyde);
```

Legger han hentingen i spilløkka, forklarer Bit at menyen da slutter å virke –
det gamle hentes seksti ganger i sekundet.

**Lærer:** at programmer glemmer, å lagre, å hente, og **standardverdi**.

Det lagrede overlever at nettleseren lukkes helt – det er testet med ekte
omlasting. Merk at spillet fra en fil på PC-en og spillet på GitHub Pages har hver
sin lagring.

### Kapittel 7 – Veggen
**Ditt valg:** veggen før tegneprogrammet.

Rommet har fått synlige sidevegger. Figuren går rett gjennom dem – til han lærer
den noe annet.

**Venstre vegg.** Hans første `if`, inni spilløkka:

```javascript
if (figurX < 110) {
  figurX = 110;
}
```

Markøren står allerede på riktig sted i spilløkka. Mangler noe, får han først
prøve å gå inn i veggen – og se at figuren går rett gjennom – før Bit forklarer.

**Høyre vegg.** Samme mønster, men kodebiten kommer med vilje med feil tegn: `<`.
Han må selv tenke over at høyre vegg spør «større enn». Med feil tegn sitter
figuren fast ved veggen når han prøver å gå bort fra den.

**Lærer:** **`if`** – et spørsmål i koden, og at et program kan ta valg. Og
forskjellen på `<` og `>`.

### Motoren slik den står nå
To flater, `"rom"` og `"skjerm"`, begge med koordinatsystem 1000 × 700. Elevens
program lagres som data og tolkes – ikke `eval`. Alt et program lager merkes med
programmets navn, så ett program kan byttes ut uten at noe annet røres. Fremdrift
og alle programmene hans lagres i nettleseren og kjøres på nytt ved oppstart.

Menyknapper er *ting* som blir stående, mens tegninger er *maling* som `viskUt()`
fjerner. Musepekeren tegnes alltid øverst. En oppgave kan be ham prøve først
(`provForst`), gi ham tid til å se på før Bit sier noe (`seTid`), peke ut nøyaktig
hvor markøren skal starte, og regne ut palett og instruks ut fra det han har laget
tidligere. I editoren kan man trykke på en `});` for å sette inn *under* en blokk.

`hvertBilde` kjøres nøyaktig seksti ganger i sekundet. Verdier kan være små
regnestykker (`figurX + fart`) eller hentede verdier (`hentLagret(...)`). Kodebiten
`if` har et trykkbart sammenligningstegn. Felles hjelpere til oppgavesjekkene ligger
i `Kode` i `js/kapitler.js`, og kodebitene til fri lek meldes inn i `Verksted`.

---

## 7. Hva vi skal gjøre

### Kapittel 8 – Tegneprogrammet  ← neste

**Din idé:** et program på skrivebordet der man kan tegne enkle tegninger, som vi
siden bruker som grafikk i spillet.

Et nytt ikon – *Tegneboka* – åpner et **16 × 16** rutenett han kan male i med
fingeren, en fargepalett, og et navn å lagre tegningen under. Selve
tegneverktøyet er noe vi gir ham, på samme måte som Kodeverkstedet. Det han
bygger selv, er ikonet og åpningen – slik han gjorde i kapittel 2.

Så kommer poenget. En ny kodebit:

```javascript
tegnBilde("blomst", 300, 520, 80);
```

Blomsten han nettopp tegnet står nå i rommet.

Og deretter avsløringen: Bit viser ham at tegningen hans **bare er en liste med
tall**. Hver rute er et tall, hvert tall er en farge. Koden leser den samme lista.

**Lærer:** koblingen mellom det visuelle og koden. At grafikk er data. At en
tegning og et program er laget av det samme stoffet.

**Bygger på kapittel 2 og 6:** han har allerede laget et ikon som åpner et
program, og han vet at ting kan lagres under et navn. En tegning er bare en ny
slags lapp.

**Motoren må lære seg:** en egen skjerm for tegneverktøyet inne i maskinen (ikke
kodeeditoren), lagring av tegninger under et navn, og en måte å vise lista med
tall på som en tiåring faktisk kan lese. Verkstedlista må også kunne åpne
Tegneboka.

### Kapittel 9 – Animasjon

Her møtes bevegelse og tegneprogrammet. Han tegner to bilder av figuren i
Tegneboka – ett med venstre fot fram, ett med høyre – og bytter mellom dem i
spilløkka mens figuren går. Det er animasjon, og han har laget begge bildene
selv.

**Lærer:** at animasjon bare er bilder som byttes fort nok. At det han tegner og
det han koder henger sammen. Og trolig `if`/`else` for å velge bilde – som han
nå har et godt grunnlag for.

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

1. **Hvor mye av Tegneboka skal han bygge selv?** Planen er at han bygger ikonet
   og åpningen, mens selve tegneverktøyet er gitt. Det alternative er at han også
   bygger en enkel versjon av rutenettet – mer lærerikt, men et mye lengre
   kapittel.
2. **Skal Bit ha en annen stemme etter hvert?** Han er ganske ivrig nå. Det
   passer for en tiåring som er fersk, men kan bli mye om et år.
3. **Hvordan gikk det da han prøvde?** Alt over er fortsatt mine antagelser om hva
   som treffer. Ett kvarter med ham foran nettbrettet er verdt mer enn hele dette
   dokumentet – og særlig tempoet trenger det.

## 9. Det jeg er usikker på

* **Tempoet.** Kapittel 3, 5 og 6 har flere oppgaver hver. Det kan være mye i
  strekk for én økt.
* **Om paletten blir for full.** I fri lek har Figuren nå over tretti kodebiter.
  Den trenger trolig grupper (Utseende, Meny, Bevegelse, Lagring, Vegger).
* **Om koden blir for lang å bla i.** Figurprogrammet hans er nå godt over femti
  linjer. På et nettbrett betyr det mye rulling. Lukkbare blokker, som kan foldes
  sammen, er trolig det neste editoren trenger.
* **Om menyen blir for rotete.** Knappene står i den rekkefølgen koden lager dem,
  så «Lagre» og «Stopp» havner hulter til bulter. Grupper av knapper er en mulig
  senere forbedring.
* **Om han kommer til å ville lese koden i det hele tatt**, eller bare trykke til
  det virker. Begge deler er greit i starten – men leksjonene om rekkefølge og
  tegn er bygget på at han faktisk ser hva som står.

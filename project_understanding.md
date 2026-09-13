# Kodeverkstedet – forståelse og plan

Dette dokumentet er min forståelse av hva vi holder på med, hvilke valg du har
tatt, hva som er bygget, og hva som står for tur. **Planen er styrt av dine valg.**
Der jeg foreslår noe på egen hånd, står det uttrykkelig.

Sist oppdatert: 13. september 2026 (etter kapittel 4).

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
* **Menyvalg lagres ikke.** Laster han spillet på nytt, er figuren tilbake slik
  koden sier. Det er slik ekte programmer virker også; å lagre er et eget begrep.

### Rettet etter din første testing
* Palettknapper lot seg ikke velge med mus. Trykk-effekten flyttet knappen 2
  piksler, paletten ble rullbar, og knappene hoppet bort fra musepekeren.
* Knappen i Bits beskjeder sa «Prøv igjen» på hver linje, også når det kom mer.
* Kapittel 2 stoppet helt når man trykket på datamaskinen – to trykk-lyttere
  slåss om samme trykk.
* Figuren ble tegnet oppå skrivebordet når man zoomet inn i maskinen.

**Lærdom:** jeg testet med programmerte klikk, og de hopper over nettopp det som
gikk galt. Nå tester jeg med ekte museklikk der det betyr noe.

### Motoren slik den står nå
To flater, `"rom"` og `"skjerm"`, begge med koordinatsystem 1000 × 700. Elevens
program lagres som data og tolkes – ikke `eval`. Alt et program lager merkes med
programmets navn, så ett program kan byttes ut uten at noe annet røres. Fremdrift
og alle programmene hans lagres i nettleseren og kjøres på nytt ved oppstart.

Nytt i kapittel 4: menyknapper er *ting* som blir stående, mens tegninger er
*maling* som `viskUt()` fjerner. Musepekeren tegnes alltid øverst. En oppgave kan
be ham prøve først (`provForst`), og regne ut palett og instruks ut fra det han
har laget tidligere. I editoren kan man trykke på en `});` for å sette inn *under*
en blokk i stedet for inni.

---

## 7. Hva vi skal gjøre

### Kapittel 5 – Bevegelse  ← neste

Nå får figuren endelig gå.

```javascript
hvertBilde(function () {
  figurX = figurX + 2;
  viskUt();
  tegnFigur(figurX, 560);
});
```

**Lærer:** **spilløkka** – at et spill tegner alt på nytt seksti ganger i
sekundet, og at bevegelse bare er en variabel som endrer seg litt for hvert bilde.

**Bygger direkte på kapittel 4.** Menyknappen gjorde tre ting én gang: endret en
variabel, visket ut, tegnet på nytt. Spilløkka gjør *nøyaktig det samme* – bare
seksti ganger i sekundet. Det er hele hemmeligheten, og han har allerede gjort
den med egne hender. Bit har lovet ham det i slutten av kapittel 4.

**Motoren må lære seg:** en hendelse som kjøres for hvert bilde, og at `x` i
`tegnFigur` kan være en variabel som endrer seg. Figuren står i dag fast på
(810, 560).

**Åpne spørsmål, avgjøres når vi kommer dit:**
* Hvordan styrer han? Knapper i menyen («gå til venstre»/«gå til høyre») bygger
  videre på det han kan. Å dra med fingeren er mer naturlig på nettbrett, men et
  nytt begrep.
* Hva skjer ved kanten av rommet? Første `if` kan komme helt naturlig her: *hvis*
  figuren er ved veggen, stopp.

### Kapittel 6 – Tegneprogrammet

**Din idé:** et program på skrivebordet der man kan tegne enkle tegninger, som vi
siden bruker som grafikk i spillet.

Et nytt ikon – *Tegneboka* – åpner et **16 × 16** rutenett han kan male i med
fingeren, en fargepalett, og et navn å lagre tegningen under. Selve
tegneverktøyet er noe vi gir ham, på samme måte som Kodeverkstedet 1.0. Det han
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

### Kapittel 7 – Animasjon

Her møtes kapittel 5 og 6. Han tegner to bilder av figuren i Tegneboka – ett med
venstre fot fram, ett med høyre – og bytter mellom dem i spilløkka mens figuren
går. Det er animasjon, og han har laget begge bildene selv.

**Lærer:** at animasjon bare er bilder som byttes fort nok. At det han tegner og
det han koder henger sammen.

### Videre – skissen

Rekkefølgen er ikke spikret, og begrepene bestemmer den mer enn møblene gjør.

| Det han bygger | Begrepet det bærer |
|---|---|
| Lys som kan slås av og på | `if`/`else`, sant og usant |
| En stol å sitte på | kollisjon, tilstand |
| Et vindu å se ut av | lag og dybde |
| Flere ikoner på skrivebordet | **løkke** – gjør det samme for hver ting i en liste |
| Figuren blir sulten | variabler som endrer seg over tid, tid som begrep |
| Spillet husker det du valgte i menyen | å lagre, og hvorfor ting ellers glemmes |
| En fiende | flere figurer, kollisjon som betyr noe |
| Poeng og mål | tilstand, vinne og tape – **et spill** |

---

## 8. Ting jeg vil at du skal bestemme

1. **Styring i kapittel 5** – knapper i menyen, eller dra med fingeren? Jeg heller
   mot knapper først, fordi han nettopp har lært dem.
2. **Skal Bit ha en annen stemme etter hvert?** Han er ganske ivrig nå. Det
   passer for en tiåring som er fersk, men kan bli mye om et år.
3. **Hvordan gikk det da han prøvde?** Han har ikke prøvd ennå. Alt over er mine
   antagelser om hva som treffer. Ett kvarter med ham foran nettbrettet er verdt
   mer enn hele dette dokumentet – og særlig tempoet trenger det.

## 9. Det jeg er usikker på

* **Tempoet.** Kapittel 3 har tre oppgaver, kapittel 4 har to der den første
  inneholder tre oppdagelser. Det kan være mye i strekk.
* **Om paletten blir for full.** Den vokser for hvert kapittel. På et tidspunkt
  må kodebitene sorteres i grupper, eller så drukner han i valg.
* **Om koden blir for lang å bla i.** Etter kapittel 4 er figurprogrammet hans
  godt over tjue linjer. På et nettbrett betyr det mye rulling.
* **Om han kommer til å ville lese koden i det hele tatt**, eller bare trykke til
  det virker. Begge deler er greit i starten – men leksjonene om rekkefølge er
  bygget på at han faktisk ser hva som står.

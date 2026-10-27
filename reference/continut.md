# Conținut Bolders – extras din bolders1.webflow.io

Sursă: textele randate (DOM după JS) de pe paginile publicate, extrase la Etapa 1 (2026-10-27).
Textele sunt păstrate **exact** ca pe site, inclusiv greșelile. Corecturile propuse sunt la final, în „Greșeli de confirmat”, și se aplică doar după confirmarea clientului.

Excluse (rămășițe de template): titlul și descrierea „Flow Design Agency”, butonul „Hire me” (Jotform), linkurile lissanh95 / 5fourdigital / heymara / minimdesign, plățile Stripe/Wise, eticheta „Co-founder, 5fourdigital” de sub testimoniale, numele „John D Saunders”, pagina „Privacy Policy and Terms” (integral template, în engleză), mesajele formularului în engleză.

## Starea paginilor

| Pagina din meniu/footer | Stare pe Webflow | Sursa conținutului pentru site-ul nou |
|---|---|---|
| Homepage (`/`) | publicată | secțiunea „Homepage” de mai jos |
| Departamente (`/departamente`) | publicată | secțiunea „Departamente” de mai jos |
| Agenție | **nu există** (link `#`) | fragmente din homepage: Storytelling, „Fii Bolders”, Echipa |
| Proiecte | **nu există** (link `#process`) | secțiunea Proiecte din homepage |
| Contact | **nu există** (link `#`) | formularul din footer |
| Întrebări frecvente | **nu există** (link `#`) | secțiunea FAQ din homepage |
| News | **nu există** | fără conținut |
| Confidențialitate / Termeni și Condiții / Politica Cookies | **nu există**; singura pagină legală e template englezesc | fără conținut, trebuie furnizat de client |

---

## Global

### Meta

- Meta title homepage: **lipsește** (actualul e template „White Label Webflow Development for Agencies | Flow Design Agency”). De furnizat.
- Meta description homepage: **lipsește** (actuala e template). De furnizat.
- Meta title Departamente: `departamente` (titlul implicit al paginii). De furnizat.
- Favicon: `reference/media/brand/favicon-32.png`, apple-touch-icon: `reference/media/brand/apple-touch-icon-256.png`.

### Navigație (header)

- Logo (simbolul „b”), link spre `/`
- Agentie
- Deparamente
- Proiecte
- Contact (evidențiat cu verde)
- Buton dreapta: **Contact** (cu punct verde)

### Butoane recurente

- Hai să discutăm!
- Contacteaza-ne

### Footer

Meniu (separat cu „/” verde):

- Agentie / Departamente / Proiecte / Contact
- Întrebări Frecvente / News / Confidențialitate
- Termeni și Condiții / Politica Cookies / Bolders

Formular (titlu **Contact**):

- Câmp: Numele tau
- Câmp: Adresa de e-mail
- Câmp: Scrie mesajul tau...
- Bifă: Acceptă politica noastră de confidențialitate
- Buton: Trimite mesajul
- Mesaje de succes și eroare: în engleză (template), de scris în română.

Wordmark mare: **Bolders** (logo contur + plin)

Bara de jos:

- © 2026 Bolders Srl (anul se generează dinamic)
- Link „Privacy Policy and Terms” (de înlocuit cu paginile legale în română)
- Iconițele sociale duc la conturile template-ului. Conturile reale Bolders lipsesc.

---

## Homepage

### 1. Hero

- Etichetă (pill): Construim viitorul tău digital!
- Titlu: Acum este momentul **să strălucești!**
  („strălucești!” este împărțit în silabe animate: st · ră · lu · ce · șt · i · !)
- Subtitlu: Afacerea ta merită mai mult decât să fie doar un nume pe internet.
- Buton: Hai să discutăm!

### 2. Storytelling (text dezvăluit cuvânt cu cuvânt la scroll)

> Garanția noastră este simplă... facem ca afacerea ta să câștige clienți valoroși și să îți creștem vânzările, oferind soluții personalizate și rezultate concrete. La Bolders, combinăm creativitatea cu strategia digitală pentru a construi website-uri moderne, webshop-uri optimizate și campanii de marketing care funcționează!

Variantă ascunsă în cod (nefolosită vizual):

> Bolders este partenerul de încredere al brandurilor care vor rezultate concrete. Creăm strategii eficiente și soluții personalizate pentru a atrage clienți valoroși și a crește vânzările. Fie că ai nevoie de marketing digital, identitate de brand sau optimizarea proceselor de vânzare, suntem aici pentru a duce afacerea ta la un nivel premium.

### 3. Departamente (carduri în stivă)

- Titlu: Susținem inovația, accelerăm digitalizarea
- Card: **Marketing Digital**. Accelerăm prezența ta digitală.
- Card: **Web-design**. Viziunea ta, expertiza noastră.
- Card: **Branding**. (Re)adu viață brandului tău.
- Paragraf: Fiecare proiect este o oportunitate de a transforma ideile tale în rezultate reale și de a face afacerea ta vizibilă, memorabilă și profitabilă.
- Buton: Spre toate Serviciile

### 4. Fii Bolders (avantaje + testimoniale)

- Titlu: Fii Bolders. Fii diferit!
- Subtitlu: Nu suntem doar o agenție digitală, creăm experiențe care vă aduc clienți și îți cresc vânzările afacerii tale.
- **Expertiză globală**: După 5 ani de succes în Austria, Bolder este acum în România, transformând ideile în proiecte digitale care contează și aduc clienți valoroși.
- **Abordare personalizată**: Fiecare afacere e diferită, așa că oferim soluții adaptate care cresc vânzările și ating obiectivele tale.
- **Creativitate și impact**: Folosim tehnologie modernă și AI pentru a crea proiecte digitale care aduc rezultate reale și clienți valoroși.
- Buton: Hai să discutăm!

Testimoniale, titlu: **Părerile celor care ne-au ales**

1. „Sunteți o echipă foarte creativă și foarte dedicată. GG!” · Alexandra A., Make-up Artist
2. „M-au surprins cât de mult țin cont de parerile noastre. Bravo” · Maria Toma, Creator digital
3. „Mă bucur că am ales agenția voastră pentru a-mi lansa noul site. A fost o experiență deosebită! Designul este modern, iar echipa a înțeles exact ce îmi doream. Mulțumesc pentru profesionalism! Si iti multumesc in special tie Stefan pentru rabdarea oferita !” · Daniel Caraba, CEO Renox s.r.l
4. „Ce pot spune? Voi sunteți cei mai buni! M-ați ajutat să creez o imagine modernă pentru afacerea mea și, în plus, să mă ajutați să atrag clienți noi. Sunteți minunați!” · Marius Botizan, Co-CEO e-garten.at
5. „Recomand cu drag! M-au ajutat să creez o campanie care a ajuns direct la publicul țintă. Sunt foarte mulțumit de rezultatele obținute. Multumesc Bolders !” · Adina M., Freelancer
6. „Super experiență! Echipa m-a ajutat să pun pe picioare o campanie care a ajuns fix la oamenii potriviți și a dat rezultate rapid. Colaborarea cu Bolders ne-a ajutat să creștem de două ori mai repede. Cu perseverență și profesionalism, am reușit împreună să ducem lucrurile la următorul nivel.” · Pintea Livia, CEO Semnul Credintei
7. „Am lucrat cu agenția voastră pentru un proiect important și pot spune că am rămas extrem de mulțumit.” · Stefan Adrian, Co- CEO e-garten
8. „Colaborarea cu agenția a fost o alegere foarte inspirată. Ma simt norocoasă. O pot recomanda cu drag.” · Claudia T., Titular PFA

Bloc avatare: **Toate părerile** + link „Vezi ce se mai spune despre noi”

### 5. Resurse

- Titlu: Aducem digitalizarea mai aproape ca niciodată
- Subtitlu: Mai mult decât soluții, oferim rezultate clare și rapide.
- Card: **Creăm branduri memorabile**. Un stil unic care te face ușor de recunoscut și greu de uitat.
- Card: **De la strategie la rezultate**. De la idee la rezultate , cu gândire strategică și execuție clară.

### 6. Proiecte

- Titlu: Proiecte noastre de Succes
- Paragraf: Mai mult de 50 de proiecte de succes, 200+ suflete fericite, 500+ vibrații pozitive. Alătură-te călătoriei noastre creative și vezi cum dăm viață ideilor!
- Carduri (doar imagine + buton „Vezi proiectul”, fără nume afișat):
  - Bolders, bolders.ro (`proiecte/proiect-bolders-website.jpg`)
  - Renox, renox.ro (`proiecte/proiect-renox.jpg`)
  - e-garten (`proiecte/proiect-egarten.jpg`, link lipsă; pe site duce la un domeniu template)
  - Semnul Credinței, semnulcredintei.ro (`proiecte/proiect-semnul-credintei.png`)
- Buton: Vezi toate proiectele
- Tipul proiectului și anul (cerute de inspirația 02-proiecte) **nu există pe site**. De furnizat.

### 7. Proces

- Titlu: Ești la 5 pași distanță de noul tău proiect...
- Paragraf: Începe cu o idee, colaborăm la detalii, creăm un design personalizat, implementăm tehnologia potrivită și livrăm un proiect care îți va aduce rezultate!
- 01 **Solicită**: Dă-ne un semn și să vedem cum putem să te ajutăm!
- 02 **Estimare**: Îți oferim un estimat rapid și clar, ca să știi exact la ce să te aștepți.
- 03 **Aprobă**: Ne dai ok-ul, îți zicem cât durează și revenim cu vești pe parcurs.
- 04 **Realizăm**: Echipa noastră se pune pe treabă și îți aduce proiectul la viață.
- 05 **Livrare**: Gata! Proiectul tău este acum finalizat și pregătit să facă furori!

### 8. Echipa

- Titlu: Cine este în spatele echipei Bolders?
- Profil: **Stefan Pintea**, CEO Bolders
- Link: Hai să lucrăm împreună
- **Tindem spre perfectiune**: La conducerea Bolders se află Stefan, un profesionist cu viziune, peste 5 ani de experiență în industrie și o pasiune autentică pentru branduri care ies din tipare.
- **Bolders Team**: Suntem o echipă în continuă creștere, formată din peste 10 specialiști și colaboratori pasionați, uniți de aceeași viziune: să livrăm excelență.
- **Experiență in Web si Marketing**: Această expertienta ne permite să livrăm experiențe moderne, intuitive și optimizate, construite cu precizie și gândite pentru rezultate.
- **Parteneriate active cu specialiști Google Ads, Meta și SEO**: Colaborăm constant cu experți în performance marketing de la campanii Google și Meta pentru a realiza strategii optime pentru cele mai rapide rezultate.
- **Recomandat de clienți, validat de rezultate**: Recenzii reale de pe Google și Trustpilot care confirmă calitatea, seriozitatea și impactul colaborărilor noastre.

### 9. Întrebări frecvente

Titlu: **Întrebări frecvente**

- **Cum începem colaborarea?** Simplu! Ne trimiteți un mesaj cu câteva detalii despre ce aveți nevoie. Apoi stabilim o întâlnire (online sau fizică) pentru a discuta proiectul în detaliu și a vă oferi o ofertă clară.
- **De ce să aleg agenția voastră și nu alta?** Pentru că ne pasă sincer de fiecare client, nu lucrăm "pe bandă rulantă". Oferim soluții personalizate, comunicare deschisă și atenție la detalii. Fiecare proiect este pentru noi o carte de vizită și vrem să fie perfect. *(link: Contacteaza-ne)*
- **Cât durează finalizarea unui proiect?** Durata depinde de complexitatea proiectului. De regulă, proiectele mai mici pot fi finalizate în 2-4 săptămâni, iar cele mai ample în 1-2 luni. Oferim un calendar clar încă de la început, astfel încât să știți la ce să vă așteptați. *(link: Contacteaza-ne)*
- **Cum comunicăm pe parcursul colaborării?** Ne dorim să fim cât mai transparenți și apropiați. Comunicăm prin e-mail, telefon, WhatsApp sau chiar videoconferințe, în funcție de preferințele dumneavoastră. Oferim update-uri regulate pe parcursul proiectului. *(link: Contacteaza-ne)*
- **Pot cere modificări după livrare?** Sigur! Oferim o perioadă de revizie inclusă, în care puteți cere modificări gratuite. Dacă sunt necesare ajustări mai complexe după această perioadă, putem continua colaborarea printr-un pachet de suport personalizat.
- **Ce facem dacă nu sunt mulțumit?** Punem accent pe satisfacția clienților noștri. De aceea lucrăm pas cu pas, cu aprobări intermediare, pentru a evita surprizele. În cazul în care există nemulțumiri, căutăm împreună soluții și nu încheiem proiectul până nu sunteți mulțumit.

### 10. CTA final (bandă cu mesaje)

- Etichetă: Construim viitorul tău digital!
- Bandă (în ordine): Branduri care vând · Design care convinge · Strategie cu sens · Imagine de impact · Website-uri rapide · Logo-uri memorabile · Campanii care aduc clienți · Prezență online premium · Conținut care atrage · Mesaje care rămân · Soluții personalizate · Creativitate cu rezultate
- Buton: Hai să discutăm!

---

## Departamente

Secțiunile 1, 3, 5–10 și footerul sunt identice cu homepage-ul, cu diferențele de mai jos.

### 2. Storytelling

> Bolders este partenerul tău de încredere și al brandurilor care vor rezultate concrete. Creăm strategii eficiente și soluții personalizate pentru a atrage clienți valoroși și a crește vânzările. Fie ca ai nevoie de un website, marketing digital, identitate de brand sau de un webshop, suntem aici pentru a aduce afacerea ta la un nivel premium.

### 3. Departamente (diferențe)

- Paragraf: Ai nevoie de un site, un brand memorabil sau marketing care convertește? Noi îți livrăm rezultate concrete prin strategii inteligente și design eficient.
- Buton: Toate Serviciile

### 4. De ce Bolders

- Titlu: Iată de ce clienții aleg Bolders
- Subtitlu: Ce ne face diferiți și de ce contează pentru tine
- **Expertiză globală**: Cu peste 5 ani de experiență în Austria, Bolders este acum prezent și în România, oferind soluții inovatoare care fac diferența.
- **Abordare personalizată**: Ne concentrăm pe nevoile tale unice, oferind soluții adaptate pentru a atinge obiectivele tale de business.
- **Creativitate și impact**: Combinăm gândirea strategică cu inovația pentru a crea proiecte care nu doar că atrag atenția, dar și generează rezultate reale.
- Buton: Hai să discutăm!
- Testimoniale: aceleași texte ca pe homepage, dar toate semnate „John D Saunders” (template). Se folosesc semnăturile de pe homepage. Un text diferă (varianta lungă de la Adina M.):
  > Recomand cu drag! M-au ajutat să creez o campanie care a ajuns direct la publicul țintă repede si cu profit. Sunt foarte mulțumit de rezultatele obținute. Cu perseverenta si prfesionalism am putut impreuna cu cei de la Bolders sa ne dezvoltam de doua ori mai repede.
  Variantă suplimentară: „Îmi plac ideile lor inovative și stilul lor de a lucra.” (fără autor real)
- Bloc avatare: **349 proiecte de succes!** + „Vezi ce se mai spune despre noi” (contrazice „Mai mult de 50 de proiecte” de pe homepage)

### 8. Echipa (diferență)

- **Acreditări Webflow & Figma**: Această expertiză ne permite să livrăm experiențe moderne, intuitive și optimizate, construite cu precizie și gândite pentru rezultate.
  (înlocuiește „Experiență in Web si Marketing”; pe stack-ul nou, Webflow nu mai e relevant)

### 11. Servicii detaliate (după footer, în pagina actuală)

- Titlu: Alătură-te clienților noștri
- Etichetă: Locurile sunt limitate.

**Branding** (link: Află mai multe)
> Creăm identități vizuale memorabile și autentice pentru afacerea ta. De la design-ul logo-ului până la dezvoltarea unui ghid de brand complet, ne asigurăm că mesajul tău este clar și consistent pe toate canalele. Branding-ul nu este doar despre cum arată afacerea ta, ci despre cum o percep clienții. Avem grijă să construim o poveste puternică, care să reflecte valorile tale și să rezoneze cu publicul tău țintă.

**Webdesign**
> Îți creăm site-uri moderne, rapide și ușor de utilizat, folosind platforma Webflow. Designul este gândit special pentru a atrage atenția, a transmite mesajul brandului tău și a oferi o experiență plăcută vizitatorilor. Site-ul tău va fi complet optimizat pentru desktop, tabletă și telefon, garantând o imagine profesionistă pe orice dispozitiv.

Sub-servicii: WEBSITE 01 · LANDING PAGE 02 · WEBSHOP 03 · SUPORT WEB 04 (link: Află mai multe)

**Marketing Online**
> Oferim strategii personalizate de marketing online pentru a-ți crește vizibilitatea și a atrage mai mulți clienți. De la campanii de publicitate pe rețelele sociale, SEO (optimizare pentru motoarele de căutare), e-mail marketing, până la Google Ads, ne asigurăm că fiecare activitate de marketing are un impact real asupra afacerii tale. Scopul nostru este să transformăm vizitele pe site-ul tău în clienți și să creștem ROI-ul campaniilor tale online.

---

## Greșeli de confirmat (nu se corectează fără acordul clientului)

| Text actual | Propunere |
|---|---|
| Deparamente (meniu) | Departamente |
| Agentie | Agenție |
| Bolder este acum în România | Bolders este acum în România |
| Proiecte noastre de Succes | Proiectele noastre de succes |
| Experiență in Web si Marketing | Experiență în web și marketing |
| Această expertienta | Această experiență |
| Tindem spre perfectiune | Tindem spre perfecțiune |
| De la idee la rezultate , cu… | De la idee la rezultate, cu… |
| Contacteaza-ne | Contactează-ne |
| Numele tau / Scrie mesajul tau... | Numele tău / Scrie mesajul tău... |
| parerile; Si iti multumesc in special tie Stefan pentru rabdarea oferita ! | (citat de client, se lasă sau se diacritizează doar cu acordul lui) |
| Webdesign: „folosind platforma Webflow” | de actualizat după migrarea pe Astro |
| „Mai mult de 50 de proiecte” vs „349 proiecte de succes!” | o singură cifră confirmată |
| Mesaj ton mixt „vă / îți” în aceeași frază | unificat la „tu” |

## Lipsesc și trebuie furnizate

- Meta title și description pentru fiecare pagină
- Date de contact Bolders (e-mail, telefon, adresă, CUI) și conturile sociale reale
- Conținut pentru Agenție (poveste în etapele Întâi / Apoi / Azi, cf. inspirație 06), News și paginile legale (Confidențialitate, Termeni, Cookies)
- Pentru fiecare proiect: nume afișat, tip, an, link corect (e-garten)
- Pentru formularul de contact în 3 pași (inspirație 05): opțiuni „ce vrei”, intervale de buget, timpul de răspuns și textul „un loc liber în acest trimestru”

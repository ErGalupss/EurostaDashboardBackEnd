export interface Incarico {
  id: string;
  Incarico: string;
  Commessa: string;
  CPI: string;
  RegioneRiferimento: string;
  Richiedente: string;
  CodiceFiscale: string;
  ProvinciaRichiedente: string;
  StatoWorkFlow: string;
  DataUltimaTransizione: string; // ISO Date
  DataUltimaModifica: string; // ISO Date
  DataRichiesta: string; // ISO Date (Primo Invio PEC)
  Lavorata: string; // "SI", "si", "11AB", ""
  CategoriaRiscontrata: string;
  Partner: string;
  EsitoPEC: string; // "Da inviare", "Inviata", "Pec non inviata" (Errore)
  raw?: Record<string, any>; // Store original row data
}

export const REGIONI = [
  "Abruzzo",
  "Basilicata",
  "Calabria",
  "Campania",
  "Emilia-Romagna",
  "Friuli-Venezia Giulia",
  "Lazio",
  "Liguria",
  "Lombardia",
  "Marche",
  "Molise",
  "Piemonte",
  "Puglia",
  "Sardegna",
  "Sicilia",
  "Toscana",
  "Trentino-Alto Adige",
  "Umbria",
  "Valle d'Aosta",
  "Veneto",
  "Richiesta singola",
  "Monza-Brianza"
];

export const CPI_LIST = Array.from(new Set([
  "CPI - SULMONA", "CPI - AVEZZANO", "CPI - CASTEL SANGRO", "CPI - L'AQUILA", "CPI - LANCIANO", "CPI - CHIETI", "CPI - VASTO", "CPI - ORTONA", "CPI - SCAFA", "CPI - PESCARA", "CPI - PENNE", "CPI - NERETO", "CPI - TERAMO", "CPI - ROSETO DEGLI ABRUZZI", "CPI - GIULIANOVA", "CPI - STIGLIANO", "CPI - POLICORO", "CPI - MATERA", "CPI - LAURENZANA", "CPI - GENZANO DI LUCANIA", "CPI - POTENZA", "CPI - MELFI", "CPI - BARAGIANO", "CPI - VILLA D'AGRI", "CPI - SENISE", "CPI - LAURIA", "CPI - LAVELLO", "CPI - CASTROVILLARI", "CPI - PAOLA", "CPI - COSENZA", "CPI - CORIGLIANO", "CPI - CATANZARO", "CPI - SOVERATO", "CPI - LAMEZIA TERME", "CPI - CROTONE", "CPI - CIRÒ MARINA", "CPI - LOCRI", "CPI - GIOIA TAURO", "CPI - REGGIO CALABRIA", "CPI - SERRA SAN BRUNO", "CPI - VIBO VALENTIA", "CPI - AVELLINO", "CPI - ARIANO IRPINO", "CPI - GROTTAMINARDA", "CPI - BENEVENTO", "CPI - AVERSA", "CPI - MADDALONI", "CPI - CAPUA", "CPI - CASERTA", "CPI - CASAL DI PRINCIPE", "CPI - NAPOLI - FUORIGROTTA", "CPI - NAPOLI - RAIMONDI", "CPI - NAPOLI - SCAMPIA", "CPI - AFRAGOLA", "CPI - CASTELLAMARE DI STABIA", "CPI - ISCHIA", "CPI - MARIGLIANO", "CPI - FRATTAMAGGIORE", "CPI - GIUGLIANO", "CPI - NOLA", "CPI - BATTIPAGLIA", "CPI - AGROPOLI", "CPI - OLIVETO CITRA", "CPI - MAIORI", "CPI - MERCATO S. SEVERINO", "CPI - NOCERA INFERIORE", "CPI - OTTAVIANO", "CPI - PIEDIMONTE MATESE", "CPI - POMIGLIANO D'ARCO", "CPI - POMPEI", "CPI - PORTICI", "CPI - POZZUOLI", "CPI - ROCCADASPIDE", "CPI - S.ANGELO DEI LOMBARDI", "CPI - SALA CONSILINA", "CPI - SALERNO", "CPI - SAN BARTOLOMEO IN GALDO", "CPI - SANT'AGATA DE' GOTI", "CPI - SAPRI", "CPI - SCAFATI", "CPI - SESSA AURUNCA", "CPI - SORRENTO", "CPI - TEANO", "CPI - TELESE", "CPI - TORRE DEL GRECO", "CPI - VALLO DELLA LUCANIA", "CPI - ALTO RENO TERME", "CPI - BOLOGNA", "CPI - BORGO VAL DI TARO", "CPI - CARPI", "CPI - CASTEL SAN GIOVANNI", "CPI - CASTELFRANCO EMILIA", "CPI - CASTELNOVO NE' MONTI", "CPI - CENTO", "CPI - CESENA", "CPI - CODIGORO", "CPI - CORREGGIO", "CPI - FAENZA", "CPI - FERRARA", "CPI - FIDENZA", "CPI - FIORENZUOLA D'ARDA", "CPI - FORLÌ", "CPI - GUASTALLA", "CPI - IMOLA", "CPI - LANGHIRANO", "CPI - LUGO", "CPI - MINERBIO", "CPI - MIRANDOLA", "CPI - MODENA", "CPI - MONTECCHIO EMILIA", "CPI - PARMA", "CPI - PAVULLO NEL FRIGNANO", "CPI - PIACENZA", "CPI - RAVENNA", "CPI - REGGIO EMILIA", "CPI - RICCIONE", "CPI - RIMINI", "CPI - SAN GIOVANNI IN PERSICETO", "CPI - SAN LAZZARO DI SAVENA", "CPI - SASSUOLO", "CPI - SAVIGNANO SUL RUBICONE", "CPI - SCANDIANO", "CPI - VIGNOLA", "CPI - ZOLA PEDROSA", "CPI - MONFALCONE", "CPI - MANIAGO", "CPI - PORDENONE", "CPI - SACILE", "CPI - SAN VITO AL TAGLIAMENTO", "CPI - SPILIMBERGO", "CPI - TRIESTE", "CPI - CERVIGNANO DEL FRIULI", "CPI - TOLMEZZO", "CPI - GEMONA DEL FRIULI", "CPI - TARCENTO", "CPI - UDINE", "CPI - CODROIPO", "CPI - CIVIDALE DEL FRIULI", "CPI - GORIZIA", "CPI - PONTEBBA", "CPI - SAN DANIELE DEL FRIULI", "CPI - LATISANA", "CPI - ACQUAPENDENTE", "CPI - ALBANO LAZIALE", "CPI - ANAGNI", "CPI - ANZIO", "CPI - BOLSENA", "CPI - CIVITAVECCHIA", "CPI - BRACCIANO", "CPI - CASSINO", "CPI - CERVETERI", "CPI - CISTERNA DI LATINA", "CPI - CIVITA CASTELLANA", "CPI - COLLEFERRO", "CPI - FONDI", "CPI - FORMIA", "CPI - FRASCATI", "CPI - FROSINONE", "CPI - GUIDONIA MONTECELIO", "CPI - LATINA", "CPI - MARINO", "CPI - ROMA MONTEROTONDO", "CPI - MORLUPO", "CPI - ORTE", "CPI - PALESTRINA", "CPI - POGGIO MIRTETO", "CPI - POMEZIA", "CPI - RIETI", "CPI - ROMA (VARI)", "CPI - ROMA OSTIA", "CPI - SEZZE SCALO", "CPI - SORA", "CPI - SUBIACO", "CPI - TARQUINIA", "CPI - TIVOLI", "CPI - VELLETRI", "CPI - VITERBO", "CPI - ZAGAROLO", "CPI - GENOVA POENTE", "CPI - TIGULLIO", "CPI - VAL BISAGNO", "CPI - GENOVA CENTRO", "CPI - VAL POLCEVERA", "CPI - VENTIMIGLIA", "CPI - IMPERIA", "CPI - SANREMO", "CPI - SARZANA", "CPI - LA SPEZIA", "CPI - ALBENGA", "CPI - SAVONA", "CPI - CARCARE", "CPI - ALBINO", "CPI - APPIANO GENTILE", "CPI - BERGAMO", "CPI - BORMIO", "CPI - BRENO", "CPI - BRESCIA", "CPI - BUSTO ARSIZIO", "CPI - CANTU'", "CPI - CASALMAGGIORE", "CPI - CASTIGLIONE DELLE STIVIERE", "CPI - CESANO MADERNO", "CPI - CHIAVENNA", "CPI - CINISELLO BALSAMO", "CPI - CLUSONE", "CPI - CODOGNO", "CPI - COMO", "CPI - CORSICO", "CPI - CREMA", "CPI - CREMONA", "CPI - DESENZANO", "CPI - ERBA", "CPI - GALLARATE-SESTO CALENDE", "CPI - GRUMELLO DEL MONTE", "CPI - ISEO", "CPI - LAVENO MOMBELLO", "CPI - LECCO", "CPI - LEGNANO", "CPI - LENO", "CPI - LODI", "CPI - LOVERE", "CPI - LUINO", "CPI - MAGENTA", "CPI - MANTOVA", "CPI - MELZO", "CPI - MENAGGIO", "CPI - MERATE", "CPI - MILANO", "CPI - MONZA", "CPI - MORBEGNO", "CPI - ORZINUOVI", "CPI - OSTIGLIA", "CPI - PAVIA", "CPI - PONTE SAN PIETRO", "CPI - RHO", "CPI - ROMANO DI LOMBARDIA", "CPI - ROZZANO", "CPI - SALO'", "CPI - SAN DONATO MILANESE", "CPI - SAREZZO", "CPI - SARONNO", "CPI - SEREGNO", "CPI - SONDRIO", "CPI - SORESINA", "CPI - SUZZARA", "CPI - TIRANO", "CPI - TRADATE", "CPI - TRESCORE BALNEARIO", "CPI - TREVIGLIO", "CPI - VARESE", "CPI - VIADANA", "CPI - VIGEVANO", "CPI - VIMERCATE", "CPI - VOGHERA", "CPI - ZOGNO", "CPI - ANCONA", "CPI - ASCOLI PICENO", "CPI - MACERATA", "CPI - CIVITANOVE MARCHE", "CPI - FABRIANO", "CPI - FANO", "CPI - FERMO", "CPI - JESI", "CPI - PESARO", "CPI - SAN BENEDETTO DEL TRONTO", "CPI - SENIGALLIA", "CPI - TOLENTINO", "CPI - URBINO", "CPI - CAMPOBASSO", "CPI - ISERNIA", "CPI - TERMOLI", "CPI - ACQUITERME", "CPI - ALBA", "CPI - ALESSANDRIA", "CPI - ASTI", "CPI - BIELLA", "CPI - BORGOMANERO", "CPI - BORGOSESIA", "CPI - CASALE MONFERRATO", "CPI - CHIERI", "CPI - CHIVASSO", "CPI - CIRIE'", "CPI - CUNEO", "CPI - CUORGNE'", "CPI - FOSSANO", "CPI - IVREA", "CPI - MONCALIERI", "CPI - MONDOVI'", "CPI - NOVARA", "CPI - NOVI LIGURE", "CPI - OMEGNA", "CPI - ORBASSANO", "CPI - PINEROLO", "CPI - RIVOLI", "CPI - SALUZZO", "CPI - SETTIMO TORINESE", "CPI - SUSA", "CPI - TORINO", "CPI - TORTONA", "CPI - VENARIA", "CPI - VERCELLI", "CPI - CASAMASSIMA", "CPI - NOCI", "CPI - ALTAMURA", "CPI - BARI", "CPI - MODUGNO", "CPI - BITONTO", "CPI - TRIGGIANO", "CPI - MONOPOLI", "CPI - RUTIGLIANO", "CPI - CORATO", "CPI - GIOIA DEL COLLE", "CPI - MOLFETTA", "CPI - ACQUAVIVA DELLE FONTI", "CPI - BRINDISI", "CPI - OSTUNI", "CPI - FRANCAVILLA FONTANA", "CPI - ANDRIA", "CPI - BARLETTA", "CPI - BISCEGLIE", "CPI - CANOSA DI PUGLIA", "CPI - ASCOLI SATRIANO", "CPI - LUCERA", "CPI - SAN SEVERO", "CPI - VICO DEL GARGANO", "CPI - CERIGNOLA", "CPI - FOGGIA", "CPI - MANFREDONIA", "CPI - TRICASE", "CPI - GALLIPOLI", "CPI - CASARANO", "CPI - POGGIARDO", "CPI - GALATINA", "CPI - LECCE", "CPI - MAGLIE", "CPI - MARTANO", "CPI - CAMPI SALENTINA", "CPI - NARDÒ", "CPI - MANDURIA", "CPI - GROTTAGLIE", "CPI - CASTELLANETA", "CPI - MARTINA FRANCA", "CPI - MASSAFRA", "CPI - TARANTO", "CPI - ALES", "CPI - ALGHERO", "CPI - ASSEMINI", "CPI - BONORVA", "CPI - BOSA", "CPI - CAGLIARI", "CPI - CARBONIA", "CPI - CASTELSARDO", "CPI - CUGLIERI", "CPI - GHILARZA", "CPI - IGLESIAS", "CPI - ISILI", "CPI - LANUSEI", "CPI - MACOMER", "CPI - MOGORO", "CPI - MURAVERA", "CPI - NUORO", "CPI - OLBIA", "CPI - ORISTANO", "CPI - OZIERI", "CPI - QUARTU S.ELENA", "CPI - SAN GAVINO MONREALE", "CPI - SANLURI", "CPI - SASSARI", "CPI - SENORBÌ", "CPI - SINISCOLA", "CPI - SORGONO", "CPI - TEMPIO PAUSANIA", "CPI - TERRALBA", "CPI - TORTOLÌ", "CPI - ACIREALE", "CPI - ADRANO", "CPI - AGRIGENTO", "CPI - ALCAMO", "CPI - AUGUSTA", "CPI - BAGHERIA", "CPI - BARCELLONA POZZO DI GOTTO", "CPI - BIVONA", "CPI - BRONTE", "CPI - CALTAGIRONE", "CPI - CALTANISSETTA", "CPI - CANICATTÌ", "CPI - CAPO D'ORLANDO", "CPI - CARINI", "CPI - CASTELTERMINI", "CPI - CASTELVETRANO", "CPI - CATANIA", "CPI - CEFALÙ", "CPI - CORLEONE", "CPI - ENNA", "CPI - FRANCAVILLA DI SICILIA", "CPI - GELA", "CPI - GIARDINI NAXOS", "CPI - GIARRE", "CPI - GRAMMICHELE", "CPI - LENTINI", "CPI - LEONFORTE", "CPI - LERCARA FRIDDI", "CPI - LICATA", "CPI - LIPARI", "CPI - MARSALA", "CPI - MAZARA DEL VALLO", "CPI - MENFI", "CPI - MESSINA", "CPI - MILAZZO", "CPI - MISILMERI", "CPI - MISTERBIANCO", "CPI - MISTRETTA", "CPI - MODICA", "CPI - MONREALE", "CPI - MUSSOMELI", "CPI - NICOSIA", "CPI - NOTO", "CPI - PALERMO", "CPI - PARTINICO", "CPI - PATERNÒ", "CPI - PATTI", "CPI - PETRALIA SOPRANA", "CPI - PIAZZA ARMERINA", "CPI - RAGUSA", "CPI - RAMACCA", "CPI - RANDAZZO", "CPI - RIBERA", "CPI - SANT'AGATA DI MILITELLO", "CPI - SANTA TERESA DI RIVA", "CPI - SANTO STEFANO DI CAMASTRA", "CPI - SCIACCA", "CPI - SCORDIA", "CPI - SIRACUSA", "CPI - TERMINI IMERESE", "CPI - TRAPANI", "CPI - TREMESTIERI ETNEO", "CPI - VILLAFRANCA TIRRENA", "CPI - VITTORIA", "CPI - AMIATA", "CPI - ARCIDOSSO", "CPI - ARETINA", "CPI - AULLA", "CPI - BORGO SAN LORENZO", "CPI - CARRARA", "CPI - CASENTINO", "CPI - CASTELFIORENTINO", "CPI - CECINA", "CPI - EMPOLI", "CPI - FIGLINE VALDARNO", "CPI - FIRENZE - CENTRO", "CPI - FOLLONICA", "CPI - GROSSETO", "CPI - LIVORNO", "CPI - LUCCA", "CPI - MANCIANO", "CPI - MASSA", "CPI - MONSUMMANO TERME", "CPI - ORBETELLO", "CPI - PESCIA", "CPI - PIOMBINO", "CPI - PISA", "CPI - PISTOIA", "CPI - PONTASSIEVE", "CPI - PONTEDERA", "CPI - PORTOFERRAIO", "CPI - PRATO", "CPI - QUARRATA", "CPI - ROSIGNANO", "CPI - SAN CASCIANO VAL DI PESA", "CPI - SAN MARCELLO PISTOIESE", "CPI - SANTA CROCE SULL'ARNO", "CPI - SCANDICCI", "CPI - SENESE", "CPI - SESTO FIORENTINO", "CPI - VALDARNO", "CPI - VALDENSA", "CPI - VALDICHIANA", "CPI - VALLE DEL SERCHIO", "CPI - VALTIBERINA", "CPI - VERSILIA", "CPI - VOLTERRA", "CPI - BOLZANO", "CPI - BORGO VALSUGANA", "CPI - BRESSANONE - VIPITENO", "CPI - BRUNICO", "CPI - CAVALESE", "CPI - CLES", "CPI - EGNA", "CPI - MALÈ", "CPI - MERANO", "CPI - MEZZOLOMBARDO", "CPI - PERGINE VALSUGANA", "CPI - RIVA DEL GARDA", "CPI - ROVERETO", "CPI - SAN GIOVANNI DI FASSA-SEN JAN", "CPI - SILANDRO", "CPI - TIONE", "CPI - TIONE DI TRENTO", "CPI - TRENTO", "CPI - CITTÀ DI CASTELLO", "CPI - FOLIGNO", "CPI - ORVIETO", "CPI - PERUGIA", "CPI - TERNI", "CPI - AOSTA", "CPI - VERRÈS", "CPI - ADRIA", "CPI - AFFI", "CPI - AGORDO", "CPI - ARZIGNANO", "CPI - ASIAGO", "CPI - BADIA POLESINE", "CPI - BASSANO DEL GRAPPA", "CPI - BELLUNO", "CPI - BOVOLONE", "CPI - CAMPOSAMPIERO", "CPI - CASTELFRANCO VENETO", "CPI - CHIOGGIA", "CPI - CITTADELLA", "CPI - CONEGLIANO", "CPI - CONSELVE", "CPI - DOLO", "CPI - ESTE", "CPI - FELTRE", "CPI - JESOLO", "CPI - LEGNAGO", "CPI - LONIGO", "CPI - MIRANO", "CPI - MONSELICE", "CPI - MONTEBELLUNA", "CPI - ODERZO", "CPI - PADOVA", "CPI - PIEVE DI CADORE", "CPI - PIOVE DI SACCO", "CPI - PORTOGRUARO", "CPI - ROVIGO", "CPI - SAN BONIFACIO", "CPI - SAN DONÀ DEL PIAVE", "CPI - SCHIO", "CPI - TREVISO", "CPI - VALDAGNO", "CPI - VENEZIA", "CPI - VERONA", "CPI - VICENZA", "CPI - VILLAFRANCA DI VERONA", "CPI - VITTORIO VENETO", "RANDSTAD ITALIA SPA", "PUNTO SERVICE - COOPERATIVA SOCIALE A R.L.", "CPI - CALITRI", "CPI - ROMA PRIMAVALLE", "CPI - ROMA CINECITTA'", "NON USARE - CPI - ARDEA", "CPI - ROMA TORRE ANGELA", "CPI - ROMA TESTACCIO", "CPI - ROMA CASALBERTONE", "CPI - ROMA TIBURTINO", "CPI - ROMA COORDINAMENTO", "G.S. GROUP B.V.", "XXXXX", "CPI - NAPOLI", "CPI - CANINO"
])).sort();

export const PARTNERS = ["All Risks s.r.l.", "IBL", "Quinservizi"];
export const ESITI_PEC = ["Da inviare", "Inviata", "Pec non inviata", ""];
export const STATI_WORKFLOW = [
  "Chiusa - Caricamento Errato",
  "Chiusa - Annullata",
  "Chiusa - Perfezionata",
  "Chiusa - Perfezionata base",
  "Chiusa - Perfezionata Fase I",
  "In Lavorazione - Inviato a Fornitore",
  "In Lavorazione - Risposta da fornitore",
  "In Lavorazione - Verifica documenti",
  "In Lavorazione - Attesa invio a C.I.",
  "In Lavorazione - Inviato a C.I.",
  "In Lavorazione - Rettificato a C.I.",
  "In Lavorazione - Verifica implementazione",
  "In Lavorazione - Assegnato Esterno",
  "In Lavorazione - Assegnato Interno",
  "In Lavorazione - Riscontrato da C.I.",
  "In Lavorazione - Integrazione fornitore",
  "In Lavorazione - Attesa integrazione a C.I.",
  "In Lavorazione - Integrato a C.I.",
  "In Lavorazione - Integrazione Cliente",
  "In Lavorazione - Rettifica cliente",
  "In Lavorazione - Attesa rettifica a C.I.",
  "In Lavorazione - Attesa implementazione a C.I.",
  "In Lavorazione - Rettifica documenti",
  "In Lavorazione - Implementato a C.I.",
  "In Lavorazione - Notificato al controinteressato",
  "In Lavorazione - Integrazione Eurosta",
  "In Lavorazione - Da inviare al Fornitore",
  "In Lavorazione - Istanza - Sollecito",
  "In Lavorazione - Istanza - Mancata risposta sollecito",
  "In Lavorazione - Notifica - Sollecito",
  "In Lavorazione - Notifica - Mancata risposta sollecito",
  "In Lavorazione - Sollecito rettifica a c.i.",
  "In Lavorazione - Sollecito Integrazione Istanza",
  "In Lavorazione - Chiusura Fase I",
  "Nuova - Da assegnare"
];
export const PROVINCE = ["NA", "CH", "CE", "MI", "BZ", "TE", "PE", "RG", "CT", "ME", "BS", "MO", "PZ", "BO", "VA", "AQ", "BG", "FE", "FC", "SU", "SS", "CR", "IM", "PR", "LU", "AR", "TO", "AL", "RN", "NU", "LC", "MN", "SV", "UD", "SA", "PA", "CL", "EN", "GO", "FI", "PD", "PG", "BA", "RM", "FR", "TV", "LE", "BT", "TA", "VI", "AP", "FM", "LT", "RI", "MC"];
export const LAVORATA_VALUES = ["SI", "si", "11AB", ""];
export const CATEGORIE_RISCONTRATE = [
  "-",
  "DECEDUTO",
  "DIPENDENTE",
  "DISOCCUPATO",
  "DIPENDENTE/AUTONOMO",
  "PENSIONATO"
];

export const CLOSED_STATES = [
  "Chiusa - Caricamento Errato",
  "Chiusa - Annullata",
  "Chiusa - Perfezionata",
  "Chiusa - Perfezionata base",
  "Chiusa - Perfezionata Fase I"
];

export const SUCCESS_STATES = [
  "Chiusa - Perfezionata",
  "Chiusa - Perfezionata base",
  "Chiusa - Perfezionata Fase I"
];

export const isClosed = (stato: string): boolean => {
  return CLOSED_STATES.includes(stato);
};

export const isSuccess = (stato: string): boolean => {
  return SUCCESS_STATES.includes(stato);
};

export const NAMES = ["Mario", "Luigi", "Giovanni", "Anna", "Maria", "Giulia", "Paolo", "Francesco", "Alessandro", "Roberto", "Elena", "Chiara", "Antonio", "Giuseppe", "Davide"];
export const SURNAMES = ["Rossi", "Bianchi", "Verdi", "Esposito", "Russo", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Gallo", "Conti", "De Luca", "Costa"];

export const generateMockData = (count: number = 500): Incarico[] => {
  const data: Incarico[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const requestDate = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000); // Last 6 months
    const lastModDate = new Date(requestDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    const lastTransDate = new Date(lastModDate.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000);

    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const provincia = PROVINCE[Math.floor(Math.random() * PROVINCE.length)];

    const cons = (str: string) => str.replace(/[AEIOU]/ig, '').padEnd(3, 'X').substring(0, 3).toUpperCase();
    const cf = `${cons(surname)}${cons(name)}80A01H501${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    data.push({
      id: `260${60000 + i}`,
      Incarico: `260${60000 + i}`,
      Commessa: `14-09/09/2024`,
      CPI: Math.random() > 0.2 ? CPI_LIST[Math.floor(Math.random() * CPI_LIST.length)] : "",
      RegioneRiferimento: REGIONI[Math.floor(Math.random() * REGIONI.length)],
      Richiedente: `${name} ${surname}`,
      CodiceFiscale: cf,
      ProvinciaRichiedente: provincia,
      StatoWorkFlow: STATI_WORKFLOW[Math.floor(Math.random() * STATI_WORKFLOW.length)],
      DataUltimaTransizione: lastTransDate.toISOString(),
      DataUltimaModifica: lastModDate.toISOString(),
      DataRichiesta: requestDate.toISOString(),
      Lavorata: LAVORATA_VALUES[Math.floor(Math.random() * LAVORATA_VALUES.length)],
      CategoriaRiscontrata: Math.random() > 0.3 ? CATEGORIE_RISCONTRATE[Math.floor(Math.random() * CATEGORIE_RISCONTRATE.length)] : "",
      Partner: PARTNERS[Math.floor(Math.random() * PARTNERS.length)],
      EsitoPEC: ESITI_PEC[Math.floor(Math.random() * ESITI_PEC.length)],
    });
  }
  return data.sort((a, b) => new Date(b.DataRichiesta).getTime() - new Date(a.DataRichiesta).getTime());
};

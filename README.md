Progetto di SWE per l'anno accademico 2017/2018


> Stab è volutamente scritto male, giuro.


# Prerequisiti
* installa nodejs [link](https://nodejs.org/en/)
* installa yarn  [link](https://yarnpkg.com/lang/en/)


# Installazione

1. fai tutto ciò scritto nella sezione ** contributing code ** di questo file [CONTRIBUTING.MD](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md), salta la prima frase, dove ti fa clonare kibana
    1. a titolo informativo, ti fa installare **nvm** che è uno scriptino che permette di settare con quale versione di nodejs vuoi lavorare, in quanto Kibana è una fighetta e vuole una versione in particolare
1. ora spostati in stabHavana e digita `npm install` così installi le dipendenze per il nostro plugin

## Avvio
1. vai in Code/kibana e digita `yarn elasticsearch`
2. vai in Code/stabHavana e digita `npm start`
3. vai in localhost:5601 ed il gioco è fatto


## Nota bene
* per generare il plugin ho usato [sao](https://github.com/elastic/template-kibana-plugin/)
* avrai notato che nella cartella Kibana ho creato la sottocartella node, questo perchè il generatore di plugin è stato sviluppato per una versione di kibana più vecchia, tale cartella è stata stradicata nella versione 6.x quindi il plugin non funziona senza, ho aperto una issue per segnalare questa cosa ma non verrà mai risolta.
* se kibana da un errore, in particolare ** \_d2 not defined** od una cosa del genere, riavvia kibana, attualmente le cause di questo errore mi sono sconosciute, c'è della magia nera
* è il codice più brutto che io abbia mai visto, concordo, verrà sistemato, ma per ora funziona

### FAQ
** Ma perchè kibana usa yarn ed il plugin npm? (per chi non lo sapesse sono entrambi gestori di pacchetti) **
 Perchè sono quattro incompetenti del cazzo


### Risorse utili
Forse per alcuni di voi queste potrebbero essere tutte tecnologie nuove, scrivo queste quattro righe di introduzione perchè conosco bene quella sensazione di smarrimento difronte ad un sacco di cose nuove

#### Nodejs
Allora, Javascript è un linguaggio di scripting interpretato, l'interprete (Javascritp V8) è installato nel tuo browser di fiducia. Cos'hanno fatto? hanno preso l'interprete e l'hanno estratto dai browser rendendolo di fatto stand-alone. Quindi ora puoi scrivere programmi per desktop come se stessi lavorando ad un sito web, inoltre nodejs è corredato di moduli che permettono di interfacciarsi con il s.o, quindi veramente puoi fare quello che vuoi.

#### NPM / YARN
Hai presente il playstore? E' esattamente la stessa cosa per nodejs, installi che app (pacchetti) che ti servono per fare quello che devi fare (e.g d3.js esiste anche sottoforma di pacchetto per nodejs)
Tutti i pacchetti che installi, insieme alle informazioni basilari del tuo programma vengono salvate in un file particolare che si chiama ** package.json **

#### ES6
E' l'ultima versione di js implementata (al 99%) da nodejs. Permette di scrivere javascript in maniera molto più semplice ed intutitiva rispetto al plain Javascript. ES6 ha introdotto diverse novità che hanno rivoluzionato js.

#### Promises
L'asincronia è un aspetto fondamentale di Nodejs in quanto è single threaded. Ciò comporta che tutte le chiamate a servizi web diventerebbero bloccanti, cioè l'esecuzione si blocca fino a che non viene fornita una risposta e poi si continua, le promise dunque sono la soluzione che fornisce la scappatoia alle chiamate bloccanti. Le promise sono oggetti particolari alla quale viene fornito un compito da fare e poi loro si occuperanno di fornire una risposta (resolve o reject) a seconda se il compito è andato a buon fine o non e nel frattempo il tuo programma continua nella sua esecuzione.


### LINK UTILI
* [Novità di ES6](https://webapplog.com/es6/)
* [Npm, comandi principali](https://docs.npmjs.com/)
* [Decisamente la migliore guida per Javascript, spiega meglio di Ballan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

Per qualsiasi domanda o dubbio scrivetemi senza problemi





### STRUTTURA PLUGIN

#### Index.js
Entry point del plugin, qui viene ritornato a Kibana una reference al plugin che si sta creando così poi Kibana lo include in se stesso. Qui si può decidere quali reference invece Kibana manderà al nostro plugin, ad esempio, se il nostro plugin utilizzerà elasticsearch allora Kibana fornirà una reference di elastic al nostro plugin.

#### public/
Contiene tutti i file che vengono spediti al browser dell'utente quando visualizzano il plugin, quindi i css la pahina vera e propria in html ed il js che la gestisce.

#### public/app.js
Logica del plugin qui vengono gestite le richieste che vengono fatte al plugin e si istanziano i controller che gestiscono la pagina vera e propria.

#### server/
Qui vengono gestite le route, quando si vuole effettuare una richiesta (e.g. query ad elasticsearch) questa va gestita in server/routes/examples.js

#### package.json
informazioni utili del nostro plugin, lista dependencies, comandi, etc...

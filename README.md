# WalletArt Studio

Crea l'interfaccia di WalletArt, un'app Android per personalizzare esteticamente le immagini delle proprie carte digitali.



Tecnologie



- React, TypeScript e Tailwind CSS.

- Struttura compatibile con Capacitor per Android.

- Codice organizzato in componenti riutilizzabili.

- Repository esportabile su GitHub.



Design



- Stile premium, moderno e minimalista, ispirato alle migliori applicazioni fintech.

- Tema scuro con possibilità di tema chiaro.

- Animazioni fluide, sobrie e professionali.

- Interfaccia completamente responsive, ottimizzata per smartphone.

- Icone Lucide, evitando emoji.



Schermate principali



1. Home: anteprima della carta personalizzata, pulsante per modificarla e stato della funzionalità di sovrapposizione.

2. Editor: caricamento immagine dalla galleria, ritaglio con proporzioni di una carta bancaria, zoom e riposizionamento.

3. Le mie carte: raccolta delle grafiche salvate, con possibilità di aggiungerle, modificarle ed eliminarle.

4. Impostazioni: tema, autorizzazioni Android e informazioni sull'app.



Funzionalità dell'interfaccia



- Anteprima in tempo reale.

- Selezione e ritaglio delle immagini.

- Salvataggio locale dei design.

- Pulsante per attivare o disattivare la sovrapposizione.

- Stati visivi per autorizzazioni concesse o mancanti.



Importante



L'app non deve simulare pagamenti, raccogliere dati bancari o richiedere numeri di carta.



Non implementare una falsa integrazione con Google Wallet.



Predisponi un'interfaccia "NativeOverlayBridge" con metodi per mostrare, nascondere e configurare una sovrapposizione Android. L'implementazione nativa sarà sviluppata separatamente.



Non usare dati dimostrativi che sembrino reali informazioni bancarie.



Il risultato deve essere un progetto completo, elegante e pronto per essere collegato a GitHub.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f0c7b634-0d97-4885-bad7-b5fe3c779159).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

export function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto max-w-3xl py-32 px-4">
        <h1 className="font-serif text-4xl text-brand-primary mb-12">Cookie Policy</h1>
        
        <div className="prose prose-brand max-w-none text-brand-contrast/80">
          <p>La presente Cookie Policy descrive l'utilizzo dei cookie su questo sito web, gestito da Stefania Mastroianni.</p>
          
          <h3 className="font-serif text-2xl text-brand-primary mt-12 mb-4">1. Cosa sono i Cookie?</h3>
          <p>
            I cookie sono piccoli file di testo che i siti visitati dagli utenti inviano ai loro terminali, ove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva. I cookie si differenziano tra loro in base alle finalità perseguite da chi li usa (tecnici vs di profilazione) e in base al soggetto che li installa sul terminale (prima parte vs terze parti).
          </p>

          <h3 className="font-serif text-2xl text-brand-primary mt-12 mb-4">2. Cookie Tecnici (Strettamente Necessari)</h3>
          <p>
            Questo sito web utilizza cookie tecnici per garantirne il corretto funzionamento, agevolare la navigazione, e garantire l'accesso sicuro all'Admin Dashboard. Questi cookie non sono strumentali alla raccolta di dati per scopi commerciali o profilazione personale e vengono installati direttamente dal sito.
            Per l'installazione di questi cookie non è richiesto il preventivo consenso dell'utente.
          </p>

          <h3 className="font-serif text-2xl text-brand-primary mt-12 mb-4">3. Cookie Analitici di Terze Parti</h3>
          <p>
            Al fine di migliorare la piattaforma, potremmo utilizzare servizi di analisi del traffico in forma aggregata e totalmente anonimizzata (come, ad esempio, Vercel Web Analytics o simili). Questi strumenti non raccolgono informazioni univocamente identificabili dei singoli visitatori.
          </p>

          <h3 className="font-serif text-2xl text-brand-primary mt-12 mb-4">4. Disabilitazione dei Cookie</h3>
          <p>
            Fermo restando quanto sopra indicato in ordine ai cookie strettamente necessari alla navigazione, l'utente può eliminare gli altri cookie direttamente tramite il proprio browser ove la maggior parte dei browser web è configurata in modo da accettarli automaticamente l’installazione ma è possibile limitare queste impostazioni.
          </p>

          <p className="mt-12 text-sm opacity-60">Ultimo aggiornamento: [Data Odierna]</p>
        </div>
      </div>
    </div>
  );
}

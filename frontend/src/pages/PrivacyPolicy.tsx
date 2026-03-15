export function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto max-w-3xl py-32 px-4">
        <h1 className="font-serif text-4xl text-brand-primary mb-12">Privacy Policy</h1>
        
        <div className="prose prose-brand max-w-none text-brand-contrast/80">
          <p>La presente Privacy Policy descrive il modo in cui Stefania Mastroianni (di seguito "Titolare") raccoglie, utilizza e protegge i dati personali degli utenti del sito web.</p>
          
          <h3 className="font-serif text-2xl text-brand-primary mt-12 mb-4">1. Titolare del Trattamento</h3>
          <p>Stefania Mastroianni<br/>Email: info@stefaniamastroianni.com<br/>P.IVA: [INSERIRE_PIVA]</p>

          <h3 className="font-serif text-2xl text-brand-primary mt-12 mb-4">2. Dati Raccolti</h3>
          <p>I dati personali raccolti tramite questo sito (es. tramite il Modulo Contatti o la Newsletter) includono:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Nome e Cognome</li>
            <li>Indirizzo Email</li>
            <li>Eventuali dati inseriti liberamente nel campo "Messaggio"</li>
          </ul>

          <h3 className="font-serif text-2xl text-brand-primary mt-12 mb-4">3. Finalità del Trattamento</h3>
          <p>I dati raccolti saranno utilizzati esclusivamente per:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Rispondere alle richieste di contatto o consulenza.</li>
            <li>Inviare la Newsletter periodica (solo previo esplicito consenso fornito al momento dell'iscrizione).</li>
          </ul>

          <h3 className="font-serif text-2xl text-brand-primary mt-12 mb-4">4. Diritti dell'Utente (GDPR)</h3>
          <p>In quanti utente europeo, secondo il GDPR hai diritto di:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Richiedere l'accesso ai tuoi dati.</li>
            <li>Richiedere la rettifica o la cancellazione degli stessi.</li>
            <li>Revocare il consenso in qualsiasi momento (es. cancellandosi dalla Newsletter).</li>
          </ul>

          <p className="mt-12 text-sm opacity-60">Ultimo aggiornamento: [Data Odierna]</p>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { ExternalLink, LegalList, LegalPage, LegalSection } from "@/components/sections/LegalPage";

export function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      seoDescription="Informazioni su cookie e tecnologie simili usati dal sito di Stefania Mastroianni: niente cookie di profilazione né analitici."
      lastUpdated="1 novembre 2026"
    >
      <p>
        Questa pagina spiega quali cookie e tecnologie simili usa il sito
        www.stefaniamastroianni.com, gestito da Stefania Mastroianni.
      </p>

      <LegalSection title="1. Cosa sono i cookie">
        <p>
          I cookie sono piccoli file di testo che un sito salva nel browser di chi lo visita,
          per poi rileggerli nelle visite successive. Esistono tecnologie simili, come il
          “local storage” del browser, che funzionano in modo analogo. Si distinguono in{" "}
          <strong className="font-semibold text-brand-contrast">tecnici</strong>, necessari a
          far funzionare il sito, e{" "}
          <strong className="font-semibold text-brand-contrast">di profilazione o analitici</strong>,
          usati per tracciare il comportamento degli utenti o mostrare pubblicità.
        </p>
      </LegalSection>

      <LegalSection title="2. Cosa usa questo sito">
        <p>
          <strong className="font-semibold text-brand-contrast">
            Questo sito non usa cookie di profilazione, pubblicitari o di statistica
          </strong>
          , e non installa cookie durante la normale navigazione.
        </p>
        <p>
          L'unica memorizzazione nel browser riguarda l'area riservata di amministrazione,
          usata solo dalla titolare del sito: dopo l'accesso, un codice di autenticazione
          viene salvato nel local storage del browser per mantenere la sessione. Si tratta di
          uno strumento tecnico, che non riguarda i visitatori.
        </p>
        <p>
          Per questo motivo il sito non mostra un banner e non chiede il consenso ai cookie.
        </p>
      </LegalSection>

      <LegalSection title="3. Servizi di terze parti">
        <p>
          Il sito non carica contenuti da servizi esterni: anche i caratteri tipografici sono
          ospitati direttamente qui, quindi navigando non trasmetti dati a terzi.
        </p>
        <p>
          Per WhatsApp e Instagram ci sono solo dei link: i cookie di questi servizi entrano in
          gioco solo se apri i link, secondo le informative di Meta.
        </p>
      </LegalSection>

      <LegalSection title="4. Come gestire i cookie nel browser">
        <p>
          Puoi comunque vedere, bloccare o cancellare cookie e dati salvati dai siti nelle
          impostazioni del tuo browser. Ecco le guide dei browser più diffusi:
        </p>
        <LegalList>
          <li>
            <ExternalLink href="https://support.google.com/chrome/answer/95647?hl=it">Google Chrome</ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop">Mozilla Firefox</ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://support.apple.com/it-it/guide/safari/sfri11471/mac">Safari</ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09">Microsoft Edge</ExternalLink>
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Maggiori informazioni">
        <p>
          Per sapere come tratto i tuoi dati personali consulta la{" "}
          <Link to="/privacy-policy" className="underline hover:text-brand-secondary">
            Privacy Policy
          </Link>
          . Per qualsiasi domanda puoi scrivermi a{" "}
          <a href="mailto:info@stefaniamastroianni.com" className="underline hover:text-brand-secondary">
            info@stefaniamastroianni.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

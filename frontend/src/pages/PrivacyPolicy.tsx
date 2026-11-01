import { Link } from "react-router-dom";
import { ExternalLink, LegalList, LegalPage, LegalSection } from "@/components/sections/LegalPage";

const EMAIL = "info@stefaniamastroianni.com";

export function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      seoDescription="Informativa sul trattamento dei dati personali degli utenti del sito di Stefania Mastroianni, ai sensi del Regolamento UE 2016/679 (GDPR)."
      lastUpdated="1 novembre 2026"
    >
      <p>
        Questa informativa, resa ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679
        (GDPR), spiega quali dati personali raccoglie questo sito, per quali scopi li
        utilizzo, per quanto tempo li conservo e quali sono i tuoi diritti.
      </p>

      <LegalSection title="1. Titolare del trattamento">
        <p>
          Stefania Mastroianni
          <br />
          Email: <a href={`mailto:${EMAIL}`} className="underline hover:text-brand-secondary">{EMAIL}</a>
          <br />
          P.IVA: 01314240076
        </p>
      </LegalSection>

      <LegalSection title="2. Quali dati raccolgo">
        <p>
          <strong className="font-semibold text-brand-contrast">Dati di navigazione.</strong>{" "}
          I sistemi che fanno funzionare il sito registrano, come avviene per qualsiasi sito
          web, alcuni dati tecnici legati alla visita: indirizzo IP, tipo di browser, pagine
          richieste, data e ora. Servono solo a garantire il funzionamento e la sicurezza del
          sito e non vengono usati per identificarti.
        </p>
        <p>
          <strong className="font-semibold text-brand-contrast">Dati che mi fornisci tu.</strong>{" "}
          Raccolgo solo i dati che scegli di inviarmi:
        </p>
        <LegalList>
          <li>
            <strong className="font-semibold text-brand-contrast">Modulo contatti:</strong>{" "}
            nome, indirizzo email e il testo del messaggio.
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Newsletter:</strong>{" "}
            indirizzo email.
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Commenti al blog:</strong>{" "}
            il nome che scegli e il testo del commento, che dopo la mia approvazione viene
            pubblicato sul sito ed è visibile a tutti.
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Email e WhatsApp:</strong>{" "}
            i dati contenuti nei messaggi che mi invii direttamente.
          </li>
        </LegalList>
        <p>
          Ti chiedo di non inserire nei messaggi informazioni sulla tua salute o altri dati
          particolari, se non strettamente necessari: potremo parlarne di persona durante
          l'incontro conoscitivo.
        </p>
      </LegalSection>

      <LegalSection title="3. Perché li tratto e su quale base giuridica">
        <LegalList>
          <li>
            <strong className="font-semibold text-brand-contrast">Rispondere alle tue richieste</strong>{" "}
            di informazioni, consulenze o partecipazione a eventi: il trattamento è necessario
            per dare seguito a una tua richiesta (art. 6.1.b GDPR).
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Inviarti la newsletter</strong>{" "}
            con aggiornamenti su percorsi, ritiri ed eventi: solo con il tuo consenso, che dai
            iscrivendoti (art. 6.1.a GDPR).
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Pubblicare i tuoi commenti</strong>{" "}
            al blog: sulla base del tuo consenso, espresso inviando il commento (art. 6.1.a GDPR).
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Proteggere il sito</strong>{" "}
            da abusi e malfunzionamenti, tramite i dati di navigazione: legittimo interesse del
            Titolare (art. 6.1.f GDPR).
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Adempiere agli obblighi di legge</strong>,
            ad esempio fiscali, se diventi cliente (art. 6.1.c GDPR).
          </li>
        </LegalList>
        <p>
          Non uso i tuoi dati per profilazione o pubblicità e non li vendo né li cedo a terzi
          per scopi commerciali.
        </p>
      </LegalSection>

      <LegalSection title="4. È obbligatorio fornire i dati?">
        <p>
          No, è sempre una tua scelta. Senza nome ed email, però, non posso risponderti né
          inviarti la newsletter.
        </p>
      </LegalSection>

      <LegalSection title="5. Per quanto tempo li conservo">
        <LegalList>
          <li>
            <strong className="font-semibold text-brand-contrast">Richieste di contatto:</strong>{" "}
            per il tempo necessario a gestire la richiesta e l'eventuale rapporto che ne nasce;
            puoi chiederne la cancellazione in qualsiasi momento.
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Newsletter:</strong>{" "}
            fino a quando non ti disiscrivi, con il link presente in ogni email o scrivendomi.
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Commenti:</strong>{" "}
            finché restano pubblicati, o finché non ne chiedi la rimozione.
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Dati fiscali:</strong>{" "}
            per il periodo previsto dalla legge (di norma 10 anni).
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">Dati di navigazione:</strong>{" "}
            per un periodo limitato, poi vengono cancellati automaticamente.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="6. Chi altro può trattare i dati">
        <p>I dati sono trattati da me e, solo per quanto necessario, da questi fornitori:</p>
        <LegalList>
          <li>
            <strong className="font-semibold text-brand-contrast">Aruba S.p.A.</strong>{" "}
            (Italia), che ospita il sito, il database e la posta elettronica.
          </li>
          <li>
            <strong className="font-semibold text-brand-contrast">WhatsApp (Meta)</strong>,
            solo se scegli di scrivermi su WhatsApp: in quel caso si applica anche la{" "}
            <ExternalLink href="https://www.whatsapp.com/legal/privacy-policy-eea">
              privacy policy di WhatsApp
            </ExternalLink>
            .
          </li>
        </LegalList>
        <p>
          Il link al mio profilo Instagram porta a un sito esterno, con una sua informativa.
          Il sito non carica risorse da servizi esterni: anche i caratteri tipografici sono
          ospitati direttamente qui.
        </p>
      </LegalSection>

      <LegalSection title="7. I tuoi diritti">
        <p>In base agli artt. 15-22 del GDPR puoi, in qualsiasi momento:</p>
        <LegalList>
          <li>sapere quali tuoi dati tratto e riceverne una copia;</li>
          <li>chiederne la correzione o la cancellazione;</li>
          <li>chiedere di limitarne il trattamento o opporti a esso;</li>
          <li>ricevere i dati che mi hai fornito in un formato leggibile (portabilità);</li>
          <li>revocare il consenso dato, ad esempio disiscrivendoti dalla newsletter, senza che ciò tocchi quanto fatto prima della revoca.</li>
        </LegalList>
        <p>
          Per esercitarli basta scrivere a{" "}
          <a href={`mailto:${EMAIL}`} className="underline hover:text-brand-secondary">{EMAIL}</a>
          . Se ritieni che i tuoi dati siano trattati in modo non corretto, puoi anche
          presentare reclamo al{" "}
          <ExternalLink href="https://www.garanteprivacy.it">
            Garante per la protezione dei dati personali
          </ExternalLink>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Cookie">
        <p>
          Per sapere come il sito usa cookie e tecnologie simili, consulta la{" "}
          <Link to="/cookie-policy" className="underline hover:text-brand-secondary">
            Cookie Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Modifiche">
        <p>
          Questa informativa può essere aggiornata nel tempo. La versione in vigore è sempre
          quella pubblicata su questa pagina, con la data dell'ultimo aggiornamento.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

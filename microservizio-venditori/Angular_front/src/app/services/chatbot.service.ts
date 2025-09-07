// src/app/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class chatbotService {

  // Mantieni la struttura leggibile: keys "umanamente leggibili".
  // Ma la mappa interna userà le chiavi NORMALIZZATE (lowercase + trim).
  private rawRaccomandazioni: Record<string, string[]> = {
    "Investitori,budget limitato,Location,Urgente": [
      "Prepara una brochure digitale professionale con dati di mercato e ritorno sull’investimento ben evidenziati.",
      "Promuovila tramite campagne mirate su LinkedIn e inviala via email a investitori selezionati.",
      "Punta su messaggi brevi e incisivi che sottolineano l’urgenza e l’opportunità di acquisto."
    ],
    "Investitori,budget limitato,Location,Posso aspettare": [
      "Implementa una newsletter periodica per mantenere aggiornati gli investitori interessati.",
      "Cura contenuti SEO mirati per il settore immobiliare, valorizzando la posizione strategica dell’immobile.",
      "Utilizza blog e social network per costruire una community senza pressioni di vendita."
    ],
    "Investitori,budget limitato,Caratteristica interna,Urgente": [
      "Realizza un video rapido focalizzato sulla caratteristica chiave dell’immobile (es. impianti innovativi).",
      "Diffondilo su YouTube, Reddit e forum di investitori, con call-to-action chiare per spingere una decisione rapida."
    ],
    "Investitori,budget limitato,Caratteristica interna,Posso aspettare": [
      "Crea una presentazione PowerPoint scaricabile che evidenzi le caratteristiche tecniche e i vantaggi.",
      "Attiva campagne di email drip marketing per educare e coinvolgere gli investitori nel tempo."
    ],
    "Investitori,budget elevato,Location,Urgente": [
      "Offri un tour virtuale 3D dettagliato dell’immobile e organizza webinar live con dati di rendimento e analisi finanziarie.",
      "Usa campagne Pay-Per-Click su portali specializzati, puntando sull’urgenza e la posizione strategica."
    ],
    "Investitori,budget elevato,Location,Posso aspettare": [
      "Organizza webinar mensili per aggiornare gli investitori.",
      "Costruisci una strategia LinkedIn di lungo termine per rafforzare la reputazione e mantenere contatti con potenziali acquirenti."
    ],
    "Investitori,budget elevato,Caratteristica interna,Urgente": [
      "Produci un video professionale di alta qualità focalizzato sulle caratteristiche esclusive.",
      "Accompagna il video con attività di PR digitale su magazine e portali immobiliari, con call-to-action aggressive per stimolare decisioni rapide."
    ],
    "Investitori,budget elevato,Caratteristica interna,Posso aspettare": [
      "Gestisci un blog con case study dettagliati sull’immobile, mostrando dati di rendimento e potenziale crescita.",
      "Accompagna con campagne di email marketing per mantenere alto l’interesse."
    ],
    "Famiglie,budget limitato,Location,Urgente": [
      "Organizza open house nel quartiere, supportati da volantinaggio mirato.",
      "Usa Facebook Ads geolocalizzate per famiglie in zona e promuovi visite rapide e senza impegno."
    ],
    "Famiglie,budget limitato,Location,Posso aspettare": [
      "Pubblica annunci gratuiti su gruppi Facebook locali e bacheche comunitarie, aggiornandoli regolarmente.",
      "Mantieni contatti costanti tramite messaggi e newsletter settimanali, senza pressioni."
    ],
    "Famiglie,budget limitato,Caratteristica interna,Urgente": [
      "Scatta foto emozionali dell’immobile, puntando su spazi vivibili e comfort.",
      "Pubblica annunci su Facebook Marketplace con offerte speciali limitate nel tempo."
    ],
    "Famiglie,budget limitato,Caratteristica interna,Posso aspettare": [
      "Crea video brevi coinvolgenti per Instagram Reels e Pinterest, mostrando estetica e caratteristiche.",
      "Mantieni aggiornamenti regolari per coinvolgere senza fretta."
    ],
    "Famiglie,budget elevato,Location,Urgente": [
      "Produci video con riprese drone per mostrare quartiere e zona.",
      "Attiva campagne Google Ads geolocalizzate per famiglie, puntando su comodità e servizi locali."
    ],
    "Famiglie,budget elevato,Location,Posso aspettare": [
      "Realizza mini documentari emozionali sul quartiere, con testimonianze di residenti e servizi vicini.",
      "Rivolgiti a famiglie con bambini tramite campagne social e blog tematici."
    ],
    "Famiglie,budget elevato,Caratteristica interna,Urgente": [
      "Fai home staging professionale per valorizzare ogni ambiente, abbina video emozionali e attiva campagne di remarketing su YouTube per ricordare l’immobile agli interessati."
    ],
    "Famiglie,budget elevato,Caratteristica interna,Posso aspettare": [
      "Produci video-interviste con l’ex proprietario che racconta la storia e i vantaggi.",
      "Crea un sito web dedicato con blog per mantenere alto l’interesse e accompagnare il percorso decisionale."
    ]
  };

  // Mappa interna con chiavi normalizzate (lowercase + trim)
  private mapNormalized: Map<string, string[]> = new Map();

  constructor() {
    // costruiamo la mappa normalizzata
    Object.keys(this.rawRaccomandazioni).forEach(k => {
      const normalized = chatbotService.normalizeKey(k);
      this.mapNormalized.set(normalized, this.rawRaccomandazioni[k]);
    });
  }

  // normalizzazione: toLowerCase e trim degli elementi separati da virgola
  private static normalizeKey(keyOrArray: string | string[]): string {
    if (Array.isArray(keyOrArray)) {
      return keyOrArray.map(s => (s || '').toString().trim().toLowerCase()).join(',');
    } else {
      return keyOrArray.toString().split(',').map(s => (s || '').trim().toLowerCase()).join(',');
    }
  }

  raccomandazione(tag: string[]): Observable<string> {
    const norm = chatbotService.normalizeKey(tag);
    const arr = this.mapNormalized.get(norm);
    if (arr) {
      return of(arr.join('/n '));
    }

    // fallback: prova con qualche normalizzazione extra (es. singolare/plurale)
    // esempio: se "investitore" vs "investitori" è il problema, prova a sostituire termini chiave
    const alternativeNorm = norm
      .replace('investitore', 'investitori')
      .replace('famiglia', 'famiglie');
    const altArr = this.mapNormalized.get(alternativeNorm);
    if (altArr) return of(altArr.join('/n '));

    console.warn(`[ChatbotService] Nessuna raccomandazione per la chiave: "${norm}"`);
    return of("Non ci sono raccomandazioni disponibili per queste scelte.");
  }

  // restituisce array (utile per *ngFor)
  getRaccomandazione(tag: string[]): string[] {
    const norm = chatbotService.normalizeKey(tag);
    const arr = this.mapNormalized.get(norm);
    if (arr) return arr;

    const alternativeNorm = norm
      .replace('investitore', 'investitori')
      .replace('famiglia', 'famiglie');
    const altArr = this.mapNormalized.get(alternativeNorm);
    if (altArr) return altArr;

    console.warn(`[ChatbotService] Nessuna raccomandazione per la chiave: "${norm}"`);
    return ["Non ci sono raccomandazioni disponibili per queste scelte."];
  }
}

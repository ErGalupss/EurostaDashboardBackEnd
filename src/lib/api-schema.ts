/**
 * SCHEMA LOGICO DATI NORMALIZZATO
 * 
 * Entità Principale: Incarico (Pratica)
 * Primary Key: Incarico (ID univoco)
 * 
 * Campi:
 * - Incarico: string (PK)
 * - Commessa: string
 * - CPI: string
 * - RegioneRiferimento: string
 * - Richiedente: string
 * - CodiceFiscale: string
 * - ProvinciaRichiedente: string
 * - StatoWorkFlow: string (FK -> Stato)
 * - DataUltimaTransizione: datetime
 * - DataUltimaModifica: datetime
 * - DataRichiesta: datetime (Inizio Pratica / Primo Invio PEC)
 * - Lavorata: boolean / enum ("SI", "NO")
 * - CategoriaRiscontrata: string
 * - Partner: string
 * - EsitoPEC: enum ("Da inviare", "Inviata", "Pec non inviata")
 * 
 * 
 * STRUTTURA ENDPOINT API COERENTE
 * 
 * GET /api/v1/dashboard/kpi
 * Query Params: partner, incarico, richiedente, stato, regione, provincia, prodotto
 * Response: {
 *   totalIncarichi: number,
 *   tassoChiusura: number, // percentuale
 *   tempoMedioTAT: number, // giorni
 *   successRate: number // percentuale
 * }
 * 
 * GET /api/v1/dashboard/pec-funnel
 * Query Params: partner, incarico, richiedente, stato, regione, provincia, prodotto
 * Response: {
 *   daInviare: number,
 *   inviate: number,
 *   errori: number
 * }
 * 
 * GET /api/v1/dashboard/workflow-status
 * Query Params: partner, incarico, richiedente, stato, regione, provincia, prodotto
 * Response: Array<{ stato: string, count: number, percentage: number }>
 * 
 * 
 * PSEUDOCODICE FUNZIONI KPI (Backend)
 * 
 * function calculateKPIs(filters):
 *   // 1. Applica filtri (Partner, Incarico, Richiedente, Stato, Regione, Provincia, Prodotto)
 *   dataset = applyFilters(db.incarichi, filters)
 *   
 *   // 2. Calcola Totale Incarichi
 *   total = count(dataset)
 *   
 *   // 3. Filtra stati chiusi
 *   closed_states = ["Chiusa - Caricamento Errato", "Chiusa - Annullata", "Chiusa - Perfezionata", "Chiusa - Perfezionata base", "Chiusa - Perfezionata Fase I"]
 *   closed_items = dataset.filter(item => item.StatoWorkFlow in closed_states)
 *   closed_count = count(closed_items)
 *   
 *   // 4. Calcola Tasso di Chiusura
 *   tasso_chiusura = (closed_count / total) * 100
 *   
 *   // 5. Calcola Tempo Medio (TAT)
 *   total_days = 0
 *   for item in closed_items:
 *     // Data chiusura = DataUltimaModifica (quando entra in stato chiuso)
 *     // Inizio pratica = DataRichiesta (Primo Invio PEC)
 *     days = dateDiffInDays(item.DataUltimaModifica, item.DataRichiesta)
 *     total_days += max(0, days)
 *   tat = closed_count > 0 ? (total_days / closed_count) : 0
 *   
 *   // 6. Calcola Success Rate
 *   success_states = ["Chiusa - Perfezionata", "Chiusa - Perfezionata base", "Chiusa - Perfezionata Fase I"]
 *   success_items = closed_items.filter(item => item.StatoWorkFlow in success_states)
 *   success_count = count(success_items)
 *   success_rate = closed_count > 0 ? (success_count / closed_count) * 100
 *   
 *   return { total, tasso_chiusura, tat, success_rate }
 */

export const API_SCHEMA_DOC = true;

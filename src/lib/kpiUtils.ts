import { Incarico, isClosed, isSuccess } from './data';
import { differenceInDays, parseISO, format, eachMonthOfInterval, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';

export const calculateKPIs = (data: Incarico[]) => {
  const total = data.length;
  
  const closedItems = data.filter(d => isClosed(d.StatoWorkFlow));
  const closed = closedItems.length;
  const closedPercentage = total > 0 ? (closed / total) * 100 : 0;

  const totalDays = closedItems.reduce((acc, curr) => {
    // Assuming DataUltimaModifica is the close date and DataRichiesta is the start date
    return acc + Math.max(0, differenceInDays(parseISO(curr.DataUltimaModifica), parseISO(curr.DataRichiesta)));
  }, 0);
  const avgTAT = closed > 0 ? totalDays / closed : 0;

  const successItems = closedItems.filter(d => isSuccess(d.StatoWorkFlow));
  const success = successItems.length;
  const successRate = closed > 0 ? (success / closed) * 100 : 0;

  // PEC Funnel
  let pecDaInviare = 0;
  let pecInviate = 0;
  let pecErrori = 0;

  data.forEach(d => {
    const esito = (d.EsitoPEC || '').toLowerCase().trim();
    if (esito === 'da inviare') pecDaInviare++;
    else if (esito === 'inviata') pecInviate++;
    else if (esito === 'pec non inviata') pecErrori++;
  });

  return {
    total,
    closed,
    closedPercentage,
    avgTAT,
    successRate,
    pecDaInviare,
    pecInviate,
    pecErrori
  };
};

export const getTrendData = (data: Incarico[]) => {
  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  return months.map(month => {
    const monthStr = format(month, 'yyyy-MM');
    const itemsInMonth = data.filter(d => d.DataRichiesta.startsWith(monthStr));
    const closedInMonth = data.filter(d => isClosed(d.StatoWorkFlow) && d.DataUltimaModifica.startsWith(monthStr));
    
    return {
      name: format(month, 'MMM', { locale: it }),
      Richieste: itemsInMonth.length,
      Chiuse: closedInMonth.length
    };
  });
};

export const getStatusDistribution = (data: Incarico[]) => {
  const counts: Record<string, number> = {};
  data.forEach(d => {
    counts[d.StatoWorkFlow] = (counts[d.StatoWorkFlow] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

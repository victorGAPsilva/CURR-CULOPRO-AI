/** Formata "AAAA-MM" como "MM/AAAA". Retorna "" quando vazio/inválido. */
export function formatMonth(value: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value.trim());
  if (!match) return "";
  return `${match[2]}/${match[1]}`;
}

/** Monta o período de um item (experiência, formação). */
export function formatPeriod(
  start: string,
  end: string,
  current: boolean,
): string {
  const from = formatMonth(start);
  const to = current ? "Atual" : formatMonth(end);

  if (from && to) return `${from} – ${to}`;
  if (from) return `Desde ${from}`;
  if (to) return to === "Atual" ? "Atual" : `Até ${to}`;
  return "";
}

/** Rótulo relativo curto para datas de atualização (ex.: "há 3 dias"). */
export function formatRelative(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  if (!Number.isFinite(then)) return "";
  const diff = Date.now() - then;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  return new Date(isoDate).toLocaleDateString("pt-BR");
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const formatador = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatarData(data: Date): string {
  return formatador.format(data);
}

export function dataIso(data: Date): string {
  return data.toISOString().slice(0, 10);
}

import { DATE_FORMAT } from '../config/constants';

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const formatDate = (iso: string): string =>
  new Date(iso + 'T00:00:00').toLocaleDateString('es-CL', DATE_FORMAT);

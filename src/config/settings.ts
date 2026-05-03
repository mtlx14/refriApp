/**
 * Configuración centralizada de la app.
 * Agregá nuevas secciones acá (no crear archivos sueltos).
 */
export const SETTINGS = {
  /** Generación e impresión de etiquetas QR en PDF */
  print: {
    /** Cantidad de etiquetas NUEVAS a generar por tanda (saltea IDs ya en uso). */
    quantity: 900,

    /** Longitud del ID rellenado con ceros. ID 1 → "001" si padLength = 3. */
    idPadLength: 3,

    /** Desde qué número arranca la tanda. */
    startFrom: 1,

    /** Tamaño de la etiqueta individual en mm. */
    label: {
      widthMm: 17,
      heightMm: 16,
      qrSizeMm: 12,
      idFontSizePt: 5,
    },

    /** Layout de la página A4 (mm). 10 cols × 15 filas = 150 por página. */
    page: {
      format: 'a4' as const,
      orientation: 'portrait' as const,
      marginMm: 8,
      gapMm: 2,
    },

    /** Nombre del archivo PDF descargado. */
    fileName: 'refriapp-qrs',
  },
} as const;

/** Devuelve un ID formateado tipo "0001". */
export const formatLabelId = (n: number): string =>
  String(n).padStart(SETTINGS.print.idPadLength, '0');

export const APP_NAME = 'refriApp';

export const STORAGE_KEY = 'refriapp_products';

export const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

export const UI = {
  header: {
    greeting: 'Mi despensa',
    searchAriaLabel: 'Buscar producto',
  },
  form: {
    placeholderName: 'Nombre del producto',
    placeholderDescription: 'Descripción corta (opcional)',
    labelId: 'ID / código',
    labelName: 'Nombre',
    labelCategory: 'Categoría',
    labelEntryDate: 'Fecha de ingreso',
    labelDescription: 'Descripción',
    btnSave: 'Guardar',
    btnCancel: 'Cancelar',
    btnDelete: 'Eliminar',
    btnEdit: 'Editar',
  },
  sort: {
    label: 'Ordenar por',
    oldest: 'Más antiguos',
    newest: 'Más recientes',
  },
  scanner: {
    title: 'Escanear QR',
    fallbackBtn: 'Ingresar ID manual',
    placeholderId: 'Ej: 013',
    btnConfirmId: 'Confirmar',
    duplicateMsg: 'Este ID ya tiene un producto asignado.',
  },
  emptyState: 'No hay productos. Agregá el primero con el botón +.',
  options: {
    triggerAriaLabel: 'Más opciones',
    title: 'Opciones',
    printQrs: 'Imprimir códigos QR',
    printingMsg: 'Generando PDF…',
  },
} as const;

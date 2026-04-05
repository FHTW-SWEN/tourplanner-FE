export const TRANSPORT_OPTION_VALUES = ['walk', 'bike', 'car', 'public_transport'] as const;

export type TransportType = (typeof TRANSPORT_OPTION_VALUES)[number];

export const TRANSPORT_OPTIONS: ReadonlyArray<{ value: TransportType; label: string }> = [
  { value: 'walk', label: 'Walk' },
  { value: 'bike', label: 'Bike' },
  { value: 'car', label: 'Car' },
  { value: 'public_transport', label: 'Public transport' },
];

export function transportLabel(code: string): string {
  return TRANSPORT_OPTIONS.find(o => o.value === code)?.label ?? code;
}

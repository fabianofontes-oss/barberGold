export type AppMode = 'DEMO' | 'PILOT' | 'PROD';

export function getAppMode(): AppMode {
  const raw = process.env.NEXT_PUBLIC_APP_MODE;
  if (raw === 'PROD' || raw === 'PILOT' || raw === 'DEMO') return raw;
  return 'DEMO';
}

export function isProdMode(): boolean {
  return getAppMode() === 'PROD';
}

export interface PixPayloadParams {
  pixKey: string;
  beneficiaryName: string;
  city?: string;
  amount?: number;
  transactionId?: string;
}

export function generatePixPayload({
  pixKey,
  beneficiaryName,
  city = 'SAO PAULO',
  amount,
  transactionId = '***'
}: PixPayloadParams): string {
  const payload = [
    genEMV('00', '01'),
    genEMV('26', [
      genEMV('00', 'BR.GOV.BCB.PIX'),
      genEMV('01', pixKey),
    ].join('')),
    genEMV('52', '0000'),
    genEMV('53', '986'),
    amount ? genEMV('54', amount.toFixed(2)) : '',
    genEMV('58', 'BR'),
    genEMV('59', beneficiaryName.substring(0, 25).toUpperCase()),
    genEMV('60', city.substring(0, 15).toUpperCase()),
    genEMV('62', genEMV('05', transactionId)),
  ].filter(Boolean).join('');

  return payload + genEMV('63', crc16(payload + '6304'));
}

function genEMV(id: string, value: string): string {
  const size = value.length.toString().padStart(2, '0');
  return id + size + value;
}

function crc16(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

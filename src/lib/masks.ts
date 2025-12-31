/**
 * Biblioteca de mÃ¡scaras para formataÃ§Ã£o de inputs
 */

/**
 * MÃ¡scara para telefone brasileiro
 * Formato: (11) 91234-5678 ou (11) 1234-5678
 */
export function phoneMask(value: string): string {
  if (!value) return '';
  
  // Remove tudo que nÃ£o Ã© nÃºmero
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a mÃ¡scara
  if (numbers.length <= 10) {
    // Telefone fixo: (11) 1234-5678
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14);
  } else {
    // Celular: (11) 91234-5678
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }
}

/**
 * MÃ¡scara para CEP brasileiro
 * Formato: 12345-678
 */
export function cepMask(value: string): string {
  if (!value) return '';
  
  const numbers = value.replace(/\D/g, '');
  
  return numbers
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
}

/**
 * MÃ¡scara para Instagram (remove @ e espaÃ§os)
 * Formato: username
 */
export function instagramMask(value: string): string {
  if (!value) return '';
  
  // Remove @ do inÃ­cio, espaÃ§os e caracteres especiais
  return value
    .replace(/^@/, '')
    .replace(/\s/g, '')
    .replace(/[^a-zA-Z0-9._]/g, '')
    .toLowerCase();
}

/**
 * MÃ¡scara para WhatsApp (mesmo que telefone)
 * Formato: (11) 91234-5678
 */
export function whatsappMask(value: string): string {
  return phoneMask(value);
}

/**
 * Remove mÃ¡scara de telefone/WhatsApp (retorna apenas nÃºmeros)
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Remove mÃ¡scara de CEP (retorna apenas nÃºmeros)
 */
export function unmaskCep(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Busca endereÃ§o por CEP usando ViaCEP API
 */
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse | null> {
  const cleanCep = unmaskCep(cep);
  
  if (cleanCep.length !== 8) {
    return null;
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}

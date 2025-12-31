/**
 * Biblioteca de máscaras para formatação de inputs
 */

/**
 * Máscara para telefone brasileiro
 * Formato: (11) 91234-5678 ou (11) 1234-5678
 */
export function phoneMask(value: string): string {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara
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
 * Máscara para CEP brasileiro
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
 * Máscara para Instagram (remove @ e espaços)
 * Formato: username
 */
export function instagramMask(value: string): string {
  if (!value) return '';
  
  // Remove @ do início, espaços e caracteres especiais
  return value
    .replace(/^@/, '')
    .replace(/\s/g, '')
    .replace(/[^a-zA-Z0-9._]/g, '')
    .toLowerCase();
}

/**
 * Máscara para WhatsApp (mesmo que telefone)
 * Formato: (11) 91234-5678
 */
export function whatsappMask(value: string): string {
  return phoneMask(value);
}

/**
 * Remove máscara de telefone/WhatsApp (retorna apenas números)
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Remove máscara de CEP (retorna apenas números)
 */
export function unmaskCep(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Busca endereço por CEP usando ViaCEP API
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

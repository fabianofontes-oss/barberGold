import { toast } from 'sonner';

/**
 * Wrapper para server actions que adiciona toast notifications automaticamente
 * @param action - Server action a ser executada
 * @param options - Mensagens de sucesso/erro personalizadas
 */
export async function withToast<T>(
    action: () => Promise<T>,
    options: {
        loading?: string;
        success?: string;
        error?: string;
    }
): Promise<T> {
    const loadingToast = toast.loading(options.loading || 'Processando...');

    try {
        const result = await action();
        toast.success(options.success || 'Operação realizada com sucesso!', {
            id: loadingToast
        });
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        toast.error(options.error || errorMessage, {
            id: loadingToast
        });
        throw error;
    }
}

/**
 * Hook para facilitar uso de actions com toast
 */
export function useActionWithToast() {
    return {
        execute: withToast
    };
}

import { test, expect } from '@playwright/test';

test.describe('Fluxo Crítico: PDV e Venda', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@barbergold.com');
        await page.fill('input[type="password"]', 'Admin123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('/app/dashboard');
    });

    test('deve criar uma venda no PDV', async ({ page }) => {
        // Ir para PDV
        await page.click('text=PDV');
        await page.waitForURL('/app/pdv');

        // Adicionar serviço ao carrinho (clicar no primeiro serviço)
        const firstService = page.locator('[data-service-card]').first();
        await firstService.click();

        // Verificar que item foi adicionado ao carrinho
        await expect(page.locator('text=Itens no carrinho')).toBeVisible();

        // Selecionar método de pagamento
        await page.click('button:has-text("Dinheiro")');

        // Finalizar venda
        await page.click('button:has-text("Finalizar Venda")');

        // Verificar toast de sucesso ou modal de confirmação
        await expect(page.locator('text=Venda')).toBeVisible({ timeout: 3000 });
    });
});

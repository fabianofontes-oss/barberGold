import { test, expect } from '@playwright/test';

test.describe('Fluxo Crítico: Login e Dashboard', () => {
    test('deve fazer login e acessar dashboard', async ({ page }) => {
        // Ir para página de login
        await page.goto('/login');

        // Preencher credenciais (ajustar com suas credenciais de teste)
        await page.fill('input[type="email"]', 'admin@barbergold.com');
        await page.fill('input[type="password"]', 'Admin123!');

        // Clicar em entrar
        await page.click('button[type="submit"]');

        // Aguardar redirecionamento
        await page.waitForURL('/app/dashboard', { timeout: 5000 });

        // Verificar elementos do dashboard
        await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible();

        // Verificar navegação
        await expect(page.locator('text=Agenda')).toBeVisible();
        await expect(page.locator('text=PDV')).toBeVisible();
    });
});

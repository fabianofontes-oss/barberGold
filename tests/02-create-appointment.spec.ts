import { test, expect } from '@playwright/test';

test.describe('Fluxo Crítico: Criar Agendamento', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@barbergold.com');
        await page.fill('input[type="password"]', 'Admin123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('/app/dashboard');
    });

    test('deve criar um agendamento completo', async ({ page }) => {
        // Ir para agenda
        await page.click('text=Agenda');
        await page.waitForURL('/app/agenda');

        // Abrir modal de novo agendamento
        await page.click('button:has-text("Novo Agendamento")');

        // Aguardar modal abrir
        await expect(page.locator('text=New Appointment')).toBeVisible();

        // Selecionar cliente (primeiro da lista)
        await page.selectOption('select', { index: 1 });

        // Selecionar serviço (já vem pré-selecionado)

        // Definir horário
        await page.fill('input[type="time"]', '10:00');

        // Salvar
        await page.click('button:has-text("Book Now")');

        // Verificar que modal fechou
        await expect(page.locator('text=New Appointment')).not.toBeVisible();

        // Verificar agendamento criado (deve aparecer na lista)
        await expect(page.locator('text=10:00')).toBeVisible();
    });
});

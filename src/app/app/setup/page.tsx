'use client';

export default function SetupPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Configuração Inicial
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure sua barbearia para começar a usar o sistema
          </p>
        </div>
        <div className="p-6 pt-0">
          <p className="text-muted-foreground">
            Página de configuração em desenvolvimento.
          </p>
        </div>
      </div>
    </div>
  );
}

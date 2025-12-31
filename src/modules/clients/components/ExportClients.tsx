'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, Loader2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Client } from '@/types';

interface ExportClientsProps {
  clients: Client[];
  shopName: string;
}

export const ExportClients: React.FC<ExportClientsProps> = ({ clients, shopName }) => {
  const [isExporting, setIsExporting] = useState(false);

  const generateCSV = () => {
    const headers = [
      'Nome',
      'Telefone',
      'Email',
      'Data Nascimento',
      'Total Gasto',
      'Ãšltima Visita',
      'Pontos Fidelidade',
      'CÃ³digo IndicaÃ§Ã£o',
      'Tags',
      'Dependentes',
    ];

    const rows = clients.map((client) => [
      client.name,
      client.phone,
      client.email || '',
      client.birthDate || '',
      `R$ ${client.totalSpent.toFixed(2)}`,
      client.lastVisit ? format(new Date(client.lastVisit), 'dd/MM/yyyy') : '',
      client.loyaltyPoints || 0,
      client.referralCode || '',
      (client.tags || []).join(', '),
      (client.dependents || []).map((d) => d.name).join(', '),
    ]);

    const csvContent = [
      `ExportaÃ§Ã£o de Clientes - ${shopName}`,
      `Gerado em: ${format(new Date(), "dd/MM/yyyy 'Ã s' HH:mm", { locale: ptBR })}`,
      `Total de clientes: ${clients.length}`,
      '',
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csv = generateCSV();
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clientes-${shopName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || clients.length === 0}
      className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
      )}
      Exportar CSV
    </button>
  );
};

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ChipReport } from "@/types/chip";

interface ExportButtonProps {
  reports: ChipReport[];
}

export const ExportButton = ({ reports }: ExportButtonProps) => {
  const exportToCSV = () => {
    if (!reports || reports.length === 0) {
      return;
    }

    // Header CSV
    const headers = [
      'Tanggal',
      'Produk',
      'Nama',
      'Chip',
      'Tipe',
      'Discount (%)',
      'Saldo Awal',
      'Penambahan',
      'Saldo Akhir',
      'Saldo ACT',
      'Pemakaian',
      'Sisa Saldo',
      'Laba'
    ];

    // Data rows
    const rows = reports.map(report => [
      report.tanggal,
      report.produk,
      report.nama,
      report.chip,
      report.tipe,
      report.discount,
      report.saldo_awal,
      report.penambahan,
      report.saldo_akhir,
      report.saldo_act,
      report.pemakaian,
      report.sisa_saldo,
      report.laba
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-chip-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={exportToCSV}
      variant="outline"
      size="sm"
      disabled={!reports || reports.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
};
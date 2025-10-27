import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChipReports } from "@/hooks/useChipReports";
import { Trash2 } from "lucide-react";
import { Produk } from "@/types/chip";
import { ExportButton } from "@/components/ExportButton";

export const ChipReportList = () => {
  const { reports, isLoading, deleteReport } = useChipReports();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterProduk, setFilterProduk] = useState<Produk | 'ALL'>('ALL');

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Math.abs(angka));
  };

  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredReports = reports?.filter(report => 
    filterProduk === 'ALL' || report.produk === filterProduk
  ) || [];

  const totalLaba = filteredReports.reduce((sum, report) => sum + report.laba, 0);
  const totalPemakaian = filteredReports.reduce((sum, report) => sum + report.pemakaian, 0);

  if (isLoading) {
    return <Card><CardContent className="p-8 text-center">Memuat data...</CardContent></Card>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>📊 History Laporan</CardTitle>
            <div className="flex gap-2">
              <ExportButton reports={filteredReports} />
              <Select value={filterProduk} onValueChange={(v) => setFilterProduk(v as Produk | 'ALL')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Produk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Produk</SelectItem>
                  <SelectItem value="ISAT">ISAT</SelectItem>
                  <SelectItem value="THREE">THREE</SelectItem>
                  <SelectItem value="SMART">SMART</SelectItem>
                  <SelectItem value="AXIS">AXIS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada laporan</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Total Pemakaian</p>
                    <p className="text-xl font-bold text-primary">{formatRupiah(totalPemakaian)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Total Laba</p>
                    <p className="text-xl font-bold text-primary">{formatRupiah(totalLaba)}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead className="text-right">Pemakaian</TableHead>
                      <TableHead className="text-right">Laba</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="whitespace-nowrap">{formatTanggal(report.tanggal)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.produk}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{report.nama}</TableCell>
                        <TableCell>
                          <Badge variant={report.tipe === 'Saldo' ? 'default' : 'secondary'}>
                            {report.tipe}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatRupiah(report.pemakaian)}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatRupiah(report.laba)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(report.id || null)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Laporan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteReport.mutate(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
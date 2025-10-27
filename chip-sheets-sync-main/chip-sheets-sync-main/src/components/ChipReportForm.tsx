import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CHIP_DATA, ChipData, Produk, Tipe, ChipReport } from "@/types/chip";
import { useChipReports } from "@/hooks/useChipReports";
import { sendToZapier } from "@/components/ZapierIntegration";

export const ChipReportForm = () => {
  const { createReport } = useChipReports();
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [produk, setProduk] = useState<Produk>('ISAT');
  const [selectedChip, setSelectedChip] = useState<ChipData>(CHIP_DATA.ISAT[0]);
  const [tipe, setTipe] = useState<Tipe>('Saldo');
  const [saldoAwal, setSaldoAwal] = useState(0);
  const [penambahan, setPenambahan] = useState(0);
  const [saldoAkhir, setSaldoAkhir] = useState(0);
  const [saldoAct, setSaldoAct] = useState(0);
  const [awalServer, setAwalServer] = useState(0);
  const [tambahServer, setTambahServer] = useState(0);
  const [akhirServer, setAkhirServer] = useState(0);

  useEffect(() => {
    setSelectedChip(CHIP_DATA[produk][0]);
  }, [produk]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Math.abs(angka));
  };

  const hitungNonAxis = () => {
    const pemakaian = saldoAwal + penambahan - saldoAkhir;
    const laba = tipe === 'Saldo' ? (pemakaian * selectedChip.disc) / 100 : 0;
    return { pemakaian, laba };
  };

  const hitungAxis = () => {
    const pemakaian = awalServer + tambahServer - akhirServer;
    const sisaSaldo = akhirServer - saldoAct;
    const laba = (pemakaian * selectedChip.disc) / 100;
    return { pemakaian, sisaSaldo, laba };
  };

  const handleSubmit = async () => {
    let report: ChipReport;

    if (produk === 'AXIS') {
      const { pemakaian, sisaSaldo, laba } = hitungAxis();
      
      if (pemakaian < 0 || sisaSaldo < 0) {
        return;
      }

      report = {
        tanggal,
        produk,
        nama: selectedChip.nama,
        chip: selectedChip.chip,
        tipe: 'Saldo',
        discount: selectedChip.disc,
        saldo_awal: awalServer,
        penambahan: tambahServer,
        saldo_akhir: akhirServer,
        saldo_act: saldoAct,
        pemakaian,
        sisa_saldo: sisaSaldo,
        laba: Math.round(laba)
      };
    } else {
      const { pemakaian, laba } = hitungNonAxis();
      
      if (pemakaian < 0) {
        return;
      }

      report = {
        tanggal,
        produk,
        nama: selectedChip.nama,
        chip: selectedChip.chip,
        tipe,
        discount: selectedChip.disc,
        saldo_awal: saldoAwal,
        penambahan,
        saldo_akhir: saldoAkhir,
        saldo_act: 0,
        pemakaian,
        sisa_saldo: saldoAkhir,
        laba: Math.round(laba)
      };
    }

    createReport.mutate(report);
    
    // Kirim ke Zapier jika aktif
    sendToZapier(report);
    
    // Reset form
    setSaldoAwal(0);
    setPenambahan(0);
    setSaldoAkhir(0);
    setSaldoAct(0);
    setAwalServer(0);
    setTambahServer(0);
    setAkhirServer(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📋 Laporan Chip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tanggal">Tanggal</Label>
          <Input
            id="tanggal"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="produk">Produk</Label>
          <Select value={produk} onValueChange={(v) => setProduk(v as Produk)}>
            <SelectTrigger id="produk">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ISAT">PRODUK ISAT</SelectItem>
              <SelectItem value="THREE">PRODUK THREE</SelectItem>
              <SelectItem value="SMART">PRODUK SMART</SelectItem>
              <SelectItem value="AXIS">PRODUK AXIS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nama">Nama & CHIP</Label>
          <Select 
            value={selectedChip.chip} 
            onValueChange={(v) => {
              const chip = CHIP_DATA[produk].find(c => c.chip === v);
              if (chip) setSelectedChip(chip);
            }}
          >
            <SelectTrigger id="nama">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHIP_DATA[produk].map((item) => (
                <SelectItem key={item.chip} value={item.chip}>
                  {item.nama} ({item.chip})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary">Discount: {selectedChip.disc}%</Badge>
        </div>

        {produk !== 'AXIS' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="tipe">Tipe</Label>
              <Select value={tipe} onValueChange={(v) => setTipe(v as Tipe)}>
                <SelectTrigger id="tipe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saldo">Saldo</SelectItem>
                  <SelectItem value="Komisi">Komisi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipe === 'Komisi' && (
              <Alert>
                <AlertDescription>
                  ⚠️ Tipe "Komisi" tidak termasuk potongan discount. Laba = Rp 0.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="awal">Saldo Awal (Rp)</Label>
              <Input
                id="awal"
                type="number"
                value={saldoAwal || ''}
                onChange={(e) => setSaldoAwal(Number(e.target.value))}
                placeholder="Contoh: 1000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tambah">Penambahan (Rp)</Label>
              <Input
                id="tambah"
                type="number"
                value={penambahan || ''}
                onChange={(e) => setPenambahan(Number(e.target.value))}
                placeholder="Contoh: 500000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="akhir">Saldo Akhir (Rp)</Label>
              <Input
                id="akhir"
                type="number"
                value={saldoAkhir || ''}
                onChange={(e) => setSaldoAkhir(Number(e.target.value))}
                placeholder="Contoh: 300000"
              />
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Pemakaian: <span className="text-primary">{formatRupiah(hitungNonAxis().pemakaian)}</span>
                  </p>
                  <p className="text-sm font-medium">
                    Laba: <span className="text-primary">{formatRupiah(hitungNonAxis().laba)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {produk === 'AXIS' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="saldo-act">💰 Saldo ACT (Rp)</Label>
              <Input
                id="saldo-act"
                type="number"
                value={saldoAct || ''}
                onChange={(e) => setSaldoAct(Number(e.target.value))}
                placeholder="Contoh: 100000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="awal-server">💻 Saldo Awal SERVER (Rp)</Label>
              <Input
                id="awal-server"
                type="number"
                value={awalServer || ''}
                onChange={(e) => setAwalServer(Number(e.target.value))}
                placeholder="Contoh: 1000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tambah-server">Penambahan SERVER (Rp)</Label>
              <Input
                id="tambah-server"
                type="number"
                value={tambahServer || ''}
                onChange={(e) => setTambahServer(Number(e.target.value))}
                placeholder="Contoh: 500000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="akhir-server">Saldo Akhir SERVER (Rp)</Label>
              <Input
                id="akhir-server"
                type="number"
                value={akhirServer || ''}
                onChange={(e) => setAkhirServer(Number(e.target.value))}
                placeholder="Contoh: 300000"
              />
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Pemakaian SERVER: <span className="text-primary">{formatRupiah(hitungAxis().pemakaian)}</span>
                  </p>
                  <p className="text-sm font-medium">
                    Sisa Saldo (Bersih): <span className="text-primary">{formatRupiah(hitungAxis().sisaSaldo)}</span>
                  </p>
                  <p className="text-sm font-medium">
                    Laba: <span className="text-primary">{formatRupiah(hitungAxis().laba)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={createReport.isPending}
        >
          {createReport.isPending ? "Menyimpan..." : "📤 Simpan Laporan"}
        </Button>
      </CardContent>
    </Card>
  );
};
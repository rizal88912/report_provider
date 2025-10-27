-- Tabel untuk menyimpan laporan chip
CREATE TABLE public.chip_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL,
  produk TEXT NOT NULL CHECK (produk IN ('ISAT', 'THREE', 'SMART', 'AXIS')),
  nama TEXT NOT NULL,
  chip TEXT NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('Saldo', 'Komisi')),
  discount DECIMAL(5,2) NOT NULL DEFAULT 0,
  saldo_awal BIGINT NOT NULL DEFAULT 0,
  penambahan BIGINT NOT NULL DEFAULT 0,
  saldo_akhir BIGINT NOT NULL DEFAULT 0,
  saldo_act BIGINT NOT NULL DEFAULT 0,
  pemakaian BIGINT NOT NULL DEFAULT 0,
  sisa_saldo BIGINT NOT NULL DEFAULT 0,
  laba BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chip_reports ENABLE ROW LEVEL SECURITY;

-- Policy untuk membaca semua data (public)
CREATE POLICY "Anyone can view chip reports" 
ON public.chip_reports 
FOR SELECT 
USING (true);

-- Policy untuk insert data (public)
CREATE POLICY "Anyone can insert chip reports" 
ON public.chip_reports 
FOR INSERT 
WITH CHECK (true);

-- Policy untuk update data (public)
CREATE POLICY "Anyone can update chip reports" 
ON public.chip_reports 
FOR UPDATE 
USING (true);

-- Policy untuk delete data (public)
CREATE POLICY "Anyone can delete chip reports" 
ON public.chip_reports 
FOR DELETE 
USING (true);

-- Index untuk performa
CREATE INDEX idx_chip_reports_tanggal ON public.chip_reports(tanggal DESC);
CREATE INDEX idx_chip_reports_produk ON public.chip_reports(produk);
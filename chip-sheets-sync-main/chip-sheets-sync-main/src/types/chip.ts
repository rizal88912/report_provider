export type Produk = 'ISAT' | 'THREE' | 'SMART' | 'AXIS';
export type Tipe = 'Saldo' | 'Komisi';

export interface ChipData {
  nama: string;
  chip: string;
  disc: number;
}

export interface ChipReport {
  id?: string;
  tanggal: string;
  produk: Produk;
  nama: string;
  chip: string;
  tipe: Tipe;
  discount: number;
  saldo_awal: number;
  penambahan: number;
  saldo_akhir: number;
  saldo_act: number;
  pemakaian: number;
  sisa_saldo: number;
  laba: number;
  created_at?: string;
}

export const CHIP_DATA: Record<Produk, ChipData[]> = {
  ISAT: [
    { nama: "Jaya Cell 1", chip: "08561048630", disc: 2.2 },
    { nama: "Jaya Cell 2", chip: "085591101748", disc: 2.0 }
  ],
  THREE: [
    { nama: "Yukee Cell", chip: "89524324270", disc: 1.5 },
    { nama: "Abadi Cell", chip: "895338232420", disc: 1.5 }
  ],
  SMART: [
    { nama: "COR36RET31452", chip: "08811621764", disc: 1.0 },
    { nama: "JBE11812", chip: "628812138611", disc: 1.0 },
    { nama: "COR36RET29465", chip: "6288973797468", disc: 1.0 }
  ],
  AXIS: [
    { nama: "KBTG", chip: "KBTG", disc: 0.2 }
  ]
};
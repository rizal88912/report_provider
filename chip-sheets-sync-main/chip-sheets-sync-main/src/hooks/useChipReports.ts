import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChipReport } from "@/types/chip";
import { useToast } from "@/hooks/use-toast";

export const useChipReports = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery({
    queryKey: ['chip-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chip_reports')
        .select('*')
        .order('tanggal', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ChipReport[];
    }
  });

  const createReport = useMutation({
    mutationFn: async (report: ChipReport) => {
      const { data, error } = await supabase
        .from('chip_reports')
        .insert(report)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chip-reports'] });
      toast({
        title: "Berhasil!",
        description: "Laporan berhasil disimpan",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal!",
        description: "Gagal menyimpan laporan: " + error.message,
        variant: "destructive",
      });
    }
  });

  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('chip_reports')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chip-reports'] });
      toast({
        title: "Berhasil!",
        description: "Laporan berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal!",
        description: "Gagal menghapus laporan: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    reports,
    isLoading,
    createReport,
    deleteReport
  };
};
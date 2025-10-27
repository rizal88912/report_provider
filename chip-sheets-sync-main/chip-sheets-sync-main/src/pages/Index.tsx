import { ChipReportForm } from "@/components/ChipReportForm";
import { ChipReportList } from "@/components/ChipReportList";
import { ZapierIntegration } from "@/components/ZapierIntegration";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Sistem Laporan Chip</h1>
          <p className="text-muted-foreground">Kelola laporan chip dengan mudah dan terorganisir</p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <ChipReportForm />
            <ZapierIntegration />
          </div>
          <div>
            <ChipReportList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

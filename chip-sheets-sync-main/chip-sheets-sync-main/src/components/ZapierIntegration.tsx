import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Zap } from "lucide-react";

export const ZapierIntegration = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState(
    localStorage.getItem('zapier_webhook_url') || ''
  );
  const [isEnabled, setIsEnabled] = useState(
    localStorage.getItem('zapier_enabled') === 'true'
  );

  const handleSave = () => {
    localStorage.setItem('zapier_webhook_url', webhookUrl);
    localStorage.setItem('zapier_enabled', String(isEnabled));
    
    toast({
      title: "Tersimpan!",
      description: "Pengaturan Zapier berhasil disimpan",
    });
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Masukkan URL webhook Zapier terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: "Test dari Sistem Laporan Chip"
        }),
      });

      toast({
        title: "Test Berhasil!",
        description: "Webhook berhasil dipanggil. Cek Zapier history untuk memastikan.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memanggil webhook. Periksa URL dan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Integrasi Zapier
        </CardTitle>
        <CardDescription>
          Otomatis kirim data baru ke Google Sheets via Zapier
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="zapier-enabled">Aktifkan Auto-Sync</Label>
            <Switch
              id="zapier-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
        </div>

        {isEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Simpan
              </Button>
              <Button onClick={testWebhook} variant="outline">
                Test
              </Button>
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
              <p className="font-medium">📝 Cara Setup:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Buat Zap baru di Zapier</li>
                <li>Pilih trigger "Webhooks by Zapier"</li>
                <li>Pilih "Catch Hook"</li>
                <li>Copy webhook URL ke form di atas</li>
                <li>Pilih action "Google Sheets - Create Spreadsheet Row"</li>
                <li>Map field data sesuai kebutuhan</li>
              </ol>
              <a
                href="https://zapier.com/app/zaps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline mt-2"
              >
                Buka Zapier <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const getZapierConfig = () => {
  const webhookUrl = localStorage.getItem('zapier_webhook_url');
  const isEnabled = localStorage.getItem('zapier_enabled') === 'true';
  
  return { webhookUrl, isEnabled };
};

export const sendToZapier = async (data: any) => {
  const { webhookUrl, isEnabled } = getZapierConfig();
  
  if (!isEnabled || !webhookUrl) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error sending to Zapier:', error);
  }
};
import { Button } from "@/components/ui/button";
import { generateCertificatePdf } from "@/utils/certificateGenerator";
import { Award, Download, Loader2, Printer, X } from "lucide-react";
import { useRef, useState } from "react";
import CertificateTemplate, {
  type CertificateTemplateProps,
} from "./CertificateTemplate";

interface CertificateModalProps extends CertificateTemplateProps {
  open: boolean;
  onClose: () => void;
}

export default function CertificateModal({
  open,
  onClose,
  ...certProps
}: CertificateModalProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!open) return null;

  const safeFilename = `${certProps.certificateId}`
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .toLowerCase();

  async function handleDownload() {
    if (!certRef.current) return;
    setIsGenerating(true);
    try {
      await generateCertificatePdf(certRef.current, safeFilename);
    } catch {
      // silently fail — user can always print
    } finally {
      setIsGenerating(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cert-modal-overlay"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
        tabIndex={-1}
        data-ocid="training.cert.dialog"
      >
        {/* Panel */}
        <div
          className="relative bg-card border border-border rounded-xl shadow-2xl max-w-[1200px] w-full cert-modal-panel"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-foreground font-semibold text-sm">
                Training Certificate
              </span>
              <span className="text-muted-foreground text-xs font-mono">
                {certProps.certificateId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-border gap-1.5"
                data-ocid="training.cert.print_button"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleDownload}
                disabled={isGenerating}
                className="gap-1.5"
                data-ocid="training.cert.download_button"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0"
                aria-label="Close certificate"
                data-ocid="training.cert.close_button"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Certificate preview — scrollable on small screens */}
          <div className="overflow-auto p-4 flex items-start justify-center bg-muted/20 cert-preview-area">
            <div
              className="cert-printable"
              style={{ transformOrigin: "top center" }}
            >
              <CertificateTemplate ref={certRef} {...certProps} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

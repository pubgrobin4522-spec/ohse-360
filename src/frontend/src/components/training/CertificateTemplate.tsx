import React from "react";

export interface CertificateTemplateProps {
  employeeName: string;
  employeeCode: string;
  trainingName: string;
  certificateId: string;
  issueDate: string;
  expiryDate: string;
  certStatus?: "Valid" | "ExpiringSoon" | "Expired";
}

/** A4 landscape certificate — rendered at ~1122×794px for html2canvas capture. */
const CertificateTemplate = React.forwardRef<
  HTMLDivElement,
  CertificateTemplateProps
>(function CertificateTemplate(
  {
    employeeName,
    employeeCode,
    trainingName,
    certificateId,
    issueDate,
    expiryDate,
    certStatus,
  },
  ref,
) {
  const statusColor =
    certStatus === "Expired"
      ? "#ef4444"
      : certStatus === "ExpiringSoon"
        ? "#f59e0b"
        : "#22c55e";

  return (
    <div
      ref={ref}
      style={{
        width: "1122px",
        height: "794px",
        backgroundColor: "#0f1923",
        fontFamily: "Georgia, 'Times New Roman', serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* ── Outer decorative border */}
      <div
        style={{
          position: "absolute",
          inset: "12px",
          border: "2px solid #22c55e",
          borderRadius: "4px",
          pointerEvents: "none",
        }}
      />
      {/* ── Amber inner border */}
      <div
        style={{
          position: "absolute",
          inset: "20px",
          border: "1px solid rgba(245,158,11,0.45)",
          borderRadius: "2px",
          pointerEvents: "none",
        }}
      />

      {/* ── Corner ornaments (CSS-only diamonds) */}
      {(
        [
          [16, 16],
          [16, "auto"],
          ["auto", 16],
          ["auto", "auto"],
        ] as const
      ).map(([t, l]) => (
        <div
          key={`corner-${String(t)}-${String(l)}`}
          style={{
            position: "absolute",
            top: typeof t === "number" ? t : undefined,
            bottom: t === "auto" ? 16 : undefined,
            left: typeof l === "number" ? l : undefined,
            right: l === "auto" ? 16 : undefined,
            width: "14px",
            height: "14px",
            border: "2px solid #f59e0b",
            transform: "rotate(45deg)",
            backgroundColor: "#0f1923",
          }}
        />
      ))}

      {/* ── Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #22c55e 100%)",
        }}
      />

      {/* ── Content area */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "36px 56px 32px",
          boxSizing: "border-box",
        }}
      >
        {/* ── Header row: RKTR + OHSE 360 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          {/* RKTR wordmark */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontFamily: "Arial Black, Arial, sans-serif",
                fontWeight: 900,
                fontSize: "32px",
                color: "#ffffff",
                letterSpacing: "6px",
                lineHeight: 1,
              }}
            >
              RKTR
            </span>
            <span
              style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontFamily: "Arial, sans-serif",
              }}
            >
              SAFETY &amp; COMPLIANCE
            </span>
          </div>

          {/* OHSE 360 + status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: 700,
                fontSize: "18px",
                color: "#22c55e",
                letterSpacing: "2px",
              }}
            >
              OHSE 360
            </span>
            <span
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "9px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Occupational Health, Safety &amp; Environment
            </span>
            {certStatus && (
              <span
                style={{
                  fontSize: "9px",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: statusColor,
                  border: `1px solid ${statusColor}`,
                  borderRadius: "99px",
                  padding: "2px 10px",
                  marginTop: "2px",
                }}
              >
                {certStatus === "ExpiringSoon"
                  ? "EXPIRING SOON"
                  : certStatus.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* ── Horizontal divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #22c55e 20%, #f59e0b 50%, #22c55e 80%, transparent)",
            marginBottom: "22px",
          }}
        />

        {/* ── Main title */}
        <div style={{ textAlign: "center", marginBottom: "6px" }}>
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "30px",
              fontWeight: 700,
              color: "#f59e0b",
              letterSpacing: "6px",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Certificate of Completion
          </h1>
        </div>

        {/* ── Sub-line */}
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.55)",
            fontSize: "12px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontFamily: "Arial, sans-serif",
            margin: "0 0 18px",
          }}
        >
          This is to certify that
        </p>

        {/* ── Employee name */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "38px",
              fontWeight: 700,
              color: "#22c55e",
              letterSpacing: "1px",
              lineHeight: 1.1,
            }}
          >
            {employeeName}
          </span>
          <div
            style={{
              display: "inline-block",
              marginLeft: "12px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "1px",
              verticalAlign: "middle",
            }}
          >
            [{employeeCode}]
          </div>
        </div>

        {/* ── Completion line */}
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.65)",
            fontSize: "13px",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "1px",
            margin: "0 0 10px",
          }}
        >
          has successfully completed the training program
        </p>

        {/* ── Training name */}
        <p
          style={{
            textAlign: "center",
            color: "#ffffff",
            fontSize: "20px",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 600,
            letterSpacing: "1px",
            margin: "0 0 22px",
          }}
        >
          &ldquo;{trainingName}&rdquo;
        </p>

        {/* ── Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(245,158,11,0.3)",
            marginBottom: "20px",
          }}
        />

        {/* ── Detail row: dates + cert ID */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          {/* Issue date */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "9px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "Arial, sans-serif",
                margin: "0 0 4px",
              }}
            >
              Issue Date
            </p>
            <p
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontFamily: "'Courier New', Courier, monospace",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "1px",
              }}
            >
              {issueDate}
            </p>
          </div>

          {/* Cert ID center */}
          <div
            style={{
              textAlign: "center",
              flex: 2,
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              borderRight: "1px solid rgba(255,255,255,0.1)",
              padding: "0 20px",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "9px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "Arial, sans-serif",
                margin: "0 0 4px",
              }}
            >
              Certificate ID
            </p>
            <p
              style={{
                color: "#f59e0b",
                fontSize: "15px",
                fontFamily: "'Courier New', Courier, monospace",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "2px",
              }}
            >
              {certificateId}
            </p>
          </div>

          {/* Expiry date */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "9px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "Arial, sans-serif",
                margin: "0 0 4px",
              }}
            >
              Expiry Date
            </p>
            <p
              style={{
                color:
                  expiryDate === "—" ? "rgba(255,255,255,0.5)" : statusColor,
                fontSize: "14px",
                fontFamily: "'Courier New', Courier, monospace",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "1px",
              }}
            >
              {expiryDate}
            </p>
          </div>
        </div>

        {/* ── Footer row */}
        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid rgba(34,197,94,0.25)",
            paddingTop: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Seal placeholder */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                border: "2px solid #22c55e",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  border: "1px solid rgba(34,197,94,0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    color: "#22c55e",
                    fontFamily: "Arial Black, Arial, sans-serif",
                    letterSpacing: "0",
                  }}
                >
                  RK
                </span>
              </div>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "12px",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                OHSE Safety Authority
              </p>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "9px",
                  fontFamily: "Arial, sans-serif",
                  letterSpacing: "1px",
                }}
              >
                Authorized Issuing Body
              </p>
            </div>
          </div>

          {/* Signature line */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "140px",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                marginBottom: "4px",
              }}
            />
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.4)",
                fontSize: "9px",
                fontFamily: "Arial, sans-serif",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Authorised Signatory
            </p>
          </div>

          {/* Issued by / RKTR right */}
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                margin: "0 0 2px",
                color: "rgba(255,255,255,0.35)",
                fontSize: "9px",
                fontFamily: "Arial, sans-serif",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Issued by
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "Arial Black, Arial, sans-serif",
                fontWeight: 900,
                fontSize: "16px",
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "4px",
              }}
            >
              RKTR
            </p>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.25)",
                fontSize: "8px",
                fontFamily: "Arial, sans-serif",
                letterSpacing: "1px",
              }}
            >
              ohse360.rktr.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CertificateTemplate;

const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-o5KNRZJC.js","assets/index-BzAcXe3o.css"])))=>i.map(i=>d[i]);
import { a as createLucideIcon, R as React, j as jsxRuntimeExports, r as reactExports, B as Button, u as useBackend, d as useAuth, f as useQuery, o as BookOpen, w as CertificateStatus, I as Input, x as TrainingType, U as Users, A as AttendanceStatus, h as useQueryClient, y as TrainingFrequency, i as useMutation, n as ue, m as Label, _ as __vitePreload } from "./index-o5KNRZJC.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BC0tVdjJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DLpeTQN2.js";
import { S as Skeleton } from "./skeleton-FWJuhcbn.js";
import { A as Award } from "./award-zEdQuhfk.js";
import { L as LoaderCircle } from "./loader-circle-BLgF8ams.js";
import { D as Download } from "./download-ClH3W2L_.js";
import { X, P as Plus } from "./x-CXE19MnU.js";
import { C as CircleCheckBig } from "./circle-check-big-CmR7_H-4.js";
import { S as Search } from "./search-naONrdle.js";
import { C as CircleX } from "./circle-x-CUsDDx9A.js";
import "./index-BgKcp2pS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode);
async function generateCertificatePdf(element, filename) {
  const html = element.outerHTML;
  const styleLinks = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]')
  ).map((l) => `<link rel="stylesheet" href="${l.href}">`).join("\n");
  const inlineStyles = Array.from(document.querySelectorAll("style")).map((s) => `<style>${s.textContent}</style>`).join("\n");
  const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${filename}</title>
  ${styleLinks}
  ${inlineStyles}
  <style>
    @page { size: A4 landscape; margin: 0; }
    body { margin: 0; padding: 0; background: #0f172a; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  </style>
</head>
<body>
  ${html}
  <script>window.onload = function() { window.focus(); window.print(); window.close(); };<\/script>
</body>
</html>`;
  const popup = window.open(
    "",
    "_blank",
    "width=1200,height=850,menubar=no,toolbar=no"
  );
  if (!popup) {
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:0;height:0;border:none;";
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printHtml);
      iframeDoc.close();
      setTimeout(() => {
        var _a;
        try {
          (_a = iframe.contentWindow) == null ? void 0 : _a.print();
        } catch {
        }
        setTimeout(() => document.body.removeChild(iframe), 1e3);
      }, 300);
    }
    return;
  }
  popup.document.open();
  popup.document.write(printHtml);
  popup.document.close();
}
const certificateGenerator = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generateCertificatePdf
}, Symbol.toStringTag, { value: "Module" }));
const CertificateTemplate = React.forwardRef(function CertificateTemplate2({
  employeeName,
  employeeCode,
  trainingName,
  certificateId,
  issueDate,
  expiryDate,
  certStatus
}, ref) {
  const statusColor = certStatus === "Expired" ? "#ef4444" : certStatus === "ExpiringSoon" ? "#f59e0b" : "#22c55e";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      style: {
        width: "1122px",
        height: "794px",
        backgroundColor: "#0f1923",
        fontFamily: "Georgia, 'Times New Roman', serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: "12px",
              border: "2px solid #22c55e",
              borderRadius: "4px",
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: "20px",
              border: "1px solid rgba(245,158,11,0.45)",
              borderRadius: "2px",
              pointerEvents: "none"
            }
          }
        ),
        [
          [16, 16],
          [16, "auto"],
          ["auto", 16],
          ["auto", "auto"]
        ].map(([t, l]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: typeof t === "number" ? t : void 0,
              bottom: t === "auto" ? 16 : void 0,
              left: typeof l === "number" ? l : void 0,
              right: l === "auto" ? 16 : void 0,
              width: "14px",
              height: "14px",
              border: "2px solid #f59e0b",
              transform: "rotate(45deg)",
              backgroundColor: "#0f1923"
            }
          },
          `corner-${String(t)}-${String(l)}`
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              backgroundImage: "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #22c55e 100%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "36px 56px 32px",
              boxSizing: "border-box"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            fontFamily: "Arial Black, Arial, sans-serif",
                            fontWeight: 900,
                            fontSize: "32px",
                            color: "#ffffff",
                            letterSpacing: "6px",
                            lineHeight: 1
                          },
                          children: "RKTR"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            fontSize: "9px",
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "3px",
                            textTransform: "uppercase",
                            fontFamily: "Arial, sans-serif"
                          },
                          children: "SAFETY & COMPLIANCE"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "4px"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                fontSize: "18px",
                                color: "#22c55e",
                                letterSpacing: "2px"
                              },
                              children: "OHSE 360"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                fontFamily: "Arial, sans-serif",
                                fontSize: "9px",
                                color: "rgba(255,255,255,0.4)",
                                letterSpacing: "2px",
                                textTransform: "uppercase"
                              },
                              children: "Occupational Health, Safety & Environment"
                            }
                          ),
                          certStatus && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                fontSize: "9px",
                                fontFamily: "Arial, sans-serif",
                                fontWeight: 700,
                                letterSpacing: "2px",
                                textTransform: "uppercase",
                                color: statusColor,
                                border: `1px solid ${statusColor}`,
                                borderRadius: "99px",
                                padding: "2px 10px",
                                marginTop: "2px"
                              },
                              children: certStatus === "ExpiringSoon" ? "EXPIRING SOON" : certStatus.toUpperCase()
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, #22c55e 20%, #f59e0b 50%, #22c55e 80%, transparent)",
                    marginBottom: "22px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginBottom: "6px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  style: {
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "30px",
                    fontWeight: 700,
                    color: "#f59e0b",
                    letterSpacing: "6px",
                    textTransform: "uppercase",
                    margin: 0,
                    lineHeight: 1.2
                  },
                  children: "Certificate of Completion"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  style: {
                    textAlign: "center",
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "12px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontFamily: "Arial, sans-serif",
                    margin: "0 0 18px"
                  },
                  children: "This is to certify that"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "8px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "38px",
                      fontWeight: 700,
                      color: "#22c55e",
                      letterSpacing: "1px",
                      lineHeight: 1.1
                    },
                    children: employeeName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      display: "inline-block",
                      marginLeft: "12px",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "'Courier New', Courier, monospace",
                      letterSpacing: "1px",
                      verticalAlign: "middle"
                    },
                    children: [
                      "[",
                      employeeCode,
                      "]"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  style: {
                    textAlign: "center",
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "13px",
                    fontFamily: "Arial, sans-serif",
                    letterSpacing: "1px",
                    margin: "0 0 10px"
                  },
                  children: "has successfully completed the training program"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  style: {
                    textAlign: "center",
                    color: "#ffffff",
                    fontSize: "20px",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    margin: "0 0 22px"
                  },
                  children: [
                    "“",
                    trainingName,
                    "”"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: "1px",
                    background: "rgba(245,158,11,0.3)",
                    marginBottom: "20px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "18px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", flex: 1 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "9px",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            fontFamily: "Arial, sans-serif",
                            margin: "0 0 4px"
                          },
                          children: "Issue Date"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            color: "#ffffff",
                            fontSize: "14px",
                            fontFamily: "'Courier New', Courier, monospace",
                            fontWeight: 700,
                            margin: 0,
                            letterSpacing: "1px"
                          },
                          children: issueDate
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          textAlign: "center",
                          flex: 2,
                          borderLeft: "1px solid rgba(255,255,255,0.1)",
                          borderRight: "1px solid rgba(255,255,255,0.1)",
                          padding: "0 20px"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              style: {
                                color: "rgba(255,255,255,0.4)",
                                fontSize: "9px",
                                letterSpacing: "2px",
                                textTransform: "uppercase",
                                fontFamily: "Arial, sans-serif",
                                margin: "0 0 4px"
                              },
                              children: "Certificate ID"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              style: {
                                color: "#f59e0b",
                                fontSize: "15px",
                                fontFamily: "'Courier New', Courier, monospace",
                                fontWeight: 700,
                                margin: 0,
                                letterSpacing: "2px"
                              },
                              children: certificateId
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", flex: 1 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "9px",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            fontFamily: "Arial, sans-serif",
                            margin: "0 0 4px"
                          },
                          children: "Expiry Date"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            color: expiryDate === "—" ? "rgba(255,255,255,0.5)" : statusColor,
                            fontSize: "14px",
                            fontFamily: "'Courier New', Courier, monospace",
                            fontWeight: 700,
                            margin: 0,
                            letterSpacing: "1px"
                          },
                          children: expiryDate
                        }
                      )
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    marginTop: "auto",
                    borderTop: "1px solid rgba(34,197,94,0.25)",
                    paddingTop: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: "44px",
                            height: "44px",
                            border: "2px solid #22c55e",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                width: "34px",
                                height: "34px",
                                border: "1px solid rgba(34,197,94,0.5)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  style: {
                                    fontSize: "11px",
                                    fontWeight: 900,
                                    color: "#22c55e",
                                    fontFamily: "Arial Black, Arial, sans-serif",
                                    letterSpacing: "0"
                                  },
                                  children: "RK"
                                }
                              )
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            style: {
                              margin: 0,
                              color: "#ffffff",
                              fontSize: "12px",
                              fontFamily: "Arial, sans-serif",
                              fontWeight: 700,
                              letterSpacing: "0.5px"
                            },
                            children: "OHSE Safety Authority"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            style: {
                              margin: 0,
                              color: "rgba(255,255,255,0.4)",
                              fontSize: "9px",
                              fontFamily: "Arial, sans-serif",
                              letterSpacing: "1px"
                            },
                            children: "Authorized Issuing Body"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: "140px",
                            borderBottom: "1px solid rgba(255,255,255,0.3)",
                            marginBottom: "4px"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            margin: 0,
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "9px",
                            fontFamily: "Arial, sans-serif",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase"
                          },
                          children: "Authorised Signatory"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            margin: "0 0 2px",
                            color: "rgba(255,255,255,0.35)",
                            fontSize: "9px",
                            fontFamily: "Arial, sans-serif",
                            letterSpacing: "2px",
                            textTransform: "uppercase"
                          },
                          children: "Issued by"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            margin: 0,
                            fontFamily: "Arial Black, Arial, sans-serif",
                            fontWeight: 900,
                            fontSize: "16px",
                            color: "rgba(255,255,255,0.8)",
                            letterSpacing: "4px"
                          },
                          children: "RKTR"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            margin: 0,
                            color: "rgba(255,255,255,0.25)",
                            fontSize: "8px",
                            fontFamily: "Arial, sans-serif",
                            letterSpacing: "1px"
                          },
                          children: "ohse360.rktr.com"
                        }
                      )
                    ] })
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
});
const CertificateTemplate$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CertificateTemplate
}, Symbol.toStringTag, { value: "Module" }));
function CertificateModal({
  open,
  onClose,
  ...certProps
}) {
  const certRef = reactExports.useRef(null);
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  if (!open) return null;
  const safeFilename = `${certProps.certificateId}`.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
  async function handleDownload() {
    if (!certRef.current) return;
    setIsGenerating(true);
    try {
      await generateCertificatePdf(certRef.current, safeFilename);
    } catch {
    } finally {
      setIsGenerating(false);
    }
  }
  function handlePrint() {
    window.print();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cert-modal-overlay",
      onClick: onClose,
      onKeyDown: (e) => e.key === "Escape" && onClose(),
      role: "presentation",
      tabIndex: -1,
      "data-ocid": "training.cert.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative bg-card border border-border rounded-xl shadow-2xl max-w-[1200px] w-full cert-modal-panel",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-5 h-5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold text-sm", children: "Training Certificate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-mono", children: certProps.certificateId })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: handlePrint,
                    className: "border-border gap-1.5",
                    "data-ocid": "training.cert.print_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-3.5 h-3.5" }),
                      "Print"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    onClick: handleDownload,
                    disabled: isGenerating,
                    className: "gap-1.5",
                    "data-ocid": "training.cert.download_button",
                    children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
                      "Generating…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                      "Download PDF"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: onClose,
                    className: "w-8 h-8 p-0",
                    "aria-label": "Close certificate",
                    "data-ocid": "training.cert.close_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto p-4 flex items-start justify-center bg-muted/20 cert-preview-area", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "cert-printable",
                style: { transformOrigin: "top center" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CertificateTemplate, { ref: certRef, ...certProps })
              }
            ) })
          ]
        }
      )
    }
  ) });
}
const TRAINING_TYPE_LABELS = {
  Induction: "Induction",
  Refresher: "Refresher",
  Regulatory: "Regulatory",
  OnTheJob: "On-the-Job",
  External: "External"
};
const FREQUENCY_LABELS = {
  OneTime: "One-time",
  Annual: "Annual",
  BiAnnual: "Bi-annual",
  ThreeYearly: "3-yearly"
};
const FREQUENCY_MONTHS = {
  OneTime: null,
  Annual: 12,
  BiAnnual: 6,
  ThreeYearly: 36
};
const TYPE_COLORS = {
  Induction: "bg-primary/20 text-primary border-primary/30",
  Refresher: "bg-secondary/20 text-secondary border-secondary/30",
  Regulatory: "bg-destructive/20 text-destructive border-destructive/30",
  OnTheJob: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  External: "bg-chart-5/20 text-chart-5 border-chart-5/30"
};
function calcExpiryDate(trainingDate, frequency) {
  const months = FREQUENCY_MONTHS[frequency];
  if (!months) return "—";
  const d = new Date(trainingDate);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}
function certStatusBadge(status) {
  if (!status) return null;
  const map = {
    Valid: {
      label: "Valid",
      cls: "bg-primary/20 text-primary border-primary/30"
    },
    ExpiringSoon: {
      label: "Expiring Soon",
      cls: "bg-secondary/20 text-secondary border-secondary/30"
    },
    Expired: {
      label: "Expired",
      cls: "bg-destructive/20 text-destructive border-destructive/30"
    }
  };
  const { label, cls } = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`,
      children: label
    }
  );
}
function trainingAttendeePresent(attendees) {
  return attendees.filter((a) => a.attendance === AttendanceStatus.Present).length;
}
function trainingOverallCertStatus(t) {
  const statuses = t.attendees.map((a) => a.certStatus).filter(Boolean);
  if (statuses.includes(CertificateStatus.Expired))
    return CertificateStatus.Expired;
  if (statuses.includes(CertificateStatus.ExpiringSoon))
    return CertificateStatus.ExpiringSoon;
  if (statuses.length > 0) return CertificateStatus.Valid;
  return null;
}
function CreateTrainingDialog({
  open,
  onClose,
  employees
}) {
  const { actor, token } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [type, setType] = reactExports.useState(TrainingType.Induction);
  const [frequency, setFrequency] = reactExports.useState(
    TrainingFrequency.Annual
  );
  const [trainingDate, setTrainingDate] = reactExports.useState("");
  const [trainer, setTrainer] = reactExports.useState("");
  const [dept, setDept] = reactExports.useState("");
  const [attendeeSearch, setAttendeeSearch] = reactExports.useState("");
  const [selectedCodes, setSelectedCodes] = reactExports.useState([]);
  const expiryPreview = trainingDate ? calcExpiryDate(trainingDate, frequency) : "—";
  const filteredEmployees = reactExports.useMemo(() => {
    const q = attendeeSearch.toLowerCase();
    return employees.filter(
      (e) => e.fullName.toLowerCase().includes(q) || e.empCode.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)
    );
  }, [employees, attendeeSearch]);
  const toggleAttendee = (code) => setSelectedCodes(
    (prev) => prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
  );
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.createTraining(token, {
        name: name.trim(),
        trainingType: type,
        frequency,
        trainingDate,
        trainer: trainer.trim(),
        department: dept.trim() || ((user == null ? void 0 : user.department) ?? ""),
        attendeeCodes: selectedCodes
      });
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      ue.success("Training created successfully");
      qc.invalidateQueries({ queryKey: ["trainings"] });
      onClose();
      resetForm();
    },
    onError: (e) => ue.error(e.message)
  });
  function resetForm() {
    setName("");
    setType(TrainingType.Induction);
    setFrequency(TrainingFrequency.Annual);
    setTrainingDate("");
    setTrainer("");
    setDept("");
    setSelectedCodes([]);
    setAttendeeSearch("");
  }
  const canSubmit = name.trim() && trainingDate && trainer.trim() && selectedCodes.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto",
      "data-ocid": "training.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary" }),
          "Create New Training"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "t-name", className: "text-foreground", children: "Training Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "t-name",
                placeholder: "e.g. Fire Safety Induction",
                value: name,
                onChange: (e) => setName(e.target.value),
                className: "bg-background border-border",
                "data-ocid": "training.name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Training Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: type,
                  onValueChange: (v) => setType(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "bg-background border-border",
                        "data-ocid": "training.type_select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: Object.values(TrainingType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: TRAINING_TYPE_LABELS[t] }, t)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Frequency *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: frequency,
                  onValueChange: (v) => setFrequency(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "bg-background border-border",
                        "data-ocid": "training.frequency_select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: Object.values(TrainingFrequency).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f, children: FREQUENCY_LABELS[f] }, f)) })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "t-date", className: "text-foreground", children: "Training Date *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "t-date",
                  type: "date",
                  value: trainingDate,
                  onChange: (e) => setTrainingDate(e.target.value),
                  className: "bg-background border-border",
                  "data-ocid": "training.date_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Auto-calculated Expiry" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 items-center rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground font-mono", children: expiryPreview })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "t-trainer", className: "text-foreground", children: "Trainer / Facilitator *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "t-trainer",
                  placeholder: "Trainer name",
                  value: trainer,
                  onChange: (e) => setTrainer(e.target.value),
                  className: "bg-background border-border",
                  "data-ocid": "training.trainer_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "t-dept", className: "text-foreground", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "t-dept",
                  placeholder: "Defaults to your dept",
                  value: dept,
                  onChange: (e) => setDept(e.target.value),
                  className: "bg-background border-border",
                  "data-ocid": "training.dept_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-foreground", children: [
              "Attendees * (",
              selectedCodes.length,
              " selected)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search employees…",
                value: attendeeSearch,
                onChange: (e) => setAttendeeSearch(e.target.value),
                className: "bg-background border-border mb-2",
                "data-ocid": "training.attendee_search"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-40 overflow-y-auto rounded-lg border border-border divide-y divide-border", children: [
              filteredEmployees.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-3 text-sm text-muted-foreground text-center", children: "No employees found" }),
              filteredEmployees.map((emp) => {
                const sel = selectedCodes.includes(emp.empCode);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleAttendee(emp.empCode),
                    className: `w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40 ${sel ? "bg-primary/10" : ""}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${sel ? "bg-primary border-primary" : "border-border"}`,
                          children: sel && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3 text-primary-foreground" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: emp.fullName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "·" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: emp.empCode }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-muted-foreground text-xs", children: emp.department })
                    ]
                  },
                  emp.empCode
                );
              })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onClose,
              className: "border-border",
              "data-ocid": "training.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              disabled: !canSubmit || mutation.isPending,
              onClick: () => mutation.mutate(),
              "data-ocid": "training.submit_button",
              children: mutation.isPending ? "Creating…" : "Create Training"
            }
          )
        ] })
      ]
    }
  ) });
}
function TrainingDetailDialog({
  training,
  onClose
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [certModal, setCertModal] = reactExports.useState(
    null
  );
  const [downloadingAll, setDownloadingAll] = reactExports.useState(false);
  function buildCertProps(att) {
    if (!att.certificateId || !training) return null;
    return {
      employeeName: att.empName,
      employeeCode: att.empCode,
      trainingName: training.name,
      certificateId: att.certificateId,
      issueDate: training.trainingDate,
      expiryDate: att.expiryDate ?? calcExpiryDate(training.trainingDate, training.frequency),
      certStatus: att.certStatus
    };
  }
  async function handleDownloadAll() {
    if (!training) return;
    const { generateCertificatePdf: generateCertificatePdf2 } = await __vitePreload(async () => {
      const { generateCertificatePdf: generateCertificatePdf3 } = await Promise.resolve().then(() => certificateGenerator);
      return { generateCertificatePdf: generateCertificatePdf3 };
    }, true ? void 0 : void 0);
    setDownloadingAll(true);
    const presentWithCerts = training.attendees.filter(
      (a) => a.attendance === AttendanceStatus.Present && a.certificateId
    );
    for (const att of presentWithCerts) {
      const container = document.createElement("div");
      container.style.cssText = "position:fixed;left:-9999px;top:0;";
      document.body.appendChild(container);
      const { default: ReactDOM } = await __vitePreload(async () => {
        const { default: ReactDOM2 } = await import("./index-o5KNRZJC.js").then((n) => n.c);
        return { default: ReactDOM2 };
      }, true ? __vite__mapDeps([0,1]) : void 0);
      const CertTplMod = await __vitePreload(() => Promise.resolve().then(() => CertificateTemplate$1), true ? void 0 : void 0);
      const CertTpl = CertTplMod.default;
      const props = buildCertProps(att);
      if (!props) {
        document.body.removeChild(container);
        continue;
      }
      await new Promise((resolve) => {
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(CertTpl, props));
        setTimeout(async () => {
          const el = container.firstChild;
          if (el) {
            const fn = `${att.certificateId}-${att.empCode}`.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
            await generateCertificatePdf2(el, fn);
          }
          root.unmount();
          document.body.removeChild(container);
          resolve();
        }, 300);
      });
    }
    setDownloadingAll(false);
  }
  const attendanceMutation = useMutation({
    mutationFn: async ({
      empCode,
      attendance
    }) => {
      if (!actor || !token || !training) throw new Error("Not ready");
      const res = await actor.markAttendance(
        token,
        training.trainingId,
        empCode,
        attendance
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trainings"] });
      qc.invalidateQueries({ queryKey: ["training", training == null ? void 0 : training.trainingId] });
      ue.success("Attendance updated");
    },
    onError: (e) => ue.error(e.message)
  });
  if (!training) return null;
  const expiry = calcExpiryDate(training.trainingDate, training.frequency);
  const presentCount = trainingAttendeePresent(training.attendees);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!training, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto",
        "data-ocid": "training.detail.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground text-xl", children: training.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[training.trainingType]}`,
                    children: TRAINING_TYPE_LABELS[training.trainingType]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: FREQUENCY_LABELS[training.frequency] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: training.department })
              ] })
            ] }),
            training.attendees.some(
              (a) => a.attendance === AttendanceStatus.Present && a.certificateId
            ) && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: handleDownloadAll,
                disabled: downloadingAll,
                className: "flex-shrink-0 gap-1.5 border-border",
                "data-ocid": "training.detail.download_all_button",
                children: downloadingAll ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
                  "Generating…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                  "Download All Certs"
                ] })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: [
            { label: "Training Date", value: training.trainingDate },
            { label: "Expiry Date", value: expiry },
            { label: "Trainer", value: training.trainer }
          ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground font-mono", children: value })
          ] }, label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 py-2 border-y border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground font-medium", children: [
                training.attendees.length,
                " attendees"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground", children: [
                presentCount,
                " present"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground", children: [
                training.attendees.length - presentCount,
                " absent"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "training.detail.attendee_list", children: [
            training.attendees.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-center py-8 text-muted-foreground text-sm",
                "data-ocid": "training.detail.empty_state",
                children: "No attendees assigned to this training"
              }
            ),
            training.attendees.map((att, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3",
                "data-ocid": `training.detail.attendee.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => attendanceMutation.mutate({
                        empCode: att.empCode,
                        attendance: att.attendance === AttendanceStatus.Present ? AttendanceStatus.Absent : AttendanceStatus.Present
                      }),
                      className: `flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-smooth ${att.attendance === AttendanceStatus.Present ? "bg-primary/20 border-primary" : "border-border hover:border-primary/50"}`,
                      "aria-label": `Toggle attendance for ${att.empName}`,
                      "data-ocid": `training.detail.attendance_toggle.${idx + 1}`,
                      children: att.attendance === AttendanceStatus.Present && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-primary" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: att.empName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: att.empCode })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-xs font-medium px-2 py-0.5 rounded-full ${att.attendance === AttendanceStatus.Present ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
                      children: att.attendance
                    }
                  ),
                  att.certificateId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            const p = buildCertProps(att);
                            if (p) setCertModal(p);
                          },
                          className: "flex items-center gap-1.5 hover:opacity-75 transition-smooth",
                          "aria-label": "View certificate",
                          "data-ocid": `training.detail.view_cert.${idx + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-3.5 h-3.5 text-secondary flex-shrink-0" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-secondary underline-offset-2 hover:underline truncate max-w-[140px]", children: att.certificateId })
                          ]
                        }
                      ),
                      att.certStatus && certStatusBadge(att.certStatus)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: async () => {
                          const p = buildCertProps(att);
                          if (!p) return;
                          const { generateCertificatePdf: generateCertificatePdf2 } = await __vitePreload(async () => {
                            const { generateCertificatePdf: generateCertificatePdf3 } = await Promise.resolve().then(() => certificateGenerator);
                            return { generateCertificatePdf: generateCertificatePdf3 };
                          }, true ? void 0 : void 0);
                          const container = document.createElement("div");
                          container.style.cssText = "position:fixed;left:-9999px;top:0;";
                          document.body.appendChild(container);
                          const { default: ReactDOM } = await __vitePreload(async () => {
                            const { default: ReactDOM2 } = await import("./index-o5KNRZJC.js").then((n) => n.c);
                            return { default: ReactDOM2 };
                          }, true ? __vite__mapDeps([0,1]) : void 0);
                          const CertTplMod = await __vitePreload(() => Promise.resolve().then(() => CertificateTemplate$1), true ? void 0 : void 0);
                          const CertTpl = CertTplMod.default;
                          const root = ReactDOM.createRoot(container);
                          root.render(React.createElement(CertTpl, p));
                          await new Promise(
                            (res) => setTimeout(async () => {
                              const el = container.firstChild;
                              if (el) {
                                const fn = `${att.certificateId}-${att.empCode}`.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
                                await generateCertificatePdf2(el, fn);
                              }
                              root.unmount();
                              document.body.removeChild(container);
                              res();
                            }, 300)
                          );
                        },
                        className: "p-1.5 rounded hover:bg-muted/60 transition-smooth text-muted-foreground hover:text-foreground",
                        "aria-label": "Download certificate PDF",
                        "data-ocid": `training.detail.download_cert.${idx + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "No cert" })
                ]
              },
              att.empCode
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onClose,
              className: "border-border",
              "data-ocid": "training.detail.close_button",
              children: "Close"
            }
          ) })
        ]
      }
    ) }),
    certModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CertificateModal,
      {
        open: true,
        onClose: () => setCertModal(null),
        ...certModal
      }
    )
  ] });
}
function TrainingPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [selectedTraining, setSelectedTraining] = reactExports.useState(
    null
  );
  const [search, setSearch] = reactExports.useState("");
  const [filterType, setFilterType] = reactExports.useState("ALL");
  const [filterCertStatus, setFilterCertStatus] = reactExports.useState("ALL");
  const [filterDept, setFilterDept] = reactExports.useState("");
  const { data: trainings, isLoading: trainingsLoading } = useQuery({
    queryKey: ["trainings", filterType, filterDept],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listTrainings(
        token,
        filterDept || null,
        filterType !== "ALL" ? filterType : null
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const { data: employees } = useQuery({
    queryKey: ["employees", "all"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listEmployees(token, null, null, null, null);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const { data: kpi } = useQuery({
    queryKey: ["kpi", (user == null ? void 0 : user.department) ?? null],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getKPISummary(token, null);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const departments = reactExports.useMemo(() => {
    const set = new Set(
      (trainings ?? []).map((t) => t.department).filter(Boolean)
    );
    return Array.from(set).sort();
  }, [trainings]);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return (trainings ?? []).filter((t) => {
      const matchSearch = !search || t.name.toLowerCase().includes(q) || t.trainer.toLowerCase().includes(q) || t.department.toLowerCase().includes(q);
      const overallCert = trainingOverallCertStatus(t);
      const matchCert = filterCertStatus === "ALL" || overallCert === filterCertStatus;
      return matchSearch && matchCert;
    });
  }, [trainings, search, filterCertStatus]);
  const canCreate = (user == null ? void 0 : user.role) === "SystemAdmin" || (user == null ? void 0 : user.role) === "SafetyOfficer" || (user == null ? void 0 : user.role) === "HOD";
  const compliancePct = kpi ? Math.round(kpi.trainingCompliancePct) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "training.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "section-header flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-6 h-6 text-primary" }),
          "Training & Compliance"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage employee training records, attendance, and certificates" })
      ] }),
      canCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setShowCreate(true),
          className: "gap-2",
          "data-ocid": "training.create_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "New Training"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "elevated-card rounded-xl p-5 flex items-center gap-4",
          "data-ocid": "training.compliance_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${compliancePct === null ? "bg-muted" : compliancePct >= 80 ? "bg-primary/20" : compliancePct >= 50 ? "bg-secondary/20" : "bg-destructive/20"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Award,
                  {
                    className: `w-6 h-6 ${compliancePct === null ? "text-muted-foreground" : compliancePct >= 80 ? "text-primary" : compliancePct >= 50 ? "text-secondary" : "text-destructive"}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Training Compliance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-value", children: compliancePct === null ? "—" : `${compliancePct}%` })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "elevated-card rounded-xl p-5 flex items-center gap-4",
          "data-ocid": "training.total_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-chart-4/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-6 h-6 text-chart-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Total Trainings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-value", children: (trainings == null ? void 0 : trainings.length) ?? "—" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "elevated-card rounded-xl p-5 flex items-center gap-4",
          "data-ocid": "training.valid_certs_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Valid Certificates" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-value", children: trainings ? trainings.flatMap((t) => t.attendees).filter((a) => a.certStatus === CertificateStatus.Valid).length : "—" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search trainings…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9 bg-background border-border",
            "data-ocid": "training.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterType,
          onValueChange: (v) => setFilterType(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "bg-background border-border",
                "data-ocid": "training.filter_type_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Types" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Types" }),
              Object.values(TrainingType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: TRAINING_TYPE_LABELS[t] }, t))
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterCertStatus,
          onValueChange: (v) => setFilterCertStatus(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "bg-background border-border",
                "data-ocid": "training.filter_cert_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Cert Status" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Cert Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: CertificateStatus.Valid, children: "Valid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: CertificateStatus.ExpiringSoon, children: "Expiring Soon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: CertificateStatus.Expired, children: "Expired" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterDept || "ALL",
          onValueChange: (v) => setFilterDept(v === "ALL" ? "" : v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "bg-background border-border",
                "data-ocid": "training.filter_dept_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Departments" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Departments" }),
              departments.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d))
            ] })
          ]
        }
      )
    ] }) }),
    trainingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "training.loading_state", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl bg-muted/40" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "elevated-card rounded-xl p-12 flex flex-col items-center justify-center gap-3",
        "data-ocid": "training.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: "No trainings found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: search || filterType !== "ALL" || filterCertStatus !== "ALL" || filterDept ? "Try adjusting your filters" : canCreate ? "Create the first training to get started" : "No training records yet" }),
          canCreate && !search && filterType === "ALL" && filterCertStatus === "ALL" && !filterDept && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setShowCreate(true),
              className: "mt-2 gap-2",
              "data-ocid": "training.empty_create_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                " New Training"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "training.list", children: filtered.map((t, idx) => {
      const presentCount = trainingAttendeePresent(t.attendees);
      const overallCert = trainingOverallCertStatus(t);
      const expiry = calcExpiryDate(t.trainingDate, t.frequency);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setSelectedTraining(t),
          className: "w-full text-left elevated-card rounded-xl p-4 hover:border-primary/40 transition-smooth",
          "data-ocid": `training.item.${idx + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground truncate", children: t.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[t.trainingType]}`,
                    children: TRAINING_TYPE_LABELS[t.trainingType]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Trainer:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: t.trainer })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Dept:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: t.department })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    presentCount,
                    "/",
                    t.attendees.length,
                    " present"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 flex-shrink-0", children: [
              overallCert && certStatusBadge(overallCert),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Date: " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: t.trainingDate })
                ] }),
                expiry !== "—" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Exp: " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `${new Date(expiry) < /* @__PURE__ */ new Date() ? "text-destructive" : new Date(expiry) < new Date(Date.now() + 30 * 864e5) ? "text-secondary" : "text-foreground"}`,
                      children: expiry
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: FREQUENCY_LABELS[t.frequency] })
            ] })
          ] })
        },
        t.trainingId
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateTrainingDialog,
      {
        open: showCreate,
        onClose: () => setShowCreate(false),
        employees: employees ?? []
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TrainingDetailDialog,
      {
        training: selectedTraining,
        onClose: () => setSelectedTraining(null)
      }
    )
  ] });
}
export {
  TrainingPage as default
};

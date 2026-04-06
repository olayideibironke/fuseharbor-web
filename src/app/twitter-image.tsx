import { ImageResponse } from "next/og";

export const alt = "FuseHarbor | Premium Home Electrification Marketplace";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "#f6f2eb",
            color: "#111827",
            padding: "48px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: "32px",
              border: "1px solid rgba(17,24,39,0.08)",
              background: "#ffffff",
              padding: "44px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
              >
                <div
                  style={{
                    width: "76px",
                    height: "76px",
                    borderRadius: "9999px",
                    background: "#111827",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: 700,
                  }}
                >
                  FH
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "#c97a2b",
                    }}
                  >
                    FuseHarbor
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "24px",
                      color: "#475569",
                    }}
                  >
                    Premium Home Electrification Marketplace
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 18px",
                  borderRadius: "9999px",
                  background: "#f8fafc",
                  border: "1px solid rgba(17,24,39,0.08)",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                Maryland-first
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "900px",
              }}
            >
              <div
                style={{
                  fontSize: "68px",
                  lineHeight: 1.02,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  color: "#111827",
                }}
              >
                Premium home electrification,
              </div>

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "68px",
                  lineHeight: 1.02,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  color: "#c97a2b",
                }}
              >
                guided with trust.
              </div>

              <div
                style={{
                  marginTop: "24px",
                  fontSize: "28px",
                  lineHeight: 1.4,
                  color: "#475569",
                }}
              >
                Vetted pros for EV chargers, panel upgrades, heat pumps, and
                battery backup power.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: "9999px",
                  background: "#f8fafc",
                  border: "1px solid rgba(17,24,39,0.08)",
                  color: "#334155",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                EV Chargers
              </div>

              <div
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: "9999px",
                  background: "#f8fafc",
                  border: "1px solid rgba(17,24,39,0.08)",
                  color: "#334155",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Panel Upgrades
              </div>

              <div
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: "9999px",
                  background: "#f8fafc",
                  border: "1px solid rgba(17,24,39,0.08)",
                  color: "#334155",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Heat Pumps
              </div>

              <div
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: "9999px",
                  background: "#f8fafc",
                  border: "1px solid rgba(17,24,39,0.08)",
                  color: "#334155",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Battery Backup
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      },
    );
  } catch {
    return new Response("Failed to generate Twitter image.", {
      status: 500,
    });
  }
}
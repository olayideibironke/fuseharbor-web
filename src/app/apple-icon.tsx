import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f2eb",
        }}
      >
        <div
          style={{
            width: "146px",
            height: "146px",
            borderRadius: "40px",
            background: "#111827",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 800,
              lineHeight: 1,
              fontFamily: "Arial, sans-serif",
              letterSpacing: "-7px",
            }}
          >
            <span
              style={{
                fontSize: "86px",
              }}
            >
              F
            </span>
            <span
              style={{
                fontSize: "80px",
                marginLeft: "-4px",
              }}
            >
              H
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              right: "14px",
              bottom: "14px",
              width: "16px",
              height: "16px",
              borderRadius: "9999px",
              background: "#c97a2b",
              border: "3px solid #ffffff",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
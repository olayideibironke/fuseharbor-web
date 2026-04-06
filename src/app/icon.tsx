import { ImageResponse } from "next/og";

export const size = {
  width: 256,
  height: 256,
};

export const contentType = "image/png";

export default function Icon() {
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
            width: "208px",
            height: "208px",
            borderRadius: "56px",
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
              letterSpacing: "-10px",
            }}
          >
            <span
              style={{
                fontSize: "126px",
              }}
            >
              F
            </span>
            <span
              style={{
                fontSize: "116px",
                marginLeft: "-6px",
              }}
            >
              H
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              right: "20px",
              bottom: "20px",
              width: "24px",
              height: "24px",
              borderRadius: "9999px",
              background: "#c97a2b",
              border: "4px solid #ffffff",
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
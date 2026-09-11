import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "#1A3532",
          color: "#FBFAF6",
          fontSize: 18,
          fontFamily: "Georgia, serif",
        }}
      >
        D
      </div>
    ),
    size,
  );
}

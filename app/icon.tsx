import { ImageResponse } from "next/og";

export const size = {
    width: 64,
    height: 64,
};

export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    alignItems: "center",
                    background: "linear-gradient(135deg, #09111f 0%, #14335c 60%, #18a0b6 100%)",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        alignItems: "center",
                        background: "rgba(255, 255, 255, 0.12)",
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: 18,
                        color: "white",
                        display: "flex",
                        fontSize: 30,
                        fontWeight: 800,
                        height: 44,
                        justifyContent: "center",
                        letterSpacing: -1,
                        width: 44,
                    }}
                >
                    M
                </div>
            </div>
        ),
        size
    );
}
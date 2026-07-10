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
                        background: "rgba(255, 255, 255, 0.14)",
                        border: "4px solid rgba(255, 255, 255, 0.24)",
                        borderRadius: 44,
                        color: "white",
                        display: "flex",
                        fontSize: 86,
                        fontWeight: 800,
                        height: 124,
                        justifyContent: "center",
                        letterSpacing: -3,
                        width: 124,
                    }}
                >
                    M
                </div>
            </div>
        ),
        size
    );
}
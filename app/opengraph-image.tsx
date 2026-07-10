import { ImageResponse } from "next/og";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "radial-gradient(circle at top right, #18a0b6 0%, rgba(24, 160, 182, 0) 28%), linear-gradient(135deg, #08101c 0%, #102745 55%, #14335c 100%)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-between",
                    padding: "64px 72px",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        alignItems: "center",
                        display: "flex",
                        gap: 24,
                    }}
                >
                    <div
                        style={{
                            alignItems: "center",
                            background: "rgba(255, 255, 255, 0.12)",
                            border: "3px solid rgba(255, 255, 255, 0.24)",
                            borderRadius: 32,
                            display: "flex",
                            fontSize: 72,
                            fontWeight: 800,
                            height: 112,
                            justifyContent: "center",
                            letterSpacing: -3,
                            width: 112,
                        }}
                    >
                        M
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                        }}
                    >
                        <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -3 }}>
                            Mediaro
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 30 }}>
                            Search, track, and organize your movie library.
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 20,
                    }}
                >
                    {[
                        "Track statuses",
                        "Save ratings and notes",
                        "Browse TMDB metadata",
                    ].map((label) => (
                        <div
                            key={label}
                            style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.14)",
                                borderRadius: 9999,
                                display: "flex",
                                fontSize: 28,
                                padding: "14px 24px",
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        ),
        size
    );
}
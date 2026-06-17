import { useState } from "react"
export default function Hero() {

    const [hovered, setHovered] = useState("")
    return (
        <section
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at center,#171717 0%,#050505 65%)",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "0 10%"
            }}
        >
            <div style={{ position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        fontSize: "22rem",
                        fontWeight: 900,
                        opacity: .03,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%,-50%)",
                        pointerEvents: "none",
                        userSelect: "none"
                    }}
                >
                    HACK
                </div>
                <div
                    style={{
                        position: "absolute",
                        left: "-150px",
                        top: "-100px",
                        fontSize: "8rem",
                        opacity: .08,
                        transform: "rotate(-20deg)"
                    }}
                >
                    🚀
                </div>

                <div
                    style={{
                        position: "absolute",
                        right: "-120px",
                        top: "50px",
                        fontSize: "7rem",
                        opacity: .08
                    }}
                >
                    💻
                </div>

                <div
                    style={{
                        position: "absolute",
                        left: "0",
                        bottom: "-120px",
                        fontSize: "6rem",
                        opacity: .08
                    }}
                >
                    ⚡
                </div>

                <div
                    style={{
                        position: "absolute",
                        right: "0",
                        bottom: "-180px",
                        fontSize: "8rem",
                        opacity: .08
                    }}
                >
                    🛠️
                </div>

                <div
                    style={{
                        color: "#ec3750",
                        fontWeight: 800,
                        letterSpacing: "5px",
                        marginBottom: 30,
                        fontSize: "1rem"
                    }}
                >
                    HACK CLUB
                </div>

                <h1
                    style={{
                        fontSize: "clamp(4rem,11vw,10rem)",
                        lineHeight: ".9",
                        margin: 0,
                        fontWeight: 900,
                        textShadow:
                            "0 0 100px rgba(236,55,80,.2)"  
                    }}
                >
                    BUILD.
                    <br />
                    SHIP.
                    <br />
                    TOGETHER.
                </h1>

                <p
                    style={{
                        maxWidth: "850px",
                        margin: "40px auto",
                        fontSize: "1.5rem",
                        opacity: ".75",
                        lineHeight: 1.6
                    }}
                >
                    A community of high school makers building
                    projects, running clubs, creating events,
                    and turning ideas into reality.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: 20,
                        justifyContent: "center",
                        flexWrap: "wrap"
                    }}
                >
                    <button
                        onMouseEnter={() => setHovered("explore")}
                        onMouseLeave={() => setHovered("")}

                        style={{
                            padding: "24px 64px",
                            fontSize: "1.25rem",
                            fontWeight: 800,

                            border: "none",
                            borderRadius: 999,

                            background:
                                hovered === "explore"
                                    ? "#ff5470"
                                    : "#ec3750",

                            color: "white",

                            transform:
                                hovered === "explore"
                                    ? "translateY(-8px)"
                                    : "translateY(0)",

                            boxShadow:
                                hovered === "explore"
                                    ? "0 20px 60px rgba(236,55,80,.45)"
                                    : "0 0 0 rgba(0,0,0,0)",

                            transition:
                                "all .25s ease",

                            cursor: "pointer"
                        }}
                    >
                        Explore
                    </button>
                    <button

                        onMouseEnter={() => setHovered("projects")}
                        onMouseLeave={() => setHovered("")}

                        style={{
                            padding: "24px 64px",

                            fontSize: "1.25rem",

                            background:
                                hovered === "projects"
                                    ? "rgba(255,255,255,.08)"
                                    : "transparent",

                            border:
                                hovered === "projects"
                                    ? "1px solid white"
                                    : "1px solid #444",

                            color: "white",

                            borderRadius: 999,

                            transform:
                                hovered === "projects"
                                    ? "translateY(-8px)"
                                    : "translateY(0)",

                            transition:
                                "all .25s ease",

                            cursor: "pointer"
                        }}
                    >
                        See Projects

                    </button>
                    
                </div>
                <div
                    style={{
                        marginTop: "80px",
                        display: "flex",
                        justifyContent: "center",
                        gap: "120px",
                        flexWrap: "wrap"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "4rem",
                                fontWeight: 900
                            }}
                        >
                            20K+
                        </div>

                        <div
                            style={{
                                opacity: .7,
                                fontSize: "1rem"
                            }}
                        >
                            Students
                        </div>
                    </div>


                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "4rem",
                                fontWeight: 900
                            }}
                        >
                            100+
                        </div>

                        <div
                            style={{
                                opacity: .7,
                                fontSize: "1rem"
                            }}
                        >
                            Countries
                        </div>
                    </div>


                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "4rem",
                                fontWeight: 900
                            }}
                        >
                            ∞
                        </div>

                        <div
                            style={{
                                opacity: .7,
                                fontSize: "1rem"
                            }}
                        >
                            Projects
                        </div>
                    </div>

                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: 40,
                        left: "50%",
                        transform: "translateX(-50%)",
                        opacity: .5,
                        fontSize: "2rem"
                    }}
                >
                    ↓
                </div>

            </div>
        </section>
    )
}
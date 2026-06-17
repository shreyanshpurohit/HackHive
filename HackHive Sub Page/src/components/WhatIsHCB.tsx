export default function WhatIsHCB() {
   const cards = [
    {
        title: "Build Projects",
        text: "Turn ideas into websites, apps, hardware and things people can and actually use."

    },
    {
        title: "Ship Fast",
        text: "Make things publicly instead of waiting forever"

    },
    {
        title: "Meet Builders",
        text: "Join People making cool stuff all around the world."

    },
    {
        title: "Get Rewards",
        text: "Obtain cool and deserving rewards for your work"
    }
]

    return (
        <section
            style={{
                background: "#090909",
                color: "white",
                padding: "140px 10%"
            }}
        >
            <div
                style={{
                    marginBottom: "80px"
                }}
            >
                <div
                    style={{
                        color: "#ec3750",
                        fontWeight: 800,
                        marginBottom: 20
                    }}
                >
                    WHAT IS HACK CLUB
                </div>

                <h2
                    style={{
                        fontSize: "clamp(3rem,7vw,6rem)",
                        margin: 0
                    }}
                >
                    More than coding.
                </h2>

                <p
                    style={{
                        maxWidth: 800,
                        opacity: .75,
                        fontSize: "1.6rem",
                        lineHeight: 1.7
                    }}
                >
                    Hack Club helps high school students
                    build, launch, experiment,
                    and create things that matter.
                </p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(2,minmax(0,1fr))",
                    gap: 28
                }}
            >
                {cards.map((card) => (
                    <div
                        key={card.title}
                        style={{
                            background: "#111",
                            padding: 80,
                            borderRadius: 32,
                            minHeight: 380
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "clamp(3rem,4vw,5rem)",
                                fontWeight: 900,
                                marginBottom: 20
                            }}
                        >
                            {card.title}
                        </h3>

                        <p
                            style={{
                                fontSize: "1.15rem",
                                opacity: .8,
                                lineHeight: 1.9,
                                transition: "0.3s",
                                cursor: "pointer",
                            }}
                        >
                            {card.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
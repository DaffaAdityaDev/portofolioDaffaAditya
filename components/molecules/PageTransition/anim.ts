export const brutalSwipe = {
    initial: {
        y: "0%",
    },
    enter: {
        y: "-100%",
        transition: {
            duration: 0.7,
            ease: [0.87, 0, 0.13, 1],
            delay: 0.15 
        }
    },
    exit: {
        y: ["100%", "0%"],
        transition: {
            duration: 0.7,
            ease: [0.87, 0, 0.13, 1]
        }
    }
}
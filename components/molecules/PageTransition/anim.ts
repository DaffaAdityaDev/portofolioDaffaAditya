export const expand = {
    initial: {
        scaleY: 1,
        transformOrigin: "top",
    },
    enter: (i: number) => ({    
        scaleY: 0,
        transformOrigin: "bottom",
        transition: {
            duration: 0.8,
            delay: 0.08 * i,
            ease: [0.645, 0.045, 0.355, 1],
        }
    }),
    exit: (i: number) => ({
        scaleY: [0, 1, 1],
        transformOrigin: ["top", "bottom", "bottom"],
        transition: {
            duration: 1.2,
            times: [0, 0.5, 1],
            delay: 0.08 * i,
            ease: [0.645, 0.045, 0.355, 1]
        }
    })
}
export const opacity = {
    initial: {
        opacity: 0.5
    },
    enter: {
        opacity: 0
    },
    exit: {
        opacity: 0.5,
        
    }
}
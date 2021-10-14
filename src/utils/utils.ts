const Sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const RandomSpeed = (minspeed: number, maxspeed: number) => {
    return Math.floor(Math.random() * (maxspeed - minspeed + 1)) + minspeed;
}

export { Sleep, RandomSpeed };
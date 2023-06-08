/**
 * TODO:
 * make class
 * 
 * 
 */

/**Creates an island2
     *@class 
     * @desc males an isalnd in the pixels array
     * @param { Number } inc -Increment value for perlin noise, affects "smoothness"
     * @param { Number } fallOff -The "steepness" of the border map boundary
     * @param { Array[2] } center -Coords of island's center 
     * @param { Number } seed -seed for noise()
     * @param { Number } _squareness -How sqaure the border is
     * 
     * @desc creates an array of length pixels.length/4 of values between 1 and 0. 1 in the center and tapering off radially to 0 by factor fallOff
     * @issue if user can pick focus how do I algotihmically find the max Dist ( always in a corner: so do a quadrant check and pick "opposite quadrants corner") 
     */


class NoiseIsland {
    constructor ({
        inc = 0.1,
        fallOff = 3,
        center = {
            x: (width / 2),
            y: (height / 2)
        },
        seed = random(100),
        _squareness = 0,
        cols = [
            { name: "WaterBlue", color: { red: 20, green: 60, blue: 200 }, factor: 0 },
            { name: "BeachTan", color: { red: 120, green: 180, blue: 30 }, factor: 1 },
            { name: "ForestGreen", color: { red: 0, green: 255, blue: 12 }, factor: 2 },
            { name: "RockGrey", color: { red: 100, green: 100, blue: 100 }, factor: 3 },
            { name: "SnowWhite", color: { red: 255, green: 255, blue: 255 }, factor: 4 },
            { name: "BrightPurple", color: { red: 200, green: 60, blue: 200 }, factor: 5 },
        ]
    } = {}) {
        this.incrementAmount = inc
        this.fallOff = fallOff
        this.centerPoint = center
        this.rSeed = seed
        this.squareness = _squareness
        this.colors = cols
    }

    #pickColorByHeight = (h, thresh, x) => {
        for (i in this.colors) {
            if (this.colors[i].factor == floor(h / thresh)) return this.cols[i].color
        }
    }

    showMap = () => {
        const maxDist = dist(0, 0, center.x, center.y)
        let yoff = 0
        noiseSeed(seed)
        loadPixels()
        for (let y = 0; y < height; y++) {
            let xoff = 0
            for (let x = 0; x < width; x++) {
                const distToC = dist(x, y, center.x, center.y)
                const maskVal = map(distToC, 0, maxDist, 1, 0) ** fallOff
                const index = (x + y * width) * 4
                const r = noise(xoff, yoff) * maskVal
                pixels[index + 0] = r * 255
                pixels[index + 1] = r * 255
                pixels[index + 2] = r * 255
                pixels[index + 3] = 255
                xoff += inc
            }
            yoff += inc
        }
        updatePixels()
    }

}

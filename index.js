const screenshot = require('screenshot-desktop')
const jimp = require('jimp')
const pixelmatch = require('pixelmatch')
const PNG = require('pngjs').PNG
const fs = require('fs')
const robot = require("robotjs")

setInterval(() => {
    makeScreenshot(diffPixels => {
        if (diffPixels > 5) {
            robot.moveMouse(1920 + 556 + 120, 850 + 123)
            robot.mouseClick('right')
            process.exit(0)
        }
    })
}, 8000)

function makeScreenshot(cb) {
    console.log('Testing has started')
    screenshot.listDisplays().then(displays => {
        screenshot({ filename: 'shot.png', screen: displays[1].id })
            .then(imgPath => {
                jimp.read('shot.png', (err, lenna) => {
                    if (err) throw err
                    lenna
                        .crop(556, 850, 129, 43)
                        .write('shot_cropped.png', () => {
                            const img1 = PNG.sync.read(fs.readFileSync('const.png'))
                            const img2 = PNG.sync.read(fs.readFileSync('shot_cropped.png'))
                            const { width, height } = img1
                            const diff = new PNG({ width, height })
                            console.log('Comparing...')
                            const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 })
                            console.log(`There are ${diffPixels} different pixels.`)
                            cb(diffPixels)
                        })
                })
            })
    })
}
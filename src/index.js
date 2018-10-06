document.body.style.padding = '0px'
document.body.style.maring = '0px'

import FFT from './FFT'
const fft = new FFT()
fft.load('./resources/Ezun+-+Revager+(Original+Mix)+-+Master.mp3', 128)
    .then(() => {

})


const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT
document.body.appendChild(canvas)

const context = canvas.getContext('2d')

const DIGONAL_SIZE = 16  // must be odd number

const w = (WIDTH > HEIGHT) ? HEIGHT / parseInt((DIGONAL_SIZE * 1.8)) : WIDTH / parseInt((DIGONAL_SIZE * 1.8))
const h = (WIDTH > HEIGHT) ? HEIGHT / parseInt((DIGONAL_SIZE * 1.8)) : WIDTH / parseInt((DIGONAL_SIZE * 1.8))
const BLOCK_MAX_HEIGHT = h * 2
const p1 = [0. * w, -0.5 * h]
const p2 = [1. * w, 0. * h]
const p3 = [0. * w, 0.5 * h]
const p4 = [-1. * w, 0. * h]

const blocks = []
const countMap = {}
for (let r = 0; r <= DIGONAL_SIZE; r++) {
  const t = Math.sin(r / DIGONAL_SIZE * Math.PI).toFixed(2)
  let colCount = countMap[t]

  if (!colCount) {
    const countArr = Object.keys(countMap).map((key) => countMap[key])
    countMap[t] = (countArr.length == 0) ? 1 : Math.max.apply(null, countArr) + 1
    colCount = countMap[t]
  }

  let sc = w * 0.5 -(colCount * w)
  for (let c = 0; c < colCount; c++) {
    blocks.push({
      x: sc + c * w * 2, y: r * h * 0.5
    })
  }
}

let prevAvg = 0
const render = (t) => {
  const frequency = fft.getFrequency()

  context.clearRect(0, 0, WIDTH, HEIGHT)
  context.fillStyle = '#000'
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const clusterPositions = [
    {
      x: WIDTH * 0.5 + w * 0.5, y: HEIGHT * 0.5 - h * 3.
    }
  ]

  clusterPositions.forEach((cp, j) => {
    
    context.save()
    context.translate(cp.x, cp.y)
  
    let sum = 0
    blocks.forEach(({x, y}, i) => {
      let f = Math.abs(Math.sin(0.8 * Math.PI * i / blocks.length + t * 0.004)) * 0.001
      if (frequency.length > 0) {
        f += frequency[i + 20] / 128
        sum += frequency[i + 20] / 128
      }

      const r = 100 + Math.sqrt(f * 0.3) * 150//parseInt(Math.random() * 255)
      const g = 50 - Math.sqrt(f * 0.1) * 70//parseInt(Math.random() * 255)
      const b = 50 - Math.sqrt(f * 0.1) * 70//parseInt(Math.random() * 255)

      const h = -(BLOCK_MAX_HEIGHT * 0.1) - (BLOCK_MAX_HEIGHT * Math.pow((f + 0.5), 2) * 0.5)

      const m = 0 //parseInt(-(1. - r) * 20)
  
      context.beginPath()
      context.moveTo(x + p1[0], y + p1[1] + h)
      context.lineTo(x + p2[0], y + p2[1] + h)
      context.lineTo(x + p3[0], y + p3[1] + h)
      context.lineTo(x + p4[0], y + p4[1] + h)
      context.closePath()
      context.fillStyle = `rgb(${r + m}, ${g + m}, ${b + m})`
      context.fill()
  
      context.beginPath()
      context.moveTo(x + p3[0], y + p3[1] + h)
      context.lineTo(x + p4[0], y + p4[1] + h)
      context.lineTo(x + p4[0], y + p4[1])
      context.lineTo(x + p3[0], y + p3[1])
      context.closePath()
      context.fillStyle = `rgb(${r - 10 + m}, ${g - 10 + m}, ${b - 10 + m})`
      context.fill()
  
      context.beginPath()
      context.moveTo(x + p2[0], y + p2[1] + h)
      context.lineTo(x + p2[0], y + p2[1])
      context.lineTo(x + p3[0], y + p3[1])
      context.lineTo(x + p3[0], y + p3[1] + h)
      context.closePath()
      context.fillStyle = `rgb(${r + 10 + m}, ${g + 10 + m}, ${b + 10 + m})`
      context.fill()
    })
    prevAvg = sum / blocks.length
    context.restore()
  })

  requestAnimationFrame(render)  
}

requestAnimationFrame(render)

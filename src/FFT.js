
class FFT {
    constructor() {
        this.audio = new Audio()
        this.context = new AudioContext()
        this.frequencyData = []
    }

    load(audioFile, FFT_SIZE = 1024) {
        const this_ = this
        return new Promise((resolve) => {
            const { audio, context } = this
            const analyser = context.createAnalyser()
            const source = context.createMediaElementSource(audio)

            source.connect(analyser)
            analyser.connect(context.destination)
            analyser.fftSize = FFT_SIZE * 2

            audio.removeEventListener('ended', this_.start)
            audio.addEventListener('ended', this_.start)

            audio.onloadeddata = () => {
                setTimeout(() => {
                    this_.start()
                    this_.analyser = analyser
                    this_.frequencyData = new Uint8Array(analyser.frequencyBinCount)
                    resolve()    
                }, 500)
            }

            audio.src = audioFile


        })
    }

    getFrequency() {
        const { analyser, frequencyData } = this
        if (analyser)
            analyser.getByteFrequencyData(frequencyData)
        return frequencyData
    }

    start() {
        const { audio } = this
        audio.currentTime = 0
        audio.play()
    }
}

export default FFT
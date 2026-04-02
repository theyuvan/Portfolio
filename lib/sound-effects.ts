class SoundEffects {
  private sounds: Record<string, HTMLAudioElement> = {}
  private isMuted = false
  private volume = 0.5
  private initialized = false

  private init() {
    if (this.initialized || typeof window === 'undefined') return
    this.initialized = true
    this.loadSound('notification', '/assets/sounds/notification.mp3')
    this.loadSound('magic', '/assets/sounds/magic.mp3')
    this.loadSound('click', '/assets/sounds/click.mp3')
  }

  private loadSound(name: string, path: string) {
    try {
      const audio = new Audio(path)
      audio.volume = this.volume
      audio.preload = 'auto'
      this.sounds[name] = audio
    } catch (error) {
      console.warn(`Failed to load sound: ${name}`, error)
    }
  }

  private play(soundName: string) {
    this.init()
    if (this.isMuted) return

    const sound = this.sounds[soundName]
    if (!sound) return

    const clone = sound.cloneNode() as HTMLAudioElement
    clone.volume = this.volume
    clone.play().catch((error) => {
      console.warn(`Failed to play sound: ${soundName}`, error)
    })
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = this.volume
    })
  }

  mute() {
    this.isMuted = true
  }

  unmute() {
    this.isMuted = false
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  playNotification() {
    this.play('notification')
  }

  playMagic() {
    this.play('magic')
  }

  playClick() {
    this.play('click')
  }
}

const soundEffects = new SoundEffects()

export default soundEffects

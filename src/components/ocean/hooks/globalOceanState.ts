export type OceanWorldEvent = 'none' | 'surge' | 'bubbles' | 'pause'

class GlobalOceanState {
  // Shared time updated once per frame by the manager
  public time: number = 0
  
  // The global unified current/drift (a low-frequency sine wave)
  public currentDrift: number = 0
  
  // Active sparse world events
  public activeEvent: OceanWorldEvent = 'none'
  
  // How long the current event has been active
  public eventTimer: number = 0

  // The manager calls this every frame
  update(delta: number, elapsed: number) {
    this.time = elapsed
    
    // Base gentle drift
    let driftTarget = Math.sin(this.time * 0.4) * 0.3
    
    // Add complexity to the drift
    driftTarget += Math.cos(this.time * 0.15) * 0.15

    // If there's a surge event, increase current dramatically
    if (this.activeEvent === 'surge') {
      driftTarget += Math.sin(this.time * 2.0) * 1.5
    }

    // Smoothly interpolate current to avoid snapping
    this.currentDrift += (driftTarget - this.currentDrift) * delta * 2.0

    // Manage event expiration
    if (this.activeEvent !== 'none') {
      this.eventTimer -= delta
      if (this.eventTimer <= 0) {
        this.activeEvent = 'none'
      }
    }
  }

  triggerEvent(event: OceanWorldEvent, duration: number) {
    this.activeEvent = event
    this.eventTimer = duration
  }
}

export const oceanState = new GlobalOceanState()

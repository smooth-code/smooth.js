import EventEmitter from 'events'
import chokidar from 'chokidar'

export class Watcher extends EventEmitter {
  constructor(task) {
    super()
    this.close = null
    this.tickId = 0
    this.task = task
    this.pending = false
    this.ready = false
  }

  tick() {
    if (!this.pending) {
      this.emit('run')
    }

    this.pending = true
    this.tickId += 1

    const { tickId } = this

    this.task()
      .then(result => {
        this.emitForTick(tickId, 'done', result)
        if (!this.ready) {
          this.emitForTick(tickId, 'ready', result)
        }
        if (tickId === this.tickId) {
          this.pending = false
          this.ready = true
        }
      })
      .catch(error => {
        this.emitForTick(tickId, 'error', error)
        if (tickId === this.tickId) {
          this.pending = false
        }
      })
  }

  emitForTick(tickId, event, value) {
    if (tickId === this.tickId) {
      this.emit(event, value)
    }
  }
}

export function watchFs(filePath, task) {
  const fsWatcher = chokidar.watch(filePath, {
    ignored: /(^|[/\\])\../,
  })
  fsWatcher.on('ready', () => {
    task()
    fsWatcher.on('all', () => task())
  })
}

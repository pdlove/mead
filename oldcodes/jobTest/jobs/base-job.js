// jobs/base-job.js
const { EventEmitter } = require('events');
const { v4: uuidv4 } = require('uuid');

class BaseJob extends EventEmitter {
  constructor(name, params = {}) {
    super();
    this.id = uuidv4();
    this.name = name;
    this.params = params;
    this.created = new Date();
    this.status = 'pending'; // running, done, error
    this.progress = null;
  }

  setProgress(percent) {
    this.progress = percent;
    this.emit('update', { type: 'progress', percent });
  }

  log(group, detail, message, level = 'info') {
    this.emit('log', { group, detail, message, level, timestamp: new Date() });
  }

  updateStep(group, detail, status) {
    this.emit('step', { group, detail, status });
  }

  run() {
    throw new Error('Job must implement run()');
  }
  supportsPause() { return false; }
  supportsCancel() { return false; }
  pause() { throw new Error("Pause not supported"); }
  cancel() { throw new Error("Cancel not supported"); }

}

module.exports = BaseJob;

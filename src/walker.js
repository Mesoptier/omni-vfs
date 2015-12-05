import async from 'async';
import mpath from 'path';
import { EventEmitter2 } from 'eventemitter2';

export default class Walker extends EventEmitter2 {

  constructor(vfs, path, options = {}) {
    super();

    this.vfs = vfs;
    this.path = path;

    let {                       // DEFAULT OPTIONS:
      shouldStat = () => true,  // Make a stat call for every node
      shouldEnter = () => true, // Enter every directory
      concurrency = 1           // Process one node at a time
    } = options;

    this.shouldStat = shouldStat;
    this.shouldEnter = shouldEnter;

    // Create an async queue. We can push paths onto the queue, which will then
    // be asynchronously processed by the _walk function. Optionally, we can
    // have multiple _walk functions running at the same time.
    this.queue = async.queue(this._walk.bind(this), concurrency);

    // When the queue is empty, emit the 'end' event and close the queue
    this.queue.drain = () => {
      this.emit('end');
      this.queue.kill();
    };

    // Push the initial path on the queue
    this.queue.push(this.path);
  }
  
  _walk(path, callback) {
    this.vfs
      // Read the contents of the directory and loop over the file names
      .readdir(path)
      .each((name) => {
        // Combine the filename with the path, to get the full path in the VFS
        let fullPath = mpath.posix.join(path, name);

        if (!this.shouldStat(fullPath)) {
          return;
        }

        return this.vfs
          // Get the type of the node
          .statType(fullPath)
          .then((type) => {
            if (type === 'directory' && this.shouldEnter(fullPath)) {
              this.queue.push(fullPath);
            }

            this.emit(type, fullPath);
          });
      })
      .then(() => {
        callback();
      }, (err) => {
        // When an error occurs, emit an 'error' event and close the queue
        this.emit('error', err);
        this.queue.kill();
      });
  }

}

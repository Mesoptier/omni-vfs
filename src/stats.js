import mimeTypes from 'mime-types';

export default class Stats {

  constructor(stats) {
    this.type = stats.type;
    this.mime = stats.mime;

    delete stats.type;
    delete stats.mime;

    Object.assign(this, stats);
  }

  isFile() {
    return this.type === 'file';
  }

  isDirectory() {
    return this.type === 'directory';
  }

  static lookupMimeType(filename) {
    return mimeTypes.lookup(filename);
  }

}

export default class Stats {

  constructor({ type, mime }) {
    this.type = type;
    this.mime = mime;
  }

  get isFile() {
    return this.type === 'file';
  }

  get isDirectory() {
    return this.type === 'directory';
  }

}

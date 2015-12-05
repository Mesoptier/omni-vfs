import Walker from './walker';

export default class OmniBase {

  walk(path, options) {
    return new Walker(this, path, options);
  }

  /*eslint-disable no-unused-vars */
  readdir(path) {
    throw new Error('not implemented');
  }

  readfile(path) {
    throw new Error('not implemented');
  }

  stat(path) {
    throw new Error('not implemented');
  }
  /*eslint-enable no-unused-vars */

  statType(path) {
    return this.stat(path).then((stats) => stats.type);
  }

  close() {}

}

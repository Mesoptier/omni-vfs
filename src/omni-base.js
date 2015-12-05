import { Walker } from './walker';

/**
 * This is the base file system class. Other virtual file system implementations
 * need to extend this one.
 */
export default class OmniBase {

  /**
   * Recursively walk through the virtual file system.
   *
   * @param  {string} path    The path in which the walker should start.
   * @param  {Object} options Options object, see {@link Walker#constructor}.
   * @return {EventEmitter2}
   */
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

  /**
   * Get the type of a node. Normally this is a shorthand for doing
   * `vfs.stat(path).then((stats) => stats.type)`, but other VFS implementations
   * can override this for better efficiency.
   *
   * @param  {string} path Path to the node.
   * @return {string}      Type of the node (`file`, `directory`, etc.)
   */
  statType(path) {
    return this.stat(path).then((stats) => stats.type);
  }

  /**
   * Close the virtual file system.
   */
  close() { }

}

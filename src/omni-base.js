import Walker from './walker';

/**
 * This is the base file system class. Other virtual file system implementations
 * need to extend this one.
 *
 * @class OmniBase
 */
export default class OmniBase {

  /**
   * Recursively walks through the virtual file system.
   *
   * @param  {String} path    The path in which the walker should start.
   * @param  {Object} options Options object, see {@link Walker#constructor}.
   * @return {EventEmitter2}
   */
  walk(path, options) {
    return new Walker(this, path, options);
  }

  /*eslint-disable no-unused-vars */

  /**
   * Reads the contents of a directory.
   *
   * @param  {String} path [description]
   * @return {Promise}      [description]
   */
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
   * Get the type of a node.
   *
   * Normally this is a shorthand for doing <code>vfs.stat(path).then((stats) => stats.type)</code>.
   * But this behaviour can be overriden by other VFS implementations for
   * efficiency reasons.
   *
   * @param  {String} path Path to the node.
   * @return {Promise.<String>}      Type of the node (`file`, `directory`, etc.)
   */
  statType(path) {
    return this.stat(path).then((stats) => stats.type);
  }

  /**
   * Close the virtual file system.
   */
  close() { }

}

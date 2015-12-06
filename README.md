# omni-vfs

> Omni, a virtual file system.

## Install

```sh
$ npm install omni-vfs
```

> This package only includes the base classes for the virtual file systems, you need to install one (or more) of the various [implementations](#implementations) before you can start using Omni.

## API

### Class: `OmniBase`

> This is an abstract base class, you need to install one of the [implementations](#implementations) to use these methods.

##### `readdir(path: string) → Promise.<Array.<string>>`
Read the contents of a directory, returns an array of filenames.

##### `readfile(path: string) → Promise.<ReadableStream>`

##### `stat(path: string) → Promise.<Stats>`
Get a `Stats` object for a node.

##### `statType(path: string) → Promise.<string>`
Convenience method for getting the type of a node, returns `'file'` or `'directory'`. By default this method simply calls `.stat()`, but this can potentially be overridden for performance reasons by other VFS implementations.

##### `walk(path: string, [options: object]) → EventEmitter`
Recursively walk over the nodes in a directory.

* `options.shouldStat: function(path: string) → boolean` - If this callback returns `false`, no stat called is made for this node, this also means that no `file` or `directory` event will be fired. Returns `true` by default.
* `options.shouldEnter: function(path: string) → boolean` - If this callback returns `false`, the directory will not be entered by the walker, a `directory` event will still be fired. Returns `true` by default.
* `options.concurrency: number` - The number of workers to run in parallel. This is directly passed to `async.queue`. Defaults to `1`.

###### Events
* `.on('directory', function(path: string))`
* `.on('file', function(path: string))`
* `.on('end', function())`
* `.on('error', function(error: Error))`

###### Example
```javascript
const walker = vfs.walk('base/directory');
walker.on('directory', (path) => console.log(path));
walker.on('end', () => console.log('ended'));
```

### Class: `Stats`

##### `type: string`
The type of the node, either `file` or `directory`.

##### `mime: string`
The MIME type of the node. Note that the value of this is up to the VFS implementation.

##### `isDirectory() → boolean`
Whether the node is a directory, simply a convenience method for checking `type === 'directory'`.

##### `isFile() → boolean`
Whether the node is a file, simply a convenience method for checking `type === 'file'`.


Implementations
---------------

* [omni-vfs-local](https://github.com/Mesoptier/omni-vfs-local) - Local file system, using node's `fs`.
* omni-vfs-ftp


Creating your own implementation
--------------------------------
Extend the abstract `OmniBase` class and implement the unimplemented methods, optionally overriding already implemented methods (such as `.walk()` and `.statType()`) for performance reasons.

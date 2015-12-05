# Walker

Walker class used for recursively walking through a virtual file system.

## constructor

Walker constructor.

**Parameters**

-   `vfs` **OmniBase** Virtual file system to walk over.
-   `path` **string** The path in which the walker should start.
-   `options` **[Object]**  (optional, default `{}`)
    -   `options.shouldStat` **Function** 
    -   `options.shouldEnter` **Function** 
    -   `options.concurrency` **number** 

# OmniBase

This is the base file system class. Other virtual file system implementations
need to extend this one.

## close

Close the virtual file system.

## statType

Get the type of a node. Normally this is a shorthand for doing
`vfs.stat(path).then((stats) => stats.type)`, but other VFS implementations
can override this for better efficiency.

**Parameters**

-   `path` **string** Path to the node.

Returns **string** Type of the node (`file`, `directory`, etc.)

## walk

Recursively walk through the virtual file system.

**Parameters**

-   `path` **string** The path in which the walker should start.
-   `options` **Object** Options object, see `Walker#constructor`.

Returns **EventEmitter2** 

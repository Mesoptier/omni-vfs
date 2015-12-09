import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import isStream from 'is-stream';
import streamToPromise from 'stream-to-promise';
import { tree } from 'omni-tree';

import { OmniBase } from '../lib/index';

chai.use(chaiAsPromised);

export function omniBaseTest({ name, impl, init, mock }) {
  describe(name, () => {
    it('should extend OmniBase', () => {
      expect(impl.prototype instanceof OmniBase).to.be.true;
    });

    let vfs;

    before(() => {
      // Install mock data
      mock.install(tree((f, d, s) => {
        return d({
          'readdir': d({
            'empty-dir': d({}),
            'directory': d({
              'a.txt': '',
              'b.txt': ''
            }),
          }),

          'readfile': d({
            'plain.txt': f('content'),
            'jenny.png': f(new Buffer([8, 6, 7, 5, 3, 0, 9]))
          }),

          'stat': d({
            'file.txt': f('content', { mode: '0777' })
          })
        });
      }));

      // Initiate the VFS
      vfs = init();
    });

    after(() => {
      mock.restore();
    });

    describe('#readdir()', () => {

      it('should resolve with an array of the directory contents', () => {
        return expect(vfs.readdir('readdir/directory')).to.eventually.become(['a.txt', 'b.txt']);
      });

      it('should resolve with an empty array when the directory is empty', () => {
        return expect(vfs.readdir('readdir/empty-dir')).to.eventually.become([]);
      });

      it('should be rejected when the directory does not exist', () => {
        return expect(vfs.readdir('readdir/non-existant-dir')).to.be.rejectedWith('ENOENT');
      });

    });

    describe('#readfile()', () => {

      it('should resolve with a ReadableStream', () => {
        return vfs.readfile('readfile/plain.txt').then((stream) => {
          return expect(isStream.readable(stream)).to.be.true;
        });
      });

      it('should resolve with plain text content', () => {
        return vfs.readfile('readfile/plain.txt').then((stream) => {
          return streamToPromise(stream).then((buffer) => {
            return expect(buffer.toString()).to.equal('content');
          });
        });
      });

      it('should resolve with buffer content', () => {
        return vfs.readfile('readfile/jenny.png').then((stream) => {
          return streamToPromise(stream).then((buffer) => {
            return expect(buffer).to.deep.equal(new Buffer([8, 6, 7, 5, 3, 0, 9]));
          });
        });
      });

    });

    describe('#stat()', () => {

      it('should resolve with a Stats object', () => {
        return expect(vfs.stat('stat/file.txt')).to.resolve;
      });

    });

  });
}

import * as fs from 'fs';
import * as Path from 'path';
import * as Rx from 'rxjs';

//
// Recursively asynchronously enumerates the descendent
// files and directories of the given root directory.
//
export const traverse$ = (dir: string) => {
  return ls$(dir)
    .expand((x) => {
      return x.stat.isFile() ?
        Rx.Observable.empty() :
        ls$(x.path);
    });
};

//
// Asynchronously list the file stats of a directory.
//
export const ls$ = (dir: string) => {
  return readdir$(dir).flatMap((files) => {
    return Rx.Observable.from(files.map(stat$)).mergeAll();
  });
};

//
// Asynchronously reads the files in the directory and emits an Array of dir + filename.
//
export const readdir$ = (dir: string) => {
  return Rx.Observable.bindNodeCallback(fs.readdir, (files: string[]) => {
    return files.map((file) => Path.join(dir, file));
  })(dir);
};

//
// Asynchronously reads the stats of the item at the path.
//
export const stat$ = (path: string) => {
  return Rx.Observable.bindNodeCallback(fs.stat, (stat) => {
    return new FilenameMetadata(path || '', stat);
  })(path);
};

class FilenameMetadata {
  constructor(public path: string, public stat: fs.Stats) {
  }
}

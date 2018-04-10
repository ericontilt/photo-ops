import * as fs from 'fs';
import * as Rx from 'rxjs';
import * as Path from 'path';

// 
// Recursively asynchronously enumerates the descendent
// files and directories of the given root directory.
// 
export const traverse$ = (dir) : Rx.Observable<FilenameMetadata> => {
  return ls$(dir)
    .expand(x => {
      return x.stat.isFile() ?
        Rx.Observable.empty() :
        ls$(x.path)
    })
};

// 
// Asynchronously list the file stats of a directory.
// 
export const ls$ = (dir: string) => {
  return readdir$(dir).flatMap(files => {
    return Rx.Observable.from(files.map(stat$)).mergeAll();
  });
};

// 
// Asynchronously reads the files in the directory and emits an Array of dir + filename.
// 
export const readdir$ = (dir: string) => {
  return Rx.Observable.bindNodeCallback(fs.readdir, (files: string[]) => {
    return files.map(file => Path.join(dir, file));
  })(dir);

  // return Rx.Observable.create((observer: Rx.Observer<string[]>) => {
  //   fs.readdir(dir, (err, files) => {
  //     if (err) return observer.error(err);
  //     observer.next(files.map(file => {
  //       return Path.join(dir, file);
  //     }));
  //     // files.forEach(file => observer.next(Path.join(dir, file)));
  //     observer.complete();
  //   });
  // }) as Rx.Observable<string[]>;
};

// 
// Asynchronously reads the stats of the item at the path.
// 
export const stat$ = (path: string) => {
  return Rx.Observable.bindNodeCallback(fs.stat, stat => {
    return getFilenameMetaData(path || '', { stat });
  })(path);

  // return Rx.Observable.create((observer: Rx.Observer<FilenameMetadata>) => {
  //   fs.stat(path, (err, stat) => {
  //     if (err) return observer.error(err);
  //     var data = getFilenameMetaData(path || '', { stat });
  //     observer.next(data);
  //     observer.complete();
  //   });
  // }) as Rx.Observable<FilenameMetadata>;
};

interface FilenameMetadata {
  extension: string,
  name: string,
  location: string,
  path: string,
  stat: fs.Stats,
};

const getFilenameMetaData = (path, additionalMetadata): FilenameMetadata => {
  var extension = Path.extname(path);
  return {
    extension: Path.extname(path),
    name: Path.basename(path, extension),
    location: Path.dirname(path),
    path: path,
    ...additionalMetadata,
  };
};

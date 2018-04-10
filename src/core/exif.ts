import * as fastExif from 'fast-exif';
import * as Rx from 'rxjs';

export const readExif$ = (path: string) => {
  return Rx.Observable.fromPromise(fastExif.read(path));
};

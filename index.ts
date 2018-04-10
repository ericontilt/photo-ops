import * as Path from 'path';
import * as Rx from 'rxjs';
import * as Exif from './src/core/exif';
import * as fs from './src/core/fileSystem';

const dir = process.argv.length > 2 ? process.argv[2] : '.';

fs.traverse$(dir)
  .filter((x) => x.stat.isFile() && Path.extname(x.path).toLowerCase() === '.jpg')
  .take(2)
  .flatMap((meta) => Exif.readExif$(meta.path))
  .subscribe(
    ({ exif }) => console.log(exif.DateTimeOriginal),
    console.error,
    () => console.log('Done!'),
  );

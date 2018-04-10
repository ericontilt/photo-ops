import * as fs from './src/core/fileSystem';

const dir = process.argv.length > 2 ? process.argv[2] : '.';

fs.traverse$(dir)
  .filter((x) => x.stat.isFile())
  .take(10)
  .subscribe(
    (file) => console.log(`${file.path}`),
    console.error,
    () => console.log('Done!'),
  );

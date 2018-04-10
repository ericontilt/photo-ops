import * as fs from './src/core/fileSystem';

fs.traverse$('.')
  .filter((x) => x.stat.isFile())
  .take(5)
  .subscribe(
    console.log,
    console.error,
    () => console.log('Done!'),
  );

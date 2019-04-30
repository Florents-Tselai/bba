import * as path from 'path';
import * as fs from 'fs';

export function readFile(relativePath) {
  const sourcePath = path.resolve(__dirname, relativePath);
  return fs.readFileSync(sourcePath, 'utf8');
}

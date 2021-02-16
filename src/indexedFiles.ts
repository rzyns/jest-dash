import * as fs from 'fs';
import * as path from 'path';
import { Pages } from './Page';

import { flow, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { PathReporter } from "io-ts/PathReporter";

const unwrapEither = <E, A>(ea: E.Either<E, A>): E | A =>
  E.isLeft(ea) ? ea.left : ea.right;

export const getIndexedFiles = (filePath?: string) => pipe(
  E.tryCatch(
    () => fs.readFileSync(filePath ?? path.join(__dirname, "../indexedFiles.json"), "utf8"),
    (e) => String(e)
  ),
  E.chain((json) => E.parseJSON(json, String)),
  E.chain(
    flow(
      Pages.decode,
      E.mapLeft((e) => PathReporter.report(E.left(e)).join("\n"))
    )
  ),
  unwrapEither
);
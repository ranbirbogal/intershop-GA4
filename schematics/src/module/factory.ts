import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';
import { PWAModuleOptionsSchema as Options } from 'schemas/module/schema';

import { applyNameAndPath, determineArtifactName } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';

export function createModule(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    options = await applyNameAndPath('module', host, options);
    options = determineArtifactName('module', host, options);

    const operations: Rule[] = [];

    operations.push(
      mergeWith(
        apply(url('./files'), [
          applyTemplates({
            ...strings,
            ...options,
            'if-flat': (s: unknown) => (options.flat ? '' : s),
          }),
          move(options.path),
        ])
      )
    );

    operations.push(applyLintFix());

    return chain(operations);
  };
}

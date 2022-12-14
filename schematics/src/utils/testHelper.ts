import { Observable, OperatorFunction } from '@angular-devkit/core/node_modules/rxjs';
import { switchMap, tap } from '@angular-devkit/core/node_modules/rxjs/operators';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ModuleOptions } from '@schematics/angular/module/schema';
import { readFileSync } from 'fs';

export function createSchematicRunner() {
  return new SchematicTestRunner('intershop-schematics', require.resolve('../collection.json'));
}

export function createApplication(schematicRunner: SchematicTestRunner) {
  return schematicRunner
    .runExternalSchematicAsync('@schematics/angular', 'workspace', {
      name: 'workspace',
      newProjectRoot: 'projects',
      version: '6.0.0',
    })
    .pipe(
      switchMap(workspace =>
        schematicRunner.runExternalSchematicAsync(
          '@schematics/angular',
          'application',
          {
            name: 'bar',
            inlineStyle: false,
            inlineTemplate: false,
            routing: true,
            style: 'scss',
            skipTests: false,
            skipPackageJson: false,
            prefix: 'ish',
            projectRoot: '',
          },
          workspace
        )
      )
    );
}

export function createModule(
  schematicRunner: SchematicTestRunner,
  options: ModuleOptions
): OperatorFunction<UnitTestTree, UnitTestTree> {
  return (source$: Observable<UnitTestTree>) =>
    source$.pipe(switchMap(tree => schematicRunner.runSchematicAsync('module', { ...options, project: 'bar' }, tree)));
}

export function copyFileFromPWA(path: string): OperatorFunction<UnitTestTree, UnitTestTree> {
  return (source$: Observable<UnitTestTree>) =>
    source$.pipe(
      tap(tree => {
        tree.create(`/${path}`, readFileSync(`../${path}`));
      })
    );
}

export function createAppLastRoutingModule(schematicRunner: SchematicTestRunner) {
  return (source$: Observable<UnitTestTree>) =>
    source$.pipe(
      switchMap(tree =>
        schematicRunner.runExternalSchematicAsync(
          '@schematics/angular',
          'module',
          {
            name: 'pages/app-last-routing',
            flat: true,
            module: 'app.module',
            project: 'bar',
          },
          tree
        )
      )
    );
}

export function componentDecorator(input: string, omitChangeDetection = true) {
  const decorator = input.match(/@Component.*}\)/s)?.[0]?.replace(/\s+/g, ' ');
  return omitChangeDetection ? decorator?.replace(' changeDetection: ChangeDetectionStrategy.OnPush,', '') : decorator;
}

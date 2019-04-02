import { normalize, strings } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';
import { validateHtmlSelector, validateName } from '@schematics/angular/utility/validation';

import { buildSelector } from './selector';

export function applyNameAndPath(
  artifact: string,
  host: Tree,
  options: {
    project?: string;
    name?: string;
    path?: string;
    restricted?: boolean;
    flat?: boolean;
    artifactFolder?: boolean;
  }
) {
  let path = options.path;
  let name = options.name;

  const project = getProject(host, options.project);

  // remove possible added path from root
  if (name && name.startsWith('src/app/')) {
    name = name.substr(8);
  }

  const parsedPath = parseName(path || buildDefaultPath(project), name);
  name = parsedPath.name;
  if (artifact) {
    name = name.replace(new RegExp(`\-?${artifact}$`), '');
  }

  if (!options.restricted) {
    path = parsedPath.path;
  }
  if (options.artifactFolder) {
    // add artifact folder
    const containingFolder = `/${artifact}s`;
    if (!options.flat && !path.endsWith(containingFolder)) {
      path += containingFolder;
    }
  }

  validateName(name);

  return {
    ...options,
    name,
    path,
  };
}

export function determineArtifactName(
  artifact: string,
  _: Tree,
  options: {
    project?: string;
    name?: string;
    path?: string;
    restricted?: boolean;
    flat?: boolean;
    artifactFolder?: boolean;
  }
) {
  const kebab = strings.dasherize(options.name);
  const moduleImportPath = `/${options.path}${options.flat ? '' : `/${kebab}`}/${kebab}.${artifact}`;

  const artifactName = strings.classify(`${options.name}-${artifact}`);

  return {
    ...options,
    moduleImportPath,
    artifactName,
  };
}

export function detectExtension(
  artifact: string,
  host: Tree,
  options: { path?: string; name?: string; restricted?: boolean; project?: string; extension?: string }
) {
  const project = getProject(host, options.project);

  let extension = options.extension;
  const regex = /extensions\/([a-z][a-z0-9-]+)/;
  const requestDestination = normalize(`${options.path}/${options.name}`);
  if (regex.test(requestDestination)) {
    extension = requestDestination.match(regex)[1];
  }

  let path = options.path;
  if (options.restricted) {
    if (!extension) {
      const rootLocation = ['page', 'extension', 'cms'].includes(artifact) ? '' : 'core/';
      path = `${project.sourceRoot}/app/${rootLocation}${artifact.replace(/s$/, '')}s/`;
    } else {
      path = `${project.sourceRoot}/app/extensions/${extension}/${artifact}s/`;
    }
  }

  return {
    ...options,
    extension,
    path,
  };
}

export function findDeclaringModule(host: Tree, options: { name?: string }) {
  const module = findModuleFromOptions(host, { ...options, name: options.name as string });
  return {
    ...options,
    module,
  };
}

export function generateSelector(
  artifact: string,
  host: Tree,
  options: { project?: string; selector?: string; name?: string; prefix?: string }
) {
  const project = getProject(host, options.project);
  const selector = options.selector || buildSelector(artifact, options, project.prefix);
  validateHtmlSelector(selector);

  return {
    ...options,
    selector,
  };
}

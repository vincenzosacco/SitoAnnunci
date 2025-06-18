// This script reads a properties file and parses it
// to update Angular configuration files and package.json.

import properties from 'properties-parser';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import path from 'path';

// Constants
const PROPERTIES_PATH = '../app.properties';
const PACKAGE_JSON_PATH = './package.json';
const ANGULAR_JSON_PATH = './angular.json';
const ENV_DEV_PATH = './src/environments/environment.ts';
const ENV_PROD_PATH = './src/environments/environment.prod.ts';

function main() {
  // Read properties file
  const props = properties.parse(readFileSync(PROPERTIES_PATH, 'utf8'));
  // derive additional properties ( just for readability )
  props['frontend.mock.api.url'] = `http://${props['frontend.mock.api.host']}:${props['frontend.mock.api.port']}`;
  props['backend.api.url'] = `${props['backend.protocol']}://${props['backend.host']}:${props['backend.port']}${props['backend.api.entrypoint']}`;

  // Validate required properties
  validateProperties(props);

  // Update configuration files
  updatePackageJson(props);
  updateAngularJson(props);
  updateEnvironmentFiles(props);
}

function validateProperties(props: properties.Properties) {
  const requiredProps = [
    'frontend.mock.api.port',
    'frontend.mock.api.host',
    'frontend.port',
    'frontend.mock.api.url',
    'backend.api.url'
  ];

  requiredProps.forEach(prop => {
    if (!props[prop]) {
      throw new Error(`Missing '${prop}' property in ${PROPERTIES_PATH}`);
    }
  });
}

function updatePackageJson(props: properties.Properties) {
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    packageJson.scripts.mock_db = `json-server -p ${props['frontend.mock.api.port']} -h ${props['frontend.mock.api.host']} .\\json_server\\db_mock.json`;
  writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2));
  console.log(`Updated package.json with mock_db script`);
}

function updateAngularJson(props: properties.Properties) {
  const angularJson = JSON.parse(readFileSync(ANGULAR_JSON_PATH, 'utf8'));

  angularJson.projects.frontend.architect.serve.options.port = parseInt(props['frontend.port']);
  writeFileSync(ANGULAR_JSON_PATH, JSON.stringify(angularJson, null, 2));
  console.log(`Updated angular.json with serve port: ${props['frontend.port']}`);
}

function updateEnvironmentFiles(props: properties.Properties) {
  const environments = [
    {
      path: ENV_DEV_PATH,
      content: generateEnvironmentContent(false, props['frontend.mock.api.url'])
    },
    {
      path: ENV_PROD_PATH,
      content: generateEnvironmentContent(true, props['backend.api.url'])
    }
  ];

  environments.forEach(env => {
    ensureDirectoryExist(env.path);
    writeFileSync(env.path, env.content);
  });
  console.log('Updated environment files');
}

function generateEnvironmentContent(isProduction: boolean, serverUrl: any) {
  return `export const environment = {
  production: ${isProduction},
  api: {
    serverUrl: '${serverUrl}',
  },
};`;
}

function ensureDirectoryExist(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!existsSync(dirname)) {
    mkdirSync(dirname, { recursive: true });
  }
}

main();

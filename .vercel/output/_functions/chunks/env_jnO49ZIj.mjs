const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.embarazafit.com", "SSR": true};
function requireEnv(name) {
  const value = Object.assign(__vite_import_meta_env__, {})[name] ?? process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno ${name} no configurada`);
  }
  return value;
}
function getRequiredEnv(name) {
  return requireEnv(name);
}

export { getRequiredEnv as g };

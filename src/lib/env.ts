function requireEnv(name: string): string {
  const value = import.meta.env[name] ?? process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno ${name} no configurada`);
  }
  return value;
}

export function getEnv(name: string): string | undefined {
  return import.meta.env[name] ?? process.env[name];
}

export function getRequiredEnv(name: string): string {
  return requireEnv(name);
}

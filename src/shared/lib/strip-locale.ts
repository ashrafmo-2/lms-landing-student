export function stripLocale(path: string): string {
    return path.replace(/^\/(ar|en|it)(\/|$)/, "/");
  }
  
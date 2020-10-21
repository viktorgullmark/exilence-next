declare module 'namor' {
  interface Options {
    words?: number;
    separator?: string;
    saltType?: 'number' | 'string' | 'mixed';
    saltLength?: number;
    subset?: 'manly';
    /* deprecated */
    char?: string;
    numbers?: number;
    manly?: boolean;
  }

  function generate(opts: Options): string;
}

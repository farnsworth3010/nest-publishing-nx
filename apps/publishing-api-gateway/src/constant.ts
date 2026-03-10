export const NEWS_CLIENT = 'NEWS_CLIENT';
export const AUTHOR_CLIENT = 'AUTHOR_CLIENT';
export const BOOK_CLIENT = 'BOOK_CLIENT';
export const BOOK_MATERIAL_CLIENT = 'BOOK_MATERIAL_CLIENT';
export const CATEGORY_CLIENT = 'CATEGORY_CLIENT';
export const MATERIAL_CLIENT = 'MATERIAL_CLIENT';
export const OFFICE_CLIENT = 'OFFICE_CLIENT';
export const ROLE_CLIENT = 'ROLE_CLIENT';
export const SALE_CLIENT = 'SALE_CLIENT';
export const USER_CLIENT = 'USER_CLIENT';

export const CLIENT_PORTS = Object.freeze( {
  [ NEWS_CLIENT ]: 3010,
  [ AUTHOR_CLIENT ]: 3009,
  [ BOOK_CLIENT ]: 3002,
  [ BOOK_MATERIAL_CLIENT ]: 3003,
  [ CATEGORY_CLIENT ]: 3004,
  [ MATERIAL_CLIENT ]: 3005,
  [ OFFICE_CLIENT ]: 3006,
  [ ROLE_CLIENT ]: 3007,
  [ SALE_CLIENT ]: 3008,
  [ USER_CLIENT ]: 3001,
} );

export function resolveClientPorts(): Readonly<Record<string, number>> {
  const resolved: Record<string, number> = {};

  for ( const [ key, def ] of Object.entries( CLIENT_PORTS ) ) {
    const env = process.env[ key ];
    const parsed = env !== undefined ? Number( env ) : def;
    resolved[ key ] = Number.isFinite( parsed ) && parsed > 0 ? parsed : def;
  }

  return Object.freeze( resolved );
}

export const CLIENT_KEYS = Object.freeze( Object.keys( CLIENT_PORTS ) );

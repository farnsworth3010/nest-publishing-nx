import 'dotenv/config';
import { DataSource, EntityManager } from 'typeorm';
import { Author } from '../libs/contracts/src/author/author.entity';
import { BookMaterial } from '../libs/contracts/src/book-material/book-material.entity';
import { Book } from '../libs/contracts/src/book/book.entity';
import { Category } from '../libs/contracts/src/category/category.entity';
import { Material } from '../libs/contracts/src/material/material.entity';
import { Office } from '../libs/contracts/src/office/office.entity';
import { Role } from '../libs/contracts/src/role/role.entity';
import { Sale } from '../libs/contracts/src/sale/sale.entity';
import { User } from '../libs/contracts/src/user/user.entity';

const AppDataSource = new DataSource( {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +( process.env.DB_PORT || 5432 ),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nest_publishing',
  entities: [
    User, Role, Book, BookMaterial, Category, Office, Sale, Material, Author
  ],
  synchronize: false,
} );

async function init() {

  console.log( 'Purging database...' );

  await AppDataSource.initialize();

  const manager: EntityManager = AppDataSource.manager;

  const entities = AppDataSource.entityMetadatas;
  const tableNames = entities.map( ( entity ) => `"${ entity.tableName }"` ).join( ", " );

  // Truncate all tables with CASCADE
  const truncateQuery = `TRUNCATE TABLE ${ tableNames } CASCADE;`;
  await manager.query( truncateQuery );
  console.log( 'All tables truncated with CASCADE' );

  // Reset all primary key sequences
  for ( const entity of entities ) {
    // Only reset if PK is auto-increment
    if ( entity.generatedColumns.length > 0 ) {
      for ( const column of entity.generatedColumns ) {
        // Only handle integer PKs
        if ( column.generationStrategy === 'increment' ) {
          // Default sequence name pattern in Postgres
          const sequenceName = `${ entity.tableName }_${ column.databaseName }_seq`;
          const resetQuery = `ALTER SEQUENCE "${ sequenceName }" RESTART WITH 1;`;
          try {
            await manager.query( resetQuery );
            console.log( `Sequence ${ sequenceName } reset` );
          } catch ( err ) {
            console.warn( `Could not reset sequence ${ sequenceName }:`, err.message );
          }
        }
      }
    }
  }

  console.log( 'Purging and sequence reset complete!' );

  await AppDataSource.destroy();
}

init().catch( console.error );
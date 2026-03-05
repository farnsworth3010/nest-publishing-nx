import 'dotenv/config';
import { Author } from 'src/modules/author/entities/author.entity';
import { BookMaterial } from 'src/modules/book-material/entities/book-material.entity';
import { Book } from 'src/modules/book/entities/book.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Material } from 'src/modules/material/entities/material.entity';
import { Office } from 'src/modules/office/entities/office.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Sale } from 'src/modules/sale/entities/sale.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource, EntityManager } from 'typeorm';

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

  const entities = manager.connection.entityMetadatas;
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
import 'dotenv/config';
import { createBookMaterials } from 'src/scripts/up/book-materials';
import { DataSource, EntityManager } from 'typeorm';
import { Author } from '../modules/author/entities/author.entity';
import { BookMaterial } from '../modules/book-material/entities/book-material.entity';
import { Book } from '../modules/book/entities/book.entity';
import { Category } from '../modules/category/entities/category.entity';
import { Material } from '../modules/material/entities/material.entity';
import { Office } from '../modules/office/entities/office.entity';
import { Role } from '../modules/role/entities/role.entity';
import { Sale } from '../modules/sale/entities/sale.entity';
import { User } from '../modules/user/entities/user.entity';
import { createAuthors } from './up/authors';
import { createBooks } from './up/books';
import { createCategories } from './up/categories';
import { createMaterials } from './up/materials';
import { createOffices } from './up/offices';
import { createRoles } from './up/roles';
import { createSales } from './up/sales';
import { createUsers } from './up/users';

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
  console.log( 'Initializing database...' );

  await AppDataSource.initialize();
  const manager: EntityManager = AppDataSource.manager;

  const authors: Author[] = await createAuthors( manager );
  const roles: Role[] = await createRoles( manager );
  const offices: Office[] = await createOffices( manager );
  const users: User[] = await createUsers( manager, roles, offices );
  const categories: Category[] = await createCategories( manager );
  const books: Book[] = await createBooks( manager, categories, authors );
  const materials: Material[] = await createMaterials( manager );

  await createSales( manager, books, users, offices );
  await createBookMaterials( manager, books, materials );

  console.log( 'Initialization complete!' );
  await AppDataSource.destroy();
}

init().catch( console.error );
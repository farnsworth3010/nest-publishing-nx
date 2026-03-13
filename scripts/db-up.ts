import { News } from '@app/contracts/news/news.entity';
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
import { createAuthors } from './up/authors';
import { createBookMaterials } from './up/book-materials';
import { createBooks } from './up/books';
import { createCategories } from './up/categories';
import { createMaterials } from './up/materials';
import { createNews } from './up/news';
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
    User, Role, Book, BookMaterial, Category, Office, Sale, Material, Author, News
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

  await createNews( manager, authors );

  console.log( 'Initialization complete!' );
  await AppDataSource.destroy();
}

init().catch( console.error );
import { EntityManager } from 'typeorm';
import { Author } from '../../libs/contracts/src/author/author.entity';

export const createAuthors = async ( manager: EntityManager ): Promise<Author[]> => {
  console.log( "Creating authors..." );

  const authorNames: { firstName: string; lastName: string; }[] = [
    { firstName: 'Harper', lastName: 'Lee' },
    { firstName: 'George', lastName: 'Orwell' },
    { firstName: 'F. Scott', lastName: 'Fitzgerald' },
    { firstName: 'J.D.', lastName: 'Salinger' },
    { firstName: 'Herman', lastName: 'Melville' },
    { firstName: 'Leo', lastName: 'Tolstoy' },
    { firstName: 'Jane', lastName: 'Austen' },
    { firstName: 'Fyodor', lastName: 'Dostoevsky' },
    { firstName: 'Aldous', lastName: 'Huxley' },
    { firstName: 'J.R.R.', lastName: 'Tolkien' },
    { firstName: 'J.K.', lastName: 'Rowling' },
    { firstName: 'Paulo', lastName: 'Coelho' },
    { firstName: 'Antoine', lastName: 'de Saint-Exupéry' },
    { firstName: 'Dan', lastName: 'Brown' },
    { firstName: 'Stieg', lastName: 'Larsson' },
    { firstName: 'Gillian', lastName: 'Flynn' },
    { firstName: 'Suzanne', lastName: 'Collins' },
    { firstName: 'Stephenie', lastName: 'Meyer' },
    { firstName: 'John', lastName: 'Green' },
    { firstName: 'Stephen', lastName: 'King' },
    { firstName: 'Bram', lastName: 'Stoker' },
    { firstName: 'Mary', lastName: 'Shelley' },
    { firstName: 'Cormac', lastName: 'McCarthy' },
    { firstName: 'Yann', lastName: 'Martel' },
    { firstName: 'Arthur', lastName: 'Golden' },
    { firstName: 'Markus', lastName: 'Zusak' },
    { firstName: 'George R.R.', lastName: 'Martin' },
    { firstName: 'Patrick', lastName: 'Rothfuss' },
    { firstName: 'Frank', lastName: 'Herbert' },
    { firstName: 'Isaac', lastName: 'Asimov' },
    { firstName: 'Ray', lastName: 'Bradbury' },
    { firstName: 'Charles', lastName: 'Dickens' },
    { firstName: 'Margaret', lastName: 'Atwood' },
    { firstName: 'C.S.', lastName: 'Lewis' },
    { firstName: 'E.B.', lastName: 'White' },
    { firstName: 'Frances', lastName: 'Burnett' },
    { firstName: 'Roald', lastName: 'Dahl' },
    { firstName: 'Kenneth', lastName: 'Grahame' },
    { firstName: 'Emily', lastName: 'Bronte' },
    { firstName: 'Charlotte', lastName: 'Bronte' },
    { firstName: 'Victor', lastName: 'Hugo' },
    { firstName: 'Miguel', lastName: 'de Cervantes' },
    { firstName: 'Homer', lastName: '' },
    { firstName: 'Dante', lastName: 'Alighieri' },
    { firstName: 'William', lastName: 'Shakespeare' },
  ];
  const authors: Author[] = [];

  for ( const a of authorNames ) {
    authors.push( manager.create( Author, a ) );
  }

  await manager.save( authors );

  console.log( `Created ${ authors.length } authors.` );
  return authors;
};
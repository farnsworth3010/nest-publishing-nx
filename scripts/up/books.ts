import { Author } from 'src/modules/author/entities/author.entity';
import { Book } from 'src/modules/book/entities/book.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { getRandomInt } from 'src/utils/utils';
import { EntityManager } from 'typeorm';

export const createBooks = async ( manager: EntityManager, categories: Category[], authors: Author[] ): Promise<Book[]> => {
  console.log( "Creating books..." );

  const realBooks: { name: string, categories: string[]; }[] = [
    { name: 'To Kill a Mockingbird', categories: [ 'Classic', 'Fiction' ] },
    { name: '1984', categories: [ 'Dystopian', 'Classic', 'Science Fiction' ] },
    { name: 'The Great Gatsby', categories: [ 'Classic', 'Fiction' ] },
    { name: 'The Catcher in the Rye', categories: [ 'Classic', 'Fiction' ] },
    { name: 'Moby-Dick', categories: [ 'Classic', 'Adventure' ] },
    { name: 'War and Peace', categories: [ 'Classic', 'War' ] },
    { name: 'Pride and Prejudice', categories: [ 'Classic', 'Romance' ] },
    { name: 'Crime and Punishment', categories: [ 'Classic', 'Mystery' ] },
    { name: 'Brave New World', categories: [ 'Dystopian', 'Science Fiction' ] },
    { name: 'The Hobbit', categories: [ 'Fantasy', 'Adventure' ] },
    { name: 'Harry Potter and the Sorcerer\'s Stone', categories: [ 'Fantasy', 'Children' ] },
    { name: 'The Lord of the Rings', categories: [ 'Fantasy', 'Adventure' ] },
    { name: 'The Alchemist', categories: [ 'Fiction', 'Adventure' ] },
    { name: 'The Little Prince', categories: [ 'Children', 'Classic' ] },
    { name: 'The Da Vinci Code', categories: [ 'Mystery', 'Thriller' ] },
    { name: 'The Girl with the Dragon Tattoo', categories: [ 'Mystery', 'Thriller' ] },
    { name: 'Gone Girl', categories: [ 'Mystery', 'Thriller' ] },
    { name: 'The Hunger Games', categories: [ 'Dystopian', 'Young Adult' ] },
    { name: 'Twilight', categories: [ 'Fantasy', 'Romance', 'Young Adult' ] },
    { name: 'The Fault in Our Stars', categories: [ 'Romance', 'Young Adult' ] },
    { name: 'The Shining', categories: [ 'Horror', 'Thriller' ] },
    { name: 'Dracula', categories: [ 'Horror', 'Classic' ] },
    { name: 'Frankenstein', categories: [ 'Horror', 'Classic' ] },
    { name: 'The Road', categories: [ 'Dystopian', 'Adventure' ] },
    { name: 'Life of Pi', categories: [ 'Adventure', 'Fiction' ] },
    { name: 'Memoirs of a Geisha', categories: [ 'Romance', 'Historical' ] },
    { name: 'The Book Thief', categories: [ 'Historical', 'Young Adult' ] },
    { name: 'A Game of Thrones', categories: [ 'Fantasy', 'Adventure' ] },
    { name: 'The Name of the Wind', categories: [ 'Fantasy', 'Adventure' ] },
    { name: 'Dune', categories: [ 'Science Fiction', 'Adventure' ] },
    { name: 'Foundation', categories: [ 'Science Fiction', 'Classic' ] },
    { name: 'Fahrenheit 451', categories: [ 'Dystopian', 'Classic' ] },
    { name: 'Animal Farm', categories: [ 'Classic', 'Satire' ] },
    { name: 'The Kite Runner', categories: [ 'Fiction', 'Historical' ] },
    { name: 'The Handmaid\'s Tale', categories: [ 'Dystopian', 'Classic' ] },
    { name: 'The Chronicles of Narnia', categories: [ 'Fantasy', 'Children' ] },
    { name: 'Charlotte\'s Web', categories: [ 'Children', 'Classic' ] },
    { name: 'The Secret Garden', categories: [ 'Children', 'Classic' ] },
    { name: 'Matilda', categories: [ 'Children', 'Classic' ] },
    { name: 'The Wind in the Willows', categories: [ 'Children', 'Classic' ] },
    { name: 'Wuthering Heights', categories: [ 'Classic', 'Romance' ] },
    { name: 'Jane Eyre', categories: [ 'Classic', 'Romance' ] },
    { name: 'Great Expectations', categories: [ 'Classic', 'Fiction' ] },
    { name: 'Les Misérables', categories: [ 'Classic', 'Historical' ] },
    { name: 'Don Quixote', categories: [ 'Classic', 'Adventure' ] },
    { name: 'The Odyssey', categories: [ 'Classic', 'Adventure' ] },
    { name: 'The Iliad', categories: [ 'Classic', 'Adventure' ] },
    { name: 'The Divine Comedy', categories: [ 'Classic', 'Poetry' ] },
    { name: 'Hamlet', categories: [ 'Classic', 'Drama' ] },
    { name: 'Macbeth', categories: [ 'Classic', 'Drama' ] },
  ];

  const books: Book[] = [];

  for ( let i = 0; i < realBooks.length; i++ ) {
    const bookData = realBooks[ i ];
    const bookCategories = categories.filter( cat => bookData.categories.includes( cat.name ) );
    let author: Author | undefined;

    switch ( bookData.name ) {
      case 'To Kill a Mockingbird': author = authors.find( a => a.lastName === 'Lee' ); break;
      case '1984': author = authors.find( a => a.lastName === 'Orwell' ); break;
      case 'The Great Gatsby': author = authors.find( a => a.lastName === 'Fitzgerald' ); break;
      case 'The Catcher in the Rye': author = authors.find( a => a.lastName === 'Salinger' ); break;
      case 'Moby-Dick': author = authors.find( a => a.lastName === 'Melville' ); break;
      case 'War and Peace': author = authors.find( a => a.lastName === 'Tolstoy' ); break;
      case 'Pride and Prejudice': author = authors.find( a => a.lastName === 'Austen' ); break;
      case 'Crime and Punishment': author = authors.find( a => a.lastName === 'Dostoevsky' ); break;
      case 'Brave New World': author = authors.find( a => a.lastName === 'Huxley' ); break;
      case 'The Hobbit': author = authors.find( a => a.lastName === 'Tolkien' ); break;
      case 'Harry Potter and the Sorcerer\'s Stone': author = authors.find( a => a.lastName === 'Rowling' ); break;
      case 'The Lord of the Rings': author = authors.find( a => a.lastName === 'Tolkien' ); break;
      case 'The Alchemist': author = authors.find( a => a.lastName === 'Coelho' ); break;
      case 'The Little Prince': author = authors.find( a => a.lastName === 'de Saint-Exupéry' ); break;
      case 'The Da Vinci Code': author = authors.find( a => a.lastName === 'Brown' ); break;
      case 'The Girl with the Dragon Tattoo': author = authors.find( a => a.lastName === 'Larsson' ); break;
      case 'Gone Girl': author = authors.find( a => a.lastName === 'Flynn' ); break;
      case 'The Hunger Games': author = authors.find( a => a.lastName === 'Collins' ); break;
      case 'Twilight': author = authors.find( a => a.lastName === 'Meyer' ); break;
      case 'The Fault in Our Stars': author = authors.find( a => a.lastName === 'Green' ); break;
      case 'The Shining': author = authors.find( a => a.lastName === 'King' ); break;
      case 'Dracula': author = authors.find( a => a.lastName === 'Stoker' ); break;
      case 'Frankenstein': author = authors.find( a => a.lastName === 'Shelley' ); break;
      case 'The Road': author = authors.find( a => a.lastName === 'McCarthy' ); break;
      case 'Life of Pi': author = authors.find( a => a.lastName === 'Martel' ); break;
      case 'Memoirs of a Geisha': author = authors.find( a => a.lastName === 'Golden' ); break;
      case 'The Book Thief': author = authors.find( a => a.lastName === 'Zusak' ); break;
      case 'A Game of Thrones': author = authors.find( a => a.lastName === 'Martin' ); break;
      case 'The Name of the Wind': author = authors.find( a => a.lastName === 'Rothfuss' ); break;
      case 'Dune': author = authors.find( a => a.lastName === 'Herbert' ); break;
      case 'Foundation': author = authors.find( a => a.lastName === 'Asimov' ); break;
      case 'Fahrenheit 451': author = authors.find( a => a.lastName === 'Bradbury' ); break;
      case 'Animal Farm': author = authors.find( a => a.lastName === 'Orwell' ); break;
      case 'The Kite Runner': author = authors.find( a => a.lastName === 'Hosseini' ); break;
      case 'The Handmaid\'s Tale': author = authors.find( a => a.lastName === 'Atwood' ); break;
      case 'The Chronicles of Narnia': author = authors.find( a => a.lastName === 'Lewis' ); break;
      case 'Charlotte\'s Web': author = authors.find( a => a.lastName === 'White' ); break;
      case 'The Secret Garden': author = authors.find( a => a.lastName === 'Burnett' ); break;
      case 'Matilda': author = authors.find( a => a.lastName === 'Dahl' ); break;
      case 'The Wind in the Willows': author = authors.find( a => a.lastName === 'Grahame' ); break;
      case 'Wuthering Heights': author = authors.find( a => a.lastName === 'Bronte' && a.firstName === 'Emily' ); break;
      case 'Jane Eyre': author = authors.find( a => a.lastName === 'Bronte' && a.firstName === 'Charlotte' ); break;
      case 'Great Expectations': author = authors.find( a => a.lastName === 'Dickens' ); break;
      case 'Les Misérables': author = authors.find( a => a.lastName === 'Hugo' ); break;
      case 'Don Quixote': author = authors.find( a => a.lastName === 'de Cervantes' ); break;
      case 'The Odyssey': author = authors.find( a => a.lastName === 'Homer' ); break;
      case 'The Iliad': author = authors.find( a => a.lastName === 'Homer' ); break;
      case 'The Divine Comedy': author = authors.find( a => a.lastName === 'Alighieri' ); break;
      case 'Hamlet': author = authors.find( a => a.lastName === 'Shakespeare' ); break;
      case 'Macbeth': author = authors.find( a => a.lastName === 'Shakespeare' ); break;
      default: author = authors[ i % authors.length ]; // fallback
    }

    const bookAuthors = author ? [ author ] : [];

    books.push( manager.create( Book, {
      name: bookData.name,
      pages: getRandomInt( 100, 800 ),
      value: getRandomInt( 200, 5000 ),
      quantity: getRandomInt( 1, 50 ),
      publishingStart: new Date( `2025-01-${ getRandomInt( 1, 28 ) }` ),
      publishingEnd: new Date( `2025-12-${ getRandomInt( 1, 28 ) }` ),
      categories: bookCategories,
      authors: bookAuthors,
    } ) );
  }
  await manager.save( books );

  console.log( `Created ${ books.length } books.` );

  return books;
};

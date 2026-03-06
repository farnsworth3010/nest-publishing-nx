import { EntityManager } from 'typeorm';
import { BookMaterial } from '../../libs/contracts/src/book-material/book-material.entity';
import { Book } from '../../libs/contracts/src/book/book.entity';
import { Material } from '../../libs/contracts/src/material/material.entity';
import { getRandomInt } from '../utils';

export const createBookMaterials = async ( manager: EntityManager, books: Book[], materials: Material[] ): Promise<BookMaterial[]> => {
  console.log( "Creating book-material associations..." );
  const bookMaterials: BookMaterial[] = [];

  for ( const book of books ) {
    const numMaterials = getRandomInt( 1, 3 );
    const usedMaterials = new Set();

    for ( let j = 0; j < numMaterials; j++ ) {
      let matIdx: number;
      let material: Material;

      do {
        matIdx = getRandomInt( 0, materials.length - 1 );
        material = materials[ matIdx ];
      } while ( usedMaterials.has( materials[ matIdx ] ) );

      usedMaterials.add( material );

      bookMaterials.push( manager.create( BookMaterial, {
        amount: getRandomInt( 10, 100 ),
        book,
        material,
        book_id: book.id,
        material_id: material.id,
      } ) );
    }
  }
  await manager.save( bookMaterials );

  console.log( `Created ${ bookMaterials.length } book-material associations.` );

  return bookMaterials;
};


import { EntityManager } from 'typeorm';
import { Book } from '../../libs/contracts/src/book/book.entity';
import { Office } from '../../libs/contracts/src/office/office.entity';
import { Sale } from '../../libs/contracts/src/sale/sale.entity';
import { User } from '../../libs/contracts/src/user/user.entity';
import { getRandomInt } from '../utils';

export const createSales = async ( manager: EntityManager, books: Book[], users: User[], offices: Office[] ): Promise<Sale[]> => {
  console.log( "Creating sales..." );

  const sales: Sale[] = [];

  for ( let i = 0; i < books.length; i++ ) {
    const numSales: number = getRandomInt( 1, 3 );
    const clientUsers: User[] = users.filter( u => u.role && u.role.name === 'client' );

    for ( let j = 0; j < numSales; j++ ) {
      const user: User = clientUsers[ getRandomInt( 0, clientUsers.length - 1 ) ];
      const saleAmount: number = getRandomInt( 1, 5 );
      const salePrice: number = books[ i ].value * saleAmount;
      const office = offices[ getRandomInt( 0, offices.length - 1 ) ];

      sales.push( manager.create( Sale, {
        book: books[ i ],
        user,
        office,
        amount: saleAmount,
        date: new Date( `2025-0${ getRandomInt( 1, 9 ) }-${ getRandomInt( 1, 28 ) }` ),
        price: salePrice,
        isExternal: Math.random() < 0.2,
        bookId: books[ i ].id,
        userId: user.id,
      } ) );
    }
  }
  await manager.save( sales );

  console.log( `Created ${ sales.length } sales.` );
  return sales;
};

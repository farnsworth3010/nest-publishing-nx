import { EntityManager } from 'typeorm';
import { Office } from '../../libs/contracts/src/office/office.entity';

export const createOffices = async ( manager: EntityManager ): Promise<Office[]> => {
  console.log( "Creating offices..." );

  const offices = [
    manager.create( Office, { address: '123 Main St' } ),
    manager.create( Office, { address: '456 Elm St' } ),
    manager.create( Office, { address: '789 Oak St' } ),
  ];

  await manager.save( offices );

  console.log( `Created ${ offices.length } offices.` );
  return offices;
};
import { Office } from 'src/modules/office/entities/office.entity';
import { EntityManager } from 'typeorm';

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
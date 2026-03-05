import { Role } from 'src/modules/role/entities/role.entity';
import { EntityManager } from 'typeorm';

export const createRoles = async ( manager: EntityManager ): Promise<Role[]> => {
  console.log( "Creating roles..." );

  const roles = [
    manager.create( Role, { name: 'client' } ),
    manager.create( Role, { name: 'admin' } ),
    manager.create( Role, { name: 'employee' } ),
  ];

  await manager.save( roles );

  console.log( `Created ${ roles.length } roles.` );
  return roles;
};
import { EntityManager } from 'typeorm';
import { Office } from '../../libs/contracts/src/office/office.entity';
import { Role } from '../../libs/contracts/src/role/role.entity';
import { User } from '../../libs/contracts/src/user/user.entity';

export const createUsers = async ( manager: EntityManager, roles: Role[], offices: Office[] ): Promise<User[]> => {
  console.log( "Creating users..." );
  const office: Office = offices[ 0 ];

  const users = [
    manager.create( User, { name: 'client', password: 'client123', email: 'client@example.com', role: roles[ 0 ], office } ),
    manager.create( User, { name: 'admin', password: 'admin123', email: 'admin@example.com', role: roles[ 1 ], office } ),
    manager.create( User, { name: 'employee', password: 'employee123', email: 'employee@example.com', role: roles[ 2 ], office } ),
    manager.create( User, { name: 'test1', password: 'testpass1', email: 'test1@example.com', role: roles[ 0 ], office } ),
    manager.create( User, { name: 'test2', password: 'testpass2', email: 'test2@example.com', role: roles[ 0 ], office } ),
    manager.create( User, { name: 'test3', password: 'testpass3', email: 'test3@example.com', role: roles[ 2 ], office } ),
    manager.create( User, { name: 'test4', password: 'testpass4', email: 'test4@example.com', role: roles[ 1 ], office } ),
    manager.create( User, { name: 'test5', password: 'testpass5', email: 'test5@example.com', role: roles[ 2 ], office } ),
    manager.create( User, { name: 'test6', password: 'testpass6', email: 'test6@example.com', role: roles[ 0 ], office } ),
    manager.create( User, { name: 'test7', password: 'testpass7', email: 'test7@example.com', role: roles[ 1 ], office } ),
  ];

  await manager.save( users );

  console.log( `Created ${ users.length } users.` );
  return users;
};
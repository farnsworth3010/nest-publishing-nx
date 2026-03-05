import { Material } from 'src/modules/material/entities/material.entity';
import { EntityManager } from 'typeorm';

export const createMaterials = async ( manager: EntityManager ): Promise<Material[]> => {
  console.log( "Creating materials..." );
  const materialNames: { name: string; amount: number; }[] = [
    { name: 'Paper', amount: 1000 },
    { name: 'Ink', amount: 500 },
    { name: 'Leather', amount: 200 },
    { name: 'Cloth', amount: 300 },
    { name: 'Plastic', amount: 150 },
    { name: 'Cardboard', amount: 400 },
    { name: 'Glue', amount: 250 },
  ];

  const materials: Material[] = [];

  for ( const m of materialNames ) {
    materials.push( manager.create( Material, m ) );
  }

  await manager.save( materials );

  console.log( `Created ${ materials.length } materials.` );

  return materials;
};

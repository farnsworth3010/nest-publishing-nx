import { Category } from 'src/modules/category/entities/category.entity';
import { EntityManager } from 'typeorm';

export const createCategories = async ( manager: EntityManager ): Promise<Category[]> => {
  console.log( "Creating categories..." );

  const categoryNames: string[] = [
    'Fiction',
    'Non-fiction',
    'Science',
    'History',
    'Children',
    'Fantasy',
    'Biography',
    'Business',
    'Technology',
    'Art',
    'Travel',
    'Health',
    'Education',
    'Mystery',
    'Romance',
    'Horror',
    'Comics',
    'Poetry',
    'Cooking',
    'Adventure',
    'Classic',
    'Drama',
    'Self-help',
    'Spirituality',
    'Sports',
    'Politics',
    'Nature',
    'Music',
    'Graphic Novel',
    'Short Stories',
    'Memoir',
    'True Crime',
    'Young Adult',
    'Western',
    'Satire',
    'Anthology',
    'Dystopian',
    'Paranormal',
    'War',
    'Science Fiction'
  ];

  const categories: Category[] = categoryNames.map( name => manager.create( Category, { name } ) );

  await manager.save( categories );

  console.log( `Created ${ categories.length } categories.` );

  return categories;
};

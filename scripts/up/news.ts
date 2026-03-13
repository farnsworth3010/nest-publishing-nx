import { EntityManager } from 'typeorm';
import { Author } from '../../libs/contracts/src/author/author.entity';
import { News } from '../../libs/contracts/src/news/news.entity';
import { getRandomInt } from '../utils';

export const createNews = async ( manager: EntityManager, authors: Author[] ): Promise<News[]> => {
  console.log( 'Creating news...' );

  const headlineTemplates: string[] = [
    'New edition of "{book}" announced by {author}',
    '{author} signs exclusive interview on upcoming work',
    '{author} awarded prestigious literary prize',
    'Behind the scenes: {author} on the inspiration for their latest book',
    '{author} participates in charity reading event',
    '{author} explores new genre in next novel',
    'Exclusive excerpt: {author} reveals chapter from upcoming release',
    '{author} collaborates with illustrator for special edition',
    '{author} speaks at international literature festival',
    'Review roundup: critics react to {author}’s latest work',
  ];

  const newsItems: News[] = [];

  for ( let i = 0; i < authors.length; i++ ) {
    const author = authors[ i ];
    const count = getRandomInt( 1, 3 );

    for ( let j = 0; j < count; j++ ) {
      const tpl = headlineTemplates[ getRandomInt( 0, headlineTemplates.length - 1 ) ];
      const authorName = `${ author.firstName } ${ author.lastName }`.trim();
      const title = tpl.replace( '{author}', authorName ).replace( '{book}', 'their recent book' );

      const content = `In recent news, ${ authorName } announced new activities. This article explores recent developments and includes quotes from the author.`;

      const publishedAt = new Date( 2025, getRandomInt( 0, 11 ), getRandomInt( 1, 28 ) );

      newsItems.push( manager.create( News, {
        title,
        content,
        publishedAt,
        writer: author,
      } ) );
    }
  }

  await manager.save( newsItems );

  console.log( `Created ${ newsItems.length } news entries.` );

  return newsItems;
};

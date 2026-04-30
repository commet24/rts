import { getCollection } from 'astro:content';

export const newsSlug = (id: string) => id.replace(/\.(md|mdx)$/, '');

export const getPublishedNews = async () => {
  const entries = await getCollection('news', ({ data }) => data.published);

  return entries.sort(
    (left, right) => right.data.date.getTime() - left.data.date.getTime(),
  );
};

export const formatNewsDate = (date: Date) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

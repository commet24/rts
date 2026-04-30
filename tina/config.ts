import { defineConfig } from 'tinacms';

const branch =
  process.env.TINA_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'news',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'news',
        label: 'Новости',
        path: 'src/content/news',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Заголовок',
            isTitle: true,
            required: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Дата',
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Краткое описание',
            required: true,
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'image',
            name: 'image',
            label: 'Обложка',
          },
          {
            type: 'boolean',
            name: 'published',
            label: 'Опубликовано',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Текст новости',
            isBody: true,
          },
        ],
      },
    ],
  },
});

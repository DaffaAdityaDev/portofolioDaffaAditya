module.exports = function (plop) {
  // Add currentDate helper
  plop.setHelper('currentDate', () => {
    return new Date().toISOString().split('T')[0];
  });

  plop.setGenerator('blog-post', {
    description: 'Create a new blog post',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Blog post title:',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Blog post description:',
      },
      {
        type: 'input',
        name: 'timeToRead',
        message: 'Estimated time to read (in minutes):',
        default: '5',
      },
      {
        type: 'input',
        name: 'image',
        message: 'Image path (relative to public directory):',
        default: '/image/blogs/default-thumbnail.webp',
      },
      {
        type: 'confirm',
        name: 'production',
        message: 'Is this post ready for production?',
        default: false,
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'features/Blog/posts/{{pascalCase title}}.tsx',
        templateFile: 'templates/blog-post.tsx.hbs',
      },
      {
        type: 'modify',
        path: 'features/Blog/constants.ts',
        pattern: /(export const POSTS_DATA: PostData\[] = \[)/g,
        template: `$1\n  {\n    id: "{{pascalCase title}}",\n    title: "{{title}}",\n    date: "{{currentDate}}",\n    timeToRead: {{timeToRead}},\n    description: "{{description}}",\n    image: "{{image}}",\n    production: {{production}}\n  },`
      },
      {
        type: 'modify',
        path: 'pages/blog/post/[id].tsx',
        pattern: /(const MAPPED_POSTS: Record<string, React.ComponentType> = \{)/g,
        template: `$1\n  '{{pascalCase title}}': dynamic(() => import('@/features/Blog/posts/{{pascalCase title}}')),`
      }
    ],
  });
}; 
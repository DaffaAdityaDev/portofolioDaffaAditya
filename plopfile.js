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
        path: 'posts/{{kebabCase title}}.md',
        templateFile: 'templates/blog-post.md.hbs',
      },
    ],
  });
}; 
import type { PostData } from 'types/blog';

export const POSTS_DATA: PostData[] = [
  {
    id: "LearnHowToLearn",
    title: "Learn How To Learn",
    date: "2025-05-12",
    timeToRead: 5,
    description: "The Art of Learning: Mastering the meta-skill that allows you to conquer any subject, from high-level math to complex software architecture.",
    image: "/image/blogs/LearnHowToLearn/hero.webp",
    production: false
  },
  {
    id: "solid-5-pirinciples-that-can-improve-you-codebase",
    title: "SOLID 5 Pirinciples that can improve you codebase",
    date: "2025-02-18",
    timeToRead: 10,
    description: "SOLID intended to make mostly for OOP to make codebase more understandable, flexible, and maintainable.",
    image: "/image/fallback.webp",
    production: false
  },
  {
    id: "SSGInDetail",
    title: "Static Site Generation: A Revolution in Web Performance",
    date: "2024-02-28",
    timeToRead: 20,
    description: "Get a deep dive static site generation, Learn how it's making website faster and more scalable. and how it's setting a new standard for web development.",
    image: "/image/blogs/SSGInDetail/SSGThumnail.webp",
    production: true
  },
  {
    id: "videoSharing",
    title: "How i design a video Sharing service",
    date: "2024-02-26",
    timeToRead: 10,
    description: "Explore the architecture and features of a scalable video sharing service, including user authentication, video uploading, streaming, and more. Learn about design considerations, system architecture, and the importance of scalability and performance.",
    image: "/image/blogs/videoSharing/systemDesign.webp",
    production: true
  },
  {
    id: "nextjs14Improvement",
    title: "Nextjs 14 First Look: New Features and Improvements",
    date: "2024-02-28",
    timeToRead: 20,
    description: "Since the release of Next.js 14, there have been a lot of improvements and new features. Like Turbopack, Server Action and more. In this blog, we will discuss all the new features and improvements in Next.js 14.",
    image: "/image/blogs/nextjs14Improvement/thumbnail.webp",
    production: true
  }
];

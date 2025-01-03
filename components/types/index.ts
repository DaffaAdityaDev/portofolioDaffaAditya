export interface IBlogProps {
  id: string;
  image: string;
  title: string;
  description: string;
  date: string;
  timeToRead: number;
  
}
export interface IParams {
  id: string;
}

export interface IBreadcrumbItem {
  title: string;
  href: string;
}
export interface TutorialData {
  title: string;
  description: string;
  slug: string;
  sourceCode: string;
  tutorial: string;
  css: string;
  language: string;
}

export {};

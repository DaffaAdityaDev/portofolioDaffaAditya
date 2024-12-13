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

export interface PostData {
  id: string;
  date: string;
  production?: boolean;
  [key: string]: any;
} 

export interface CustomImageProps {
  src: string;
  alt: string;
}

export interface CodeBlockProps {
  children: string;
  className?: string;
}

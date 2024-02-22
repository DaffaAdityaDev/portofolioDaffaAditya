interface IBlogProps {
    id: string;
    image: string;
    title: string;
    description: string;
    date: string;
    timeToRead: number;
}
interface IParams {
    id: string;
}

interface IBreadcrumbItem {
    title: string;
    href: string;
  }
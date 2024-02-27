import Link from "next/link";

const BreadcrumbItem = ({ title, href }: any) => {
  return (
    <li>
      {href ? (
        <Link href={href}>
          <p>{title}</p>
        </Link>
      ) : (
        title
      )}
    </li>
  );
};

export default BreadcrumbItem;

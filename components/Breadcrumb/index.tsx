// components/Breadcrumb/index.tsx
import React from 'react';
import BreadcrumbItem from './BreadcrumbItem';
import { IBreadcrumbItem } from '../types';


const Breadcrumb= ({ items } : { items: IBreadcrumbItem[]}) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem title={item.title} href={item.href} />
            {index < items.length -  1 && <span className="mx-2">/</span>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
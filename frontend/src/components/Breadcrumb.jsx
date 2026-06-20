import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => (
  <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
    <div className="container mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span>/</span>
          {item.to ? (
            <Link to={item.to} className="hover:text-[#004e92] transition-colors">{item.label}</Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default Breadcrumb;
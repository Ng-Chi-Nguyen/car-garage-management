import React from 'react';
import { Link } from 'react-router-dom';

export default function CustomerList() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CustomerList Placeholder</h1>
      <div className="space-x-4">
        <Link to="/customers/detail" className="text-blue-600 hover:underline">
          View Customer Detail (Static)
        </Link>
        <Link to="/customers/analytics" className="text-blue-600 hover:underline">
          View Customer Analytics
        </Link>
      </div>
    </div>
  );
}

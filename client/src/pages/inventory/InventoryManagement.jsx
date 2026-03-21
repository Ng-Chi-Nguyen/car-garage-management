import React from 'react';
import { Link } from 'react-router-dom';

export default function InventoryManagement() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">InventoryManagement Placeholder</h1>
      <div className="space-x-4">
        <Link to="/inventory/stock-card" className="text-blue-600 hover:underline">
          View Stock Card (Static)
        </Link>
      </div>
    </div>
  );
}

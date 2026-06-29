import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { categories, products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 py-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            Catálogo Exclusivo
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Descubrí la nueva temporada de KBindumentaria. Estilo, calidad y tendencia en un solo lugar.
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          {/* Buscador */}
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Buscar prendas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-sm cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Filtros de Categorías */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/35'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              Ver Todo
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/35'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categories.find((c) => c.id === product.categoryId)?.name || 'Prenda'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-lg font-medium">
              No encontramos prendas que coincidan con tu búsqueda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-4 cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;

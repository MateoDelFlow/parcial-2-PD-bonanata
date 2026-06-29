import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, categoryName }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 transition-all duration-300 flex flex-col">
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-square overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock <= 5 && (
          <span className="absolute top-3 right-3 bg-rose-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            ¡Poco Stock! ({product.stock})
          </span>
        )}
      </div>

      {/* Contenedor de Información */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
            {categoryName}
          </span>
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-violet-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between mt-4">
          <span className="text-2xl font-black text-slate-100">
            {formatPrice(product.price)}
          </span>
          <Link
            to={`/product/${product.id}`}
            className="bg-slate-800 hover:bg-violet-600 hover:text-white text-slate-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 border border-slate-700 hover:border-violet-500"
          >
            Ver Detalle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

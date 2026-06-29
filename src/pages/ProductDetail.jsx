import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProducts } from '../context/ProductsContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, categories } = useProducts();

  const product = products.find((p) => p.id === id);
  const category = categories.find((c) => c.id === product?.categoryId);
  const [addedCount, setAddedCount] = useState(0);

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Producto No Encontrado
          </h2>
          <p className="text-slate-400 text-sm">
            La prenda con el identificador solicitado no forma parte de nuestro catálogo activo.
          </p>
          <Link
            to="/"
            className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-violet-600/25"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    setAddedCount(prev => prev + 1);
    toast.success(`¡Agregaste ${product.name} al carrito!`, {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark"
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Volver al Catálogo */}
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-violet-400 transition-colors">
          &larr; Volver al catálogo
        </Link>

        {/* Detalle del Producto */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-8">
          
          {/* Columna 1: Imagen */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stock <= 5 && (
              <span className="absolute top-4 right-4 bg-rose-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ¡Poco Stock!
              </span>
            )}
          </div>

          {/* Columna 2: Detalles */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Etiqueta de Categoría */}
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-400/10 px-3 py-1 rounded-md">
                {category?.name || 'Prenda'}
              </span>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100">
                {product.name}
              </h1>

              {/* Precio */}
              <div className="text-3xl font-black text-slate-100">
                {formatPrice(product.price)}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Detalles de la prenda
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {product.description}
                </p>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-slate-400">Disponibilidad:</span>
                <span className={`text-sm font-bold ${product.stock > 5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {product.stock} unidades en stock
                </span>
              </div>
            </div>

            {/* Acción de Agregar al Carrito */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2"
              >
                Agregar al Carrito
                {addedCount > 0 && (
                  <span className="bg-white text-violet-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {addedCount}
                  </span>
                )}
              </button>
              
              <p className="text-xs text-slate-500 text-center">
                * Esto es una simulación del proceso de compra de KBindumentaria.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

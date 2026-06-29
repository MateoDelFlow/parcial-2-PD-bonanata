import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';

const AdminPanel = () => {
  const { isLoggedIn, user } = useAuth();
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();

  // Estados locales para el Formulario controlado
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'remeras');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [formError, setFormError] = useState('');

  // Estado local para el Modal de Confirmación de borrado
  const [productToDelete, setProductToDelete] = useState(null);

  // Protección de ruta a nivel UI
  if (!isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto text-3xl font-extrabold">
            ✕
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Acceso Denegado</h2>
          <p className="text-slate-400 text-sm">
            Lo sentimos, esta sección es de uso exclusivo para administradores de la plataforma.
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

  // Limpiar campos del formulario
  const handleResetForm = () => {
    setEditId(null);
    setName('');
    setCategoryId(categories[0]?.id || 'remeras');
    setPrice('');
    setStock('');
    setDescription('');
    setImage('');
    setFormError('');
  };

  // Enviar formulario (Crear / Editar)
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Validaciones de negocio
    if (!name.trim()) {
      setFormError('El nombre de la prenda es obligatorio.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('El precio debe ser un número mayor a 0.');
      return;
    }
    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setFormError('El stock debe ser un número igual o mayor a 0.');
      return;
    }

    const defaultImage = image.trim() || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80';

    if (editId) {
      // Editar
      updateProduct(editId, {
        name: name.trim(),
        categoryId,
        price: parsedPrice,
        stock: parsedStock,
        description: description.trim(),
        image: defaultImage
      });
      toast.success('¡Prenda modificada con éxito!');
    } else {
      // Crear
      const newProduct = {
        id: Date.now().toString(),
        name: name.trim(),
        categoryId,
        price: parsedPrice,
        stock: parsedStock,
        description: description.trim(),
        image: defaultImage
      };
      addProduct(newProduct);
      toast.success('¡Nueva prenda creada con éxito!');
    }

    handleResetForm();
  };

  // Cargar datos en el formulario para editar
  const handleEditClick = (product) => {
    setEditId(product.id);
    setName(product.name);
    setCategoryId(product.categoryId);
    setPrice(product.price);
    setStock(product.stock);
    setDescription(product.description || '');
    setImage(product.image || '');
    setFormError('');
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      toast.success(`¡"${productToDelete.name}" eliminada con éxito!`);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Panel de Control Administrativo
            </h1>
            <p className="text-slate-400 text-sm">
              Gestión total del catálogo y existencias de KBindumentaria.
            </p>
          </div>
          <Link
            to="/"
            className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            Ir al catálogo público
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Formulario de Carga */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                {editId ? 'Editar Prenda' : 'Agregar Nueva Prenda'}
              </h2>
              <p className="text-xs text-slate-400">
                {editId ? 'Modifica los valores del producto seleccionado.' : 'Carga un nuevo artículo al catálogo.'}
              </p>
            </div>

            {formError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg text-center font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nombre de la Prenda *</label>
                <input
                  type="text"
                  placeholder="Ej: Remera Classic"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Precio (ARS) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="12000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock disponible *</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categoría</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">URL de Imagen</label>
                <input
                  type="text"
                  placeholder="https://ejemplo.com/prenda.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Descripción</label>
                <textarea
                  rows="3"
                  placeholder="Breve descripción..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-grow bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-sm shadow-lg shadow-violet-600/20"
                >
                  {editId ? 'Guardar Cambios' : 'Agregar Prenda'}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="bg-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-4 rounded-xl border border-slate-700 transition-colors cursor-pointer text-sm"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Columna Derecha: Listado en Tabla */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-slate-100">
              Listado de Inventario
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold text-xs uppercase">
                    <th className="py-3 px-4">Prenda</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4 text-center">Stock</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((product) => {
                    const cat = categories.find((c) => c.id === product.categoryId);
                    return (
                      <tr key={product.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-4 px-4 font-semibold text-slate-200">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg bg-slate-950 border border-slate-800"
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          <span className="bg-slate-950 px-2.5 py-1 rounded-md text-xs border border-slate-800 text-violet-400 font-bold">
                            {cat?.name || 'Prenda'}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-slate-200">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            product.stock > 5 ? 'text-emerald-400 bg-emerald-400/5' : 'text-rose-400 bg-rose-400/5'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="bg-slate-950 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="bg-slate-950 hover:bg-rose-600/20 text-rose-400 hover:text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* ConfirmModal Portal */}
      <ConfirmModal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name || ''}
      />
    </div>
  );
};

export default AdminPanel;

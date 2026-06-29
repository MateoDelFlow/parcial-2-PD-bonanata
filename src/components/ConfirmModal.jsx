import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <h3 className="text-xl font-bold text-slate-100">¿Confirmar eliminación?</h3>
        <p className="text-slate-400 text-sm">
          ¿Estás seguro de que deseas eliminar la prenda <span className="font-semibold text-slate-200">"{productName}"</span>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-lg shadow-rose-600/20"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal')
  );
};

export default ConfirmModal;

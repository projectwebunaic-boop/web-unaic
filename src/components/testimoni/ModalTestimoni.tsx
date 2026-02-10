'use client';

import { useState } from 'react';

interface Testimoni {
  nama: string;
  status: string;
  pesan: string;
}

interface ModalTestimoniProps {
  onClose: () => void;
  onSubmit: (testimoni: Testimoni) => void;
}

export default function ModalTestimoni({ onClose, onSubmit }: ModalTestimoniProps) {
  const [formData, setFormData] = useState({ nama: '', status: '', pesan: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.pesan.trim()) {
      alert('Nama dan pesan tidak boleh kosong!');
      return;
    }
    onSubmit(formData);
    setFormData({ nama: '', status: '', pesan: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-[#002B5B]">Tinggalkan Testimoni</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="Masukkan nama Anda"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              placeholder="Contoh: Mahasiswa, Alumni, Dosen"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pesan/Testimoni</label>
            <textarea
              name="pesan"
              value={formData.pesan}
              onChange={handleInputChange}
              placeholder="Tulis testimoni Anda di sini"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-gray-900"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FFD700] text-[#002B5B] rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
            >
              Kirim Testimoni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

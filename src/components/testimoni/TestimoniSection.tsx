'use client';

import { useState, useEffect } from 'react';
import ModalTestimoni from './ModalTestimoni';

interface Testimoni {
  nama: string;
  status: string;
  pesan: string;
}

export default function TestimoniSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimoniList, setTestimoniList] = useState<Testimoni[]>([]);

  useEffect(() => {
    const storedTestimoni = localStorage.getItem('testimoni');
    if (storedTestimoni) {
      setTestimoniList(JSON.parse(storedTestimoni));
    }
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddTestimoni = (newTestimoni: Testimoni) => {
    const updatedList = [...testimoniList, newTestimoni];
    setTestimoniList(updatedList);
    localStorage.setItem('testimoni', JSON.stringify(updatedList));
    handleCloseModal();
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002B5B] mb-4">
            Testimoni Pengunjung
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bagikan pengalaman Anda di Universitas Al-Irsyad Cilacap (UNAIC)
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleOpenModal}
            className="bg-[#FFD700] text-[#002B5B] px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors shadow-lg"
          >
            Tinggalkan Testimoni
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimoniList.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Belum ada testimoni yang masuk.</p>
            </div>
          ) : (
            testimoniList.map((testimoni, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#002B5B] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimoni.nama.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#002B5B]">{testimoni.nama}</h3>
                    <p className="text-sm text-gray-500">{testimoni.status}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">"{testimoni.pesan}"</p>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <ModalTestimoni onClose={handleCloseModal} onSubmit={handleAddTestimoni} />
      )}
    </section>
  );
}

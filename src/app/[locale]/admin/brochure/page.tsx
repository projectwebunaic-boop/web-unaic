"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AdminBrochure() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage("");
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        setStatus('idle');
        setMessage("");

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/brochure', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus('success');
                setMessage("Brosur berhasil diunggah!");
                setFile(null);
                // Reset file input
                const fileInput = document.getElementById('brochure-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                setStatus('error');
                setMessage(data.message || "Gagal mengunggah brosur.");
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage("Terjadi kesalahan sistem.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Upload Brosur PMB</h1>
                    <p className="text-gray-500">Unggah file brosur terbaru (PDF) untuk diunduh oleh calon mahasiswa.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                        <input
                            type="file"
                            id="brochure-input"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label htmlFor="brochure-input" className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <Upload size={32} />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-700">
                                    {file ? file.name : "Klik untuk memilih file PDF"}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Maksimal ukuran file disesuaikan dengan konfigurasi server.
                                </p>
                            </div>
                        </label>
                    </div>

                    {status === 'success' && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3">
                            <CheckCircle2 size={20} />
                            <span>{message}</span>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span>{message}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <a
                            href="/files/brosur-unaic.pdf"
                            target="_blank"
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <FileText size={18} />
                            Lihat Brosur Saat Ini
                        </a>
                        <button
                            type="submit"
                            disabled={!file || isUploading}
                            className="px-6 py-2.5 rounded-lg bg-unaicNavy text-white font-medium hover:bg-unaicNavy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Mengunggah...
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Upload File
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

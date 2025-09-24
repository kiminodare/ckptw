'use client';

import { useState } from 'react';

export default function App() {
    const [formData, setFormData] = useState({
        username: '',
        discordId: '',
        isVip: '',
        jumlahSummit: '',
        proofVip: null as File | null,
        proofSummit: null as File | null,
    });

    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const body = new FormData();
        body.append('username', formData.username);
        body.append('discordId', formData.discordId);
        body.append('isVip', formData.isVip);
        body.append('jumlahSummit', formData.jumlahSummit);
        if (formData.proofVip) body.append('proofVip', formData.proofVip);
        if (formData.proofSummit) body.append('proofSummit', formData.proofSummit);

        const res = await fetch('/api/vip/submit', {
            method: 'POST',
            body,
        });

        const data = await res.json();
        setMessage(data.success ? 'Formulir berhasil dikirim!' : `Gagal: ${data.error}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-center text-black mb-6">
                    Formulir Pendaftaran VIP
                </h1>

                {message && (
                    <div
                        className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4"
                        role="alert"
                    >
                        <p>{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username Roblox
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Masukkan username Roblox Anda"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="discordId" className="block text-sm font-medium text-gray-700">
                            Discord ID
                        </label>
                        <input
                            type="text"
                            name="discordId"
                            id="discordId"
                            value={formData.discordId}
                            onChange={handleChange}
                            className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Masukkan Discord ID Anda"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="isVip" className="block text-sm font-medium text-gray-700">
                            Apakah kamu menjadi VIP melalui gamepass?
                        </label>
                        <select
                            name="isVip"
                            id="isVip"
                            value={formData.isVip}
                            onChange={handleChange}
                            className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        >
                            <option value="" disabled>
                                Pilih salah satu
                            </option>
                            <option value="Ya">Ya</option>
                            <option value="Tidak">Tidak</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="jumlahSummit" className="block text-sm font-medium text-gray-700">
                            Jumlah Summit yang Diselesaikan
                            <span className="ml-2 relative group cursor-pointer">
                                ℹ️
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Masukkan total jumlah summit yang berhasil kamu selesaikan dan harus sesuai dengan gambar yang kamu berikan
                                </span>
                            </span>
                        </label>
                        <input
                            type="number"
                            name="jumlahSummit"
                            id="jumlahSummit"
                            value={formData.jumlahSummit}
                            onChange={handleChange}
                            className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Masukkan jumlah summit"
                            min={0}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="proofVip" className="block text-sm font-medium text-gray-700">
                            Upload Bukti Kamu Saat VIP di Map Lama
                        </label>
                        <input
                            type="file"
                            name="proofVip"
                            id="proofVip"
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="proofSummit" className="block text-sm font-medium text-gray-700">
                            Upload Bukti Kamu Saat Menyelesaikan Summit Gunung
                        </label>
                        <input
                            type="file"
                            name="proofSummit"
                            id="proofSummit"
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Kirim
                    </button>
                </form>
            </div>
        </div>
    );
}

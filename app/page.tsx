'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormDataType = {
    username: string
    discordId: string
    isVip: string
    jumlahSummit: string
    proofVip: File | null
    proofSummit: File | null
}

export default function App() {
    const router = useRouter()

    const [formData, setFormData] = useState<FormDataType>({
        username: '',
        discordId: '',
        isVip: '',
        jumlahSummit: '',
        proofVip: null,
        proofSummit: null
    })

    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [fieldErrors, setFieldErrors] = useState<string[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setFieldErrors([])

        const body = new FormData()
        body.append('username', formData.username)
        body.append('discordId', formData.discordId)
        body.append('isVip', formData.isVip)
        body.append('jumlahSummit', formData.jumlahSummit)

        if (formData.isVip === 'Ya' && formData.proofVip) {
            body.append('proofVip', formData.proofVip)
        }
        if (formData.proofSummit) {
            body.append('proofSummit', formData.proofSummit)
        }

        try {
            const res = await fetch('/api/vip/submit', {
                method: 'POST',
                body
            })

            const data = await res.json()

            if (res.status === 500) {
                setMessage(`${data.error} (${data.details})`)
                return
            }

            if (data.success) {
                setMessage('Formulir berhasil dikirim!')
                setFieldErrors([])
            } else {
                setMessage(data.error || 'Terjadi kesalahan')
                if (data.issues) {
                    setFieldErrors(data.issues.map((issue: { message: string }) => issue.message))
                }
            }
        } catch {
            setMessage('Terjadi kesalahan jaringan, coba lagi nanti.')
        } finally {
            setLoading(false)
        }
    }

    if (process.env.NEXT_PUBLIC_FORM_CLOSED === 'true') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col items-center justify-center text-center px-6">
                <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Formulir Ditutup ❌
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Pendaftaran sudah ditutup. Stay tuned untuk info berikutnya!
                    </p>
                    <button
                        onClick={() => router.push('/public/dashboard')}
                        className="w-full px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 active:scale-95 transition-all"
                    >
                        Lihat Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl">
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6 tracking-tight">
                    Daftar VIP Summit
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    Isi form ini untuk pendaftaran VIP. Pastikan semua data benar ya!
                </p>

                {message && (
                    <div
                        className={`${
                            message.startsWith('Gagal') || message.startsWith('Data tidak valid')
                                ? 'bg-red-100 border-red-400 text-red-700'
                                : 'bg-green-100 border-green-400 text-green-700'
                        } border-l-4 p-4 rounded-lg mb-4 transition-all duration-300`}
                        role="alert"
                    >
                        <p className="font-medium">{message}</p>
                        {fieldErrors.length > 0 && (
                            <ul className="mt-2 list-disc list-inside text-sm">
                                {fieldErrors.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                            Username Roblox
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-2 text-gray-900 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Masukkan username Roblox kamu"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="discordId" className="block text-sm font-semibold text-gray-700">
                            Discord ID
                        </label>
                        <input
                            type="text"
                            name="discordId"
                            id="discordId"
                            value={formData.discordId}
                            onChange={handleChange}
                            className="mt-2 block text-gray-900 w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Masukkan Discord ID kamu"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="isVip" className="block text-sm font-semibold text-gray-700">
                            Apakah kamu VIP melalui gamepass?
                        </label>
                        <select
                            name="isVip"
                            id="isVip"
                            value={formData.isVip}
                            onChange={handleChange}
                            className="mt-2 block text-gray-900 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                            disabled={loading}
                        >
                            <option value="" disabled>
                                Pilih salah satu
                            </option>
                            <option value="Ya">Ya</option>
                            <option value="Tidak">Tidak</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="jumlahSummit" className="block text-sm font-semibold text-gray-700">
                            Jumlah Summit yang Diselesaikan
                        </label>
                        <input
                            type="number"
                            name="jumlahSummit"
                            id="jumlahSummit"
                            value={formData.jumlahSummit}
                            onChange={handleChange}
                            className="mt-2 block text-gray-900 w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Masukkan jumlah summit"
                            min={0}
                            required
                            disabled={loading}
                        />
                    </div>

                    {formData.isVip === 'Ya' && (
                        <div>
                            <label htmlFor="proofVip" className="block text-sm font-semibold text-gray-700">
                                Upload Bukti VIP di Map Lama
                            </label>
                            <input
                                type="file"
                                name="proofVip"
                                id="proofVip"
                                onChange={handleChange}
                                className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition-colors duration-200"
                                required
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="proofSummit" className="block text-sm font-semibold text-gray-700">
                            Upload Bukti Penyelesaian Summit
                        </label>
                        <input
                            type="file"
                            name="proofSummit"
                            id="proofSummit"
                            onChange={handleChange}
                            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition-colors duration-200"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-semibold text-white transition-all duration-300 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Mengirim...' : 'Kirim'}
                    </button>
                </form>
            </div>
        </div>
    )
}

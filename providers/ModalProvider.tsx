'use client'

import { useModalStore } from '@/stores/modalStore'

export function ModalProvider() {
    const { modal, closeModal } = useModalStore()

    if (!modal) return null

    const Component = modal.component as React.ComponentType<any>

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
                <Component {...modal.props} onCancel={closeModal} />
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}

import { create } from 'zustand'

type ModalType<T> = {
    component: React.ComponentType<T>
    props: T
}

type ModalStore = {
    modal: ModalType<any> | null
    openModal: <T>(component: React.ComponentType<T>, props: T) => void
    closeModal: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
    modal: null,
    openModal: (component, props) => set({ modal: { component, props } }),
    closeModal: () => set({ modal: null }),
}))

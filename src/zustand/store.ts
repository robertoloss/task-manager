import { create } from 'zustand'

type MainStore = {
	colsTrigger: boolean,
	setColsTrigger: () => void
}

export const useMainStore = create<MainStore>()((set) => ({
	colsTrigger: false,
	setColsTrigger: () => set((state) => ({ colsTrigger: !state.colsTrigger }))
}))

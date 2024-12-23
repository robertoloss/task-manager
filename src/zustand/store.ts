import { create } from 'zustand'
import { Column } from '../models/db'

type MainStore = {
	dropColumn: Column | null,
	setDropColumn: (c: Column) => void
}

export const useMainStore = create<MainStore>()((set) => ({
	dropColumn: null,
	setDropColumn: c => set({ dropColumn: c })
}))

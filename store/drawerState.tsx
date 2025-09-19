import { create } from 'zustand';

interface DrawerStoreType {
  detailDrawer: boolean;
  detailLoading: boolean;
  setDetailDrawer: (bool: boolean) => void;
}

export const useDrawerStore = create<DrawerStoreType>((set) => ({
  detailDrawer: false,
  detailLoading: false,
  setDetailDrawer: (bool) => set({ detailDrawer: bool }),
}));

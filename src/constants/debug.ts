import { create } from 'zustand';

export const useCurrentLocationStore = create((set) => ({
    pointX: 0,
    pointY: 0,
    lat: 0,
    long: 0,
    wfo: "",

    setX: (x) => set({ pointX: x }),
    setY: (y) => set({ pointY: y }),
    setLat: (lat) => set({ lat: lat }),
    setLong: (long) => set({ long: long }),
    setWFO: (wfo) => set({ wfo: wfo }),
    
}))


export function p(text: any) { 
    console.log(text)
}
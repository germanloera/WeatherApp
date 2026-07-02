import { create } from 'zustand';

interface CurrentLocation {

    pointX: number,
    pointY: number,
    lat: number,
    long: number,
    wfo: string,

    setX: (x: number) => void,
    setY: (y: number) => void,
    setLat: (lat: number) => void,
    setLong: (long: number) => void,
    setWFO: (wf: string) => void,

}






export const useCurrentLocationStore = create<CurrentLocation>((set) => ({
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



export function log(text: any) {

    console.log()
    console.log(text);
    console.log()

}
export function err(err: any) {

    console.log()
    console.error(err);
    console.log()

}

export function p(text: any) {
    log(text)
}
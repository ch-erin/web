import { defineStore } from 'pinia'

export const useCanvasBackgroundStore = defineStore('canvasBackground', {
    state: () => ({
        background: '#ffffff',
        height: 900,
        width: 1200,
        opacity: 1,
    }),
    actions: {
        setBackground(color: string) {
            this.background = color
        },
        setHeight(height: number) {
            this.height = height
        },
        setWidth(width: number) {
            this.width = width
        },
        setOpacity(opacity: number) {
            this.opacity = opacity
        }
    },
})
import { defineStore } from 'pinia'

export const useCanvasBackgroundStore = defineStore('canvasBackground', {
    state: () => ({
        background: '#ffffff',
        height: 900,
        width: 1200,
        opacity: 1,
        minHeight: 600,
        minWidth: 800,
        padding: 50, // 画布边距
    }),
    getters: {
        canvasStyle: (state) => ({
            backgroundColor: state.background,
            height: `${state.height}px`,
            width: `${state.width}px`,
            opacity: state.opacity,
            minHeight: `${state.minHeight}px`,
            minWidth: `${state.minWidth}px`,
        })
    },
    actions: {
        setBackground(color: string) {
            this.background = color
        },
        setHeight(height: number) {
            this.height = Math.max(height, this.minHeight)
        },
        setWidth(width: number) {
            this.width = Math.max(width, this.minWidth)
        },
        setOpacity(opacity: number) {
            this.opacity = opacity
        },
        setMinSize(width: number, height: number) {
            this.minWidth = width
            this.minHeight = height
        },
        // 根据组件边界自动调整画布尺寸
        adjustCanvasSize(componentBounds: { maxX: number; maxY: number; minX: number; minY: number }) {
            const { maxX, maxY, minX, minY } = componentBounds

            // 计算需要的画布尺寸（加上边距）
            const requiredWidth = Math.max(maxX + this.padding, this.minWidth)
            const requiredHeight = Math.max(maxY + this.padding, this.minHeight)

            // 确保画布左上角有足够空间（如果有负坐标组件）
            const adjustedWidth = Math.max(requiredWidth, Math.abs(minX) + maxX + this.padding * 2)
            const adjustedHeight = Math.max(requiredHeight, Math.abs(minY) + maxY + this.padding * 2)

            // 只在需要时扩大画布
            if (adjustedWidth > this.width || adjustedHeight > this.height) {
                this.width = Math.max(adjustedWidth, this.width)
                this.height = Math.max(adjustedHeight, this.height)
                return true // 返回是否调整了尺寸
            }

            return false
        },
        // 重置画布到最小尺寸
        resetToMinSize() {
            this.width = this.minWidth
            this.height = this.minHeight
        }
    },
})
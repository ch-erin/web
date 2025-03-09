// utils/geometry.ts

/**
 * 规范化角度到 0-360 范围
 * @param deg - 原始角度值
 * @returns 0-360 之间的规范化角度
 */
export const mod360 = (deg: number): number => {
    const normalized = deg % 360
    return normalized < 0 ? normalized + 360 : normalized
}

interface PositionStyle {
    left: string | number
    top: string | number
    [key: string]: unknown
}

interface ComponentPosition {
    left: number
    top: number
}

/**
 * 计算组件新位置（带单位解析和边界保护）
 * @param style - 组件当前样式
 * @param deltaX - X 轴变化量
 * @param deltaY - Y 轴变化量
 * @returns 计算后的新位置
 */
export const calculateComponentPosition = (
    style: PositionStyle,
    deltaX: number,
    deltaY: number
): ComponentPosition => {
    // 解析数值的辅助函数
    const parseNumericValue = (value: string | number): number => {
        if (typeof value === 'number') return value
        const numeric = parseFloat(value.replace(/[^0-9.-]/g, ''))
        return isNaN(numeric) ? 0 : numeric
    }

    // 计算新位置并确保不小于0
    const safeCalculate = (base: string | number, delta: number): number => {
        const baseValue = parseNumericValue(base)
        return Math.max(0, Math.round(baseValue + delta))
    }

    return {
        left: safeCalculate(style.left, deltaX),
        top: safeCalculate(style.top, deltaY)
    }
}
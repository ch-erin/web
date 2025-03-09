// utils/base/eventBus.ts
import mitt, { Emitter } from 'mitt'

type Events = {
    componentMoving: ComponentStyle
    snapPosition: { x?: number; y?: number }
    // 添加其他需要的事件类型
}

export const useEventBus = () => {
    const emitter: Emitter<Events> = mitt<Events>()

    return {
        emit: emitter.emit,
        on: emitter.on,
        off: emitter.off
    }
}

// types/editor.d.ts
export interface ComponentStyle {
    left: number | string
    top: number | string
    width: number | string
    height: number | string
    rotate?: number
    [key: string]: unknown
}

export interface ComponentData {
    id: string
    component: string
    style: ComponentStyle
    isLock?: boolean
    props?: Record<string, unknown>
    attrs?: Record<string, unknown>
}
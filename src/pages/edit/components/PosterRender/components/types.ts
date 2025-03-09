export interface ShapeProps {
    width: string | number;
    height: string | number;
    rotate: number;
    x: number;
    y: number;
}


export interface ElementsProps {
    name: string;
    component: any;
    attrs: Record<string, any>;
    style: Record<string, any>;
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
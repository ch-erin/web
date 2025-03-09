export interface CanvasItem {
    id: string;
    component: string;
    props: Record<string, any>;
    attrs: Record<string, any>;
    style: Record<string, string>;
    isLock?: boolean;
}
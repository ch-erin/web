import { componentMap } from '@/pages/edit/components/MaterialList/componentData'


export const getRealComponent = (dragData: any) => {
    const Component = componentMap[dragData.name];
    if (!Component) return;
    dragData.component = Component;
    return dragData;
}
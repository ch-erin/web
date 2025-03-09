
export function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "copy";
}

export function handleDrop(event: DragEvent, callback: (data: any) => void) {
    event.preventDefault();
    event.stopPropagation();
    try {
        if (!event.dataTransfer) return;
        const dragData = JSON.parse(event.dataTransfer.getData("application/json"));
        callback(dragData);
    } catch (e) {
        console.error("解析数据时发生错误:", e);
    }
}
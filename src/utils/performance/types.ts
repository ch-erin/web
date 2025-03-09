export interface LargestContentfulPaint extends PerformanceEntry {
    renderTime: number;
    size: number;
    id: string;
    url: string;
}

export interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
    lastInputTime: number;
    sources: Array<{
        node: Node;
        previousRect: DOMRectReadOnly;
        currentRect: DOMRectReadOnly;
    }>;
}

export interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
    processingEnd: number;
    duration: number;
    cancelable?: boolean;
}

interface TaskAttributionTiming {
    containerType: string;
    containerId: string;
    containerName: string;
    containerSrc: string;
}


export interface PerformanceLongTaskTiming extends PerformanceEntry {
    duration: number;
    attribution: TaskAttributionTiming[];
}

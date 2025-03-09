import { LargestContentfulPaint, LayoutShift, PerformanceLongTaskTiming } from './types'

export function logNavigationTimings(): void {
    const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];

    // 获取 First Paint (FP) 和 First Contentful Paint (FCP)
    const paintEntries = performance.getEntriesByType("paint") as PerformancePaintTiming[];
    const firstPaint: number | "N/A" =
        paintEntries.find((entry) => entry.name === "first-paint")?.startTime || "N/A";
    const firstContentfulPaint: number | "N/A" =
        paintEntries.find((entry) => entry.name === "first-contentful-paint")?.startTime || "N/A";

    // 获取 Largest Contentful Paint (LCP)
    const lcpEntry = performance.getEntriesByName("largest-contentful-paint")[0] as LargestContentfulPaint | undefined;
    const lcp: number | "N/A" = lcpEntry?.renderTime || "N/A";

    // 获取 Cumulative Layout Shift (CLS)
    const clsEntries = performance.getEntriesByType("layout-shift") as LayoutShift[];
    const cls: number = clsEntries
        .filter((entry) => !entry.hadRecentInput) // 排除最近有用户输入的布局偏移
        .reduce((acc, entry) => acc + entry.value, 0);

    // 获取 INP（近似实现）
    let lastInteractionTime: number | null = null;
    let inp: number | "N/A" = "N/A";

    // 监听用户交互事件
    const interactionHandler = () => {
        lastInteractionTime = performance.now();
    };

    document.addEventListener("click", interactionHandler, { capture: true });
    document.addEventListener("keydown", interactionHandler, { capture: true });

    // 监听下一次绘制事件
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformancePaintTiming[];
        if (lastInteractionTime !== null && entries.length > 0) {
            const nextPaintTime = entries[0].startTime;
            inp = nextPaintTime - lastInteractionTime;
            lastInteractionTime = null; // 重置交互时间
        }
    });

    observer.observe({ entryTypes: ["paint"] });

    // 计算 Total Blocking Time (TBT)
    const longTasks = performance.getEntriesByType("long-task") as PerformanceLongTaskTiming[];
    const tbt: number = longTasks.reduce((acc, task) => acc + task.duration, 0);

    const timings: Record<string, number | "N/A"> = {
        "DNS 解析时间 (DNS)": nav.domainLookupEnd - nav.domainLookupStart,
        "TCP 连接时间 (TCP)": nav.connectEnd - nav.connectStart,
        "SSL/TLS 握手时间 (TLS)": nav.secureConnectionStart > 0 ? nav.connectEnd - nav.secureConnectionStart : 0,
        "请求响应时间 (TTFB)": nav.responseStart - nav.requestStart,
        "内容传输时间 (Transfer)": nav.responseEnd - nav.responseStart,
        "DOM 解析时间 (DOM Parsing)": nav.domInteractive - nav.responseEnd,
        "页面渲染时间 (Render)": nav.loadEventEnd - nav.domContentLoadedEventEnd,
        "白屏时间 (FP)": firstPaint,
        "首屏渲染时间 (FCP)": firstContentfulPaint,
        "最大内容渲染时间 (LCP)": lcp,
        "累积布局偏移 (CLS)": cls,
        "交互到下次绘制时间 (INP)": inp,
        "可交互时间 (TTI)": nav.domInteractive - nav.startTime,
        "总阻塞时间 (TBT)": tbt,
    };

    Object.entries(timings).forEach(([key, value]) => {
        console.log(`${key}: ${value} ms`);
    });

    // 计算页面停留时间
    let pageLoadTime: number | null = null;

    window.addEventListener("load", () => {
        pageLoadTime = performance.now();
    });

    window.addEventListener("unload", () => {
        if (pageLoadTime !== null) {
            const pageUnloadTime = performance.now();
            const pageStayDuration = pageUnloadTime - pageLoadTime;
            console.log(`页面停留时间 (Stay Duration): ${pageStayDuration} ms`);
        }
    });
}
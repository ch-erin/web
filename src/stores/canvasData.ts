import { defineStore } from 'pinia';
import { shallowReactive, computed } from 'vue';
import { getRealComponent } from '@/utils/map/index'

type id = string | null;

export const useCanvasStore = defineStore('canvas', {
    state: () => ({
        canvasDataList: shallowReactive([]) as any[],
        selectedId: 'background' as id,
        historyStack: [] as any[],
        redoStack: [] as any[],
    }),

    getters: {
        curComponent(state) {
            return state.canvasDataList.find((item) => item.id === state.selectedId) || null;
        },
        componentData(state) {
            return state.canvasDataList;
        },
    },

    actions: {
        getRealDataList() {
            const DataList = computed(() => {
                return this.canvasDataList.map(item => {
                    const realComponent = getRealComponent(item)
                    return realComponent || item;
                })
            })
            return DataList.value;
        },

        addCanvasData(data: any) {
            this.pushHistory(); // 保存当前状态到历史栈
            this.canvasDataList.push(data);
        },

        updateStyle(data: any) {
            this.pushHistory(); // 保存当前状态到历史栈
            const index = this.canvasDataList.findIndex((item) => item.id === data.id);
            if (index !== -1) {
                const newItem = { ...this.canvasDataList[index], ...data };
                this.canvasDataList.splice(index, 1, newItem);
            }
        },

        updateStore() {
            const newData = [...this.canvasDataList];
            this.canvasDataList.splice(0, this.canvasDataList.length, ...newData);
        },

        deleteCanvasData(id: string) {
            this.pushHistory(); // 保存当前状态到历史栈
            const index = this.canvasDataList.findIndex((item) => item.id === id);
            if (index !== -1) {
                this.canvasDataList.splice(index, 1);
            }
        },

        clearCanvasData() {
            this.pushHistory();
            this.canvasDataList.length = 0;
        },

        getJsonData() {
            const filteredData = this.canvasDataList.map((item) => {
                const newItem = { ...item };
                delete newItem.containerStyle;
                newItem.component = newItem.name;
                return newItem;
            });
            return JSON.stringify(filteredData, null, 2);
        },

        setJsonData(jsonData: string) {
            const data = JSON.parse(jsonData);
            this.canvasDataList.length = 0;
            this.canvasDataList.push(...data);
            this.getRealDataList()
        },

        lockComponent(id: string) {
            const component = this.canvasDataList.find((item) => item.id === id);
            if (component) {
                component.isLock = true;
                console.log(`组件 ${id} 已锁定`);
            }
        },

        unlockComponent(id: string) {
            const component = this.canvasDataList.find((item) => item.id === id);
            if (component) {
                component.isLock = false;
            }
        },

        selectCanvasData(id: string) {
            if (this.selectedId !== id) {
                this.selectedId = id;
            }
        },

        deselectCanvasData() {
            if (this.selectedId !== null) {
                this.selectedId = 'background';
            }
        },

        // 保存画布数据到 localStorage
        saveCanvasData() {
            const jsonData = this.getJsonData();
            localStorage.setItem('canvasData', jsonData);
        },

        loadCanvasData() {
            const jsonData = localStorage.getItem('canvasData');
            if (jsonData) {
                this.setJsonData(jsonData);
            }
        },

        // 推送当前状态到历史栈
        pushHistory() {
            this.redoStack.length = 0;
            this.historyStack.push(JSON.stringify(this.canvasDataList));
        },

        undo() {
            if (this.historyStack.length > 0) {
                const lastState = this.historyStack.pop();
                if (lastState) {
                    this.redoStack.push(JSON.stringify(this.canvasDataList)); // 当前状态推入重做栈
                    const parsedState = JSON.parse(lastState);
                    this.canvasDataList.splice(0, this.canvasDataList.length, ...parsedState);
                }
            }
        },

        redo() {
            if (this.redoStack.length > 0) {
                const nextState = this.redoStack.pop();
                if (nextState) {
                    this.historyStack.push(JSON.stringify(this.canvasDataList));
                    const parsedState = JSON.parse(nextState);
                    this.canvasDataList.splice(0, this.canvasDataList.length, ...parsedState);
                }
            }
        },
    },
});
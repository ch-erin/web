import { App, Plugin } from 'vue';

// 定义键盘事件的回调类型
type KeyboardCallback = (event: KeyboardEvent) => void;

// 插件的配置类型
interface GlobalKeyboardOptions {
    key: string;
    callback: KeyboardCallback;
}

// 全局键盘插件
const GlobalKeyboardPlugin: Plugin = {
    install(app: App) {
        const keyboardEvents: GlobalKeyboardOptions[] = [];

        const addKeyboardListener = (options: GlobalKeyboardOptions) => {
            keyboardEvents.push(options);
        };

        const removeKeyboardListener = (key: string) => {
            keyboardEvents.splice(
                keyboardEvents.findIndex((event) => event.key === key),
                1
            );
        };

        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            keyboardEvents.forEach((item) => {
                const [key1, key2] = item.key.split('+').map((k) => k.trim().toLowerCase());
                const isKeyMatch = (key: string) => {
                    return key === 'ctrl' ? event.ctrlKey : key === 'meta' ? event.metaKey : key === event.key.toLowerCase();
                };

                if ((key1 === 'ctrl' && event.ctrlKey) || (key1 === 'meta' && event.metaKey)) {
                    if (isKeyMatch(key2)) {
                        item.callback(event);
                    }
                }
            });
        };

        document.addEventListener('keydown', handleGlobalKeyDown);

        app.config.globalProperties.$keyboard = {
            add: addKeyboardListener,
            remove: removeKeyboardListener
        };

        app.onUnmount(() => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        });
    }
};

export default GlobalKeyboardPlugin;
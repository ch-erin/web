import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/styles/reset.css'
import '@/assets/iconfont/iconfont.css'
import GlobalKeyboardPlugin from './plugins/global-keyboard';


const app = createApp(App)
const pinia = createPinia();

app.use(GlobalKeyboardPlugin);
app.use(ElementPlus)
app.use(pinia);
app.use(router)
app.mount('#app')

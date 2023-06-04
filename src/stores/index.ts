import {ref, computed} from 'vue'
import {createPinia} from 'pinia'

//创建顶层仓库
const pinia = createPinia();

//对外暴露
export default pinia;

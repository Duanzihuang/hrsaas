import PageTools from './PageTools'
import UploadExcel from './UploadExcel'

export default {
  install (Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
  }
}

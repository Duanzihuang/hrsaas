import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import Lang from './Lang'
import TagsView from './TagsView'

export default {
  install (Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUpload.name, ImageUpload)
    Vue.component(ScreenFull.name, ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component(Lang.name, Lang)
    Vue.component('TagsView', TagsView)
  }
}

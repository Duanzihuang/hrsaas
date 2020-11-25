<template>
  <div>
    <el-upload
      action="#"
      :http-request="upload"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="onChange"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      :limit="1"
      :class="{ disabled: fileList.length === 1 }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <!-- 进度条 -->
    <el-progress
      style="width:180px;"
      v-if="showPercent"
      :percentage="percent"
    ></el-progress>
    <!-- 预览框 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDZF0WljSxDHfspVr1VnxBHHemedNupD20', // 身份识别 ID
  SecretKey: 'tPN6crrc8OPOFxQkuvgxFZP9ANOD1b6L' // 身份密钥
})
export default {
  name: 'ImageUpload',
  data () {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      showPercent: false, // 是否显示进度条
      percent: 0 // 进度
    }
  },
  methods: {
    // 实现预览
    onChange (file, fileList) {
      this.fileList = [{ url: URL.createObjectURL(file.raw) }]
    },
    beforeAvatarUpload (file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    },
    handleRemove (file, fileList) {
      this.fileList = []
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传
    upload (params) {
      this.showPercent = true
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: 'duanzihuang-1259666555' /* 必须 */,
            Region: 'ap-guangzhou' /* 存储桶所在地域，必须字段 */,
            Key: params.file.name /* 必须 */,
            StorageClass: 'STANDARD',
            Body: params.file, // 上传文件对象
            onProgress: progressData => {
              this.percent = progressData.percent * 100
            }
          },
          (err, data) => {
            if (!err && data.statusCode === 200) {
              this.fileList = [{ url: 'http://' + data.Location, upload: true }]

              setTimeout(() => {
                this.showPercent = false
                this.percent = 0
              }, 1000)
            }
          }
        )
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>

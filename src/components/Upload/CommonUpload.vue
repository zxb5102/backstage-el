<template>
    <div>
        <el-upload class="upload-box" action="https://jsonplaceholder.typicode.com/posts/" :before-upload="beforeUpload" :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleImgRemove" :file-list="fileList" list-type="picture">
            <el-button size="small" type="primary" :disabled="uploadBtn">点击上传</el-button>
        </el-upload>
    </div>
</template>
<script>
export default {
  props: [],
  data() {
    return {
      imgId: 1,
      uploadBtn: true
    };
  },
  methods: {
    beforeUpload() {
      // this.uploadBtn = false;
    },
    uploadError() {
      console.log("error");
      this.uploadBtn = true;
    },
    uploadSuccess(resp, file, fileList) {
      this.uploadBtn = true;
      this.$emit("backImgId", {
        id: this.imgId,
        url: file.url
      });
    },
    uploadImg() {
      console.log("uploadimg");
      this.uploadDialogVisible = false;
    },
    handleImgRemove() {
      console.log("remove img");
      this.uploadBtn = false;
    },
    handlePreview() {
      console.log("preview img");
    }
    // clickBtn() {
    //   this.$emit("backImgId", this.imgId);
    // }
  }
};
</script>
<style lang="less" scoped>

</style>



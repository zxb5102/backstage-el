<template>
  <div>
    <div class="wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="form.content" name="salon"></el-input> -->
          <textarea v-model="form.content" name="salon" cols="20" rows="2"></textarea>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
// import CKEDITOR from "CKEDITOR"
// console.log(CKEDITOR);
export default {
  data() {
    return {
      form: {
        title: "",
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      var content = CKEDITOR.instances.salon.getData().trim();
      if (content != "") {
        this.form.content = "hack content";
      } else {
        this.form.content = "";
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(content);
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    var uploadPath = "/imgupload";
    // console.log(CKEDITOR.config);
    CKEDITOR.config.filebrowserImageUploadUrl = uploadPath;
    CKEDITOR.replace("salon");
  }
};
</script>

<style scoped lang="less">
.wrap {
  width: 95%;
  margin: auto;
  position: relative;
  top: 50px;
}
</style>


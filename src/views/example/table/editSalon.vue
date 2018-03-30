<template>
  <div>
    <div class="salon-list app-container calendar-list-container" v-if="!isEdit">
      <div class="tools">
        <el-button @click="handleCreate" size="small" type="primary" icon="el-icon-plus">新增</el-button>
        <el-button @click="handleEdit" type="info" size="small" icon="el-icon-edit">编辑</el-button>
        <el-button @click="handleDel" type="danger" size="small" icon="el-icon-delete">删除</el-button>
      </div>
      <div class="main">
        <el-table :data="salonList" border fit highlight-current-row style="width: 100%" @selection-change="selectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column min-width="150px" align="center" label="标题">
            <template slot-scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" label="封面图片">
            <template slot-scope="scope">
              <div class="cert-wrap-img">
                <img :src="scope.row.cover" alt="" />
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="550px" align="center" label="描述">
            <template slot-scope="scope">
              <span>{{scope.row.desc}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 编辑页面的信息 -->
    <div class="wrap" v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="封面图片" prop="cover" v-if="type == 'edit' ">
          <div class="wrap-edit-salon-cover-img">
            <img :src="showEditSalonCoverImg" alt="">
            <el-button type="text" style="margin-left:20px" @click="deleteEditSalonCover">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="封面图片" prop="cover" v-if="type == 'add' ">
          <el-upload :on-remove="removeUploadImg" :file-list="fileList" :on-success="uploadSuccess" action="/Upload/Image" name="upload" list-type="picture" :multiple="multiple">
            <el-button size="small" type="primary" :disabled="uploadDisabled">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="form.content" name="salon"></el-input> -->
          <textarea v-model="form.content" name="salon" cols="20" rows="2"></textarea>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="isEdit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import testData from "@/testData.js";
function reset() {
  this.fileList = [];
  this.imgUrls = new Map();
  this.uploadDisabled = false;
  this.form = {
    title: "",
    content: "",
    cover: ""
  };
}
export default {
  data() {
    return {
      type: "",
      realType: "",
      showEditSalonCoverImg: "",
      coverFile: null,
      isEdit: false,
      salonList: [],
      uploadDisabled: false,
      imgUrls: new Map(),
      multiple: false,
      fileList: [],
      form: {
        title: "",
        content: "",
        cover: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        cover: [{ required: true, message: "请上传图片", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
      selection: [],
      backCover: {}
    };
  },
  created() {
    axios({
      method: "post",
      url: "/Salon/List",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(resp => {
        var data = resp.data;
        for (var item of data.data) {
          this.salonList.push({
            id: item.id,
            title: item.title,
            cover: item.cover.url,
            desc: item.summary
          });
        }
        // console.log(resp.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    deleteEditSalonCover() {
      this.form.cover = "";
      this.type = "add";
    },
    selectionChange(selection) {
      this.selection = selection;
    },
    handleCreate() {
      this.realType = "add";
      this.type = "add";
      reset.bind(this)();
      this.isEdit = true;
      // CKEDITOR.replace("salon");
      window.setTimeout(() => {
        var uploadPath = "/Upload/Image";
        CKEDITOR.config.filebrowserImageUploadUrl = uploadPath;
        CKEDITOR.replace("salon");
        // console.log(.on);
        CKEDITOR.instances.salon.on("fileUploadResponse", evt => {
          // Prevent the default response handler.
          evt.stop();
          var data = evt.data,
            xhr = data.fileLoader.xhr,
            resp = JSON.parse(xhr.responseText);
          if (resp.code == 1) {
            data.uploaded = 0;
            data.message = resp.message;
            evt.cancel();
          } else {
            data.uploaded = 1;
            data.url = resp.data.url;
            this.imgUrls.set(resp.data.url, resp.data.id);
          }
        });
      }, 500);
    },
    handleEdit() {
      var length = this.selection.length;
      if (length != 1) {
        this.$alert("请选择一个编辑", "提示");
        return;
      }
      this.form.content = "";
      this.realType = "edit";
      this.isEdit = true;
      this.type = "edit";
      var id = this.selection[0].id;
      // window.setTimeout(() => {
      // }, 200);
      axios({
        method: "post",
        url: "/Salon/Details/" + id,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      })
        .then(resp => {
          var data = resp.data;
          if (data.code == 0) {
            var uploadPath = "/Upload/Image";
            CKEDITOR.config.filebrowserImageUploadUrl = uploadPath;
            CKEDITOR.replace("salon");
            // console.log(.on);
            CKEDITOR.instances.salon.on("fileUploadResponse", evt => {
              // Prevent the default response handler.
              evt.stop();
              var data = evt.data,
                xhr = data.fileLoader.xhr,
                resp = JSON.parse(xhr.responseText);
              if (resp.code == 1) {
                data.uploaded = 0;
                data.message = resp.message;
                evt.cancel();
              } else {
                data.uploaded = 1;
                data.url = resp.data.url;
                this.imgUrls.set(resp.data.url, resp.data.id);
              }
            });

            //display content
            window.setTimeout(() => {
              this.form.title = data.data.title;
              this.form.cover = data.data.cover.id;
              this.backCover = data.data.cover;
              this.imgUrls = new Map();
              this.coverFile = {
                url: data.data.cover.url
              };
              for (var item of data.data.images) {
                this.imgUrls.set(item.url, item.id);
              }

              this.showEditSalonCoverImg = data.data.cover.url;
              CKEDITOR.instances.salon.insertHtml(data.data.content);
            }, 500);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleDel() {
      var length = this.selection.length;
      if (length == 0) {
        this.$alert("请选择后删除", "提示");
        return;
      }
      this.$confirm("确认删除这" + length + "条信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var id = this.selection;
          var ids = [];
          for (var item of this.selection) {
            ids.push(item.id);
          }
          axios({
            method: "post",
            url: "/Salon/Delete",
            data: {
              Ids: ids
            }
          })
            .then(resp => {
              if (resp.data.code == 0) {
                var tary = [];
                for (const item of this.salonList) {
                  for (var tmp of this.selection) {
                    if (item.id == tmp.id) {
                      tary.push(item);
                    }
                  }
                }
                for (const item of tary) {
                  var dex = this.salonList.indexOf(item);
                  this.salonList.splice(dex, 1);
                }
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
              }
            })
            .catch();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    removeUploadImg() {
      this.uploadDisabled = false;
      this.form.cover = "";
      this.$refs.form.validateField("cover", errorMsg => {});
    },
    uploadSuccess(resp, file, fileList) {
      if (resp.code == 0) {
        this.form.cover = resp.data.id;
        this.coverFile = file;
        this.uploadDisabled = true;
      } else {
        alert(resp.message);
      }
      this.$refs.form.validateField("cover", errorMsg => {});
    },
    onSubmit() {
      var content = CKEDITOR.instances.salon.getData().trim();
      if (content != "") {
        this.form.content = "hack content";
      } else {
        this.form.content = "";
      }
      this.$refs["form"].validate(valid => {
        var imgIds = [];
        if (valid) {
          // if (this.realType == "add") {
          var txt = CKEDITOR.instances.salon.document.getBody().getText();
          var summary = txt.slice(0, 30);
          //get the used img ids
          for (var item of this.imgUrls.keys()) {
            var dex = content.indexOf(item);
            if (dex > -1) {
              imgIds.push(this.imgUrls.get(item));
            }
          }
          // debugger;
          var url = "";
          var data = {
            Title: this.form.title,
            CoverId: this.form.cover,
            Summary: summary,
            Content: content,
            ImageIds: imgIds
          };
          if (this.realType == "add") {
            url = "/Salon/Create";
          } else {
            url = "/Salon/Edit";
            data.Id = this.selection[0].id;
          }
          console.log(url);
          axios({
            method: "post",
            url: url,
            data: data,
            headers: { "X-Requested-With": "XMLHttpRequest" }
          })
            .then(resp => {
              var code = resp.data.code;
              if (code == 0) {
                // add or update
                if (this.realType == "add") {
                  // console.log(this.salonList);
                  this.salonList.push({
                    id: resp.data.data.id,
                    title: this.form.title,
                    cover: this.coverFile.url,
                    desc: summary
                  });
                } else {
                  var curr = this.selection[0];
                  curr.title = this.form.title;
                  curr.cover = this.coverFile.url;
                  curr.desc = summary;
                }
                var message = "";
                if (this.realType == "add") {
                  message = "创建活动沙龙成功";
                } else {
                  message = "编辑活动沙龙成功";
                }
                this.$message({
                  type: "success",
                  message: message
                });
                this.form.title = "";
                this.form.cover = "";
                this.fileList = [];
                this.uploadDisabled = false;
                CKEDITOR.instances.salon.setData("");
                this.isEdit = false;
              }
            })
            .catch(error => {
              console.log(error);
            });
          // } else if (this.realType == "edit") {
          //   reset.bind(this)();
          //   this.type = "";
          //   CKEDITOR.instances.salon.setData("");
          //   this.isEdit = false;
          //回显编辑后的数据
          // }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    // console.log(CKEDITOR.config);
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
.salon-list {
  .tools {
    padding-bottom: 20px;
  }
}
.cert-wrap-img {
  margin: auto;
  width: 100px;
  height: 100px; // @media (max-width: 992px) {
  //   height: 100px;
  //   width: 100px;
  // }
  display: flex;
  img {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
  }
}
.wrap-edit-salon-cover-img {
  .cert-wrap-img;
  margin: unset;
}
</style>


<template>
  <div class="app-container calendar-list-container">
    <div class="tab-tools">
      <el-button class="filter-item" :disabled="editBtn" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button>
      <el-button class="filter-item" :disabled="editBtn" style="margin-left: 10px;" @click="handleEdit" type="info" icon="el-icon-edit">编辑</el-button>
      <el-button class="filter-item" :disabled="editBtn" style="margin-left: 10px;" @click="handleDel" type="danger" icon="el-icon-delete">删除</el-button>
    </div>
    <el-table @selection-change="selectionChange" :data="designerList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column type="selection" width="55" align="center" />
      <el-table-column width="250px" align="center" label="设计师图片">
        <template slot-scope="scope">
          <div class="cert-wrap-img">
            <img :src="scope.row.img" :alt="scope.row.img" />
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" label="名字" align="center">
        <template slot-scope="scope">
          <!-- <template v-if="scope.row.edit">
            <el-input  size="small" v-model="scope.row.name"></el-input>
          </template> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="职位" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input size="small" v-model="scope.row.position"></el-input>
          </template>
          <span v-else>{{ scope.row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="邮箱" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input size="small" v-model="scope.row.mail"></el-input>
          </template>
          <span v-else>{{ scope.row.mail }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="联系方式" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input size="small" v-model="scope.row.phone"></el-input>
          </template>
          <span v-else>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300px" label="描述" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input class="edit-input" size="small" v-model="scope.row.desc"></el-input>
            <div class="cancel-btn">
              <el-button size="small" icon="el-icon-close" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
              <el-button size="small" icon="el-icon-check" type="success" @click="commitEdit(scope.row)">完成</el-button>
            </div>
          </template>
          <span v-else>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话弹框 -->
    <el-dialog title="新增设计师" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="图片" prop="img">
          <el-upload :multiple="multiple" class="upload-box" action="/Upload/Image" :before-upload="beforeUpload" :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleImgRemove" :file-list="fileList" list-type="picture">
            <el-button size="small" type="primary" :disabled="uploadBtn">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input type="text" placeholder="请输入名字" v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input type="text" placeholder="请输入职位" v-model="temp.position"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="text" placeholder="请输入描述" v-model="temp.desc"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input type="text" placeholder="请输入邮箱" v-model="temp.mail"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input type="text" placeholder="请输入电话" v-model="temp.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { fetchList } from "@/api/article";
import testData from "@/testData.js";
import Vue from "vue";

export default {
  name: "inlineEditTable",
  data() {
    return {
      selection: [],
      houseId: undefined,
      editBtn: false,
      multiple: false,
      currRow: {},
      uploadBtn: false,
      fileList: [],
      dialogFormVisible: false,
      uploadDialogVisible: false,
      designerList: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      temp: {
        id: undefined,
        name: "",
        img: "",
        mail: "",
        position: "",
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "请填写设计师的姓名", trigger: "blur" }
        ],
        img: [{ required: true, message: "请上传设计师图片", trigger: "blur" }],
        position: [{ required: true, message: "请输入职位", trigger: "blur" }],
        desc: [{ required: true, message: "请填写描述", trigger: "blur" }],
        mail: [{ required: true, message: "请填写邮箱", trigger: "blur" }],
        phone: [{ required: true, message: "请填写电话", trigger: "blur" }]
      }
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  created() {
    // this.getList();
    // designerList
    axios({
      method: "post",
      url: "/Account/GetInfo"
    }).then(resp => {
      var houseId = resp.data.data.user.institutionId;
      this.houseId = houseId;
      axios({
        method: "post",
        url: "/Home/GetDesignPro?parameter=" + houseId
      }).then(resp => {
        var data = resp.data.Designer;
        for (var item of data) {
          this.designerList.push({
            id: item.Id,
            name: item.DesigerName,
            originName: item.DesigerName,
            mail: item.Mail,
            originMail: item.Mail,
            desc: item.Introduce,
            originDesc: item.Introduce,
            phone: item.Phone,
            originPhone: item.Phone,
            position: item.Position,
            originPosition: item.Position,
            img: item.Photo.replace("../..", "")
          });
        }
        this.listLoading = false;
      });
    });
  },
  methods: {
    commitEdit(row) {
      this.editBtn = false;
      row.originName = row.name;
      row.originPosition = row.position;
      row.originMail = row.mail;
      row.originPhone = row.phone;
      row.originDesc = row.desc;
      row.edit = false;
      axios({
        method: "post",
        url: "/Home/UpdateDesignerInfo",
        data: {
          parameters: [
            row.id,
            row.desc,
            row.mail,
            row.phone,
            row.img,
            this.houseId,
            row.position
          ]
        }
      }).then();
      this.$message({
        message: "完成编辑",
        type: "success"
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
          var tary = [];
          for (const item of this.designerList) {
            for (var tmp of this.selection) {
              if (item.id == tmp.id) {
                tary.push(item);
              }
            }
          }
          for (const item of tary) {
            var dex = this.designerList.indexOf(item);
            this.designerList.splice(dex, 1);
            axios({
              url:"/Home/DeleteDesignerInfo",
              method:'post',
              data:{
                parameters:[item.id, this.houseId]
              }
            }).then(resp=>{
              // if(resp.data == "Succeed"){
              //   // cosole.log(1);
              // }
            });
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleEdit() {
      var size = this.selection.length;
      if (size != 1) {
        this.$alert("请选择一个进行编辑", "提示");
        return;
      }
      this.editBtn = true;
      var row = this.selection[0];
      // row.edit = !row.ed1t;
      new Vue.set(row, "edit", true);
    },
    selectionChange(selection) {
      this.selection = selection;
    },
    beforeUpload() {},
    uploadError() {
      this.uploadBtn = true;
    },
    uploadSuccess(resp, file, fileList) {
      this.temp.img = resp.data.url;
      this.uploadBtn = true;
      this.temp.id = new Date().getTime();
    },
    uploadImg() {
      // console.log("uploadimg");
      this.uploadDialogVisible = false;
    },
    handleImgRemove() {
      // console.log("remove img");
      this.uploadBtn = false;
    },
    handlePreview() {
      // console.log("preview img");
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        const items = response.data.items;
        this.list = items.map(v => {
          this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html

          v.originalTitle = v.title; //  will be used when user click the cancel botton

          return v;
        });
        this.listLoading = false;
      });
    },
    cancelEdit(row) {
      this.editBtn = false;
      row.name = row.originName;
      row.position = row.originPosition;
      row.mail = row.originMail;
      row.phone = row.originPhone;
      row.desc = row.originDesc;
      row.edit = false;
      this.$message({
        message: "取消编辑",
        type: "warning"
      });
    },
    handleCreate() {
      this.resetTemp();
      this.fileList = [];
      this.uploadBtn = false;
      this.dialogFormVisible = true;
      //   this.$nextTick(() => {
      //     this.$refs["dataForm"].clearValidate();
      //   });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          axios({
            url: "/Home/SavaDesignerInfo",
            method: "post",
            data: {
              parameters: [
                this.temp.name,
                this.temp.desc,
                this.temp.mail,
                this.temp.phone,
                this.temp.img,
                this.houseId,
                this.temp.position
              ]
            }
          }).then(resp => {
            var data = resp.data;
            var item = this.temp;
            // console.log(item);
            this.designerList.push({
              id: data.Id,
              // name: this.temp.name,
              // img: this.temp.img
              name: item.name,
              originName: item.name,
              mail: item.mail,
              originMail: item.mail,
              desc: item.desc,
              originDesc: item.desc,
              phone: item.phone,
              originPhone: item.phone,
              position: item.position,
              originPosition: item.position,
              img: item.img,
            });
          });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    // confirmEdit(row) {
    //   row.edit = false;
    //   row.originalTitle = row.title;
    //   this.$message({
    //     message: "编辑荣誉成功",
    //     type: "success"
    //   });
    // },
    replaceImg(row) {
      this.fileList = [];
      this.uploadBtn = false;
      this.uploadDialogVisible = true;
      this.currRow = row;
    },
    deleteRow(row) {
      // console.log(row);
      this.$confirm("确认删除这条信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var dex = 0;
          for (const item of this.list) {
            if (item.id == row.id) {
              this.list.splice(dex, 1);
            }
            dex++;
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        src: ""
      };
    }
  }
};
</script>

<style scoped lang="less">
.edit-input {
  padding-right: 200px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 42px;
}
.tab-tools {
  padding-bottom: 20px;
}
.cert-wrap-img {
  margin: auto;
  width: 100px;
  height: 100px;
  // @media (max-width: 992px) {
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
.action-btn {
  margin: 0px;
  display: inline-block;
  text-align: center;
}
</style>


<template>
  <div class="app-container calendar-list-container">
    <div class="tab-tools">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="证书图片">
        <template slot-scope="scope">
          <div class="cert-wrap-img">
            <img :src="scope.row.img" alt="scope.row.img" />
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="证书名称">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input class="edit-input" size="small" v-model="scope.row.title"></el-input>
            <el-button class='cancel-btn' size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
          </template>
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button class="action-btn" v-if="scope.row.edit" type="success" @click="confirmEdit(scope.row)" size="small" icon="el-icon-circle-check-outline">确定</el-button>
          <el-button class="action-btn" v-else type="primary" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit">编辑</el-button>
          <el-button class="action-btn" size="small" type="primary" @click="replaceImg(scope.row)">替换图片</el-button>
          <el-button class="action-btn" v-if="!scope.row.edit" size="small" type="danger" @click="deleteRow(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 对话弹框 -->
    <el-dialog title="新建" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="证书图片">
          <el-upload class="upload-box" action="https://jsonplaceholder.typicode.com/posts/" :before-upload="beforeUpload" :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleImgRemove" :file-list="fileList" list-type="picture">
            <el-button size="small" type="primary" :disabled="uploadBtn">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="荣誉" prop="honor">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="temp.honor"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
        <!-- <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button> -->
      </div>
    </el-dialog>
    <el-dialog title="替换图片" :visible.sync="uploadDialogVisible">
      <el-upload class="upload-box" action="https://jsonplaceholder.typicode.com/posts/" :before-upload="beforeUpload" :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleImgRemove" :file-list="fileList" list-type="picture">
        <el-button size="small" type="primary" :disabled="uploadBtn">点击上传</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="uploadImg">确定</el-button>
        <!-- <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from "@/api/article";

export default {
  name: "inlineEditTable",
  data() {
    return {
      currRow: {},
      uploadBtn: false,
      fileList: [],
      dialogFormVisible: false,
      uploadDialogVisible: false,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      temp: {
        id: undefined,
        honor: ""
      },
      rules: {
        honor: [{ required: true, message: "该项为必填项", trigger: "blur" }]
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
    this.getList();
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
      console.log(file.url);
      console.log(this.currRow);
      this.currRow.img = file.url;
      this.uploadBtn = true;
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
      row.title = row.originalTitle;
      row.edit = false;
      this.$message({
        message: "取消编辑",
        type: "warning"
      });
    },
    handleCreate() {
      //   this.dialogStatus = "create";
      this.resetTemp();
      this.dialogFormVisible = true;
      //   this.$nextTick(() => {
      //     this.$refs["dataForm"].clearValidate();
      //   });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.list.push({
            id: new Date().getTime(),
            title: this.temp.honor
          });
          this.dialogFormVisible = false;
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    },
    confirmEdit(row) {
      row.edit = false;
      row.originalTitle = row.title;
      this.$message({
        message: "编辑荣誉成功",
        type: "success"
      });
    },
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
        honor: ""
      };
    }
  }
};
</script>

<style scoped lang="less">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 93px;
}
.tab-tools {
  padding-bottom: 20px;
}
.cert-wrap-img {
  margin: auto;
  width: 200px;
  height: 200px;
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


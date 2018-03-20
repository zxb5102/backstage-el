<template>
  <div class="app-container calendar-list-container">
    <div class="tab-tools">
      <el-button class="filter-item" :disabled="editBtn" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button>
      <el-button class="filter-item" :disabled="editBtn" style="margin-left: 10px;" @click="handleEdit" type="info" icon="el-icon-edit">编辑</el-button>
      <el-button class="filter-item" :disabled="editBtn" style="margin-left: 10px;" @click="handleDel" type="danger" icon="el-icon-delete">删除</el-button>
    </div>
    <el-table ref="prodTable" @selection-change="selectionChange" :data="prodList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @expand-change="expendRow">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" width="80" type="expand" label="展开">
        <template slot-scope="scope">
          <div class="tab-tools">
            <el-button class="filter-item" style="margin-left: 10px;" @click="uploadProdImg" type="primary" icon="el-icon-plus">新增图片</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="delImg" type="danger" icon="el-icon-delete">删除图片</el-button>
          </div>
          <el-table :data="scope.row.subImg" style="width: 100%" border fit @selection-change="selectionChange2">
            <el-table-column type="selection" width="55" />
            <el-table-column label="图片名称" prop="id" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="图片预览" prop="name" align="center">
              <template slot-scope="scope">
                <div class="prod-wrap-img">
                  <img :src="scope.row.src" alt="scope.row.src" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" label="作品名称">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input class="edit-input" size="small" v-model="scope.row.name"></el-input>
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="作品描述">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input class="edit-input" size="small" v-model="scope.row.desc"></el-input>
            <div class="cancel-btn">
              <el-button size="small" icon="el-icon-close" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
              <el-button size="small" icon="el-icon-check" type="success" @click="successEdit(scope.row)">完成</el-button>
            </div>
          </template>
          <span v-else>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" :total="1000" class="pagination">
    </el-pagination>
    <!-- 新建作品 -->
    <el-dialog title="新建作品" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin:auto'>
        <el-form-item label="名称" prop="name">
          <el-input type="text" placeholder="请输入作品名称" v-model="temp.name">
          </el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" placeholder="请输入作品描述" v-model="temp.desc">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 新增图片 -->
    <el-dialog title="上传图片" :visible.sync="uploadImgDialog">
      <el-upload :on-remove="removeUploadImg" :file-list="fileList" :on-success="uploadSuccess" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture" :multiple="multiple">
        <div slot="tip" class="el-upload__tip">已经上传{{successNum}}个文件</div>
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadImgDialog = false">取消</el-button>
        <el-button type="primary" @click="commitUploadImg">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import testData from "@/testData.js";
import { fetchList } from "@/api/article";
import Upload from "@/components/Upload/CommonUpload";

export default {
  name: "inlineEditTable",
  data() {
    return {
      successNum: 0,
      multiple: true,
      prodImgList: [],
      fileList: [],
      uploadImgDialog: false,
      commitUploadBtn: true,
      imgId: "",
      // expendRow:undefined,
      previousRow: undefined,
      selection: [],
      selection2: [],
      isExpend: false,
      dialogFormVisible: false,
      prodList: testData.prodMsg,
      editBtn: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      temp: {
        id: undefined,
        name: "",
        desc: ""
      },
      rules: {
        name: [{ required: true, message: "该项为必填项", trigger: "blur" }],
        desc: [{ required: true, message: "该项为必填项", trigger: "blur" }]
      }
    };
  },
  components: { Upload },
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
    commitUploadImg() {
      for (var item of this.prodImgList) {
        this.previousRow.subImg.push({
          id: new Date().getTime(),
          name: item.name,
          src: item.url
        });
      }
      this.uploadImgDialog = false;
    },
    uploadSuccess(resp, file, fileList) {
      this.prodImgList.push(file);
      this.commitUploadBtn = false;
      this.successNum++;
      // if (this.prodImgList.length == fileList.length) {
      //   this.commitUploadBtn = false;
      // }
    },
    removeUploadImg(file, fileList) {
      var dex = this.prodImgList.indexOf(file);
      if (dex > -1) {
        this.prodImgList.splice(dex, 1);
        this.successNum--;
      }
    },
    uploadProdImg() {
      this.successNum = 0;
      this.commitUploadBtn = true;
      this.uploadImgDialog = true;
      this.fileList = [];
      this.prodImgList = [];
    },
    delImg() {
      var length = this.selection2.length;
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
          for (const item of this.previousRow.subImg) {
            for (var tmp of this.selection2) {
              if (item.id == tmp.id) {
                tary.push(item);
              }
            }
          }
          for (const item of tary) {
            var dex = this.previousRow.subImg.indexOf(item);
            this.previousRow.subImg.splice(dex, 1);
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
    editSuccess() {},
    handleCreate() {
      this.dialogFormVisible = true;
      this.temp = {
        id: "",
        name: "",
        desc: "",
        edit: false
      };
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
          for (const item of this.prodList) {
            for (var tmp of this.selection) {
              if (item.id == tmp.id) {
                tary.push(item);
              }
            }
          }
          for (const item of tary) {
            var dex = this.prodList.indexOf(item);
            this.prodList.splice(dex, 1);
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
    selectionChange2(selection) {
      this.selection2 = selection;
      // console.log(selection);
    },
    selectionChange(selection) {
      this.selection = selection;
      // console.log(selection);
    },
    handleEdit() {
      var size = this.selection.length;
      if (size != 1) {
        this.$alert("请选择一个作品进行编辑", "提示");
        return;
      }
      this.editBtn = true;
      var row = this.selection[0];
      row.edit = !row.ed1t;
    },
    backImgId(id) {
      console.log(id);
      this.imgId = id;
    },
    expendRow(row, expandedRows) {
      if (this.previousRow && this.previousRow.id != row.id) {
        this.$refs.prodTable.toggleRowExpansion(this.previousRow, false);
      }
      if (!row.subImg) {
        row.subImg = testData.subImg.slice(0);
      }
      this.previousRow = row;
      this.selection2 = [];
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
      row.name = row.originName;
      row.desc = row.originDesc;
      row.edit = false;
      this.editBtn = false;
      this.$message({
        message: "取消编辑",
        type: "warning"
      });
    },
    // handleCreate() {
    //   //   this.dialogStatus = "create";
    //   this.resetTemp();
    //   this.dialogFormVisible = true;
    //   //   this.$nextTick(() => {
    //   //     this.$refs["dataForm"].clearValidate();
    //   //   });
    // },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.prodList.push({
            id: new Date().getTime(),
            name: this.temp.name,
            desc: this.temp.desc,
            edit: false
          });
          this.dialogFormVisible = false;
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    },
    successEdit(row) {
      row.edit = false;
      row.originName = row.name;
      row.originDesc = row.desc;
      this.editBtn = false;
      this.$message({
        message: "编辑荣誉成功",
        type: "success"
      });
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
          for (const item of this.prodList) {
            if (item.id == row.id) {
              this.prodList.splice(dex, 1);
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
    }
    // resetTemp() {
    //   this.temp = {
    //     id: undefined,
    //     honor: ""
    //   };
    // }
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
  top: 10px;
}
.tab-tools {
  padding-bottom: 20px;
}
.prod-wrap-img {
  margin: auto;
  width: 100px;
  height: 100px;
  display: flex;
  img {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
  }
}
.pagination{
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


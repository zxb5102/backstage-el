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

            <el-table-column width="180px" align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </template>
            </el-table-column>

            <el-table-column width="120px" align="center" label="创建者">
                <template slot-scope="scope">
                    <span>{{scope.row.author}}</span>
                </template>
            </el-table-column>

            <!-- <el-table-column width="100px" label="Importance">
                <template slot-scope="scope">
                    <svg-icon v-for="n in +scope.row.importance" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
                </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="Status" width="110">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
                </template>
            </el-table-column> -->

            <el-table-column min-width="300px" label="荣誉名称">
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
                    <el-button v-if="scope.row.edit" type="success" @click="confirmEdit(scope.row)" size="small" icon="el-icon-circle-check-outline">确定</el-button>
                    <el-button v-else type="primary" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit">编辑</el-button>
                    <el-button v-if="!scope.row.edit" size="small" type="danger" @click="deleteRow(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- 对话弹框 -->
        <el-dialog title="新建" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
                <el-form-item label="荣誉" prop="honor">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="temp.honor">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createData">确定</el-button>
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
      dialogFormVisible: false,
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
            title:this.temp.honor
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

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.tab-tools {
  padding-bottom: 20px;
}
</style>


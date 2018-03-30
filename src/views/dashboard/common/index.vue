<template>
    <div class="dv">
        <span class="h5 welcome" v-if="baseInfo[3]">你好,{{ baseInfo[3].value}}</span>
        <!-- <b-table class="person-info" striped hover :items="items"></b-table> -->
        <div class="person-info">
            <div class="person-info-label">
                <div class="others">
                    <h3 style="display:inline-block;margin-right:20px">基本信息</h3>
                    <el-button type="text">
                        <a href="/Contract/List" target="_blank">合同审核</a>
                    </el-button>
                    <el-button type="text">
                        <a href="/Manage/ChangePassword" target="_blank">修改密码</a>
                    </el-button>
                    <el-button type="text">
                        <a href="/">返回官网</a>
                    </el-button>
                </div>
            </div>
            <!-- <div v-for="item in baseInfo" :key="item.label" class="each-item">
        <div class="label">{{item.label}}</div>
        <div class="msg">{{item.value}}</div>
      </div> -->
            <div class="c-info">
                <div class="c-label">
                    <div v-for="item in baseInfo" :key="item.label">{{item.label}}</div>
                </div>
                <div class="c-value">
                    <div v-for="item in baseInfo" :key="item.label">{{item.value}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var axios = require("axios");
export default {
  name: "dashboard-common",
  data() {
    return {
      baseInfo: []
    };
  },
  mounted() {
    axios({
      method: "post",
      url: "/Account/GetInfo",
      data: {}
    })
      .then(resp => {
        var code = resp.data.code;
        if (code == 0) {
          var userInfo = resp.data.data.user;
          var institutionType = "";
          switch (userInfo.institutionType) {
            case 1:
              institutionType = "部门";
              break;
            case 2:
              institutionType = "设计所";
              break;
            case 3:
              institutionType = "建材商";
              break;
            default:
              institutionType = "机构";
          }
          var status = "";
          switch (userInfo.state) {
            case -1:
              status = "审核失败";
              break;
            case 0:
              status = "正在审核";
              break;
            default:
              status = "通过";
          }

          this.baseInfo = [
            {
              label: "审核状态：",
              value: status
            },
            {
              label: "园区：",
              value: userInfo.park
            },
            {
              label: institutionType + "：",
              value: userInfo.institution
            },
            {
              label: "姓名：",
              value: userInfo.name
            },
            {
              label: "账号：",
              value: userInfo.account
            },
            {
              label: "邮箱：",
              value: userInfo.mail
            }
          ];
        } else {
          //没有登入的情况下 跳转到 登入界面
          window.location = "/#/entry/login";
        }
      })
      .catch(error => {
        console.log(error);
        // alert("服务器繁忙请稍后重试");
      });
  }
};
</script>
<style lang="less" scoped>
.welcome {
  display: block;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  @media (max-width: 992px) {
    font-size: 18px;
  }
}
.each-item {
  display: block;
  margin-bottom: 20px;
  .label {
    display: inline-block;
    min-width: 100px;
    margin-right: 20px;
    //background-color: gray;
    @media (max-width: 992px) {
      min-width: 50px;
    }
  }
  .msg {
    display: inline-block;
  }
}
.person-info {
  .person-info-label {
    font-weight: 300;
    margin-bottom: 20px;
    line-height: 14px;
    border-bottom: 1px solid black;
    @media (max-width: 992px) {
      font-size: 20px;
    }
  }
  @media (max-width: 992px) {
    max-width: 95%;
  }
  @media (min-width: 992px) {
    max-width: 768px;
  }
  margin: auto;

  .c-info {
    display: flex;
    line-height: 24px;
    justify-content: center;
    align-items: center;
    .c-label {
      flex: 1;
    }
    .c-value {
      flex: 2;
    }
  }
}
.others {
  margin-right: 20px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-around;
}
</style>



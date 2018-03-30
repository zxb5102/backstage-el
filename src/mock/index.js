import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
import testData from "@/testData"
// Mock.setup({
//   timeout: '350-600'
// })
// /Home/SaveDesignHonor
// /Home/GetProductDetailAsproId
if (ISDEV) {
    Mock.mock(/\/Home\/GetProductDetailAsproId/, 'post', testData.prodSubImgRealPath);
    Mock.mock(/\/Home\/SaveDesignHonor/, 'post', { "Id": 1086, "HonorName": "fsfs", "CompanyId": 1 });
    Mock.mock(/\/Home\/UploadLogoModifyFile/, 'post', {});
    Mock.mock(/\/Home\/UpdateDesignIntroduction/, 'post', {});
    Mock.mock(/\/Home\/DeleteDesignerInfo/, 'post', "Succeed");
    Mock.mock(/\/Home\/SavaDesignerInfo/, 'post', testData.addNewDesigner);
    Mock.mock(/\/Home\/UpdateDesignerInfo/, 'post', {});
    Mock.mock(/\/Home\/DeleteProDetail/, 'post', "Succeed");
    Mock.mock(/\/Home\/SaveProDetailAfterModify/, 'post', testData.addNewProdImg);
    Mock.mock(/\/Home\/GetProductDetail/, 'post', testData.prodSubImg);
    Mock.mock(/\/Home\/DeleteDesignerPro/, 'post', "Succeed");
    Mock.mock(/\/Home\/SaveDesignHouseProduct/, 'post', testData.saveProdServerResult);
    Mock.mock(/\/Home\/SaveDesignCert/, 'post', {});
    Mock.mock(/\/Home\/GetDesignPro/, 'post', testData.all);
    Mock.mock(/\/Home\/DeleteDesignHonor/, 'post', "Succeed");
    Mock.mock(/\/Home\/DeleteDesignCert/, 'post', "Succeed");
    Mock.mock(/\/Salon\/List/, 'post', testData.salonList);
    Mock.mock(/\/Salon\/Detail\/*/, 'post', {
        code: 0,
        data: {
            id: 1,
            ctime: "2018-01-01 10:10:10",
            title: "回显的标题",
            cover: {
                url: "http://cyy.zhcjjs.com/Photos/Company/Designer/Liuboya.jpg",
                id: 1
            },
            images: [{
                id: 3,
                url: "http://cyy.zhcjjs.com/Photos/Company/Designer/Designer91.jpg"
            }, {
                id: 5,
                url: "http://cyy.zhcjjs.com/Photos/Company/Designer/DesignerWang.jpg"
            }],
            summary: "ssummarysummarysummarysummaryummary",
            content: "<p>this is content</p>",
        }
    })
    // /Salon/Delete
    Mock.mock(/\/Salon\/Delete/, 'post', {
        // code: 0, data: { id: 1, url: "http://cyy.zhcjjs.com/Photos/Company/Logo/logo13.jpg" }
        code: 0
    })

    Mock.mock(/\/Account\/GetInfo/, 'post', testData.userInfo);
    Mock.mock(/\/Home\/DesignerPage/, 'post', testData.all);
    // Home/DesignerPage
    Mock.mock(/\/Salon\/Edit/, 'post', {
        // code: 0, data: { id: 1, url: "http://cyy.zhcjjs.com/Photos/Company/Logo/logo13.jpg" }
        code: 0
    })
    Mock.mock(/\/Salon\/Create/, 'post', {
        // code: 0, data: { id: 1, url: "http://cyy.zhcjjs.com/Photos/Company/Logo/logo13.jpg" }
        code: 0,
        data: {
            id: 123
        }
    })
    Mock.mock(/\/Upload\/Image/, 'post', {
        code: 0, data: { id: 1, url: "http://cyy.zhcjjs.com/Photos/Company/Logo/logo13.jpg" }
        // code:1,message:"upload error"
    })
    Mock.mock(/\/Salon\/UploadImage/, 'post', {
        code: 0, data: { id: 1, url: "http://cyy.zhcjjs.com/Photos/Company/Logo/logo13.jpg" }
    })

    // 登录相关
    Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
    Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
    Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)


    // 文章相关
    Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
    Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
    Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
    Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
    Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

    // 搜索相关
    Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

    // 账单相关
    Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)
}
export default Mock

// pages_project/survey_unit/survey_unit.js
const image = 'https://tdesign.gtimg.com/miniprogram/images/example2.png';

Page({
    offsetTopList: [],
    data: {
        sideBarIndex: 0,
        scrollTop: 0,
        categories: [],
        pcdyOptions:[],
        pcdyNote:'请选择普查单元',
        pcdyCode:'',
        pcdyVisible:false,
    },
    onSideBarChange(e) {
        const {
            value
        } = e.detail;

        this.setData({
            sideBarIndex: value
        });
    },
    onCategoryNew(e) {
        let type_code = this.data.categories[this.data.sideBarIndex].code;
        console.log(type_code);
        wx.navigateTo({
            url: `../category/category?type_code=` + type_code,
        });
    },
    // 级联菜单
    showCascader() {
        this.setData({
            pcdyVisible: true
        });
    },
    onChange(e) {
        const {
            selectedOptions
        } = e.detail;

        this.setData({
            pcdyNote: selectedOptions.map((item) => item.label).join('_'),
        });
    },
    // cell listener
    onEdit(e) {
        const {code} = e.currentTarget.dataset;
        let type_code = this.data.categories[this.data.sideBarIndex].code;
        wx.navigateTo({
          url: '../category/category_edit?code='+code+'&type_code='+type_code,
        });
    },
    onDelete(e) {
        const {code} = e.currentTarget.dataset;
        wx.showToast({
          title: 'code: ' + code,
        })
        
    },
    // 获取数据
    getPcdyOptions(param) {
        wx.request({
            url: 'https://easydoc.net/mock/u/58236996/PCDY_TREE',
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                this.setData({
                    pcdyOptions: res.data.areaList,
                    pcdyCode: res.data.areaList[0].children[0].children[0].value,
                    pcdyNote: [res.data.areaList[0].label, res.data.areaList[0].children[0].label,res.data.areaList[0].children[0].children[0].label].join('_'),
                });
                this.getCategories("");
            }
        })
    },
    getCategories(param) {
        wx.request({
            url: getApp().globalData.API_BASE + `/system/gxjsZt/list`,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': wx.getStorageSync("sessionid")
            },
            data: {
                PCDYBH: param
            },
            success: (res) => {
                this.setData({
                    categories: res.data.rows,
                });
            }
        })
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        console.log(options);
        if(options && options.pcdyCode) {
            this.setData({
                pcdyCode: options.pcdyCode,
                pcdyNote:options.pcdyNote
            });
            this.getCategories(options.pcdyCode);
        }else {
            this.getPcdyOptions("");
        }
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {
    },
    // 生命周期函数--监听页面显示
    onShow: function () {
    },
    // 生命周期函数--监听页面隐藏
    onHide: function () {
    },
    // 生命周期函数--监听页面卸载
    onUnload: function () {
    },
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {
    },
    // 页面上拉触底事件的处理函数
    onReachBottom: function () {
    },
    //用户点击右上角分享
    onShareAppMessage: function () {
    }
});

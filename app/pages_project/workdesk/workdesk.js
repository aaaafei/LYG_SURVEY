// pages/personal/personal.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        banners: [],
        menus: [
            {name:"普查单元",imgSrc:"/images/function/pucha.png",url:"../surveys/surveys"},
            // {name:"待普查",imgSrc:"/images/function/pucha-todo.png",url:""},
            // {name:"待提交",imgSrc:"/images/function/pucha-tosubmit.png",url:""},
            // {name:"已普查",imgSrc:"/images/function/pucha-done.png",url:""},
            {name:"人行通道",imgSrc:"/images/function/JTRX.png",url:"../survey_unit/survey_unit?ztType=jtrx"},
            {name:"地下道路",imgSrc:"/images/function/JTDL.png",url:"../survey_unit/survey_unit?ztType=jtdl"},
            {name:"地下停车场",imgSrc:"/images/function/JTTC.png",url:"../survey_unit/survey_unit?ztType=jttc"},
            {name:"给水管线",imgSrc:"/images/function/GXJS.png",url:"../survey_unit/survey_unit?ztType=gxjs"},
            {name:"再生水管线",imgSrc:"/images/function/GXZSS.png",url:"../survey_unit/survey_unit?ztType=gxzss"},
            {name:"雨水管线",imgSrc:"/images/function/GXYS.png",url:"../survey_unit/survey_unit?ztType=gxys"},
            {name:"污水管线",imgSrc:"/images/function/GXWS.png",url:"../survey_unit/survey_unit?ztType=gxws"},
            {name:"热力管线",imgSrc:"/images/function/GXRL.png",url:"../survey_unit/survey_unit?ztType=gxrl"},
            {name:"燃气管线",imgSrc:"/images/function/GXRQ.png",url:"../survey_unit/survey_unit?ztType=gxrq"},
            {name:"电力管线",imgSrc:"/images/function/GXDL.png",url:"../survey_unit/survey_unit?ztType=gxdl"},
            {name:"有线电管线",imgSrc:"/images/function/GXYXD.png",url:"../survey_unit/survey_unit?ztType=gxyxd"},
            {name:"通信管线",imgSrc:"/images/function/GXTX.png",url:"../survey_unit/survey_unit?ztType=gxtx"},
            {name:"综合管廊（沟）",imgSrc:"/images/function/ZHGL.png",url:"../survey_unit/survey_unit?ztType=gxzhgl"},
            {name:"工业管线",imgSrc:"/images/function/GXGY.png",url:"../survey_unit/survey_unit?ztType=gxgy"},
            {name:"人防工程",imgSrc:"/images/function/RF.png",url:"../survey_unit/survey_unit?ztType=qtrf"},
            {name:"废弃工程",imgSrc:"/images/function/QTFQ.png",url:"../survey_unit/survey_unit?ztType=qtfq"},
            {name:"其他设施",imgSrc:"/images/function/QTQT.png",url:"../survey_unit/survey_unit?ztType=qtqt"},
        ],
        hasPatrolTaskTodo: false,
    },
    goHome() {
        wx.redirectTo({
            url: '../login/login'
        });
    },
    getHeaderPics4Wx() {
        wx.request({
            url: getApp().globalData.API_BASE + `/comm/getHeaderPics4Wx`,
            method: 'get',
            header: {
                'content-type': 'application/json',
                'cookie': wx.getStorageSync("sessionid")
            },
            success: (res) => {
                this.setData({
                    banners: [
                        {picUrl:'../../images/login-background.jpg'},
                        {picUrl:'../../images/login-background.jpg'},
                    ]
                });
            },
            fail: (res) =>  {

            }
        });
    },
    getWXMenuByUserRole() {
        wx.request({
            url: getApp().globalData.API_BASE + `/menu/getWXMenuByUserRole`,
            method: 'get',
            header: {
                'content-type': 'application/json',
                'cookie': wx.getStorageSync("sessionid")
            },
            success: (res) =>  {
                // let menusString = res.data.result_data;
                // let menuArr = new Array();
                // menusString.forEach(item => {
                //     let menu = JSON.parse(item);
                //     menuArr.push(menu);
                // });
                // _this.setData({
                //     menus: menuArr
                // });
            },
            fail: (res) =>  {

            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getHeaderPics4Wx();
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
})
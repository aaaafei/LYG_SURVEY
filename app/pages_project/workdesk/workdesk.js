// pages/personal/personal.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners: [],
        menus: [
            {name:"普查单元",imgSrc:"/images/function/pucha.png",url:"../surveys/surveys"},
            {name:"待普查",imgSrc:"/images/function/pucha-todo.png",url:""},
            {name:"待提交",imgSrc:"/images/function/pucha-tosubmit.png",url:""},
            {name:"已普查",imgSrc:"/images/function/pucha-done.png",url:""},
        ],
        hasPatrolTaskTodo: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        wx.request({
            url: getApp().globalData.API_BASE + `/comm/getHeaderPics4Wx`,
            method: 'get',
            header: {
                'content-type': 'application/json',
                'token': wx.getStorageSync("token")
            },
            success: function (res) {
                if (res.data.status == 403) {
                    if (!needReLogin) {
                        wx.showToast({
                            title: '未登录或登录失效，请重新登录！',
                            icon: 'none',
                            duration: 3000
                        });
                    }
                    needReLogin = true;
                } else {
                    _this.setData({
                        banners: res.data.result_data
                    });
                }
            },
            fail: function (res) {

            }
        });

        wx.request({
            url: getApp().globalData.API_BASE + `/menu/getWXMenuByUserRole`,
            method: 'get',
            header: {
                'content-type': 'application/json',
                'token': wx.getStorageSync("token")
            },
            success: function (res) {
                let menusString = res.data.result_data;
                let menuArr = new Array();
                menusString.forEach(item => {
                    let menu = JSON.parse(item);
                    menuArr.push(menu);
                });
                // _this.setData({
                //     menus: menuArr
                // });
            },
            fail: function (res) {

            }
        });

    },



    goHome: function () {
        wx.redirectTo({
            url: '../login/login'
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
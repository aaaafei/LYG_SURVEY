// pages_project/surveys/surveys.js
Page({
    data: {
        surveys: [],
        total:0,
        curPage:1,
        totalPage:1,
        pageSize:20,
    },
    //
    getSurveys(param){
        let _this = this;
        wx.request({
            url: getApp().globalData.API_BASE + `/system/pcdy/list`,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': wx.getStorageSync("sessionid")
            },
            data: {
                pageSize: this.data.pageSize,
                pageNum: this.data.curPage,
                isAsc: 'asc',
                DLMC: '',
                PCDYBH: '',
                XZQHWZ: '',
                DLDJ: '',
            },
            success: (res) => {
                this.setData({
                    surveys: res.data.rows,
                    total:res.data.total,
                    totalPage: parseInt(res.data.total/_this.data.pageSize)+1
                });
            }
        });
    },
    // 翻页
    prePage() {
        if((this.data.curPage - 1)<1) {
            wx.showToast({
              title: '已经是第1页了',
            });
            return;
        }
        this.setData({
            curPage: this.data.curPage - 1
        });
        this.getSurveys();
    },
    nextPage() {
        if((this.data.curPage + 1) > this.data.totalPage) {
            wx.showToast({
              title: '已经是最后页了',
            });
            return;
        }
        this.setData({
            curPage: this.data.curPage + 1
        });
        this.getSurveys();
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        this.getSurveys();
    },
})

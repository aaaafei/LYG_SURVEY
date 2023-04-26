// pages_project/surveys/surveys.js
Page({
    data: {
        surveys: [],
        total:0,
        curPage:1,
        totalPage:1,
        pageSize:20,
        value:'',
        searchParams: {
            pageSize: 20,
            pageNum: 1,
            isAsc: 'asc',
            DLMC: '',
            PCDYBH: '',
            XZQHWZ: '',
            DLDJ: '',
        }
    },
    //
    getSurveys(){
        let _this = this;
        wx.request({
            url: getApp().globalData.API_BASE + `/system/pcdy/list`,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': wx.getStorageSync("sessionid")
            },
            data: this.data.searchParams,
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
    onSearchChange(e) {
        this.data.searchParams.DLMC = e.detail.value;
        this.setData({
            searchParams: this.data.searchParams
        });
        this.getSurveys();
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        this.getSurveys();
    },
})

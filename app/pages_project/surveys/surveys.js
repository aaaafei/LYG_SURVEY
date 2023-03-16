// pages_project/surveys/surveys.js
Page({
    data: {
        surveys: [],
        count:0,
    },
    //
    getSurveys(param){
        wx.request({
            url: 'https://easydoc.net/mock/u/58236996/surveys',
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                this.setData({
                    surveys: res.data.surveys,
                    count:res.data.count,
                });
                console.log(this.data.surveys);
            }
        });
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        this.getSurveys();
    },
})

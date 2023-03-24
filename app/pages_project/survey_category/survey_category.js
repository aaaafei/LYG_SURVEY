// pages_project/survey_unit/survey_unit.js
const image = 'https://tdesign.gtimg.com/miniprogram/images/example2.png';
const items = new Array(12).fill({
    label: '标题文字',
    image
}, 0, 12);
import Toast from 'tdesign-miniprogram/toast/index';

Page({
    offsetTopList: [],
    data: {
        sideBarIndex: 0,
        scrollTop: 0,
        categoryCode: "",
        categoryNote: "",
        pcdyCode: "",
        pcdyNote: " ",
        sections: [],
    },
    onSideBarChange(e) {
        const {
            value
        } = e.detail;

        this.setData({
            sideBarIndex: value
        });
    },
    onSectionNew(e) {
        let type_code = this.data.sections[this.data.sideBarIndex].code
        wx.navigateTo({
            url: `../section/section?type_code=` + type_code,
        });
    },
    // cell listener
    onEdit(e) {
        const {code} = e.currentTarget.dataset;
        let type_code = this.data.sections[this.data.sideBarIndex].code;
        wx.navigateTo({
          url: '../section/section_edit?code='+code+'&type_code='+type_code,
        });
    },
    onDelete(e) {
        wx.showToast({
            title: 'DELETE',
        })
    },
    getSections(param) {
        wx.request({
            url: 'https://easydoc.net/mock/u/58236996/sections',
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                this.setData({
                    sections: res.data.sections,
                });
            }
        })
    },
     // 生命周期函数--监听页面加载
     onLoad: function (options) {
        console.log(options);
        if(options && options.categoryCode) {
            this.setData({
                pcdyCode: options.pcdyCode,
                pcdyNote:options.pcdyNote,
                categoryCode: options.categoryCode,
                categoryNote: options.categoryNote,
            });
            this.getSections(options.categoryCode);
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

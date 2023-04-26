// pages_project/survey_unit/survey_unit.js
const image = 'https://tdesign.gtimg.com/miniprogram/images/example2.png';
const items = new Array(12).fill({
    label: '标题文字',
    image
}, 0, 12);

Page({
    offsetTopList: [],
    data: {
        sideBarIndex: 0,
        scrollTop: 0,
        categoryCode: "",
        categoryNote: "",
        pcdyCode: "",
        pcdyNote: "",
        ztType: "",
        cateType:"",
        sections: [],
        typeCodeMap: {
            'jtrx':{'name':'人行通道', 'categories': [{'code':'Qj','name':'区间属性'}]},
            'jtdl':{'name':'地下道路', 'categories': [{'code':'Qj','name':'区间属性'}]},
            'jttc':{'name':'地下停车场', 'categories': [{'code':'Qj','name':'区间属性'}]},
            'gxjs':{'name':'给水', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'gxzss':{'name':'再生水', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'gxys':{'name':'雨水', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'gxws':{'name':'污水', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'gxrl':{'name':'热力', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'gxrq':{'name':'燃气', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'gxdl':{'name':'电力', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'gxyxd':{'name':'有线电', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'gxtx':{'name':'通信', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'gxzhgl':{'name':'综合管廊（沟）', 'categories': [{'code':'Qj','name':'区间属性'},{'code':'Bhd','name':'管线变化点'}]},
            'gxgy':{'name':'工业', 'categories': [{'code':'Gx','name':'管线'},{'code':'Gd','name':'管点'},{'code':'Bhd','name':'管线变化点'}]},
            'qtrf':{'name':'人防工程', 'categories': [{'code':'Sx','name':'属性'}]},
            'qtfq':{'name':'废弃工程', 'categories': [{'code':'Sx','name':'属性'}]},
            'qtqt':{'name':'其他工程', 'categories': [{'code':'Sxa','name':'属性'}]},
        }
    },
    onSideBarChange(e) {
        const {
            value
        } = e.detail;

        this.setData({
            sideBarIndex: value,
            cateType: this.data.sections[value].code
        });
        this.getSections();
    },
    onSectionNew(e) {
        wx.navigateTo({
            url: `../section/section?ztType=` + this.data.ztType + '&cateType=' + this.data.cateType + '&glbsm=' + this.data.categoryCode,
        });
    },
    // cell listener
    onView(e) {
        const {code} = e.currentTarget.dataset;
        let ztType = this.data.ztType
        let cateType = this.data.cateType;
        wx.navigateTo({
          url: '../section/section_edit?pageMode=view&id='+code+'&ztType='+ztType+'&cateType='+cateType,
        });
    },
    onEdit(e) {
        const {code} = e.currentTarget.dataset;
        let ztType = this.data.ztType
        let cateType = this.data.cateType;
        wx.navigateTo({
          url: '../section/section_edit?id='+code+'&ztType='+ztType+'&cateType='+cateType,
        });
    },
    onDelete(e) {
        const {code} = e.currentTarget.dataset;
        wx.request({
            url: getApp().globalData.API_BASE + '/system/'+this.data.ztType+this.data.cateType+'/remove',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': wx.getStorageSync("sessionid")
            },
            data: {
                ids: code
            },
            success: (res) => {
                wx.showToast({
                    title: res.data.msg,
                })
                this.getSections();
            }
        })
    },
    getSections() {
        wx.request({
            // url: 'https://easydoc.net/mock/u/58236996/sections',
            url: getApp().globalData.API_BASE + '/system/'+this.data.ztType+this.data.cateType+'/list',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': wx.getStorageSync("sessionid")
            },
            data: {
                GLBSM: this.data.categoryCode,
                pageNum: 1,
                pageSize: 500,
                isAsc: 'asc',
            },
            success: (res) => {
                console.log(res.data);
                let _sections = [];
                let sectionTypeArray = this.data.typeCodeMap[this.data.ztType].categories;
                console.log(sectionTypeArray);
                for (let i in sectionTypeArray) {
                    let item = sectionTypeArray[i];
                    let oo = {};
                    if (item.code == this.data.cateType) {
                        oo = {
                            "label": item.name,
                            "code": item.code,
                            "title": this.data.typeCodeMap[this.data.ztType].name + item.name+"信息",
                            "badgeProps": {
                                "count": res.data.total
                            },
                            "items": res.data.rows
                        }
                    }else {
                        oo = {
                            "label": item.name,
                            "code": item.code,
                            "title": this.data.typeCodeMap[this.data.ztType].name + item.name+"信息",
                            "badgeProps": {
                                "count": 0
                            },
                            "items": []
                        }
                    }
                    _sections.push(oo);
                }
                this.setData({
                    sections: _sections,
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
                ztType:options.ztType,
                cateType:this.data.typeCodeMap[options.ztType].categories[0].code,
            });
        }
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {
    },
    // 生命周期函数--监听页面显示
    onShow: function () {
        this.getSections();
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

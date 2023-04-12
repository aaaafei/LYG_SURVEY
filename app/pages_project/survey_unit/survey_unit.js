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
        ztType:'',
        categoryCode:'',
        typeCodeMap: {
            'jtrx':{'name':'人行通道', 'type': 'Zt', 'typename': ''},
            'jtdl':{'name':'地下道路', 'type': 'Zt', 'typename': ''},
            'jttc':{'name':'地下停车场', 'type': 'Zt', 'typename': ''},
            'gxjs':{'name':'给水', 'type': 'Zt', 'typename': '管线'},
            'gxzss':{'name':'再生水', 'type': 'Zt', 'typename': '管线'},
            'gxys':{'name':'雨水', 'type': 'Zt', 'typename': '管线'},
            'gxws':{'name':'污水', 'type': 'Zt', 'typename': '管线'},
            'gxrl':{'name':'热力', 'type': 'Zt', 'typename': '管线'},
            'gxrq':{'name':'燃气', 'type': 'Zt', 'typename': '管线'},
            'gxdl':{'name':'电力', 'type': 'Zt', 'typename': '管线'},
            'gxyxd':{'name':'有线电', 'type': 'Zt', 'typename': '管线'},
            'gxtx':{'name':'通信', 'type': 'Zt', 'typename': '管线'},
            'gxzhgl':{'name':'综合管廊（沟）', 'type': 'Zt', 'typename': '管线'},
            'gxgy':{'name':'工业', 'type': 'Zt', 'typename': '管线'},
            'qtrf':{'name':'人防工程', 'type': 'Zt', 'typename': ''},
            'qtfq':{'name':'废弃工程', 'type': 'Zt', 'typename': ''},
            'qtqt':{'name':'其他工程', 'type': 'Zt', 'typename': ''},
        }
    },
    onSideBarChange(e) {
        const {
            value
        } = e.detail;
        this.setData({
            sideBarIndex: value,
            ztType: this.data.categories[value].code
        });
        this.getCategories();
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
    getCategories() {
        wx.request({
            url: getApp().globalData.API_BASE + '/system/'+this.data.ztType+'Zt/list',
            // url: 'https://easydoc.net/mock/u/58236996/categories',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': wx.getStorageSync("sessionid")
            },
            data: {
                PCDYBH: this.data.pcdyCode
            },
            success: (res) => {
                let _categories = [];
                for (let key in this.data.typeCodeMap) {
                    let oo = {};
                    if (key == this.data.ztType) {
                        oo = {
                            "label": this.data.typeCodeMap[this.data.ztType].name,
                            "code": this.data.ztType,
                            "title": this.data.typeCodeMap[this.data.ztType].name+this.data.typeCodeMap[this.data.ztType].typename+"总体信息",
                            "badgeProps": {
                                "count": res.data.total
                            },
                            "items": res.data.rows
                        }
                    }else {
                        oo = {
                            "label": this.data.typeCodeMap[key].name,
                            "code": key,
                            "title": this.data.typeCodeMap[key].name+this.data.typeCodeMap[key].typename+"总体信息",
                            "badgeProps": {
                                "count": 0
                            },
                            "items": []
                        }
                    }
                    _categories.push(oo);
                }
                this.setData({
                    categories: _categories,
                });
            }
        })
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        if(!(options && options.ztType)) {
            this.setData({
                ztType : 'gxjs'
            })
        } 
        this.setData({
            sideBarIndex : Object.keys(this.data.typeCodeMap).indexOf(this.data.ztType)
        });
        if(options && options.pcdyCode) {
            this.setData({
                pcdyCode: options.pcdyCode,
                pcdyNote:options.pcdyNote
            });
            this.getCategories();
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

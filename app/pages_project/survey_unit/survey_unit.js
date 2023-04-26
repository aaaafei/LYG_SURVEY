// pages_project/survey_unit/survey_unit.js
const image = 'https://tdesign.gtimg.com/miniprogram/images/example2.png';

Page({
    offsetTopList: [],
    data: {
        sideBarIndex: 0,
        scrollTop: 0,
        loading: true,
        categories: [],
        pcdyOptions:[],
        pcdyNote:'请选择普查单元',
        pcdyCode:'',
        pcdyVisible:false,
        ztType:'',
        categoryCode:'',
        currentPcdy: {},
        xzqArray:[],
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
            url: `../category/category?ztType=` + type_code + '&pcdyCode=' + this.data.pcdyCode,
        });
    },
    // 级联菜单
    showCascader() {
        this.setData({
            pcdyVisible: true
        });
        this.getPcdyOptions();
    },
    onChange(e) {
        const {
            selectedOptions
        } = e.detail;
        // console.log(selectedOptions);
        this.setData({
            pcdyNote: selectedOptions.map((item) => item.label).join('>'),
            pcdyCode: selectedOptions[2].value
        });
        this.getCategories()
    },
    // cell listener
    onView(e) {
        const {code} = e.currentTarget.dataset;
        let ztType = this.data.ztType;
        wx.navigateTo({
          url: '../category/category_edit?pageMode=view&id='+code+'&ztType='+ztType,
        });
    },
    onEdit(e) {
        const {code} = e.currentTarget.dataset;
        let ztType = this.data.ztType;
        wx.navigateTo({
          url: '../category/category_edit?id='+code+'&ztType='+ztType,
        });
    },
    onDelete(e) {
        const {code} = e.currentTarget.dataset;
        wx.request({
            url: getApp().globalData.API_BASE + '/system/'+this.data.ztType+'Zt/remove',
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
                this.getCategories();
            }
        })
    },
    // 获取数据
    getPcdyOptions(){
        wx.request({
            url: getApp().globalData.API_BASE + `/system/pcdy/list`,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': wx.getStorageSync("sessionid")
            },
            data: {
                pageSize: 1500,
                pageNum: 1,
                isAsc: 'asc',
                DLMC: '',
                PCDYBH: '',
                XZQHWZ: '',
                DLDJ: '',
            },
            success: (res) => {
                this.buildTree(res.data.rows);
                if(this.data.pcdyCode == '') {
                    this.setData({
                        pcdyCode : this.data.pcdyOptions[0].children[0].children[0].value,
                        pcdyNote:this.data.pcdyOptions[0].label+'>'+ this.data.pcdyOptions[0].children[0].label+'>'+this.data.pcdyOptions[0].children[0].children[0].label
                    })
                    this.getCategories();
                }
            }
        });
    },
    buildTree(data){
        let tree01 = this.buildTreeByAttribute(data, "XZQHWZ");
        for (let i = 0; i < tree01.length; i++) {
            const item = tree01[i];
            let tree02 = this.buildTreeByAttribute(item.children, "DLMC");
            for (let ii = 0; ii < tree02.length; ii++) {
                const iitem = tree02[ii];
                let tree03 = this.buildTreeByAttribute(iitem.children, "PCDYBH");
                for (let iii = 0; iii < tree03.length; iii++) {
                    const iiitem = tree03[iii];
                    const ele = iiitem.children[0];
                    tree03[iii].label = ele.QDMC + '-' + ele.ZDMC + '[' +ele.PCDYBH + ']';
                    delete tree03[iii].children;
                }
                tree02[ii].children = tree03;
            }
            tree01[i].children = tree02;
        }
        this.setData({
            pcdyOptions: tree01
        })
    },
    buildTreeByAttribute(data, attr) {
        const treeMap = {};
        const treeData = [];
        for (let i in data) {
            let item = data[i];
            if (treeMap[item[attr]]) {
                treeMap[item[attr]].children.push(item)
            }else {
                treeMap[item[attr]] = {
                    label: item[attr],
                    value: item[attr],
                    children: [item]
                }
            }
        }
        for (let key in treeMap) {
            treeData.push(treeMap[key])
        }
        return treeData;
    },
    getCategories() {
        this.setData({
            sideBarIndex : Object.keys(this.data.typeCodeMap).indexOf(this.data.ztType)
        });
        
        wx.request({
            url: getApp().globalData.API_BASE + '/system/'+this.data.ztType+'Zt/list',
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
                    loading: false,
                });
            }
        })
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        if(options) {
            this.setData({
                ztType: options.ztType || 'jtrx',
                pcdyCode: options.pcdyCode || '',
                pcdyNote:options.pcdyNote || '',
            });
        }
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {
    },
    // 生命周期函数--监听页面显示
    onShow: function () {
        if(this.data.pcdyCode != '') {
            this.getCategories();
        }else {
            this.getPcdyOptions();
        }
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

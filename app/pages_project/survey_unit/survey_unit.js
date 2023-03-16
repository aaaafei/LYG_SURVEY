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
        let type_code = this.data.categories[this.data.sideBarIndex].code
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
            pcdyNote: selectedOptions.map((item) => item.label).join('/'),
        });
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
                });
                console.log(res.data.areaList[0]);
                this.getCategories("");
            }
        })
    },
    getCategories(param) {
        wx.request({
            url: 'https://easydoc.net/mock/u/58236996/categories',
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                this.setData({
                    categories: res.data.categories,
                });
            }
        })
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        if(options && options.pcdyCode) {
            this.getCategories(options.pcdyCode);
        }else {
            this.getPcdyOptions("");
        }
    },
});

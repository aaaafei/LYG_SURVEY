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
        categories: [{
                label: '给水',
                code: 'GXJS_ZT',
                title: '给水-总体信息',
                badgeProps: {},
                items: [{
                        label: "给水_设施位置_设施名称001",
                        image
                    },
                    {
                        label: "给水_设施位置_设施名称002",
                        image
                    },
                    {
                        label: "给水_设施位置_设施名称003",
                        image
                    },
                ],
            },
            {
                label: '再生水',
                code: 'GXJS_ZT',
                title: '再生水-总体信息',
                badgeProps: {
                    dot: true,
                },
                items: items.slice(0, 10),
            },
            {
                label: '雨水',
                code: 'GXJS_ZT',
                title: '雨水-总体信息',
                badgeProps: {},
                items: items.slice(0, 6),
            },
            {
                label: '污水',
                code: 'GXJS_ZT',
                title: '污水-总体信息',
                badgeProps: {
                    count: 8,
                },
                items: items.slice(0, 8),
            },
        ],
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
});

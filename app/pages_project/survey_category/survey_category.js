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
                label: '管线',
                code: 'GXJS_GX',
                title: '给水-管线信息',
                badgeProps: {},
                items: [{
                        label: "给水_管线设施位置_设施名称001",
                        image
                    },
                    {
                        label: "给水_管线设施位置_设施名称002",
                        image
                    },
                ],
            },
            {
                label: '管点',
                code: 'GXJS_GD',
                title: '给水-管点信息',
                badgeProps: {
                    dot: true,
                },
                items: items.slice(0, 10),
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
    onSectionNew(e) {
        let type_code = this.data.categories[this.data.sideBarIndex].code
        console.log(type_code);
        wx.navigateTo({
            url: `../section/section?type_code=` + type_code,
        });
    },
});

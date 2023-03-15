import gulpError from './utils/gulpError';
App({
    onShow() {
        if (gulpError !== 'gulpErrorPlaceHolder') {
            wx.redirectTo({
                url: `/pages/gulp-error/index?gulpError=${gulpError}`,
            });
        }
    },
    globalData: {
        isConnected: true,
        API_BASE: 'https://jsuss.cn/api/',
        // API_BASE:'https://cn-cd-dx-7.natfrp.cloud:17700/',
    }
});

//# sourceMappingURL=app.js.map

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
        // API_BASE: 'https://jsuss.cn/api/',
        API_BASE:'http://10.60.7.222',
    }
});

//# sourceMappingURL=app.js.map

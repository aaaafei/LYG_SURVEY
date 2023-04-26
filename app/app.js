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
        API_BASE: 'http://118.195.216.138:8088/lygpipeline/',
        // API_BASE:'http://10.60.7.222/',
    }
});

//# sourceMappingURL=app.js.map

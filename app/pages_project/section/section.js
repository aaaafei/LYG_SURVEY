// pages_project/category/category.js
Page({
    /**
     * 初始数据
     */
    data: {
        formFields: [],
        // 时间配置
        mode: '',
        monthVisible: false,
        dateVisible: false,
        month: '2000-10',
        date: '2000-01-01',
        start: '1949-10-01 00:00:00',
        end: '2025-01-01 00:00:00',
        currentDateField: '',
        currentDateValue: '',
        // 骨架屏
        loading: true,
        // 列表选项配置
        listVisible: false,
        currentListPickerField: '',
        currentListItemValue: '',
        currentListOptions: [],
    },

    /**
     * 方法列表
     */
    // 日期选择相关 start
    showPicker(e) {
        const {
            fieldCode,
            mode
        } = e.currentTarget.dataset;
        this.setData({
            mode,
            [`${mode}Visible`]: true,
            currentDateField: fieldCode
        });
    },
    hidePicker() {
        const {
            mode
        } = this.data;
        this.setData({
            [`${mode}Visible`]: false,
        });
    },
    onConfirm(e) {
        const {
            value
        } = e.detail;
        const {
            mode
        } = this.data;
        for (let i in this.data.formFields) {
            if (this.data.formFields[i].code == this.data.currentDateField) {
                this.data.formFields[i]['value'] = value;
                break;
            }
        }
        this.setData({
            [mode]: value,
            formFields: this.data.formFields,
        });
        this.hidePicker();
    },
    onColumnChange(e) {
        console.log('pick', e.detail.value);
    },
    // 日期选择相关 end
    // 列表项目选择相关 start
    onPickerConfirm(e) {
        const {
            label,value
        } = e.detail;
        const {
            mode
        } = this.data;
        for (let i in this.data.formFields) {
            if (this.data.formFields[i].code == this.data.currentListPickerField) {
                this.data.formFields[i]['value'] = value[0];
                this.data.formFields[i]['label'] = label[0];
                break;
            }
        }
        this.setData({
            [mode]: value,
            formFields: this.data.formFields,
        });
        this.hidePicker();
    },
    onPickerCancel(e) {
        const { mode } = e.currentTarget.dataset;
        console.log(e, '取消');
        console.log('picker1 cancel:');
        this.setData({
            [`${mode}Visible`]: false,
        });
    },
    onListPicker(e) {
        const {
            fieldCode,
            mode
        } = e.currentTarget.dataset;
        this.data.currentListOptions = this.getItemFromFormFieldsByCode(fieldCode).options;
        this.setData({
            mode,
            [`${mode}Visible`]: true,
            currentListPickerField: fieldCode,
            currentListOptions: this.data.currentListOptions 
        });
    },

    // 列表项目选择相关 end
    // 输入框Input 变化
    handleInputChange(e) {
        let value = e.detail.value;
        let id = e.target.id;
        let fieldCode = e.target.dataset.fieldCode;
        for (let i in this.data.formFields) {
            if (this.data.formFields[i].code == fieldCode) {
                this.data.formFields[i]['value'] = value;
                break;
            }
        }
        this.setData({
            formFields: this.data.formFields,
        });
    },
    //
    handleFloatInputChange(e) {
        let value = e.detail.value;
        let id = e.target.id;
        let fieldCode = e.target.dataset.fieldCode;
        const isNumber = /^\d+(\.)?(\d+)?$/.test(e.detail.value);
        if(!isNumber) {
            wx.showToast({
              title: '请输入正确的数字',
            });
            value = '';
        }
        for (let i in this.data.formFields) {
            if (this.data.formFields[i].code == fieldCode) {
                this.data.formFields[i]['value'] = value;
                break;
            }
        }
        this.setData({
            formFields: this.data.formFields,
        });
    },
    //
    save() {
        for (let i in this.data.formFields) {
            let item = this.data.formFields[i];
            console.log(item.name, ": ", item.value);
        }
    },
    submit() {

    },
    getFormFields(param) {
        let _this = this;
        wx.request({
            url: 'https://easydoc.net/mock/u/58236996/'+param,
            method: 'GET',
            data: {
            },
            header: {
              'content-type': 'application/json'
            },
            success: (res) => { 
                console.log(res.data.formFields);
                _this.data.loading = false;
                _this.data.formFields = res.data.formFields;
                _this.setData({
                    formFields: res.data.formFields,
                    loading: _this.data.loading,
                });
            }
          });
    },
    getItemFromFormFieldsByCode(code) {
        for (let i in this.data.formFields) {
            if (this.data.formFields[i].code == code) {
                return this.data.formFields[i];
            }
        }
    },

    /**
     * 方法列表 END
     */
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        console.log(options);
        this.getFormFields("GXJS_GX");
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
})
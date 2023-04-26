// pages_project/category/category_edit.js
Page({
    /**
     * 初始数据
     */
    data: {
        formFields: [],
        formData:{},
        id:'',
        ztType:'',
        pcdyCode:'',
        pageMode: '',
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
         // dialog
         confirmBtn: { content: '知道了', variant: 'base' },
         showTextAndTitle: false,
         dialogContent: ''
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
    save() {
        let form = {};
        for (let i in this.data.formFields) {
            let item = this.data.formFields[i];
            form[item.code] = item.value;
        }
        form['ID'] = this.data.id;
        wx.request({
            url: getApp().globalData.API_BASE + '/system/'+this.data.ztType+'Zt/edit',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': wx.getStorageSync("sessionid")
            },
            data: form,
            success : (res) => {
                wx.showToast({
                    title: res.data.msg,
                    duration: 2000
                });
                setTimeout((e)=>{
                    wx.navigateBack({
                        delta: 1
                    });
                },2000);
            }
        });
    },
    submit() {
        if(this.validateForm()) {
            this.save();
        };
    },
    validateForm(){
        for (let i in this.data.formFields) {
            let item = this.data.formFields[i];
            if (!item.required) continue;
            if (item.value != undefined) continue;
            this.setData({
                showTextAndTitle: true,
                dialogContent: item.name + ' 为必填项，请完善后再提交',
            });
            return false;
        }
        return true;
    },
    closeDialog() {
        this.setData({
            showTextAndTitle: false
        });
    },
    getFormFields() {
        let _this = this;
        wx.request({
            url: 'https://easydoc.net/mock/u/58236996/'+this.data.ztType.toUpperCase() + '_ZT',
            method: 'GET',
            data: {
            },
            header: {
              'content-type': 'application/json',
              'cookie': wx.getStorageSync("sessionid")
            },
            success: (res) => { 
                this.data.loading = false;
                this.data.formFields = res.data.formFields;
                this.setData({
                    formFields: res.data.formFields,
                    // loading: _this.data.loading,
                });
                //
                this.getFormData();
            }
          });
    },
    getFormData() {
        let _this = this;
        wx.request({
            url: getApp().globalData.API_BASE + '/system/'+this.data.ztType+'Zt/getEntityById/' + this.data.id,
            method: 'GET',
            data: {
            },
            header: {
              'content-type': 'application/json',
              'cookie': wx.getStorageSync("sessionid")
            },
            success: (res) => { 
                for(let i in this.data.formFields) {
                    let code = this.data.formFields[i].code;
                    this.data.formFields[i].value = res.data[code];
                }
                this.setData({
                    formFields:  this.data.formFields,
                    loading: false,
                });
            }
          });
    },

    /**
     * 方法列表 END
     */
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        console.log(options);
        this.setData({
            ztType: options.ztType,
            id: options.id,
            pageMode: options.pageMode || ''
        })
        this.getFormFields();
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

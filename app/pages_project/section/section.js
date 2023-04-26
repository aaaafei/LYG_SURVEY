// pages_project/category/category.js
Page({
    /**
     * 初始数据
     */
    data: {
        formFields: [],
        ztType: '',
        cateType: '',
        glbsm: '',
        listOptionsData: [],
        hasListOptionsData: true,
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
        this.validateForm();
        let form = {};
        for (let i in this.data.formFields) {
            let item = this.data.formFields[i];
            form[item.code] = item.value;
        }
        wx.request({
            url: getApp().globalData.API_BASE + '/system/'+this.data.ztType + this.data.cateType+'/add',
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

    },
    async getFormFields() {
        let _this = this;
        await new Promise((resolve, reject) => {
            wx.request({
                url: getApp().globalData.API_BASE + '/system/tableFieldInfo/tableSelectField/' + this.data.ztType.toUpperCase() + '_' + this.data.cateType.toUpperCase(),
                method: 'GET',
                header: {
                  'content-type': 'application/json',
                  'cookie': wx.getStorageSync("sessionid")
                },
                success: (res) => { 
                    if(res.data.code == 0) {
                        this.setData({
                            listOptionsData: res.data.data
                        });
                        resolve(res.data)
                    }else{
                        this.setData({
                            hasListOptionsData: false
                        })
                        resolve(res)
                    }
                    
                },
                fail: (err) => {
                    reject(err);
                }
            });
        }) 
        wx.request({
            url: 'https://easydoc.net/mock/u/58236996/' + this.data.ztType.toUpperCase() + '_' + this.data.cateType.toUpperCase(),
            method: 'GET',
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                this.data.loading = false;
                let ff = res.data.formFields;
                ff = this.setValueByCode(ff, 'GLBSM', this.data.glbsm);
                if (this.data.hasListOptionsData) {
                    // 设施列表选项
                    for (let i in ff) {
                        if (ff[i].data_type != 'list') continue;
                        let key = ff[i].code;
                        let _options = this.data.listOptionsData[key];
                        let arr = [];
                        for (let ii in _options) {
                            let oo = {
                                label: _options[ii].dictLabel,
                                value: _options[ii].dictValue
                            };
                            arr.push(oo);
                        }
                        ff[i]['options'] = arr;
                    }
                    // 设施列表选项 END
                }
                this.setData({
                    formFields: ff,
                    loading: this.data.loading,
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
    setValueByCode(jsonArray,code,value){
        for(let i in jsonArray) {
            if (jsonArray[i].code == code) {
                jsonArray[i].value = value;
                return jsonArray;
            }
        }
    },
    generateUUID(){
        let d = new Date().getTime(); // 时间戳
        // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    validateForm(){
        for (let i in this.data.formFields) {
            let item = this.data.formFields[i];
            if (!item.required) continue;
            if (item.value) continue;
            this.setData({
                showTextAndTitle: true,
                dialogContent: item.name + ' 为必填项，请完善后再提交',
            });
            break;
        }
    },
    closeDialog() {
        this.setData({
            showTextAndTitle: false
        });
    },

    /**
     * 方法列表 END
     */
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        if (!options) {options.type_code = 'GXJS_GX'}
        console.log(options);
        this.setData({
            ztType: options.ztType,
            cateType: options.cateType,
            glbsm: options.glbsm
        });
        this.getFormFields();
        // this.getListOptions();
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

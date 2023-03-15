//index.js
//获取应用实例
// var Base64  = require('js-base64')
const app = getApp()


Page({
  data: { 
    currentIndex: 0,
    userName:null,
    pwd:null,
    switchChecked:false
  }, 
  onLoad: function () { 
    var _this = this;
    if(wx.getStorageSync("userName")!=undefined && wx.getStorageSync("userName")!=null && wx.getStorageSync("userName")!='' &&
    wx.getStorageSync("pwd")!=undefined && wx.getStorageSync("pwd")!=null && wx.getStorageSync("pwd")!=''){ 
      _this.setData({
        userName: wx.getStorageSync("userName"),
        pwd: wx.getStorageSync("pwd"),
        switchChecked: true
      })
    }
  
  },
  getUserInfo: function(e) { 
    var _this = this;
    wx.getUserProfile({
      desc:'用于登录安全系统',
      success:(res) => {
        let nickName = res.userInfo.nickName; 
        wx.request({
          url: getApp().globalData.API_BASE+`/user/auth/login4Wx`,
          method: 'POST',
          data: {
            wx_nickname:  nickName
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) { 
            var roles = res.data.result_data.roles;
            var roleNames =  new Array();
            roles.forEach(element => {
              roleNames.push(element.name);
            });
            wx.setStorageSync('token', 'JSTI '+res.data.result_data.token);
            wx.setStorageSync('roles',roleNames.join(','));
            wx.setStorageSync('organid',res.data.result_data.organid);
            wx.setStorageSync('truename', res.data.result_data.truename);  
            
            wx.switchTab({
              url: '../workdesk/workdesk'
            });
          },
          complete: function(res) {
            wx.switchTab({
                url: '../workdesk/workdesk'
              });
          }
        })

      }
    });

    
     
  },   
  login : function(e) { 
    var _this = this; 
    if( _this.data.userName == null ||  _this.data.userName == '' || _this.data.pwd == null || _this.data.pwd==''){
      wx.showToast({
        title: "用户名或密码不能为空！",
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: getApp().globalData.API_BASE+`/user/auth/login`,
      method: 'POST',
      data: {
        'username':  _this.data.userName, 
        'password': _this.data.pwd,
        'encrypt':1,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) { 
        let code = res.data.result_code;  
        var checkedValue = _this.data.switchChecked;
        if (code === 0) {
          var roles = res.data.result_data.roles;
          var roleNames =  new Array();
          roles.forEach(element => {
            roleNames.push(element.name);
          });
          //缓存用户名和密码
          if (checkedValue == true) {
            wx.setStorageSync("userName",_this.data.userName);
            wx.setStorageSync("pwd",_this.data.pwd);
          } else if (checkedValue == false) {
            wx.removeStorageSync("userName");
            wx.removeStorageSync("pwd");
          } 
          wx.setStorageSync('token', 'JSTI '+res.data.result_data.token);  
          wx.setStorageSync('roles',roleNames.join(','));
          wx.setStorageSync('organid',res.data.result_data.organid);
          wx.setStorageSync('truename', res.data.result_data.truename);  
          wx.switchTab({
            url: '../workdesk/workdesk'
          });
      } 
      else {
        wx.showToast({
          title: "用户名密码错误！",
          icon: 'none'
        }); 
        
      }


      

      }
    })

    
     
  },   
  noLogin:function(){
    wx.switchTab({
      url: '../workdesk/workdesk'
    });
  },  
  //用户点击tab时调用
  titleClick: function (e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
  bindUserNameInput: function (e) {   
    this.setData({
      userName:e.detail.value
    }) 
  },  
  bindPWDInput: function (e) {  
    this.setData({
      pwd:e.detail.value
    }) 
  },
  switchChange(e) {
    var checkedValue = e.detail.value;
    var _this = this;
    if (checkedValue == true){
      _this.setData({
        switchChecked:true
      })
    } else if (checkedValue == false) {
      _this.setData({
        switchChecked: false
      }) 
    }
  }

})

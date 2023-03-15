const APP = getApp()
// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {
  wx.setNavigationBarTitle({ 
    title: '安全生产管理'
  })
}

Page({
  data: {  
    listData:[] 
  },
  loadData:function(){
      var _this = this;
      //安全信息报送
      wx.request({
        url: getApp().globalData.API_BASE+`/mobile/riskinfo/getLatestRiskinfo/5`,
        method: 'POST',
        data: {check_status: "2"},
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync("token")
        },
        success: function (res) {  
          if(res.data.status==403){
            
              wx.showToast({
                title: '未登录或登录失效，请重新登录！',
                icon: 'none',
                duration: 3000
              });
            
          }
          else{
            if(res.data.result_data!=null) {
              var _news = new Array();
              for(var i=0;i<res.data.result_data.length;i++){
                var tmp = {};
                if(res.data.result_data[i].submit_time!=null && res.data.result_data[i].title!=null)  {
                  if(res.data.result_data[i].title.length>30)
                    tmp["title"] = "[" +res.data.result_data[i].submit_time.substr(5,5) + "]" + res.data.result_data[i].title.substr(0,30)+"..." ;
                  else
                    tmp["title"] = "[" +res.data.result_data[i].submit_time.substr(5,5) + "]" + res.data.result_data[i].title ;
                }
                if(res.data.result_data[i].content!=null)  {
                  var content = res.data.result_data[i].content;  
                  content = content.replace(/<div.*?div>/g,'');
                  content = content.replace(/<br.*?>/g,'');
                  content = content.replace(/&nbsp;/g,''); 
                  content = content.split(' ').join(''); 
                  if(content.length>90)
                    tmp["content"] = content.substr(0,90)+"...";
                  else
                    tmp["content"] = content;
                }
                tmp['uuid'] = res.data.result_data[i].uuid;
                _news.push(tmp);
              }
      
              _this.setData({ 
                listData: _news
              });
  
            }
          } 
        },
        fail: function (res) { 
          
        }
      });
  },     
  onLoad: function(e) {
    wx.showShareMenu({
      withShareTicket: true
    })    
    const that = this 
    that.loadData()  
  },   
  onShow: function(e){
  
  },
  scan: function() {
     wx.scanCode({
       success: (res) => {
         let qrcode = res.result;
         console.log("qrcode："+qrcode);
         let url = "../scanPatrol/index?qrcode=" + qrcode;
         if (qrcode) {
           wx.navigateTo({
             url: url
           });
         }
       },
       fail: (res) => {
         console.log(res);
       }
     })
  },
  goHome:function(){
    wx.redirectTo({
      url: '../login/login'
    });
  }
})
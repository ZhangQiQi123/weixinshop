//app.js
App({
  onLaunch: function () {
    wx.login({
      success:function(res){
        
        //res.code是变化的，每次获取值都不一样，过期时间7200ms
        //获取openid 
        //openid:每一个用户在指定的小程序里面是唯一的
        wx.request({
          url: 'http://pay.apiying.com/api/getOpenid', //仅为示例，并非真实的接口地址
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data);

            //保存opnenid

            wx.setStorageSync('openid', res.data.result.openid);
          }
        })

      }
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})

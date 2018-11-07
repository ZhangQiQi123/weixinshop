// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productHeight:180,
    isShowMore:false,
    cartList:[],
    totalPrice: 0//总价
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageInfoSync("cartList")) {
      var cartList = JSON.parse(wx.getStorageSync("cartList"));
      this.setData({
        cartList:cartList
      },() =>{
        this.computedPriceNum()
      });
      ;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showMore(){
    if (!this.data.isShowMore){
      //展开

      this.setData({
        productHeight: this.data.productHeight * this.data.cartList.length,
        isShowMore: true,
      });
    }else{
      //合起来
      this.setData({
        productHeight: 180,
        isShowMore: false,
      });
    }
  },
  //计算总价
  computedPriceNum() {
    var that = this;
    var cartList = that.data.cartList;
    var allPrice = 0;//总价
    for (var i = 0; i < cartList.length; i++) {
      allPrice += parseFloat(cartList[i].price * cartList[i].num);
    }
    that.setData({
      totalPrice:allPrice
    });
  },
  doPay(){
    var that=this;
    var openid=wx.getStorageSync("openid");
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://pay.apiying.com/api/doOrder', //仅为示例，并非真实的接口地址
      method:'POST',
      data: {
        openid:openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
       wx.hideLoading();
       if(res.data.success){

       }else{
         wx.showLoading({
           title: '提交订单异常，请求重试...',
         })
       }
      }
    })
    // wx.requestPayment({
    //   timeStamp: '',
    //   nonceStr: '',
    //   package: '',
    //   signType: 'MD5',
    //   paySign: '',
    //   success (res) { },
    //   fail (res) { }
    // })
  }
})
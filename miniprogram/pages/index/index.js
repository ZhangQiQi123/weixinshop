//index.js
const app = getApp()
var util=require("../../utils/util.js");

Page({
  data: {
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539857856014&di=53a85894536b79ca4529599ec0b65699&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F17%2F88%2F38%2F55a4209bf0c12.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539857856016&di=ca6794eb13d8c3a3a4157e1cf67015a0&imgtype=0&src=http%3A%2F%2Fimg.jiuzheng.com%2Fpic%2Fs%2F53%2Fc6%2F53c6ec6d1522da7f2b0198d3.jpg'
    ],
    indicatorDots: true,//是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 5000, //自动切换时间间隔
    duration: 1000  //滑动动画时长

  },

  onLoad: function() {
   
  },
  doQcode(){
    var that=this;
    wx.scanCode({
      onlyFromCamera:false,//只允许从相机扫码得到数据
      scanType: ['barCode', 'qrCode', 'datamatrix','pdf417'],
      success(res){
        console.log(res);
        that.getProductInfo(res.result);
      },
      fail(){},
      complete(){}
    });
  },
  getProductInfo(qcode){
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    console.log(qcode);
    var that=this;
    wx.request({
      url: util.apiUrl+'api/getProduct?qcode='+qcode, //仅为示例，并非真实的接口地址
      method:"get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //加载中隐藏
        wx.hideLoading();
        console.log("成功");
        console.log(res.data);
        if (res.data.result.length == 0){
          wx.showToast({
            title:"暂无此商品！",
            image:"../../images/warnning.png",
            duration:3000
          });
        }else{
          console.log(res.data.result[0]);
          util.addCart(res.data.result[0]);
          wx.navigateTo({
            url: '../cart/cart',
          })
        }
      },
      fail() {
        console.log("出错");
       },
      complete(e) {
        console.log(e);
        console.log("完成");
       }
    })
  }
  
})

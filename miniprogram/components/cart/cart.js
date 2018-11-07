var util = require("../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    totalPrice: 0,//总价
    totalNum: 0,//商品总数量
    hasData: false,//判断购物车是否有数据
    cartList: []
  },
  //组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
  ready(optioons){
    console.log("+++++++++++++++++++");
    if (wx.getStorageInfoSync("cartList")) {
      var cartList = JSON.parse(wx.getStorageSync("cartList"));
      console.log(cartList);
      this.setData({
        cartList: cartList,
        hasData: true
      });
      this.computedPriceNum();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //数量减少
    decCart(e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      var cartList = that.data.cartList;
      //获取当前索引值的数量
      var num = cartList[index].num;

      if (num == 1) {
        //删除操作 push:数组尾部增加 shift：数组头部增加 pop：数组尾部删除 shift：数组头部删除 splice：数组下标增删改
        wx.showModal({
          title: '提示',
          content: '您确定要删除此商品？',
          success(res) {
            if (res.confirm) {
              var list = cartList.splice(index, 1);//从下标为：index的地方删除，删除一个
              that.setData({
                cartList: cartList
              });
              //更新 storage里面购物车的数据
              wx.setStorageSync('cartList', JSON.stringify(cartList));
              //计算总价及总数量
              that.computedPriceNum();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        cartList[index].num = num - 1;
        that.setData({
          cartList: cartList
        });
        //更新 storage里面购物车的数据
        wx.setStorageSync('cartList', JSON.stringify(cartList));
        //计算总价及总数量
        that.computedPriceNum();
      }

    },
    //数量增加
    addCart(e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      var cartList = that.data.cartList;
      var num = cartList[index].num;
      cartList[index].num = num + 1;
      that.setData({
        cartList: cartList
      });
      //更新 storage里面购物车的数据
      wx.setStorageSync('cartList', JSON.stringify(cartList));
      //计算总价及总数量
      this.computedPriceNum();
    },
    //计算总价和总数量
    computedPriceNum() {
      var that = this;
      var cartList = that.data.cartList;
      var allPrice = 0;//总价
      var allNum = 0;//总数量
      for (var i = 0; i < cartList.length; i++) {
        allPrice += parseFloat(cartList[i].price * cartList[i].num);
        allNum += parseFloat(cartList[i].num);
      }
      if (allNum > 0) {
        that.setData({
          totalPrice: allPrice,
          totalNum: allNum,
          hasData: true
        });
      } else {
        that.setData({
          totalPrice: allPrice,
          totalNum: allNum,
          hasData: false
        });
      }
    },
    doQcode() {
      var that = this;
      wx.scanCode({
        onlyFromCamera: false,//只允许从相机扫码得到数据
        scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
        success(res) {
          console.log(res);
          that.getProductInfo(res.result);
        },
        fail() { },
        complete() { }
      });
    },
    getProductInfo(qcode) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      console.log(qcode);
      var that = this;
      wx.request({
        url: util.apiUrl + 'api/getProduct?qcode=' + qcode, //仅为示例，并非真实的接口地址
        method: "get",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          //加载中隐藏
          wx.hideLoading();
          console.log("成功");
          console.log(res.data);
          if (res.data.result.length == 0) {
            wx.showToast({
              title: "暂无此商品！",
              image: "../../images/warnning.png",
              duration: 3000
            });
          } else {
            console.log(res.data.result[0]);
            util.addCart(res.data.result[0]);
            //获取添加到购物车的数据，更新数量和总价
            var cartList = JSON.parse(wx.getStorageSync('cartList'));

            //改变页面的数据//调用计算总价和总数量的方法，setData是异步方法
            that.setData({
              cartList: cartList
            }, function () {
              that.computedPriceNum();
            });


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
    },
    //去结算
    goOrder() {
      wx.navigateTo({
        url: '../order/order'
      })
    }
  }
})

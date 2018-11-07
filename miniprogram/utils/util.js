var app={
  apiUrl:"http://weixin.itying.com/",
  addCart(qCodeData){
   
    /**购物车中的数据存放有两种：1.storage（未登录，换了浏览器就浏览不了加入购物车的数据）;2.数据库（已登录，可换浏览器查看加入购物车的数据） */
    //判断storage中是否有数据
    //1.如果没有数据，直接放入storage

    //2.如果有数据，判断是否有当前的数据
    //2.1如果没有当前的数据，就把当前的数据和购物车中的数据进行拼接
    //2.2如果有当前的数据，就循环遍历购物车中的数据，和当前的数据作比较进行购物车数量+1
    var cartArray = []
    var cartList = wx.getStorageSync('cartList');
    if (cartList) {
      var cartArray = JSON.parse(cartList);
      if (this.cartHasData(cartArray, qCodeData)) {
        for (var i = 0; i < cartArray.length; i++) {
          if (cartArray[i]._id == qCodeData._id) {
            cartArray[i].num = cartArray[i].num + 1;
          }
        }
        wx.setStorageSync('cartList', JSON.stringify(cartArray));
      } else {
        //把购物车的数据和当前数据做拼接
        qCodeData.num = 1;
        var cartArray = JSON.parse(cartList);
        cartArray.push(qCodeData);
        wx.setStorageSync('cartList', JSON.stringify(cartArray));
      }
    } else {//没有
      qCodeData.num = 1;
      cartArray.push(qCodeData);
      wx.setStorageSync('cartList', JSON.stringify(cartArray));
    }
  },

  cartHasData(cartList, qCodeData) {
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i]._id == qCodeData._id) {
        return true;
      }
    }
    return false;
  }

}
module.exports=app;
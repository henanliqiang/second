/**
 * 我的中心
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#mywin-frm',
    data: {
        shopUserInfodata: {},
        balancewallet: {},
        balanceintegral: {},
        // 预约信息
        ShopAndServicedata: {},
        mybattrytxt: '正在使用',
        batteryjson: {},
        userPhone: '',
        // 二维码数量
        codeNumber: []
    },
    methods: {
        //初始化
        init: function() {
            vm.getshopUserInfo();
            vm.getShopAndService();
            // 获取用户电话号码
            vm.getuserPhone();
        },
        //获取
        getshopUserInfo: function() {
            // 天牛币
            apps.axget(
                "integral/balance", {},
                function(data) {
                    vm.balanceintegral = data;
                });
            apps.axget(
                "wallet/balance", {},
                function(data) {
                    vm.balancewallet = data;
                });
            // 用户信息
            apps.axget(
                "customer/selectInfo", {},
                function(data) {
                    vm.shopUserInfodata = data;
                });
        },
        // 获取预约等信息
        getShopAndService: function() {
            apps.axget(
                "renew/batteryInfo", {},
                function(data) {
                    vm.ShopAndServicedata = data;
                    vm.batteryjson.name = vm.ShopAndServicedata.batteryname;
                    vm.batteryjson.groupnum = vm.ShopAndServicedata.groupnum;
                    // 是否交了押金
                    // isdeposit:"是否已缴纳押金 0：否 1：是",
                    // isinstall:"是否可安装电池 0：否 1：是",
                    // isabnormal:"电池是否损坏 0：否 1：是 "
                    if (vm.ShopAndServicedata.isdeposit === 0 && vm.ShopAndServicedata.isabnormal === 0) {
                        // 没押金 强制跳转押金页面
                        vm.mybattrytxt = '请缴纳押金';
                    }
                    if (vm.ShopAndServicedata.isdeposit === 1) {
                        // 电池状态（已支付押金，未完成安装时）
                        if (vm.ShopAndServicedata.isinstall === 1) {
                            vm.mybattrytxt = '请预约安装电池';
                        } else {
                            // 损坏
                            if (vm.ShopAndServicedata.isabnormal === 1) {
                                vm.mybattrytxt = '电池已损坏';
                            } else {
                                vm.mybattrytxt = '正在使用';
                                // 逾期
                                if (vm.ShopAndServicedata.isoverdue === 1) {
                                    vm.mybattrytxt = '已逾期';
                                }
                            }
                        }
                    }
                });

        },
        getmybatteryBtn: function() {
            // 是否交了押金
            // isdeposit:"是否已缴纳押金 0：否 1：是",
            // isinstall:"是否可安装电池 0：否 1：是",
            // isabnormal:"电池是否损坏 0：否 1：是 "
            if (vm.ShopAndServicedata.isdeposit === 0 && vm.ShopAndServicedata.isabnormal === 0) {
                // 没押金 强制跳转押金页面
                jumpUrl.welcome_nobatteries();
            }
            if (vm.ShopAndServicedata.isdeposit === 1) {
                // 电池状态（已支付押金，未完成安装时）
                if (vm.ShopAndServicedata.isinstall === 1) {
                    jumpUrl.welcome_havebatteries({ batteryjson: vm.batteryjson });
                } else {
                    // 损坏
                    if (vm.ShopAndServicedata.isabnormal === 1) {
                        vm.mybattrytxt = '电池已损坏';
                    } else {
                        // 预约完成 使用中- 可以退租
                        jumpUrl.mybatteries({ ShopAndServicedata: vm.ShopAndServicedata });
                    }
                }
            }
        },
        getuserPhone: function() {
            apps.axget(
              "recharge/selectiPhone", {},
              function(data) {
                  if (data) {
                      vm.userPhone = '';
                      vm.userPhone = data;
                      if (vm.userPhone && data) {
                          vm.makeCodeqrcode();
                      }
                  }
              });
        },
        // 生成二维码程序
        makeCodeqrcode: function() {
              // var codes = 'http://downloadpkg.apicloud.com/app/download?path=http://7z1c8k.com1.z0.glb.clouddn.com/66fc570a362c9dec80f3814eac9a6e3d_d'; // 二维码内容

              // var codes = 'http://tianniu.weidinghuo.com/staffManager/userRegister?iPhone=' + vm.userPhone; // 二维码内容
              // 生成二维码程序
              // $('#qrcodes').html('');
              // console.log($('#qrcodes').html(''));
              // var qrcode = new QRCode(document.getElementById("qrcodes"), {
              //     width: 90, // 设置宽高
              //     height: 90,
              //     background: '#ffffff',
              //     foreground: '#62b701'
              // });
              // var codes = "http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=" + vm.userPhone; // 二维码内容
              // qrcode.makeCode(codes);

              $('#qrcodes').html('');
              $('#qrcodes').qrcode({
      	         render: "canvas",
                // text  : "http://192.168.0.107:8088/users/userRegister?iPhone=" + vm.userPhone, // 二维码内容
                 text  : "http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=" + vm.userPhone, // 二维码内容
                 width : 90,               //二维码的宽度
                 height : 90,              //二维码的高度
                 background : "#ffffff",       //二维码的后景色
                 foreground : "#62b701",        //二维码的前景色
              });
              // 生成大图二维码
              // $('#qrcodeBigs').html('');
              // var qrcodeBig = new QRCode(document.getElementById("qrcodeBigs"), {
              //     width: 300, //设置宽高
              //     height: 300,
              //     background: '#ffffff',
              //     foreground: '#62b701'
              // });
              // var identcode = "http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=" + vm.userPhone; // 二维码内容
              // qrcodeBig.makeCode(identcode);

              $('#qrcodeBigs').html('');
              $('#qrcodeBigs').qrcode({
      	         render: "table",
                // text  : "http://192.168.0.107:8088/users/userRegister?iPhone=" + vm.userPhone, // 二维码内容
                 text  : "http://120.26.161.225:8082/tianniu-web/users/userRegister?iPhone=" + vm.userPhone, // 二维码内容
                 width : 300,               //二维码的宽度
                 height : 300,              //二维码的高度
                 background : "#ffffff",       //二维码的后景色
                 foreground : "#62b701",        //二维码的前景色
              });
        },
        qrcodebigImgs: function() {
            // 二维码大图
            apps.openMapWinUrl('openqrcode_img', 'battery/appointinfo/openqrcode_img.html', { qrcodebigImg: $('#qrcodeBigs').html() });
        },
        //客服热线
        callphone: function() {
          api.call({
              type: 'tel_prompt',
              number: '400-862-5918'
          });
        }
    }
});

var timeoutEvent = 0;
// 开始按
function touchstart() {
    // alert("touchstart事件");
    // 清楚定时器
    clearTimeout(timeoutEvent);
    // 设置定时器，定义长按1000毫秒触发长按时间，
    timeoutEvent = setTimeout("longpress()",800);
    return false;
    // vm.qrcodebigImgs();
}
// 手释放，如果在1000毫秒内释放，则取消长按事件，此时执行单击事件
function touchend() {
    // 清楚定时器
    clearTimeout(timeoutEvent);
    if (timeoutEvent != 0) {
      // 执行单击事件
      // alert("点击事件");
      vm.qrcodebigImgs();
    }
}
// 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
function touchmove() {
  // 清楚定时器
  clearTimeout(timeoutEvent);
  timeoutEvent = 0;
}
// 长按事件
function longpress() {
  timeoutEvent = 0;
  //执行长按事件
  // alert("触发长按事件");
  openUIMultiSelector();
}


apiready = function() {
    // 实现沉浸式效果
    $api.fixStatusBar($api.dom("header"));
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.init();

    api.addEventListener({
        name: 'loginsucesspst'
    }, function(ret) {
        vm.init();
    });
};


function openUIMultiSelector (){

  UIMultiSelector = api.require('UIMultiSelector');
  UIMultiSelector.open({
     rect: {
         h: api.winHeight / 3
     },
     text: {
         title: '选择执行的操作',
         leftBtn: '取消',
         rightBtn: '完成'
     },
     max: 1,
     singleSelection: true,
     maskClose: false,
     singleSelection: true,
     styles: {
         mask: 'rgba(0,0,0,0.8)',
         title: {
             bg: 'rgb(221,221,221)',
             color: 'rgb(0,0,0)',
             size: 16,
             h: 44
         },
         leftButton: {
            bg: '#fff',
             w: 80,
             h: 35,
             marginT: 5,
             marginL: 8,
             color: 'rgb(0,0,0)',
             size: 14
         },
         rightButton: {
              bg: '#fff',
             w: 80,
             h: 35,
             marginT: 5,
             marginR: 8,
             color: 'rgb(0,0,0)',
             size: 14
         },
         item: {
             h: 35,
             bg: 'rgb(255,255,255)',
             bgActive: 'rgb(221,221,221)',
             bgHighlight: 'rgb(221,221,221)',
             color: 'rgb(0,0,0)',
             active: '#ff7010',
             highlight: 'rgb(43,213,166)',
             size: 14,
             lineColor: 'rgb(0,0,0)',
             textAlign: 'center'
         },
         icon: {
             w: 20,
             h: 20,
             marginT: 11,
             marginH: 8,
             bg: '#fff',
             bgActive: '#ff7010',
             align: 'left'
         }
     },
     animation: true,
     items : [{
         text: '保存图片',
         status: 'normal'
     }, {
         text: '分享朋友圈',
         status: 'normal'
     }]
  }, function(ret, err) {
     if (ret) {
         //点击完成按钮
         if (ret.eventType == "clickRight") {
           if (ret.items[0].text == "保存图片") {
              // 执行保存图片
              api.saveMediaToAlbum({
                path: 'fs://Screenshots/tnusers.png'
              }, function(ret, err) {
                if (ret && ret.status) {
                  alert(ret.status);
                  alert('保存成功');
                } else {
                  alert(ret.status);
                  alert('保存失败');
              }
            });
          }
           if (ret.items[0].text == "分享朋友圈") {
              // 执行分享朋友圈
              var wx = api.require('wx');
              // 检测系统是否安装微信客户端
              wx.isInstalled(function(ret, err) {
                if (ret.installed) {
                  // 通过调用系统图库，获取图片文件
                  var imageUrl = 0;
                  api.getPicture({
                    sourceType: 'library',  // 图片库
                    encodingType: 'png',
                    mediaValue: 'pic',
                    destinationType: 'url',
                    allowEdit: false,
                    targetWidth: 100,
                    targetHeight: 100,
                    saveToPhotoAlbum: false
                  }, function(ret, err) {
                    if (ret) {
                      // alert(JSON.stringify(ret));
                      // alert(JSON.stringify(ret.data));
                      imageUrl = ret.data;
                    } else {
                      alert(JSON.stringify(err));
                    }
                  });

                  //分享图片
                  wx.shareImage({
                    apiKey: 'wxdde7835e5a03853e',
                    scene: 'timeline',
                    // thumb: 'widget://res/users.png',
                    thumb: imageUrl,
                    // contentUrl: 'widget://res/users.png',
                    contentUrl: 'fs://Screenshots/tnusers.png'
                  }, function(ret, err) {
                    if (ret.status) {

                    } else {
                      alert("微信分享失败");
                    }
                });
                } else {
                  alert('您的手机上没有安装微信，所以不支持分享内容到朋友圈。');
                }
            });
           }
           fnClose();
         }

         //点击取消按钮
         if (ret.eventType == "clickLeft") {
            fnClose();
         }
     }
  });
}

// 关闭选择器（从内存清除）
function fnClose() {
    UIMultiSelector.close();
};

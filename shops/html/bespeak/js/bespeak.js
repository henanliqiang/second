/**
 * 签约合同
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#bespeakshops-frm',
    data: {
        //救援订单数据
        rescueOrder_data: {
            rescueOrderList: []
        },
        noOrder: 0,
        batteryselect: {
          //服务类型
          types: [],
          batteryList: [],
          platbond: 0,
        },
        agreeTxtSta: 1,
        daystatistics: {},
        selOneNotice: {},
        selectRescueArr: [],  //  救援
    },
    methods: {
        //初始化
        init: function() {
            var storeSetdata = $api.getStorage("storeSetdata");
            // 是否上线店铺
            // isonline:"是否上线 0：否 1：是 2：初始添加"
            if (storeSetdata) {
                if (storeSetdata.isonline === 1) {
                    // 跳转首页
                    api.sendEvent({
                        name: 'indexinit'
                    });
                    setTimeout(function() {
                        api.closeToWin({
                            name: 'root'
                        });
                    }, 300);
                    vm.getdaystatistics();
                } else {
                    // 如果没店铺信息 跳转到注册
                    // auditstatus:"审核状态 0：初始添加 1：审核不通过 2：审核通过"
                    jumpUrl.join();
                }
            } else {
                jumpUrl.login();
            }
            vm.getbatterySelect();

            var timer;
            var timerArr = [];
            timer = setInterval(function() {
              apps.axget(
                  "rescue/selectRescue", {
                    pageNo: vm.pageNo,
                    pageSize: vm.pageSize
                  },
                  function(data) {
                      vm.rescueOrder_data.rescueOrderList.splice(0,vm.rescueOrder_data.rescueOrderList.length);
                      vm.rescueOrder_data.rescueOrderList = data;
                      // alert(JSON.stringify(data));
                      if (vm.rescueOrder_data.rescueOrderList.length) {
                        if (vm.rescueOrder_data.rescueOrderList[0].paystate == 1 && vm.rescueOrder_data.rescueOrderList[0].istakestate == 1) {
                            // 时间转换时间戳
                            var now = Date.parse(new Date());
                            var rescueTime = Date.parse(vm.rescueOrder_data.rescueOrderList[0].addtime);
                            var nowDay = now / 86400000;
                            var rescueDay = rescueTime / 86400000;
                            if (nowDay - rescueDay < 1) {
                              for (var i = 0; i < timerArr.length; i++) {
                                  clearInterval(timerArr[i]);
                              }
                              alert("用户支付了救援订单。");
                            }else {
                                for (var i = 0; i < timerArr.length; i++) {
                                    clearInterval(timerArr[i]);
                                }
                            }
                        }
                        for (var i = 0; i < vm.rescueOrder_data.rescueOrderList.length; i++) {
                            if (vm.rescueOrder_data.rescueOrderList[i].paystate == 0 && vm.rescueOrder_data.rescueOrderList[i].istakestate == 2) {
                                for (var i = 0; i < timerArr.length; i++) {
                                    clearInterval(timerArr[i]);
                                }
                                alert("你有一个新的订单，请在“我的”-“救援订单”选择“接单”或者“撤销订单”。");
                            }
                        }
                      }
                  });
            },20000);
            timerArr.push(timer);
        },
        //获取电池
        getbatterySelect: function() {
            apps.axget(
                "shopBattery/select", {},
                function(data) {
                    if (data) {
                      vm.batteryselect.batteryList = data.battery;
                      vm.batteryselect.types = data.types;
                      if (vm.batteryselect.types.length >= 1) {
                        // 有预约服务
                        vm.noOrder = 1;
                      }else {
                        //没有
                        vm.noOrder = 0;
                      }
                    }
                });
        },
        // 输入验证码
        identcodeBtn: function() {
            api.prompt({
                title: '请输入订单验证码',
                text: '',
                buttons: ['确定', '取消']
            }, function(ret, err) {
                var index = ret.buttonIndex;
                var text = ret.text;
                if (index == 1) {
                    // 查询信息，是否跳入详情
                    vm.fisdServiceInfo(text);
                }
            });
        },
        fisdServiceInfo: function(identcode) {
            // 预约服务详情
            apps.axget(
                "shopBatteryService/selectServiceInfo", {
                    identcode: identcode
                },
                function(data) {
                    // 预约服务详情
                    jumpUrl.servicedetail({ identcode: identcode });
                },
                // 错误信息
                function(code, message) {
                    api.alert({
                        title: '提示信息',
                        msg: message,
                    });
                });
        },
        // 打开二维码事件
        openFNScannerBtn: function() {
            var FNScanner = api.require('FNScanner');
            // 二维码扫码开关
            $api.addEvt($api.byId("openFNScannerBtn"), 'click', function() {
                FNScanner.openScanner({
                    autorotation: true
                }, function(ret, err) {
                    if (ret) {
                        var eventType = ret.eventType;
                        if (ret.eventType == 'success') {
                            // 查询信息，是否跳入详情
                            vm.fisdServiceInfo(ret.content);
                        }
                        if (ret.eventType == 'fail') {
                            api.toast({
                                msg: "扫描失败，请稍后重试",
                                location: 'middle'
                            });
                        }
                        if (ret.eventType == 'cancel') {
                            api.toast({
                                msg: "您已取消扫码",
                                location: 'middle'
                            });
                        }
                    } else {
                        api.toast({
                            msg: err.msg,
                            location: 'middle'
                        });
                    }
                });
            });
        },

        getdaystatistics: function() {
            // 今日预约
            apps.axget(
                "shopBatteryService/statistics", {},
                function(data) {
                    vm.daystatistics = data;
                });
            // 公告一条
            apps.axget(
                "platformNotice/selectOneNotice", {},
                function(data) {
                    vm.selOneNotice = data;
                });
            // 救援
            apps.axget(
                "rescue/selectRescue", {},
                function(data) {
                    vm.selectRescueArr= data.datas;
                });

        }
    }
});
apiready = function() {
    // 实现沉浸式效果
    $api.fixStatusBar($api.dom("header"));
    vm.init();
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.openFNScannerBtn();
    api.addEventListener({
        name: 'loginsucesspst'
    }, function(ret) {
        vm.init();
    });
    api.addEventListener({
        name: 'shopBatteryServicesucesspst'
    }, function(ret) {
        vm.init();
    });
}

/**
 * 签约合同
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#accept',
    data: {
        //救援订单数据
        rescueOrder_data: {
          rescueOrderList: []
        },
        agreeTxtSta: 1,
        daystatistics: {},
        selOneNotice: {},
        selectRescueArr: [],  //  救援
        //订单状态   订单状态 0：待维修 1：已维修  2：已撤销
        orderstate: 1,
        //订单生效 0：网点撤销订单   1：网点接受订单 2：等待网点操作
        istakestate: 2,
        cellphone: '',
        moredatatxt:'',
        pageSize: 5,
        pageNo: 1,
        totalPage: 0, // 总页数
    },
    methods: {
        //初始化
        init: function() {
            vm.istakestate = api.pageParam.istakestate;
            vm.cellphone = api.pageParam.cellphone;
            if (vm.istakestate) {
                alert("您接受了用户的救援订单，请尽快跟用户联系，赶到救援地点完成救援任务。");
                jumpUrl.myuser();
            }else {
                alert("您成功撤销了用户的救援订单。");
                jumpUrl.myuser();
            }
            // var storeSetdata = $api.getStorage("storeSetdata");
            // vm.getdaystatistics();
        },

        // // 获取  救援订单 列表
        // getdaystatistics: function(status) {
        //     apps.axget(
        //         "rescue/selectRescue", {
        //           pageNo: vm.pageNo,
        //           pageSize: vm.pageSize,
        //         },
        //         function(data) {
        //             vm.rescueOrder_data.rescueOrderList = data;
        //             // if (data.totalPage <= 1 || vm.pageNo == data.totalPage) {
        //             //     vm.moredatatxt = "暂无更多记录";
        //             // } else {
        //             //     vm.moredatatxt = "上滑获取更多记录";
        //             // }
        //             // if (vm.pageNo == 1) {
        //             //     vm.rescueOrder_data.rescueOrderList = [];
        //             //     data.datas.forEach(function(item) {
        //             //         if (item) {
        //             //             // 预约中的时候-倒计时
        //             //             if (item.state == 0) {
        //             //
        //             //             }
        //             //             vm.rescueOrder_data.rescueOrderList.push(item);
        //             //         }
        //             //     });
        //             //     vm.totalPage = data.totalPage; //总页数
        //             // } else {
        //             //     //第二页
        //             //     //如果存在数据并且当前的页面小于等于总页码时push
        //             //     if (data.datas.length && vm.pageNo <= data.totalPage) {
        //             //         data.datas.forEach(function(item) {
        //             //             // 预约中的时候-倒计时
        //             //             if (item.state == 0) {
        //             //
        //             //             }
        //             //             vm.rescueOrder_data.rescueOrderList.push(item);
        //             //         });
        //             //     }
        //             // }
        //             //     vm.pageNo++;
        //         });
        // },
        // 电话
        settelsBtn: function(item) {
            // 拨打电话
                    api.call({
                        type: 'tel_prompt',
                        number: item
                    });
        },
        // //接受订单
        // takeOrder: function(item){
        //   apps.axpost(
        //     "/rescue/takeRescue", {
        //         rescueid: item.rescueid,
        //         customerid: item.customerid
        //     },
        //     function(data){
        //         if (data) {
        //             alert(data.msg.split('"') + "请尽快联系救援用户，完成订单任务");
        //         }
        //     });
        //     vm.init();
        // },
        // //撤销订单
        // refuseOrder: function(item){
        //   apps.axpost(
        //     "/rescue/revokeRescue", {
        //       rescueid: item.rescueid,
        //       customerid: item.customerid
        //     },
        //     function(data){
        //         if (data) {
        //             alert(data.msg.split('"'));
        //         }
        //     });
        //     vm.init();
        // }
    }
});
apiready = function() {
    // 实现沉浸式效果
    $api.fixStatusBar($api.dom("header"));
    vm.init();
    api.parseTapmode();
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    // //上拉加载
    // api.addEventListener({
    //     name: 'scrolltobottom',
    //     extra: {
    //         threshold: 0     //设置距离底部多少距离时触发，默认值为0，数字类型
    //     }
    // }, function(ret, err) {
    //     // if (vm.pageNo < vm.totalPage) {
    //         vm.getdaystatistics();
    //     // }
    // });
}

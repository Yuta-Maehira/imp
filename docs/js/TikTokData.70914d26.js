(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["TikTokData"],{7290:function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"sns-data"},[e("div",{staticClass:"sns-box"},[e("div",[e("div",{staticClass:"title tiktok"},[t._v("アカウントID")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTikTok.accountId?t.accountData.myTikTok.accountId:"-"))])]),e("div",[e("div",{staticClass:"title tiktok"},[t._v("フォロワー数")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTikTok.followerCount?t.accountData.myTikTok.followerCount:"-"))])])]),e("div",{staticClass:"sns-box"},[e("div",[e("div",{staticClass:"title tiktok"},[t._v("アカウント名")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTikTok.accountName?t.accountData.myTikTok.accountName:"-"))])]),e("div",[e("div",{staticClass:"title tiktok"},[t._v("平均いいね数")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTikTok.goodAverage?t.accountData.myTikTok.goodAverage:"-"))])])]),e("div",{staticClass:"sns-box"},[e("div",[e("div",{staticClass:"title tiktok"},[t._v("アカウントジャンル")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTikTok.accountType?t.accountData.myTikTok.accountType:"-"))])]),e("div",[e("div",{staticClass:"title tiktok"},[t._v("エンゲージメント率")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTikTok.engagement?t.accountData.myTikTok.engagement:"-"))])])])])},c=[],i=(e("96cf"),e("1da1")),s=e("4ee7"),o={data:function(){return{roll:localStorage.roll,accountData:{}}},props:["accountId"],created:function(){var t=this,a=s["a"].firestore().collection("account"),e=function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,a.where("accountId","==",t.accountId).get();case 2:n=e.sent,t.accountData=n.docs[0].data();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),n=function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var n,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=s["a"].auth().currentUser.uid,e.next=3,a.where("userId","==",n).get();case 3:c=e.sent,t.accountData=c.docs[0].data();case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),c=function(){var a=Object(i["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if("client"!==t.roll&&"admin"!==t.roll){a.next=5;break}return a.next=3,e();case 3:a.next=8;break;case 5:if("cast"!==t.roll){a.next=8;break}return a.next=8,n();case 8:case"end":return a.stop()}}),a)})));return function(){return a.apply(this,arguments)}}();c()}},r=o,u=e("2877"),l=Object(u["a"])(r,n,c,!1,null,null,null);a["default"]=l.exports}}]);
//# sourceMappingURL=TikTokData.70914d26.js.map
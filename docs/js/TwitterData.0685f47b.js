(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["TwitterData"],{b7f0:function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"sns-data"},[e("div",{staticClass:"sns-box"},[e("div",[e("div",{staticClass:"title twitter"},[t._v("アカウントID")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTwitter.accountId?t.accountData.myTwitter.accountId:"-"))])]),e("div",[e("div",{staticClass:"title twitter"},[t._v("フォロワー数")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTwitter.followerCount?t.accountData.myTwitter.followerCount:"-"))])])]),e("div",{staticClass:"sns-box"},[e("div",[e("div",{staticClass:"title twitter"},[t._v("アカウント名")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTwitter.accountName?t.accountData.myTwitter.accountName:"-"))])]),e("div",[e("div",{staticClass:"title twitter"},[t._v("平均いいね数")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTwitter.goodAverage?t.accountData.myTwitter.goodAverage:"-"))])])]),e("div",{staticClass:"sns-box"},[e("div",[e("div",{staticClass:"title twitter"},[t._v("アカウントジャンル")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTwitter.accountType?t.accountData.myTwitter.accountType:"-"))])]),e("div",[e("div",{staticClass:"title twitter"},[t._v("エンゲージメント率")]),e("div",{staticClass:"value"},[t._v(t._s(t.accountData.myTwitter.engagement?t.accountData.myTwitter.engagement:"-"))])])])])},c=[],r=(e("96cf"),e("1da1")),i=e("4ee7"),s={data:function(){return{roll:localStorage.roll,accountData:{}}},props:["accountId"],created:function(){var t=this,a=i["a"].firestore().collection("account"),e=function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,a.where("accountId","==",t.accountId).get();case 2:n=e.sent,t.accountData=n.docs[0].data();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),n=function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(){var n,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=i["a"].auth().currentUser.uid,e.next=3,a.where("userId","==",n).get();case 3:c=e.sent,t.accountData=c.docs[0].data();case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),c=function(){var a=Object(r["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if("client"!==t.roll&&"admin"!==t.roll){a.next=5;break}return a.next=3,e();case 3:a.next=8;break;case 5:if("cast"!==t.roll){a.next=8;break}return a.next=8,n();case 8:case"end":return a.stop()}}),a)})));return function(){return a.apply(this,arguments)}}();c()}},u=s,o=e("2877"),l=Object(o["a"])(u,n,c,!1,null,null,null);a["default"]=l.exports}}]);
//# sourceMappingURL=TwitterData.0685f47b.js.map
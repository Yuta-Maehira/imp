(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["InstagramDataConfirm"],{"9ace":function(a,t,s){"use strict";s.r(t);var e=function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("div",{staticClass:"sns-data"},[s("div",{staticClass:"sns-box"},[s("div",[s("div",{staticClass:"title instagram"},[a._v("アカウントID")]),s("div",{staticClass:"value"},[a._v(a._s(a.accountId?a.accountId:"-"))])]),s("div",[s("div",{staticClass:"title instagram"},[a._v("フォロワー数")]),s("div",{staticClass:"value"},[a._v(a._s(a.followerCount?a.followerCount:"-"))])])]),s("div",{staticClass:"sns-box"},[s("div",[s("div",{staticClass:"title instagram"},[a._v("アカウント名")]),s("div",{staticClass:"value"},[a._v(a._s(a.accountName?a.accountName:"-"))])]),s("div",[s("div",{staticClass:"title instagram"},[a._v("平均いいね数")]),s("div",{staticClass:"value"},[a._v(a._s(a.goodAverage?a.goodAverage:"-"))])])]),s("div",{staticClass:"sns-box"},[s("div",[s("div",{staticClass:"title instagram"},[a._v("アカウントジャンル")]),s("div",{staticClass:"value"},[a._v(a._s(a.accountType?a.accountType:"-"))])]),s("div",[s("div",{staticClass:"title instagram"},[a._v("エンゲージメント率")]),s("div",{staticClass:"value"},[a._v(a._s(a.engagement?a.engagement:"-"))])])])])},i=[],n={data:function(){return{roll:localStorage.roll,accountId:"",accountName:"",accountType:"",followerCount:"",goodAverage:"",engagement:""}},computed:{snsData:function(){return this.$store.state.snsData}},created:function(){this.accountId=localStorage.instagramId,this.accountName=localStorage.instagramName,this.accountType=localStorage.instagramType,this.followerCount=localStorage.instagramFollower,this.goodAverage=localStorage.instagramAverage,this.engagement=localStorage.instagramEngage}},o=n,l=s("2877"),c=Object(l["a"])(o,e,i,!1,null,null,null);t["default"]=c.exports}}]);
//# sourceMappingURL=InstagramDataConfirm.801f1ad3.js.map
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Contact"],{b8fa:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Header"),n("div",{staticClass:"container"},[n("SideBar"),n("main",[n("section",{staticClass:"contact-section"},[n("h2",[t._v("コンタクト")]),n("paginate",{staticClass:"paginate",attrs:{name:"paginate-log",list:t.logs,per:10}},t._l(t.paginated("paginate-log"),(function(e,r){return n("article",{key:r,staticClass:"campaign-box"},[n("router-link",{staticClass:"campaign-link-box",attrs:{to:"/contact/cast/"+e.campaignid+"?uid="+e.uid,tag:"div"}},[n("div",{staticClass:"img-box"},[e.imgurl?n("img",{attrs:{src:e.imgurl,alt:"キャンペーンの画像"}}):n("img",{attrs:{src:a("5ec8"),alt:"キャンペーンの画像"}})]),n("div",{staticClass:"campaign-info"},[n("h3",{staticClass:"campaign-title"},[t._v(t._s(t.titleLimit(e.title)))]),n("p",{staticClass:"campaign-description"},[t._v(t._s(t.descreptionLimit(e.description)))]),n("div",{staticClass:"campaign-under-box"},[n("div",{staticClass:"sns-icon"},[n("span",{class:{active:e.instagram}},[n("i",{staticClass:"fab fa-instagram"})]),n("span",{class:{active:e.twitter}},[n("i",{staticClass:"fab fa-twitter active"})]),n("span",{class:{active:e.youtube}},[n("i",{staticClass:"fab fa-youtube"})]),n("span",{class:{active:e.tiktok}},[n("i",{staticClass:"fab fa-tiktok"})])]),n("p",{staticClass:"campaign-price"},[t._v(t._s(e.price)),n("span",[t._v("円")])])])])])],1)})),0)],1),n("paginate-links",{attrs:{for:"paginate-log",limit:3,classes:{ul:"pagination",li:"pagination-list","li > a":"pagination-link"},"show-step-links":!0}})],1)],1)],1)},r=[],i=(a("4160"),a("3ca3"),a("159b"),a("ddb0"),a("53ca")),s=(a("96cf"),a("1da1")),c=a("0418"),u=a("7c08"),o=a("4ee7"),l={components:{Header:c["a"],SideBar:u["a"]},data:function(){return{roll:localStorage.roll,logs:[],paginate:["paginate-log"]}},created:function(){var t=this,e=o["a"].auth().currentUser.uid,a=o["a"].firestore().collection("campaigns"),n=function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(){var e,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=[],t.next=3,a.where("contact","==",!0).get();case 3:return n=t.sent,n.forEach((function(t){e.push(t.id)})),t.abrupt("return",e);case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),r=function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(e){var n,r,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:n=[],r=regeneratorRuntime.mark((function t(r){var i,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return i=[],t.next=3,a.doc(e[r]).collection("applys").where("status","==",!0).get();case 3:s=t.sent,s.forEach((function(t){i.push(t.data())})),n.push(i);case 6:case"end":return t.stop()}}),t)})),i=0;case 3:if(!(i<e.length)){t.next=8;break}return t.delegateYield(r(i),"t0",5);case 5:i++,t.next=3;break;case 8:return t.abrupt("return",n);case 9:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),c=function(){var n=Object(s["a"])(regeneratorRuntime.mark((function n(r){var i,s,c,u,o,l,p;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:i=[],s=0;case 2:if(!(s<r.length)){n.next=23;break}if(0===r[s].length){n.next=20;break}if(c=r[s][0].campaignId,u=r[s][0].uid,"admin"!==t.roll){n.next=10;break}i.push(c),n.next=20;break;case 10:if("client"!==t.roll){n.next=19;break}return n.next=13,a.where("campaignid","==",c).get();case 13:o=n.sent,l=o.docs[0].data(),p=l.uid,p===e&&i.push(l.campaignid),n.next=20;break;case 19:"cast"===t.roll&&u===e&&i.push(c);case 20:s++,n.next=2;break;case 23:return n.abrupt("return",i);case 24:case"end":return n.stop()}}),n)})));return function(t){return n.apply(this,arguments)}}(),u=function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(e){var n,r,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:n=[],r=0;case 2:if(!(r<e.length)){t.next=10;break}return t.next=5,a.where("campaignid","==",e[r]).get();case 5:i=t.sent,n.push(i.docs[0].data());case 7:r++,t.next=2;break;case 10:return t.abrupt("return",n);case 11:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),l=function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(e){var a,n,r,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:a=[],n=0;case 2:if(!(n<e.length)){t.next=23;break}if(""===e[n].imgpath){t.next=19;break}if(r=e[n].imgpath,s="","object"!==Object(i["a"])(r)){t.next=12;break}return t.next=9,o["a"].storage().ref().child(r[0]).getDownloadURL();case 9:s=t.sent,t.next=15;break;case 12:return t.next=14,o["a"].storage().ref().child(r).getDownloadURL();case 14:s=t.sent;case 15:e[n].imgurl=s,a.push(e[n]),t.next=20;break;case 19:a.push(e[n]);case 20:n++,t.next=2;break;case 23:return console.log(a),t.abrupt("return",a);case 25:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),p=function(e){e.sort((function(t,e){return t.date>e.date?-1:t.date<e.date?1:0})),t.logs=e},g=function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(){var e,a,i,s,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,n();case 2:return e=t.sent,t.next=5,r(e);case 5:return a=t.sent,t.next=8,c(a);case 8:return i=t.sent,t.next=11,u(i);case 11:return s=t.sent,t.next=14,l(s);case 14:return o=t.sent,t.next=17,p(o);case 17:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();g()},methods:{titleLimit:function(t){var e=window.screen.width,a=18;return e>=1025&&e<=1299?a=10:e>=1300&&(a=13),t.length>a?t.substr(0,a)+"...":t},descreptionLimit:function(t){var e=window.screen.width,a=35;return e>=1025&&e<=1299?a=12:e>=1300&&(a=18),t.length>a?t.substr(0,a)+"...":t},logsSort:function(){this.logs.sort((function(t,e){return t.campaignid>e.campaignid?-1:t.campaignid<e.campaignid?1:0}))}}},p=l,g=a("2877"),d=Object(g["a"])(p,n,r,!1,null,null,null);e["default"]=d.exports}}]);
//# sourceMappingURL=Contact.7998c06c.js.map
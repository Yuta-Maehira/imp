import Vue from 'vue'
import Vuex from 'vuex'
import router from './router';
import firebase from './firebase'   

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    uid: "",
    roll: "",
    email: "",
    password: "",
    uniqueNumber: 1,

    // campaignのstate
    campaignTitle: "",
    campaignDescription: "",
    instagram: false,
    twitter: false,
    youtube: false,
    tiktok: false,
    price: "",
    campaignImg: [],

    // profileのstate
    profileData: {},
    // image: {},
    // client: "",
    // staff: "",
    // adress1: "",
    // adress2: "",
    // apartment: "",
    // tell: "",
    // name: "",
    // nickName: "",
    // bank: "",
    // branch: "",
    // accountNum: "",
    snsData: {},
    // myInstagram: {
    //   accountId: "",
    //   accountName: "",
    //   accountType: "",
    //   followerCount: "",
    //   goodAverage: "",
    //   engagement: ""
    // },
    // myTwitter: {
    //   accountId: "",
    //   accountName: "",
    //   accountType: "",
    //   followerCount: "",
    //   goodAverage: "",
    //   engagement: ""
    // },
    // myYouTube: {
    //   accountId: "",
    //   accountName: "",
    //   accountType: "",
    //   followerCount: "",
    //   goodAverage: "",
    //   engagement: ""
    // },
    // myTikTok: {
    //   accountId: "",
    //   accountName: "",
    //   accountType: "",
    //   followerCount: "",
    //   goodAverage: "",
    //   engagement: ""
    // },

    // notificationのstate
    notificationTitle: "",
    notificationDescription: "",
    detination: ""
  },
  mutations: {
    createAccountUpdateIdToken(state, value) {
      const uid = firebase.auth().currentUser.uid
      const db = firebase.firestore()
      const accountDb = db.collection('account')
      const newCampaignRef = accountDb.doc();
      state.idToken = value.idToken;
      state.uid = uid;
      state.email = value.email;
      state.password = value.password;
      state.roll = value.roll;
      db.runTransaction(transaction => {
        transaction.get(newCampaignRef).then(() => {
          accountDb.orderBy("createData", "desc").limit(1).get().then(response => {
            if(response) {
              Promise.all(response.docs.map(campaignDoc => {
                const campaign = campaignDoc.data();
                state.uniqueNumber = Number(campaign.accountId) + 1;
              }))
            }
            if(value.roll === 'client') {
              accountDb.doc(state.email).set({
                accountId: String(state.uniqueNumber),
                userId: uid,
                createData: new Date(),
                email: state.email,
                password: state.password,
                idToken: state.idToken,
                roll: state.roll,
                imgpath: "",
                imgurl: "",
                client: "",
                staff: "",
                adress1: "",
                adress2: "",
                apartment: "",
                tell: "",
                specialPercent: '未選択',
                campaignPercent: '未選択',
                specialEditDate: null,
                campaignEditDate: null
              }).then(() => {
                router.push('/client/dashboard');
              })
            } else if(value.roll === 'cast') {
              accountDb.doc(state.email).set({
                accountId: String(state.uniqueNumber),
                userId: uid,
                createData: new Date(),
                email: state.email,
                password: state.password,
                idToken: state.idToken,
                roll: state.roll,
                imgpath: "",
                imgurl: "",
                name: "",
                nickName: "",
                adress1: "",
                adress2: "",
                apartment: "",
                tell: "",
                bank: "",
                branch: "",
                accountNum: "",
                myInstagram: {
                  accountId: "",
                  accountName: "",
                  accountType: "",
                  followerCount: "",
                  goodAverage: "",
                  engagement: "",
                },
                myTwitter: {
                  accountId: "",
                  accountName: "",
                  accountType: "",
                  followerCount: "",
                  goodAverage: "",
                  engagement: "",
                },
                myYouTube: {
                  accountId: "",
                  accountName: "",
                  accountType: "",
                  followerCount: "",
                  goodAverage: "",
                  engagement: "",
                },
                myTikTok: {
                  accountId: "",
                  accountName: "",
                  accountType: "",
                  followerCount: "",
                  goodAverage: "",
                  engagement: "",
                },
              })
              .then(() => {
                router.push('/cast/dashboard');
              })
            }
          })
        })
      })
    },
    LoginUpdateIdToken(state, value) {
      const accountDb = firebase.firestore().collection('account')
      state.idToken = value.idToken;
      state.uid = value.uid;
      state.email = value.email;
      accountDb.doc(state.email).get().then(response => {
        localStorage.roll = response.data().roll
        state.roll = response.data().roll
        accountDb.doc(state.email).update({
          idToken: state.idToken,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          // ログイン後にダッシュボードに遷移
          router.push('/dashboard')
        })
      })
    },
    campaignDataMove(state, value) {
      state.campaignTitle = value.campaignTitle;
      state.campaignDescription = value.campaignDescription;
      state.instagram = value.instagram;
      state.twitter = value.twitter;
      state.youtube = value.youtube;
      state.tiktok = value.tiktok;
      state.price = value.price;
      state.campaignImg = value.img;
      // router.push('/campaign/confirm');
      if(state.roll === "admin") {
        router.push('/campaign/confirm');
      } else if(state.roll === "client") {
        router.push('/campaign/confirm');
      } else if(state.roll === "cast") {
        router.push('/castcampaignlist/castnewcampaign/confirm');
      }
    },
    notificationDataMove(state,value) {
      state.notificationTitle = value.notificationTitle;
      state.notificationDescription = value.notificationDescription;
      state.destination = value.destination;
      router.push('/notification/confirm');
    },
    myPageBasicDataMove(state, value) {
      state.profileData = value;
      // state.image = value.image;
      // state.client = value.client;
      // state.staff = value.staff;    
      // state.name = value.name;
      // state.nickName = value.nickName;
      // state.adress1 = value.adress1;
      // state.adress2 = value.adress2;
      // state.apartment = value.apartment;
      // state.tell = value.tell;
      // state.bank = value.bank;
      // state.branch = value.branch;
      // state.accountNum = value.accountNum;
      if(state.roll === 'admin' || state.roll === 'client') {
        router.push('/mypage/confirm')
      }
    },
    
    myPageSnsDataMove(state, value) {
      state.snsData = value;
      // state.myInstagram.accountId = value.instagramAccountId;
      // state.myInstagram.accountName = value.instagramAccountName;
      // state.myInstagram.accountType = value.instagramAccountType;
      // state.myInstagram.followerCount = value.instagramFollowerCount;
      // state.myInstagram.goodAverage = value.instagramGoodAverage;
      // state.myInstagram.engagement = value.instagramEngagement;
      // state.myTwitter.accountId = value.twitterAccountId;
      // state.myTwitter.accountName = value.twitterAccountName;
      // state.myTwitter.accountType = value.twitterAccountType;
      // state.myTwitter.followerCount = value.twitterFollowerCount;
      // state.myTwitter.goodAverage = value.twitterGoodAverage;
      // state.myTwitter.engagement = value.twitterEngagement;
      // state.myYouTube.accountId = value.youtubeAccountId;
      // state.myYouTube.accountName = value.youtubeAccountName;
      // state.myYouTube.accountType = value.youtubeAccountType;
      // state.myYouTube.followerCount = value.youtubeFollowerCount;
      // state.myYouTube.goodAverage = value.youtubeGoodAverage;
      // state.myYouTube.engagement = value.youtubeEngagement;
      // state.myTikTok.accountId = value.tiktokAccountId;
      // state.myTikTok.accountName = value.tiktokAccountName;
      // state.myTikTok.accountType = value.tiktokAccountType;
      // state.myTikTok.followerCount = value.tiktokFollowerCount;
      // state.myTikTok.goodAverage = value.tiktokGoodAverage;
      // state.myTikTok.engagement = value.tiktokEngagement;
      router.push('/mypage/confirm/1')
    },

    logOutAccount(state) {
      state.idToken = null,
      state.uid = "",
      state.email = "",
      state.password = "",
      router.push('/login')
    }
  },
  actions: {
    autoLogin({ commit }){
      const auth = firebase.auth()
      const idToken = localStorage.getItem('idToken');
      if(!idToken) return;
      const now = new Date()
      const expiryTime = localStorage.getItem('expiryTime')
      const uid = localStorage.getItem('uid')
      const email = localStorage.getItem('email')
      const password = localStorage.getItem('password')
      if(now.getTime() >= expiryTime) {
        auth.signInWithEmailAndPassword(email, password).then(() => {
          auth.currentUser.getIdToken(true).then(response => {
            localStorage.setItem('idToken',response)
            commit('LoginUpdateIdToken', {
              idToken: response,
              uid: uid,
              email: email
            })
          })
        })
      } else {
        commit('LoginUpdateIdToken', {
          idToken: idToken,
          uid: uid,
          email: email
        });
      }
    },
    createAccount({ commit }, authData) {
      const auth = firebase.auth()
      const now = new Date()
      const expiryTime = now.getTime() + (3600 * 1000)
      auth.createUserWithEmailAndPassword(
        authData.email,
        authData.password,
        ).then(() => {
        const uid = firebase.auth().currentUser.uid
        auth.currentUser.getIdToken(true).then(response => {
          localStorage.setItem('idToken',response)
          localStorage.setItem('expiryTime',expiryTime)
          localStorage.setItem('uid',uid)
          localStorage.setItem('email',authData.email)
          localStorage.setItem('password',authData.password)
          commit('createAccountUpdateIdToken', {
            email: authData.email,
            password: authData.password,
            idToken: response,
            roll: authData.roll
          });
        })
      })
    },
    loginAccount({ commit }, authData) {
      const auth = firebase.auth()
      const now = new Date()
      const expiryTime = now.getTime() + (3600 * 1000)
      auth.signInWithEmailAndPassword(
        authData.email,
        authData.password,
        ).then(() => {
        const uid = firebase.auth().currentUser.uid
        auth.currentUser.getIdToken(true).then(response => {
          localStorage.setItem('idToken',response)
          localStorage.setItem('expiryTime',expiryTime)
          localStorage.setItem('uid',uid)
          localStorage.setItem('email',authData.email)
          localStorage.setItem('password',authData.password)
          commit('LoginUpdateIdToken', {
            idToken: response,
            uid: uid,
            email: authData.email
          });
        })
      })
    }
  },
  // modules: {
  // }
})

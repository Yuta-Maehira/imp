<template>
  <header>
    
    <!-- サイトのロゴ画像 -->
    <router-link to="/dashboard" class="site-logo-img">
      <img src="../assets/image/site_logo.jpg" alt="サイトのロゴ画像">
    </router-link>

    <div class="header-right-box">
      <router-link to="/notification" class="header-notification-box" tag="div">
        <i class="fas fa-bell"></i>
        <div v-if="unreadNotification" class="header-notification-circle"></div>
      </router-link>

      <!-- メニューボタンのプロフィール画像表示 -->
      <img  @click="changeIsActive" v-if="imgurl" :src="imgurl" alt="アカウント画像">
      <img  @click="changeIsActive" v-else src="@/assets/image/top_account_image.jpg" alt="アカウント画像">
    </div>

    <!-- メニュー一覧 -->
    <ul :class="[{'header-account-menu-active': isActive}, 'header-account-menu']">
      <li><router-link to="/mypage/1">マイアカウント</router-link></li>
      <li v-if="roll === 'admin'"><router-link to="/discount/edit">割引設定</router-link></li>
      <li @click="logOutAccount">ログアウト</li>
    </ul>

  </header>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data() {
    return {
      roll: '',
      isActive: true,
      imgurl: '',
      unreadNotification: false
    }
  },
  created() {
    this.roll = localStorage.roll;
    const uid = firebase.auth().currentUser.uid;
    const accountDb = firebase.firestore().collection('account');
    
    // (2) 自分のアカウントデータを取得
    const getAccount = async () => {
      const myAccount = await accountDb.where('userId', '==', uid).get();
      const myData = myAccount.docs[0].data();
      return myData;
    }

    // (3) 通知の未読/既読をチェック
    const notificationCheck = async (myData) => {
      const notifications = myData.notification;
      Object.keys(notifications).forEach(notification => {
        if(!notifications[notification]) {
          this.unreadNotification = true;
        }
      })
    }

    // (4) 画像のパスがあればURLを取得
    const getImgUrl = async (myData) => {
      if(myData.imgpath !== '') {
        const imgpath = myData.imgpath;
        const imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
        this.imgurl = imgurl;
      }
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const myData = await getAccount();
      if(this.roll === 'client' || this.roll === 'cast') {
        await notificationCheck(myData)
      }
      await getImgUrl(myData);
    }

    allFunction()

  },
  methods: {

    // メニューボタンの開閉
    changeIsActive() {
      this.isActive = !this.isActive;
    },

    // ログアウト処理
    logOutAccount() {
      firebase.auth().signOut().then(()=>{
        localStorage.clear();
        this.$store.commit('logOutAccount')
      })
      .catch( (error)=>{
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
    }
  }
}
</script>

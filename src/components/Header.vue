<template>
  <header>
    <router-link to="/dashboard">
      <img src="../assets/image/site_logo.jpg" alt="サイトのロゴ画像">
    </router-link>
    <img  @click="changeIsActive" src="../assets/image/top_account_image.jpg" alt="アカウント画像">
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
      isActive: true
    }
  },
  created() {
    this.roll = localStorage.roll;
  },
  methods: {
    changeIsActive() {
      console.log(this.isActive)
      this.isActive = !this.isActive;
    },
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

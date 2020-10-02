<template>
  <div class="login-box">
    <div class="login-img">
      <img src="./assets/image/login_image.jpg" alt="ログイン画面の画像">
    </div>
    <div class="login-form">
      <div class="site-logo">
        <img src="./assets/image/site_logo.jpg" alt="サイトのロゴ画像">
      </div>
      <div class="input-title-h2">
        <h2>アカウントログイン</h2>
      </div>
      <div class="login-input">
        <form class="login-input-form" name="signupform">    
          <div class="form-input">
            <label for="email"><span class="required">必須</span>メールアドレス</label>
            <input type="email" id="email" name="required1" placeholder="例: influ-taro@imp.com" v-model="email" required>
          </div>
          <div class="form-input">
            <label for="password"><span class="required">必須</span>パスワード</label>
            <input type="password" id="password" name="required2" v-model="password" required>
          </div>
        </form>
        <div class="btn" @click="signInAccount">ログイン</div> 
        <div class="input-title-h3">
          <h3>新規登録</h3>
        </div>
        <div class="signup-btn">
          <router-link to="/client/signup" class="btn client-signup">クライアント</router-link>
          <router-link to="/cast/signup" class="btn cast-signup">キャスト</router-link>
        </div>
      </div>
      <p>クライアント：PRを依頼するアカウントとなります。</p>
      <p>キャスト：PRを請け負うアカウントとなります。</p>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      email: "",
      password: "",
    }
  },
  methods: {
    signInAccount() {
      if (
        document.signupform.required1.value !== "" &&
        document.signupform.required2.value !== ""
      ) {
        this.$store.dispatch('loginAccount', {
          email: this.email,
          password: this.password,
        })
        this.email = "";
        this.password = "";
      } else {
        alert('必須項目を入力してください');
      }
    }
  }
}
</script>
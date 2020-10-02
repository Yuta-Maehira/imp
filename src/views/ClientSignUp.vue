<template>
  <section class="client-signup-box">

    <div class="client-signup-img">
      <img src="../assets/image/client_signup.jpg" alt="ログイン画面の画像">
    </div>

    <div class="client-signup-input-form">
      <img src="@/assets/image/site_logo.jpg" alt="サイトのロゴ画像">
      <section class="client-input-section">
        <h2>アカウント情報の登録</h2>

        <form class="client-input-form" name="signupform">    
          <div class="form-input">
            <label for="email"><span class="required">必須</span>メールアドレス</label>
            <input type="email" id="email" name="required1" placeholder="例: influ-taro@imp.com" v-model="email" required>
          </div>
          <div class="form-input">
            <label for="password"><span class="required">必須</span>パスワード</label>
            <input type="password" id="password" name="required2" v-model="password" required>
          </div>
          <div class="term">
            <label for="check" class="check-label"><input type="checkbox" name="checkbox1" required>利用規約に同意する</label>
          </div>
          <router-link to="/terms" class="term-link">利用規約</router-link>
        </form>

        <div class="btn" @click="clientCreateAccount">登録</div>
      </section>
    </div>

  </section>
</template>

<script>

export default {
  data() {
    return {
      isResult: false,
      email: "",
      password: "",
    }
  },
  methods:{
    clientCreateAccount() {
      if (
        document.signupform.required1.value !== "" &&
        document.signupform.required2.value !== ""
      ) {
        if (document.signupform.checkbox1.checked) {
          this.$store.dispatch('createAccount', {
            email: this.email,
            password: this.password,
            roll: 'client'
          })
          this.email = "";
          this.password = "";
        } else {
          alert('利用規約に同意してください');
        }
      } else {
        alert('必須項目を入力してください');
      }
    }
  }
}
</script>
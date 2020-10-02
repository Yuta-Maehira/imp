<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="notification-create-section">
          <h2>新規通知作成</h2>
          <form class="notification-input-form" name="createnotification">
            <div class="form-input">
              <label for="title"><span class="required">必須</span>タイトル</label>
              <input type="text" id="title" name="title" placeholder="例: 運営より重要なお知らせ" v-model.trim="notificationData.notificationTitle" required>
            </div>
            <div class="form-input">
              <label for="description"><span class="required">必須</span>通知内容</label>
              <textarea name="description" rows="10" placeholder="※ 通知の内容を記入してください" v-model.trim="notificationData.notificationDescription" required></textarea>
            </div>
            <div class="form-switch">
              <div :class="[{ active: isActive }, 'left-switch']" @click="leftShift">
                <p>クライアント</p>
              </div>
              <div :class="[{ active: !isActive }, 'right-switch']" @click="rightShift">
                <p>キャスト</p>
              </div>
            </div>
          </form>
          <div class="btn" @click="notificationConfirm">確認する</div> 
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      notificationData: {
        notificationTitle: "",
        notificationDescription: "",
        destination: "client"
      },
      isActive: true
    }
  },
  methods: {
    leftShift() {
      this.isActive = true;
      this.notificationData.destination = 'client';
    },
    rightShift() {
      this.isActive = false;
      this.notificationData.destination = 'cast';
    },
    notificationConfirm() {
      this.$store.commit('notificationDataMove', this.notificationData);
    }
  }
}
</script>
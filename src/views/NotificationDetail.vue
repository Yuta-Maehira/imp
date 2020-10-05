<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="notification-detail-section">
          <h2>通知内容詳細</h2>

          <div class="notification-detail">

            <!-- 通知内容 -->
            <table class="notification-detail-table">
              <tbody>
                <tr>
                  <th>
                    <div>タイトル</div>
                  </th>
                  <td>
                    <div>{{ notificationData.title }}</div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div>通知内容</div>
                  </th>
                  <td>
                    <div>{{ notificationData.description }}</div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import firebase from '@/plugins/firebase'

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      roll: "",
      notificationId: "",
      notificationData: {}
    }
  },
  created() {
    this.roll = this.$store.state.roll
    this.notificationId = this.$route.params['id']
    const notificationDb = firebase.firestore().collection('notifications')

    // (2) 選択した通知データを取得
    const changeLooked = async () => {
      const selectNotification = await notificationDb.where('notificationId', '==', this.notificationId).get();
      const doc = selectNotification.docs[0].id;
      const data = selectNotification.docs[0].data();
      this.notificationData = data;
      if(this.roll === "client" || this.roll === "cast") {
        notificationDb.doc(doc).update({status: 'looked'})
      }
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      await changeLooked();
    }

    allFunction()
  }
}
</script>
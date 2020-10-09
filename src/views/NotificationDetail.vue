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
      notificationData: {}
    }
  },
  created() {
    this.roll = this.$store.state.roll
    const notificationId = this.$route.params['id']
    const uid = firebase.auth().currentUser.uid;
    const accountDb = firebase.firestore().collection('account')
    const notificationDb = firebase.firestore().collection('notifications')

    // (2) 選択した通知データを取得
    const getNotification = async () => {
      const notification = await notificationDb.where('notificationId', '==', notificationId).get();
      const data = notification.docs[0].data();
      this.notificationData = data;
    }

    // (3) 通知の未読/既読をデータベースに保存
    const changeLooked = async () => {
      const myAccount = await accountDb.where('userId', '==', uid).get();
      const data = myAccount.docs[0].data();
      const doc = myAccount.docs[0].id;
      data.notification[notificationId] = true
      accountDb.doc(doc).update({
        notification: data.notification
      })

    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      await getNotification();
      if(this.roll === 'client' || this.roll === 'cast') {
        await changeLooked();
      }
    }

    allFunction()
  }
}
</script>
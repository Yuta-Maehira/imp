<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="notification-confirm-section">
          <h2>登録案件の確認</h2>

          <div class="notification-confirm">

            <!-- 通知内容 -->
            <table class="notification-confirm-table">
              <tbody>
                <tr>
                  <th>
                    <div>タイトル</div>
                  </th>
                  <td>
                    <div>{{ notificationDataObject.notificationTitle }}</div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div>送信先</div>
                  </th>
                  <td>
                    <div>{{ notificationDataObject.destination }}</div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div>通知内容</div>
                  </th>
                  <td>
                    <div>{{ notificationDataObject.notificationDescription }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
            
          </div>

          <!-- 通知内容保存ボタン -->
          <div class="btn" @click="notificationCreate">登録する</div>
          <div class="result">
            <p v-if="isResult">※ 登録に失敗しました</p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import router from '@/plugins/router'
import firebase from '@/plugins/firebase'

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return{
      uniqueNumber: 1
    }
  },
  computed: {
    notificationDataObject() {
      return this.$store.state;
    }
  },
  methods: {
    notificationCreate() {
      const db = firebase.firestore();
      const accountDb = db.collection('account');
      const notificationDb = db.collection('notifications');

      // キャンペーンにユニークなidをつける処理
      const getUniqueNumber = async () => {
        await notificationDb.orderBy("createDate", "desc").limit(1).get()
        .then(response => {
          const lastNotificationNumber = response.docs[0].data().notificationId;
          this.uniqueNumber = Number(lastNotificationNumber) + 1;
        })
        .catch(() => {
          this.uniqueNumber = 1;
        })
      }
      
      // castのアカウントデータベースに通知を保存
      const addToCastAccount = async () => {
        const casts = await accountDb.where('roll', '==', 'cast').get();
        casts.forEach(cast => {
          const notification = cast.data().notification;
          notification[String(this.uniqueNumber)] = false;
          const doc = cast.id;
          accountDb.doc(doc).update({
            notification: notification
          })
        })
      }
      
      // castのアカウントデータベースに通知を保存
      const addToClientAccount = async () => {
        const clients = await accountDb.where('roll', '==', 'client').get();
        clients.forEach(client => {
          const notification = client.data().notification;
          notification[String(this.uniqueNumber)] = false;
          const doc = client.id;
          accountDb.doc(doc).update({
            notification: notification
          })
        })
      }

      // firestoreに通知データを保存
      const addToNotification = () => {
        notificationDb.add({
          notificationId: String(this.uniqueNumber),
          title: this.notificationDataObject.notificationTitle,
          description: this.notificationDataObject.notificationDescription,
          destination: this.notificationDataObject.destination,
          status: "",
          createDate: new Date()
        }).then(() => {
          router.push('/notification')
        }).catch(() => {
          this.isResult = true;
        })
      }


      // (1) 全ての関数を実行
      const allFunction = async () => {
        await getUniqueNumber();
        if(this.notificationDataObject.destination === 'client') await addToClientAccount();
        if(this.notificationDataObject.destination === 'cast') await addToCastAccount();
        await addToNotification()
      }

      allFunction()
    }
  }
}
</script>
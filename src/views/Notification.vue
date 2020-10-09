<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="notification-section">
          <h2>通知一覧</h2>

          <!-- 新規通知作成ボタン -->
          <router-link v-if="roll === 'admin'" to="/notification/create" tag="div" class="btn">新規通知作成</router-link>

          <div class="notification">
            <paginate class="paginate" name="paginate-log" :list="logs" :per="10" tag="div">

              <!-- 各通知のブロック(ループ処理) -->
              <article :class="['notification-box', {'looked': log.status}]" v-for="(log, index) in paginated('paginate-log')" :key="index">
                <router-link :to="'/notification/detail/' + log.notificationId" tag="div" class="notification-link-box">
                  <div class="notification-info">
                    <div>
                      <p class="notification-title">{{ titleLimit(log.title) }}</p>
                    </div>
                    <div>
                      <p class="notification-description">{{ descreptionLimit(log.description) }}</p>
                    </div>
                    <div class="notification-destination">
                      <p>{{ log.destination ? log.destination : '未設定' }}</p>
                    </div>
                  </div>
                </router-link>
              </article>

            </paginate>
          </div>

          <!-- ページネーション -->
          <paginate-links 
            for="paginate-log" 
            :limit="3"
            :classes="{
              'ul': 'pagination',
              'li': 'pagination-list',
              'li > a': 'pagination-link'
            }" 
            :show-step-links="true"
          ></paginate-links>
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
      roll: localStorage.roll,
      logs: [],
      paginate: ['paginate-log'],
      notificationChecked: false
    }
  },
  created() {
    const uid = firebase.auth().currentUser.uid
    const accountDb = firebase.firestore().collection('account')
    const notificationDb = firebase.firestore().collection('notifications')

    // (2) 自分のアカウントデータを取得
    const getMyAccountData = async () => {
      const myAccount = await accountDb.where('userId', '==', uid ).get();
      const myAccountData = myAccount.docs[0].data();
      return myAccountData;
    }

    // (3) 通知データを取得し、変数に格納
    const getNotification = async () => {
      const notificationDataArray = [];
      const notifications = await notificationDb.get();
      notifications.forEach(notification => {
        notificationDataArray.push(notification.data());
      })
      return notificationDataArray;
    }

    // (3) 通知の作成日時、自分のアカウント作成日時を比較し表示制限
    const checkDate = async (notificationDataArray, myAccountData) => {
      const myNotificationDataArray = []
      for(let i = 0; i < notificationDataArray.length; i++) {
        const notificationData = notificationDataArray[i];
        const notificationCreateDate = notificationData.createDate;
        if(this.roll === 'admin') {
          myNotificationDataArray.push(notificationData);
        } else if(this.roll === 'client' && notificationData.destination === 'client' && myAccountData.createData < notificationCreateDate) {
          const id = notificationData.notificationId;
          if(myAccountData.notification[id]) {
            notificationData.status = true;
          }
          myNotificationDataArray.push(notificationData);
        } else if(this.roll === 'cast' && notificationData.destination === 'cast' && myAccountData.createData < notificationCreateDate) {
          const id = notificationData.notificationId;
          if(myAccountData.notification[id]) {
            notificationData.status = true;
          }
          myNotificationDataArray.push(notificationData);
        }
      }
      return myNotificationDataArray;
    }

    // (4) notificationのデータを降順にソート
    const notificationSort = (array) => {
      array.sort((to, from) => {
        if (to.createDate > from.createDate) return -1;
        if (to.createDate < from.createDate) return 1;
        return 0;
      })
      this.logs = array;
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const myAccountData = await getMyAccountData();
      const notificationDataArray = await getNotification();
      const myNotificationDataArray = await checkDate(notificationDataArray, myAccountData);
      await notificationSort(myNotificationDataArray);
    }

    allFunction()

  },
  methods: {
    // titleの表示文字数を制限
    titleLimit(text) {
      const maxLength = 18;
      if(text.length > maxLength) {
        return text.substr(0, maxLength) + '...';
      }
      return text;
    },
    // descriptionの表示文字数を制限
    descreptionLimit(text) {
      const maxLength = 35;
      if(text.length > maxLength) {
        return text.substr(0, maxLength) + '...';
      }
      return text;
    },
  }
}
</script>
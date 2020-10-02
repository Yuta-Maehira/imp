<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="notification-section">
          <h2>通知一覧</h2>
          <router-link v-if="roll === 'admin'" to="/notification/create" tag="div" class="btn">新規通知作成</router-link>
          <div class="notification">
            <paginate class="paginate" name="paginate-log" :list="logs" :per="10" tag="div">
              <article :class="['notification-box', log.status]" v-for="(log, index) in paginated('paginate-log')" :key="index">
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
      notificationChecked: true
    }
  },
  created() {
    console.log('ok')
    const uid = firebase.auth().currentUser.uid
    const accountDb = firebase.firestore().collection('account')
    const notificationDb = firebase.firestore().collection('notifications')

    // (2) 自分のアカウントデータを取得し、変数に格納する処理
    const getMyAccountData = async () => {
      const myAccount = await accountDb.where('userId', '==', uid ).get();
      const myAccountDate = myAccount.docs[0].data().createData;
      return myAccountDate;
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
    const checkDate = async (notificationDataArray, myAccountDate) => {
      for(let i = 0; i < notificationDataArray.length; i++) {
        const notificationData = notificationDataArray[i];
        const notificationCreateDate = notificationData.createDate;
        if(this.roll === 'admin') {
          this.logs.push(notificationData);
        } else if(this.roll === 'client' && notificationData.destination === 'client' && myAccountDate < notificationCreateDate) {
          this.logs.push(notificationData);
        } else if(this.roll === 'cast' && notificationData.destination === 'cast' && myAccountDate < notificationCreateDate) {
          this.logs.push(notificationData);
        }
      }
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const myAccountDate = await getMyAccountData()
      const notificationDataArray = await getNotification()
      await checkDate(notificationDataArray, myAccountDate)
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
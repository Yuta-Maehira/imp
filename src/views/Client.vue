<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="client-section">
          <h2>クライアント一覧</h2>
        
          <paginate class="paginate" name="paginate-log" :list="logs" :per="10" tag="div">
            <article class="client-box" v-for="(log, index) in paginated('paginate-log')" :key="index">
              <router-link :to="'/client/detail/' + log.accountId" tag="div" class="client-link-box">
                <div class="img-box">
                  <img v-if="log.imgurl" :src="log.imgurl" alt="クライアントの画像">
                  <img v-else src="../assets/image/no_image.png" alt="クライアントの画像">
                </div>
                <div class="client-info">
                  <div class="client-name-info">
                    <h3 class="client-name">{{ log.client ? nameLimit(log.client) : nameLimit('未設定') }}</h3>
                    <p class="client-staff"><span class="title">担当: </span>{{ log.staff ? log.staff : '未設定' }}</p>
                  </div>
                  <div class="category">
                    <p class="client-category" v-for="(category, index) in log.category" :key="index">{{ category ? category : '未設定' }}</p>
                  </div>
                  <div v-if="roll === 'admin'" class="inquiry">
                    <p class="email">{{ log.email ? log.email : '未設定' }}</p>
                    <p class="tell">{{ log.tell ? log.tell : '未設定' }}</p>
                  </div>
                </div>
              </router-link>
            </article>
          </paginate>
        </section>
        <paginate-links 
          for="paginate-log" 
          :limit="10"
          :classes="{
            'ul': 'pagination',
            'li': 'pagination-list',
            'li > a': 'pagination-link'
          }" 
          :show-step-links="true"
        ></paginate-links>
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
    }
  },
  created() {
    const accountDb = firebase.firestore().collection('account')

    // (2) 全てのクライアントを取得して、データのみ配列に格納する処理
    const getClient = async () => {
      const clientsDataArray = [];
      const clients = await accountDb.where('roll', '==', 'client').get();
      clients.forEach(client => {
        clientsDataArray.push(client.data());
      })
      return clientsDataArray;
    }

    // (3) imgpathがあればimgurlを取得し、なければそのまま格納する処理
    const pushLogs = async (clientsDataArray) => {
      const clientImgArray = [];
      for(let i = 0; i < clientsDataArray.length; i++) {
        if(clientsDataArray[i].imgpath !== '') {
          const imgpath = clientsDataArray[i].imgpath;
          const imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
          clientsDataArray[i].imgurl = imgurl;
          clientImgArray.push(clientsDataArray[i]);
        } else {
          clientImgArray.push(clientsDataArray[i]);
        }
      }
      return clientImgArray;
    }

    // (4) logsのデータを降順にソートする処理
    const clientSort = (clientImgArray) => {
      clientImgArray.sort((to, from) => {
        if(to.date > from.date) return -1;
        if(to.date < from.date) return 1;
        return 0;
      })
      this.logs = clientImgArray;
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const clientsDataArray = await getClient()
      const clientImgArray = await pushLogs(clientsDataArray)
      await clientSort(clientImgArray)
    }

    allFunction()

  },
  methods: {
    nameLimit(text) {
      const maxLength = 8;
      if(text.length > maxLength) {
        return text.substr(0, maxLength) + '...';
      }
      return text;
    }
  }
}
</script>

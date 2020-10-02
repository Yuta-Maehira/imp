<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="campaign-section">
          <h2>キャンペーン一覧</h2>

          <!-- 新規キャンペーン作成ボタン(クライアントのみ) -->
          <router-link v-if="roll === 'client'" to="/campaign/create" tag="div" class="btn">新規案件登録</router-link>
          <!-- ここまで -->

          <section class="campaign">
            <paginate class="paginate" name="paginate-log" :list="logs" :per="10">

              <!-- 各キャンペーンのブロック(ループ処理) -->
              <article class="campaign-box" v-for="(log, index) in paginated('paginate-log')" :key="index">
                <router-link :to="'/campaign/detail/' + log.campaignid" tag="div" class="campaign-link-box">

                  <!-- キャンペーンの画像 -->
                  <div class="img-box">
                    <img v-if="log.imgurl" :src="log.imgurl" alt="キャンペーンの画像">
                    <img v-else src="../assets/image/no_image.png" alt="キャンペーンの画像">
                  </div>
                  <!-- ここまで -->

                  <!-- キャンペーンの内容 -->
                  <div class="campaign-info">
                    <h3 class="campaign-title">{{ titleLimit(log.title) }}</h3>
                    <p class="campaign-description">{{ descreptionLimit(log.description) }}</p>
                    <div class="campaign-under-box">
                      <div class="sns-icon">
                        <span :class="{ active: log.instagram }"><i class="fab fa-instagram"></i></span>
                        <span :class="{ active: log.twitter }"><i class="fab fa-twitter active"></i></span>
                        <span :class="{ active: log.youtube }"><i class="fab fa-youtube"></i></span>
                        <span :class="{ active: log.tiktok }"><i class="fab fa-tiktok"></i></span>
                      </div>
                      <p class="campaign-price">{{ log.price }}<span>円</span></p>
                    </div>
                  </div>
                  <!-- ここまで -->

                </router-link>
              </article>
              <!-- ここまで -->
              
            </paginate>
          </section>

          <paginate-links for="paginate-log" :limit="10" :classes="{
              'ul': 'pagination',
              'li': 'pagination-list',
              'li > a': 'pagination-link'
            }" :show-step-links="true"></paginate-links>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import firebase from '@/plugins/firebase';

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      roll: localStorage.roll,
      logs: [],
      paginate: ['paginate-log']
    }
  },
  created() {
    const uid = firebase.auth().currentUser.uid
    const campaignDb = firebase.firestore().collection('campaigns')

    // (2) 全てのキャンペーンを取得して、データのみ配列に格納する処理
    const getCampaigns = async () => {
      const campaignArray = [];
      const campaigns = await campaignDb.get();
      campaigns.forEach(campaign => {
        campaignArray.push(campaign.data());
      })
      return campaignArray;
    }

    // (3) imgpathがあればimgurlを取得し、なければそのまま格納する処理
    const pushLogs = async (campaignArray) => {
      const campaignImgArray = [];
      for (let i = 0; i < campaignArray.length; i++) {
        if (campaignArray[i].imgpath !== '') {
          const imgpath = campaignArray[i].imgpath;
          let imgurl = '';
          if(typeof(imgpath) === 'object') {
            imgurl = await firebase.storage().ref().child(imgpath[0]).getDownloadURL();
          } else {
            imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
          }
          campaignArray[i].imgurl = imgurl;
          if (campaignArray[i].uid === uid) campaignImgArray.push(campaignArray[i]);
          if (this.roll !== 'client') campaignImgArray.push(campaignArray[i]);
        } else {
          if (campaignArray[i].uid === uid) campaignImgArray.push(campaignArray[i]);
          if (this.roll !== 'client') campaignImgArray.push(campaignArray[i]);
        }
      }
      return campaignImgArray;
    }

    // (4) logsのデータを降順にソートする処理
    const campaignSort = (array) => {
      array.sort((to, from) => {
        if (to.date > from.date) return -1;
        if (to.date < from.date) return 1;
        return 0;
      })
      this.logs = array;
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const campaignArray = await getCampaigns()
      const campaignImgArray = await pushLogs(campaignArray)
      await campaignSort(campaignImgArray)
    }

    allFunction()

  },
  methods: {
    titleLimit(text) {
      let screenWidth = window.screen.width;
      let maxLength = 18;
      if(screenWidth >= 1025 && screenWidth <= 1299) {
        maxLength = 10;
      } else if(screenWidth >= 1300) {
        maxLength = 13;     
      }
      if(text.length > maxLength) {
        return text.substr(0, maxLength) + '...';
      }
      return text;
    },
    descreptionLimit(text) {
      let screenWidth = window.screen.width;
      let maxLength = 20;
      if(screenWidth >= 400) {
        maxLength = 30;
      }else if(screenWidth >= 600) {
        maxLength = 25;
      } else if(screenWidth >= 1025 && screenWidth <= 1299) {
        maxLength = 12;
      } else if(screenWidth >= 1300) {
        maxLength = 18;     
      }
      if(text.length > maxLength) {
        return text.substr(0, maxLength) + '...';
      }
      return text;
    }
  }
}
</script>
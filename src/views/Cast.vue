<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="cast-section">
          <h2>キャスト一覧</h2>

          <paginate class="paginate" name="paginate-log" :list="logs" :per="10" tag="div">
            <article class="cast-box" v-for="(log, index) in paginated('paginate-log')" :key="index">
              <router-link :to="'/cast/detail/' + log.accountId + '/1'" tag="div" class="cast-link-box">
                <div class="img-box">
                  <img v-if="log.imgurl" :src="log.imgurl" alt="キャストの画像">
                  <img v-else src="../assets/image/no_image.png" alt="キャストの画像">
                </div>
                <div class="cast-info">
                  <h3 class="cast-name">{{ log.name ? nameLimit(log.name) : nameLimit('未設定') }}</h3>
                  <div class="sns-icon">
                    <span :class="{ active: isInstagramActive }"><i class="fab fa-instagram"></i></span>
                    <span :class="{ active: isTwitterActive }"><i class="fab fa-twitter active"></i></span>
                    <span :class="{ active: isYouTubeActive }"><i class="fab fa-youtube"></i></span>
                    <span :class="{ active: isTikTokActive }"><i class="fab fa-tiktok"></i></span>
                  </div>
                  <div class="category">
                    <p class="cast-category" v-for="(category, index) in log.category" :key="index">{{ category ? category : '未設定' }}</p>
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
          :limit="3"
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
      isInstagramActive: false,
      isTwitterActive: false,
      isYouTubeActive: false,
      isTikTokActive: false,
    }
  },
  created() {
    const accountDb = firebase.firestore().collection('account');
    
    // (2) 全てのキャストを取得して、データのみ配列に格納する処理
    const getCasts = async () => {
      const castsDataArray = [];
      const casts = await accountDb.where('roll', '==', 'cast').get();
      casts.forEach(cast => {
        castsDataArray.push(cast.data());
      })
      return castsDataArray;
    }

    // (3) imgpathがあればimgurlを取得し、なければそのまま格納する処理
    const pushLogs = async (castsDataArray) => {
      const castImgArray = [];
      for(let i = 0; i < castsDataArray.length; i++) {
        snsActiveCheck(castsDataArray[i])
        if(castsDataArray[i].imgpath !== '') {
          const imgpath = castsDataArray[i].imgpath;
          const imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
          castsDataArray[i].imgurl = imgurl;
          castImgArray.push(castsDataArray[i]);
        } else {
          castImgArray.push(castsDataArray[i]);
        }
      }
      return castImgArray;
    }

    // (4) logsのデータを降順にソートする処理
    const castSort = (castImgArray) => {
      castImgArray.sort((to, from) => {
        if(to.createData > from.createData) return -1;
        if(to.createData < from.createData) return 1;
        return 0;
      })
      this.logs = castImgArray;
    }

    // キャストのsns活動チェック
    const snsActiveCheck = (data) => {
      if(
          data.myInstagram.accountId !== "" || data.myInstagram.accountName !== "" ||
          data.myInstagram.accountType !== "" || data.myInstagram.followerCount !== "" ||
          data.myInstagram.goodAverage !== "" || data.myInstagram.engagement !== ""
        ) this.isInstagramActive = true;

        if(
          data.myTwitter.accountId !== "" || data.myTwitter.accountName !== "" ||
          data.myTwitter.accountType !== "" || data.myTwitter.followerCount !== "" ||
          data.myTwitter.goodAverage !== "" || data.myTwitter.engagement !== ""
        ) this.isTwitterActive = true;

        if(
          data.myYouTube.accountId !== "" || data.myYouTube.accountName !== "" ||
          data.myYouTube.accountType !== "" || data.myYouTube.followerCount !== "" ||
          data.myYouTube.goodAverage !== "" || data.myYouTube.engagement !== ""
        ) this.isYouTubeActive = true;

        if(
          data.myTikTok.accountId !== "" || data.myTikTok.accountName !== "" ||
          data.myTikTok.accountType !== "" || data.myTikTok.followerCount !== "" ||
          data.myTikTok.goodAverage !== "" || data.myTikTok.engagement !== ""
        ) this.isTikTokActive = true;
    }



    // (1) 全ての関数を実行
    const allFunction = async () => {
      const castsDataArray = await getCasts()
      const castImgArray = await pushLogs(castsDataArray)
      await castSort(castImgArray)
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

<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="contact-section">
          <h2>コンタクト</h2>

          <paginate class="paginate" name="paginate-log" :list="logs" :per="10">

            <!-- 取引中のキャンペーンのブロック -->
            <article class="campaign-box" v-for="(log, index) in paginated('paginate-log')" :key="index">
              <router-link :to="'/contact/cast/' + log.campaignid + '?uid=' + log.uid" tag="div"
              class="campaign-link-box">

                <!-- キャンペーンの画像 -->
                <div class="img-box">
                  <img v-if="log.imgurl" :src="log.imgurl" alt="キャンペーンの画像">
                  <img v-else src="../assets/image/no_image.png" alt="キャンペーンの画像">
                </div>

                <!-- キャンペーンの内容 -->
                <div class="campaign-info">
                  <h3 class="campaign-title">{{ titleLimit(log.title) }}</h3>
                  <p class="campaign-description">{{ descreptionLimit(log.description) }}</p>
                  <div class="campaign-under-box">
                    <div class="sns-icon">
                      <span :class="{ active: log.instagram }">
                        <i class="fab fa-instagram"></i>
                      </span>
                      <span :class="{ active: log.twitter }">
                        <i class="fab fa-twitter active"></i>
                      </span>
                      <span :class="{ active: log.youtube }">
                        <i class="fab fa-youtube"></i>
                      </span>
                      <span :class="{ active: log.tiktok }">
                        <i class="fab fa-tiktok"></i>
                      </span>
                    </div>
                    <p class="campaign-price">{{ log.price }}<span>円</span></p>
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
      paginate: ['paginate-log']
    }
  },
  created() {
    const uid = firebase.auth().currentUser.uid;
    const campaignDb = firebase.firestore().collection('campaigns');

    // (2) 全取引中のキャンペーンデータを取得
    const getCampaign = async () => {
      const docs = [];
      const campaigns = await campaignDb.where('contact', '==', true).get();
      campaigns.forEach(campaign => {
        docs.push(campaign.id);
      })
      return docs;
    }

    // (3) 取引中のキャストデータを取得
    const getTransactionCast = async (docs) => {
      let transactionCastsDataArray = [];
      for(let i = 0; i < docs.length; i++) {
        const transactionArray = []
        const transactionCasts = await campaignDb.doc(docs[i]).collection('applys').where('status', '==', true).get();
        transactionCasts.forEach(transactionCast => {
          transactionArray.push(transactionCast.data());
        })
        transactionCastsDataArray = transactionArray;
      }
      return transactionCastsDataArray;
    }

    // (4) 取引中のキャストデータを元にキャンペーンIDを取得
    // rollがadminならそのまま配列にプッシュ
    // rollがclientなら自分のキャンペーンのみ配列にプッシュ
    // rollがcastなら自分の取引のみ配列にプッシュ
    const getTransactionCampaignId = async (transactionCastsDataArray) => { // campaign毎の取引キャスト
      const transactionCampaignsId = [];
      for(let i = 0; i < transactionCastsDataArray.length; i++) {
        if(transactionCastsDataArray[i].length !== 0) {
          const campaignId = transactionCastsDataArray[i].campaignId;
          const castUid = transactionCastsDataArray[i].uid;
          if(this.roll === "admin") {
            transactionCampaignsId.push(campaignId);
          } else if(this.roll === "client") {
            const campaign = await campaignDb.where('campaignid', '==', campaignId).get();
            const data = campaign.docs[0].data()
            const myUid = data.uid;
            if(myUid === uid) transactionCampaignsId.push(data.campaignid);
          } else if(this.roll === "cast") {
            if(castUid === uid) transactionCampaignsId.push(campaignId);
          }
        }
      }
      return transactionCampaignsId;
    }

    // (5) 取得したい取引中のキャンペーンデータを取得
    const getTransactionCampaignData = async (transactionCampaignsId) => {
      const transactionCampaignsData = [];
      for(let i = 0; i < transactionCampaignsId.length; i++) {
        const campaign = await campaignDb.where('campaignid', '==', transactionCampaignsId[i]).get()
        transactionCampaignsData.push(campaign.docs[0].data())
      }
      return transactionCampaignsData;
    }

    // (6) 画像のパスがあればURLを取得
    const dataPush = async (transactionCampaignsData) => {
      const campaignImgArray = [];
      for(let i = 0; i < transactionCampaignsData.length; i++) {
        if(transactionCampaignsData[i].imgpath !== '') {
          const imgpath = transactionCampaignsData[i].imgpath;
          const imgurl = await firebase.storage().ref().child(imgpath[0]).getDownloadURL();
          transactionCampaignsData[i].imgurl = imgurl;
          campaignImgArray.push(transactionCampaignsData[i]);
        } else {
          campaignImgArray.push(transactionCampaignsData[i]);
        }
      }
      return campaignImgArray;
    }

    // (7) キャンペーンのデータを降順にソート
    const campaignSort = (campaignImgArray) => {
      campaignImgArray.sort((to, from) => {
        if(to.date > from.date) return -1;
        if(to.date < from.date) return 1;
        return 0;
      })
      this.logs = campaignImgArray;
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const docs = await getCampaign()
      const transactionCastsDataArray = await getTransactionCast(docs)
      const transactionCampaignsId = await getTransactionCampaignId(transactionCastsDataArray)
      const transactionCampaignsData = await getTransactionCampaignData(transactionCampaignsId)
      const campaignImgArray = await dataPush(transactionCampaignsData)
      await campaignSort(campaignImgArray)
    }

    allFunction()
  },
  methods: {

    // タイトルの文字数制限
    titleLimit(text) {
      let screenWidth = window.screen.width;
      let maxLength = 18;
      if(screenWidth >= 1025 && screenWidth <= 1299) {
        maxLength = 10;
      } else if(screenWidth >= 1300) {
        maxLength = 11;     
      }
      if(text.length > maxLength) {
        return text.substr(0, maxLength) + '...';
      }
      return text;
    },

    // 内容の文字数制限
    descreptionLimit(text) {
      let screenWidth = window.screen.width;
      let maxLength = 35;
      if(screenWidth >= 1025 && screenWidth <= 1299) {
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
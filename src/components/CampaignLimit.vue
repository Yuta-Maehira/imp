<template>
  <div>
    <h3>新着案件(新規5件)</h3>
    <div class="campaign-limit">
      <div class="campaign-box" v-for="campaign in campaigns" :key="campaign.campaignId">
        <router-link :to="'/' + roll + '/campaign/detail/' + campaign.campaignid" tag="div" class="campaign-link-box">
          <div class="img-box">
            <img v-if="campaign.imgurl" :src="campaign.imgurl" alt="キャンペーンの画像">
            <img v-else src="../assets/image/no_image.png" alt="キャンペーンの画像">
          </div>
          <div class="campaign-info">
            <p class="campaign-title">{{ titleLimit(campaign.title) }}</p>
            <p class="campaign-description">{{ descreptionLimit(campaign.description) }}</p>
            <div class="campaign-under-box">
              <div class="sns-icon">
                <span :class="{ active: campaign.instagram }"><i class="fab fa-instagram"></i></span>
                <span :class="{ active: campaign.twitter }"><i class="fab fa-twitter active"></i></span>
                <span :class="{ active: campaign.youtube }"><i class="fab fa-youtube"></i></span>
                <span :class="{ active: campaign.tiktok }"><i class="fab fa-tiktok"></i></span>
              </div>
              <p class="campaign-price">{{ campaign.price }}<span>円</span></p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data() {
    return {
      roll: "",
      campaigns: []
    }
  },
  created() {
    this.roll = this.$store.state.roll;
    const campaignDb = firebase.firestore().collection('campaigns')

    // (2) campaignから最新の5件を取得
    const getNewCampaigns = async () => {
      const newCampaignsArray = [];
      const newCampaigns = await campaignDb.orderBy('date', 'desc').limit(5).get();
      newCampaigns.forEach(newCampaign => {
        newCampaignsArray.push(newCampaign.data());
      })
      return newCampaignsArray;
    }

    // (3) imgpathがあればimgurlを取得し、なければそのまま格納する処理
    const dataPush = async (newCampaignsArray) => {
      const uid = firebase.auth().currentUser.uid;
      const newCampaignImgArray = [];
      for(let i = 0; i < newCampaignsArray.length; i++) {
        if (newCampaignsArray[i].imgpath !== '') {
          const imgpath = newCampaignsArray[i].imgpath;
          let imgurl = '';
          if(typeof(imgpath) === 'object') {
            imgurl = await firebase.storage().ref().child(imgpath[0]).getDownloadURL();
          } else {
            imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
          }
          newCampaignsArray[i].imgurl = imgurl;
          if (newCampaignsArray[i].uid === uid) newCampaignImgArray.push(newCampaignsArray[i]);
          if (this.roll !== 'client') newCampaignImgArray.push(newCampaignsArray[i]);
        } else {
          if (newCampaignsArray[i].uid === uid) newCampaignImgArray.push(newCampaignsArray[i]);
          if (this.roll !== 'client') newCampaignImgArray.push(newCampaignsArray[i]);
        }
      }
      return newCampaignImgArray;
    }

    // (4) campaignsのデータを降順にソートする処理
    const campaignSort = (newCampaignImgArray) => {
      newCampaignImgArray.sort((to, from) => {
        if(to.date > from.date) return -1;
        if(to.date < from.date) return 1;
        return 0;
      })
      this.campaigns = newCampaignImgArray;
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const newCampaignsArray = await getNewCampaigns()
      const newCampaignImgArray = await dataPush(newCampaignsArray)
      await campaignSort(newCampaignImgArray)
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
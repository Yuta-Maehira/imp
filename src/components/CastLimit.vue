<template>
  <div>
    <h3>新規キャスト(新規5名)</h3>

    <div class="cast-limit">

      <!-- 新着5人のキャストの各ブロック(ループ処理) -->
      <div class="cast-box" v-for="cast in casts" :key="cast.accountId">
        <router-link :to="'/' + roll + '/cast/detail/' + cast.accountId" tag="div" class="cast-link-box">

          <!-- キャンペーンの画像 -->
          <div class="img-box">
            <img v-if="cast.imgurl" :src="cast.imgurl" alt="キャストの画像">
            <img v-else src="../assets/image/no_image.png" alt="キャストの画像">
          </div>

          <!-- キャンペーンの内容 -->
          <div class="cast-info">
            <h3 class="cast-name">{{ cast.name ? nameLimit(cast.name) : nameLimit('未設定') }}</h3>
            <div class="sns-icon">
              <span :class="{ active: isInstagramActive }"><i class="fab fa-instagram"></i></span>
              <span :class="{ active: isTwitterActive }"><i class="fab fa-twitter active"></i></span>
              <span :class="{ active: isYouTubeActive }"><i class="fab fa-youtube"></i></span>
              <span :class="{ active: isTikTokActive }"><i class="fab fa-tiktok"></i></span>
            </div>
            <div v-if="roll === 'admin'" class="inquiry">
              <p class="email">{{ cast.email ? cast.email : '未設定' }}</p>
              <p class="tell">{{ cast.tell ? cast.tell : '未設定' }}</p>
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
      casts: [],
      isInstagramActive: false,
      isTwitterActive: false,
      isYouTubeActive: false,
      isTikTokActive: false
    }
  },
  created() {
    this.roll = this.$store.state.roll;
    const accountDb = firebase.firestore().collection('account')

    // (2) アカウントデータベースからrollがcastのものを取得
    const getCasts = async () => {
      const castsDataArray = [];
      const casts = await accountDb.where('roll', '==', 'cast').get();
      casts.forEach(cast => {
        castsDataArray.push(cast.data())
      })
      return castsDataArray;
    }

    // (3) 画像のパスがあればURLを取得
    const getImgUrl = async (castSortList) => {
      const castImgArray = [];
      const castLimitList =castSortList.slice(0, 5);
      for(let i = 0; i < castLimitList.length; i++) {
        snsActiveCheck(castLimitList[i])
        if(castLimitList[i].imgpath !== '') {
          const imgpath = castLimitList[i].imgpath;
          const imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
          castLimitList[i].imgurl = imgurl;
          castImgArray.push(castLimitList[i]);
        } else {
          castImgArray.push(castLimitList[i]);
        }
      }
      return castImgArray;
    }

    // (4) 渡されたデータを降順にソート
    const castSort = (cast) => {
      cast.sort((to, from) => {
        if(to.accountId > from.accountId) return -1;
        if(to.accountId < from.accountId) return 1;
        return 0;
      })
      return cast;
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

    // (1) 全ての関数を実行/castsにデータを格納
    const allFunction = async () => {
      const castsDataArray = await getCasts()
      const castSortList = await castSort(castsDataArray)
      const castImgArray = await getImgUrl(castSortList)
      const castImgSortList = await castSort(castImgArray)
      this.casts = castImgSortList
    }

    allFunction()

  },
  methods: {
    
    // 名前の文字数制限
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
<template>
  <div class="sns-edit">

    <form class="sns-edit-form">

      <!-- Instagramアカウント情報編集フォーム -->
      <div class="sns-edit-box">
        <div class="form-input">
          <label for="id" class="instagram">アカウントID</label>
          <input type="text" id="id" name="id" v-model.trim="accountId">
        </div>
        <div class="form-input">
          <label for="name" class="instagram">フォロワー数</label>
          <input type="text" id="name" name="name" v-model.trim="accountName">
        </div>
      </div>
      <div class="sns-edit-box">
        <div class="form-input">
          <label for="type" class="instagram">アカウント名</label>
          <input type="text" id="type" name="type" v-model.trim="accountType">
        </div>
        <div class="form-input">
          <label for="follower" class="instagram">平均いいね数</label>
          <input type="text" id="follower" name="follower" v-model.trim="followerCount">
        </div>
      </div>
      <div class="sns-edit-box">
        <div class="form-input">
          <label for="good" class="instagram">アカウントジャンル</label>
          <input type="text" id="good" name="good" v-model.trim="goodAverage">
        </div>
        <div class="form-input">
          <label for="engage" class="instagram">エンゲージメント率</label>
          <input type="text" id="engage" name="engage" v-model.trim="engagement">
        </div>
      </div>

    </form>

  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data() {
    return {
      accountId: "",
      accountName: "",
      accountType: "",
      followerCount: "",
      goodAverage: "",
      engagement: ""
    }
  },
  created() {
    const uid = firebase.auth().currentUser.uid
    const accountDb = firebase.firestore().collection('account')

    // (2) 自分のアカウントデータを取得
    accountDb.where('userId', '==', uid).get().then(response => {
      const data = response.docs[0].data()

      const instagramId = data.myInstagram.accountId;
      const instagramName = data.myInstagram.accountName;
      const instagramType = data.myInstagram.accountType;
      const instagramFollower = data.myInstagram.followerCount;
      const instagramAverage = data.myInstagram.goodAverage;
      const instagramEngage = data.myInstagram.engagement;

      const twitterId = data.myTwitter.accountId;
      const twitterName = data.myTwitter.accountName;
      const twitterType = data.myTwitter.accountType;
      const twitterFollower = data.myTwitter.followerCount;
      const twitterAverage = data.myTwitter.goodAverage;
      const twitterEngage = data.myTwitter.engagement;

      const youtubeId = data.myYouTube.accountId;
      const youtubeName = data.myYouTube.accountName;
      const youtubeType = data.myYouTube.accountType;
      const youtubeFollower = data.myYouTube.followerCount;
      const youtubeAverage = data.myYouTube.goodAverage;
      const youtubeEngage = data.myYouTube.engagement;

      const tiktokId = data.myTikTok.accountId;
      const tiktokName = data.myTikTok.accountName;
      const tiktokType = data.myTikTok.accountType;
      const tiktokFollower = data.myTikTok.followerCount;
      const tiktokAverage = data.myTikTok.goodAverage;
      const tiktokEngage = data.myTikTok.engagement;

      // ローカルストレージにsns情報を保存
      localStorage.instagramId = !localStorage.instagramId ? instagramId : localStorage.instagramId
      localStorage.instagramName = !localStorage.instagramName ? instagramName : localStorage.instagramName
      localStorage.instagramType = !localStorage.instagramType ? instagramType : localStorage.instagramType
      localStorage.instagramFollower = !localStorage.instagramFollower ? instagramFollower : localStorage.instagramFollower
      localStorage.instagramAverage = !localStorage.instagramAverage ? instagramAverage : localStorage.instagramAverage
      localStorage.instagramEngage = !localStorage.instagramEngage ? instagramEngage : localStorage.instagramEngage

      localStorage.twitterId = !localStorage.twitterId ? twitterId : localStorage.twitterId
      localStorage.twitterName = !localStorage.twitterName ? twitterName : localStorage.twitterName
      localStorage.twitterType = !localStorage.twitterType ? twitterType : localStorage.twitterType
      localStorage.twitterFollower = !localStorage.twitterFollower ? twitterFollower : localStorage.twitterFollower
      localStorage.twitterAverage = !localStorage.twitterAverage ? twitterAverage : localStorage.twitterAverage
      localStorage.twitterEngage = !localStorage.twitterEngage ? twitterEngage : localStorage.twitterEngage

      localStorage.youtubeId = !localStorage.youtubeId ? youtubeId : localStorage.youtubeId
      localStorage.youtubeName = !localStorage.youtubeName ? youtubeName : localStorage.youtubeName
      localStorage.youtubeType = !localStorage.youtubeType ? youtubeType : localStorage.youtubeType
      localStorage.youtubeFollower = !localStorage.youtubeFollower ? youtubeFollower : localStorage.youtubeFollower
      localStorage.youtubeAverage = !localStorage.youtubeAverage ? youtubeAverage : localStorage.youtubeAverage
      localStorage.youtubeEngage = !localStorage.youtubeEngage ? youtubeEngage : localStorage.youtubeEngage

      localStorage.tiktokId = !localStorage.tiktokId ? tiktokId : localStorage.tiktokId
      localStorage.tiktokName = !localStorage.tiktokName ? tiktokName : localStorage.tiktokName
      localStorage.tiktokType = !localStorage.tiktokType ? tiktokType : localStorage.tiktokType
      localStorage.tiktokFollower = !localStorage.tiktokFollower ? tiktokFollower : localStorage.tiktokFollower
      localStorage.tiktokAverage = !localStorage.tiktokAverage ? tiktokAverage : localStorage.tiktokAverage
      localStorage.tiktokEngage = !localStorage.tiktokEngage ? tiktokEngage : localStorage.tiktokEngage

      this.accountId = instagramId !== localStorage.instagramId ? localStorage.instagramId : instagramId;
      this.accountName = instagramName !== localStorage.instagramName ? localStorage.instagramName : instagramName;
      this.accountType = instagramType !== localStorage.instagramType ? localStorage.instagramType : instagramType;
      this.followerCount = instagramFollower !== localStorage.instagramFollower ? localStorage.instagramFollower : instagramFollower;
      this.goodAverage = instagramAverage !== localStorage.instagramAverage ? localStorage.instagramAverage : instagramAverage;
      this.engagement = instagramEngage !== localStorage.instagramEngage ? localStorage.instagramEngage : instagramEngage;

    })
  },
  watch:{

    // 各snsフォームの入力チェック
    accountId(newAccountId) {
      localStorage.instagramId = newAccountId;
    },
    accountName(newAccountName) {
      localStorage.instagramName = newAccountName;
    },
    accountType(newAccountType) {
      localStorage.instagramType = newAccountType;
    },
    followerCount(newFollowerCount) {
      localStorage.instagramFollower = newFollowerCount;
    },
    goodAverage(newAverage) {
      localStorage.instagramAverage = newAverage;
    },
    engagement(newEngagement) {
      localStorage.instagramEngage = newEngagement;
    },
  },
  methods: {

    // sns情報内容をstoreのstateに保存(親コンポーネントから発火)
    profileConfirm() {
      this.$store.commit('myPageSnsDataMove', {
        instagramAccountId: localStorage.instagramId,
        instagramAccountName: localStorage.instagramName,
        instagramAccountType: localStorage.instagramType,
        instagramFollowerCount: localStorage.instagramFollower,
        instagramGoodAverage: localStorage.instagramAverage,
        instagramEngagement: localStorage.instagramEngage,
        twitterAccountId: localStorage.twitterId,
        twitterAccountName: localStorage.twitterName,
        twitterAccountType: localStorage.twitterType,
        twitterFollowerCount: localStorage.twitterFollower,
        twitterGoodAverage: localStorage.twitterAverage,
        twitterEngagement: localStorage.twitterEngage,
        youtubeAccountId: localStorage.youtubeId,
        youtubeAccountName: localStorage.youtubeName,
        youtubeAccountType: localStorage.youtubeType,
        youtubeFollowerCount: localStorage.youtubeFollower,
        youtubeGoodAverage: localStorage.youtubeAverage,
        youtubeEngagement: localStorage.youtubeEngage,
        tiktokAccountId: localStorage.tiktokId,
        tiktokAccountName: localStorage.tiktokName,
        tiktokAccountType: localStorage.tiktokType,
        tiktokFollowerCount: localStorage.tiktokFollower,
        tiktokGoodAverage: localStorage.tiktokAverage,
        tiktokEngagement: localStorage.tiktokEngage
      });
    },
  },
}
</script>

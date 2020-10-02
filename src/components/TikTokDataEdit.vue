<template>
  <div class="sns-edit">
    <form class="sns-edit-form">
      <div class="sns-edit-box">
        <div class="form-input">
          <label for="id" class="tiktok">アカウントID</label>
          <input type="text" id="id" name="id" v-model.trim="accountId">
        </div>
        <div class="form-input">
          <label for="name" class="tiktok">フォロワー数</label>
          <input type="text" id="name" name="name" v-model.trim="accountName">
        </div>
      </div>
      <div class="sns-edit-box">
        <div class="form-input">
          <label for="type" class="tiktok">アカウント名</label>
          <input type="text" id="type" name="type" v-model.trim="accountType">
        </div>
        <div class="form-input">
          <label for="follower" class="tiktok">平均いいね数</label>
          <input type="text" id="follower" name="follower" v-model.trim="followerCount">
        </div>
      </div>
      <div class="sns-edit-box">
        <div class="form-input">
          <label for="good" class="tiktok">アカウントジャンル</label>
          <input type="text" id="good" name="good" v-model.trim="goodAverage">
        </div>
        <div class="form-input">
          <label for="engage" class="tiktok">エンゲージメント率</label>
          <input type="text" id="engage" name="engage" v-model.trim="engagement">
        </div>
      </div>
    </form>
  </div>
</template>

<script>
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
    this.accountId = localStorage.tiktokId
    this.accountName = localStorage.tiktokName
    this.accountType = localStorage.tiktokType
    this.followerCount = localStorage.tiktokFollower
    this.goodAverage = localStorage.tiktokAverage
    this.engagement = localStorage.tiktokEngage
  },
  watch:{
    accountId(newAccountId) {
      localStorage.tiktokId = newAccountId;
    },
    accountName(newAccountName) {
      localStorage.tiktokName = newAccountName;
    },
    accountType(newAccountType) {
      localStorage.tiktokType = newAccountType;
    },
    followerCount(newFollowerCount) {
      localStorage.tiktokFollower = newFollowerCount;
    },
    goodAverage(newAverage) {
      localStorage.tiktokAverage = newAverage;
    },
    engagement(newEngagement) {
      localStorage.tiktokEngage = newEngagement;
    },
  },
  methods: {
    profileConfirm() {
      this.$store.commit('myPageSnsDataMove', {
        instagramAccountId: localStorage.instagramAccountId,
        instagramAccountName: localStorage.instagramAccountName,
        instagramAccountType: localStorage.instagramAccountType,
        instagramFollowerCount: localStorage.instagramFollowerCount,
        instagramGoodAverage: localStorage.instagramGoodAverage,
        instagramEngagement: localStorage.instagramEngagement,
        twitterAccountId: localStorage.twitterAccountId,
        twitterAccountName: localStorage.twitterAccountName,
        twitterAccountType: localStorage.twitterAccountType,
        twitterFollowerCount: localStorage.twitterFollowerCount,
        twitterGoodAverage: localStorage.twitterGoodAverage,
        twitterEngagement: localStorage.twitterEngagement,
        youtubeAccountId: localStorage.youtubeAccountId,
        youtubeAccountName: localStorage.youtubeAccountName,
        youtubeAccountType: localStorage.youtubeAccountType,
        youtubeFollowerCount: localStorage.youtubeFollowerCount,
        youtubeGoodAverage: localStorage.youtubeGoodAverage,
        youtubeEngagement: localStorage.youtubeEngagement,
        tiktokAccountId: localStorage.tiktokAccountId,
        tiktokAccountName: localStorage.tiktokAccountName,
        tiktokAccountType: localStorage.tiktokAccountType,
        tiktokFollowerCount: localStorage.tiktokFollowerCount,
        tiktokGoodAverage: localStorage.tiktokGoodAverage,
        tiktokEngagement: localStorage.tiktokEngagement
      });
    },
  }
}
</script>
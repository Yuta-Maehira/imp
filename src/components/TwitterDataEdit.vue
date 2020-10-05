<template>
  <div class="sns-edit">

    <form class="sns-edit-form">

      <!-- Twitterアカウント情報編集フォーム -->
      <div class="sns-edit-box">
        <div class="form-input">
          <label for="id" class="twitter">アカウントID</label>
          <input type="text" id="id" name="id" v-model.trim="accountId">
        </div>
        <div class="form-input">
          <label for="name" class="twitter">フォロワー数</label>
          <input type="text" id="name" name="name" v-model.trim="accountName">
        </div>
      </div>
      <div class="sns-edit-box">
        <div class="form-input">
          <label for="type" class="twitter">アカウント名</label>
          <input type="text" id="type" name="type" v-model.trim="accountType">
        </div>
        <div class="form-input">
          <label for="follower" class="twitter">平均いいね数</label>
          <input type="text" id="follower" name="follower" v-model.trim="followerCount">
        </div>
      </div>
      <div class="sns-edit-box">
        <div class="form-input">
          <label for="good" class="twitter">アカウントジャンル</label>
          <input type="text" id="good" name="good" v-model.trim="goodAverage">
        </div>
        <div class="form-input">
          <label for="engage" class="twitter">エンゲージメント率</label>
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

    // ローカルストレージの内容をデータに保存
    this.accountId = localStorage.twitterId
    this.accountName = localStorage.twitterName
    this.accountType = localStorage.twitterType
    this.followerCount = localStorage.twitterFollower
    this.goodAverage = localStorage.twitterAverage
    this.engagement = localStorage.twitterEngage
  },
  watch:{

    // 各snsフォームの入力チェック
    accountId(newAccountId) {
      localStorage.twitterId = newAccountId;
    },
    accountName(newAccountName) {
      localStorage.twitterName = newAccountName;
    },
    accountType(newAccountType) {
      localStorage.twitterType = newAccountType;
    },
    followerCount(newFollowerCount) {
      localStorage.twitterFollower = newFollowerCount;
    },
    goodAverage(newAverage) {
      localStorage.twitterAverage = newAverage;
    },
    engagement(newEngagement) {
      localStorage.twitterEngage = newEngagement;
    },
  },
  methods: {
    
    // sns情報内容をstoreのstateに保存(親コンポーネントから発火)
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
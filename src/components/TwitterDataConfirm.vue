<template>
  <div class="sns-data">

    <!-- Twitterアカウント情報確認 -->
    <div class="sns-box">
      <div>
        <div class="title twitter">アカウントID</div>
        <div class="value">{{ accountId ? accountId : '-' }}</div>
      </div>
      <div>
        <div class="title twitter">フォロワー数</div>
        <div class="value">{{ followerCount ? followerCount : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title twitter">アカウント名</div>
        <div class="value">{{ accountName ? accountName : '-' }}</div>
      </div>
      <div>
        <div class="title twitter">平均いいね数</div>
        <div class="value">{{ goodAverage ? goodAverage : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title twitter">アカウントジャンル</div>
        <div class="value">{{ accountType ? accountType : '-' }}</div>
      </div>
      <div>
        <div class="title twitter">エンゲージメント率</div>
        <div class="value">{{ engagement ? engagement : '-' }}</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      roll: localStorage.roll,
      accountId: "",
      accountName: "",
      accountType: "",
      followerCount: "",
      goodAverage: "",
      engagement: ""
    }
  },
  computed: {
    snsData() {
      return this.$store.state.snsData;
    }
  },
  created() {
    
    // アカウント情報表示欄にローカルストレージの内容を表示
    this.accountId = localStorage.twitterId;
    this.accountName = localStorage.twitterName;
    this.accountType = localStorage.twitterType;
    this.followerCount = localStorage.twitterFollower;
    this.goodAverage = localStorage.twitterAverage;
    this.engagement = localStorage.twitterEngage;
  }
}
</script>
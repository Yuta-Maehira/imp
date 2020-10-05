<template>
  <div class="sns-data">

    <!-- TikTokアカウント情報確認 -->
    <div class="sns-box">
      <div>
        <div class="title tiktok">アカウントID</div>
        <div class="value">{{ accountId ? accountId : '-' }}</div>
      </div>
      <div>
        <div class="title tiktok">フォロワー数</div>
        <div class="value">{{ followerCount ? followerCount : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title tiktok">アカウント名</div>
        <div class="value">{{ accountName ? accountName : '-' }}</div>
      </div>
      <div>
        <div class="title tiktok">平均いいね数</div>
        <div class="value">{{ goodAverage ? goodAverage : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title tiktok">アカウントジャンル</div>
        <div class="value">{{ accountType ? accountType : '-' }}</div>
      </div>
      <div>
        <div class="title tiktok">エンゲージメント率</div>
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
    this.accountId = localStorage.tiktokId;
    this.accountName = localStorage.tiktokName;
    this.accountType = localStorage.tiktokType;
    this.followerCount = localStorage.tiktokFollower;
    this.goodAverage = localStorage.tiktokAverage;
    this.engagement = localStorage.tiktokEngage;
  }
}
</script>
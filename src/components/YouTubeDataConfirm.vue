<template>
  <div class="sns-data">

    <!-- YouTubeアカウント情報確認 -->
    <div class="sns-box">
      <div>
        <div class="title youtube">アカウントID</div>
        <div class="value">{{ accountId ? accountId : '-' }}</div>
      </div>
      <div>
        <div class="title youtube">フォロワー数</div>
        <div class="value">{{ followerCount ? followerCount : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title youtube">アカウント名</div>
        <div class="value">{{ accountName ? accountName : '-' }}</div>
      </div>
      <div>
        <div class="title youtube">平均いいね数</div>
        <div class="value">{{ goodAverage ? goodAverage : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title youtube">アカウントジャンル</div>
        <div class="value">{{ accountType ? accountType : '-' }}</div>
      </div>
      <div>
        <div class="title youtube">エンゲージメント率</div>
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
    this.accountId = localStorage.youtubeId;
    this.accountName = localStorage.youtubeName;
    this.accountType = localStorage.youtubeType;
    this.followerCount = localStorage.youtubeFollower;
    this.goodAverage = localStorage.youtubeAverage;
    this.engagement = localStorage.youtubeEngage;
  }
}
</script>
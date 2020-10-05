<template>
  <div class="sns-data">

    <!-- Instagramアカウント情報確認 -->
    <div class="sns-box">
      <div>
        <div class="title instagram">アカウントID</div>
        <div class="value">{{ accountId ? accountId : '-' }}</div>
      </div>
      <div>
        <div class="title instagram">フォロワー数</div>
        <div class="value">{{ followerCount ? followerCount : '-' }}</div>
      </div>
    </div>

    <div class="sns-box">
      <div>
        <div class="title instagram">アカウント名</div>
        <div class="value">{{ accountName ? accountName : '-' }}</div>
      </div>
      <div>
        <div class="title instagram">平均いいね数</div>
        <div class="value">{{ goodAverage ? goodAverage : '-' }}</div>
      </div>
    </div>

    <div class="sns-box">
      <div>
        <div class="title instagram">アカウントジャンル</div>
        <div class="value">{{ accountType ? accountType : '-' }}</div>
      </div>
      <div>
        <div class="title instagram">エンゲージメント率</div>
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
    this.accountId = localStorage.instagramId;
    this.accountName = localStorage.instagramName;
    this.accountType = localStorage.instagramType;
    this.followerCount = localStorage.instagramFollower;
    this.goodAverage = localStorage.instagramAverage;
    this.engagement = localStorage.instagramEngage;
  }
}
</script>
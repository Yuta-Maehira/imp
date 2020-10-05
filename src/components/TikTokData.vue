<template>
  <div class="sns-data">

    <!-- TikTokアカウント情報確認 -->
    <div class="sns-box">
      <div>
        <div class="title tiktok">アカウントID</div>
        <div class="value">{{ accountData.myTikTok.accountId ? accountData.myTikTok.accountId : '-' }}</div>
      </div>
      <div>
        <div class="title tiktok">フォロワー数</div>
        <div class="value">{{ accountData.myTikTok.followerCount ? accountData.myTikTok.followerCount : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title tiktok">アカウント名</div>
        <div class="value">{{ accountData.myTikTok.accountName ? accountData.myTikTok.accountName : '-' }}</div>
      </div>
      <div>
        <div class="title tiktok">平均いいね数</div>
        <div class="value">{{ accountData.myTikTok.goodAverage ? accountData.myTikTok.goodAverage : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title tiktok">アカウントジャンル</div>
        <div class="value">{{ accountData.myTikTok.accountType ? accountData.myTikTok.accountType : '-' }}</div>
      </div>
      <div>
        <div class="title tiktok">エンゲージメント率</div>
        <div class="value">{{ accountData.myTikTok.engagement ? accountData.myTikTok.engagement : '-' }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data() {
    return {
      roll: localStorage.roll,
      accountData: {}
    }
  },
  props: ['accountId'],
  created() {
    const accountDb = firebase.firestore().collection('account');

    // (2) 選択したアカウントデータを取得
    const getSelectAccount = async () => {
      const selectAccount = await accountDb.where('accountId', '==', this.accountId).get();
      this.accountData = selectAccount.docs[0].data();
    }

    // (3) 自分のアカウントデータを取得
    const getMyAccount = async () => {
      const uid = firebase.auth().currentUser.uid;
      const myAccount = await accountDb.where('userId', '==', uid).get();
      this.accountData = myAccount.docs[0].data();
    }
    
    // (1) 全ての関数を実行
    const allFunction = async () => {
      if(this.roll === 'client' || this.roll === 'admin') {
        await getSelectAccount()
      } else if(this.roll === 'cast') {
        await getMyAccount()
      }
    }

    allFunction()

  }
}
</script>
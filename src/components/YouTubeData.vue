<template>
  <div class="sns-data">
    <div class="sns-box">
      <div>
        <div class="title youtube">アカウントID</div>
        <div class="value">{{ accountData.myYouTube.accountId ? accountData.myYouTube.accountId : '-' }}</div>
      </div>
      <div>
        <div class="title youtube">フォロワー数</div>
        <div class="value">{{ accountData.myYouTube.followerCount ? accountData.myYouTube.followerCount : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title youtube">アカウント名</div>
        <div class="value">{{ accountData.myYouTube.accountName ? accountData.myYouTube.accountName : '-' }}</div>
      </div>
      <div>
        <div class="title youtube">平均いいね数</div>
        <div class="value">{{ accountData.myYouTube.goodAverage ? accountData.myYouTube.goodAverage : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title youtube">アカウントジャンル</div>
        <div class="value">{{ accountData.myYouTube.accountType ? accountData.myYouTube.accountType : '-' }}</div>
      </div>
      <div>
        <div class="title youtube">エンゲージメント率</div>
        <div class="value">{{ accountData.myYouTube.engagement ? accountData.myYouTube.engagement : '-' }}</div>
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

    // (2) 選択したアカウントデータを取得し変数に格納する処理
    const getSelectAccount = async () => {
      const selectAccount = await accountDb.where('accountId', '==', this.accountId).get();
      this.accountData = selectAccount.docs[0].data();
    }

    // (3) 自分のアカウントデータを取得し変数に格納する処理
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
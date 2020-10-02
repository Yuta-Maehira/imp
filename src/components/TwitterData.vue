<template>
  <div class="sns-data">
    <div class="sns-box">
      <div>
        <div class="title twitter">アカウントID</div>
        <div class="value">{{ accountData.myTwitter.accountId ? accountData.myTwitter.accountId : '-' }}</div>
      </div>
      <div>
        <div class="title twitter">フォロワー数</div>
        <div class="value">{{ accountData.myTwitter.followerCount ? accountData.myTwitter.followerCount : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title twitter">アカウント名</div>
        <div class="value">{{ accountData.myTwitter.accountName ? accountData.myTwitter.accountName : '-' }}</div>
      </div>
      <div>
        <div class="title twitter">平均いいね数</div>
        <div class="value">{{ accountData.myTwitter.goodAverage ? accountData.myTwitter.goodAverage : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title twitter">アカウントジャンル</div>
        <div class="value">{{ accountData.myTwitter.accountType ? accountData.myTwitter.accountType : '-' }}</div>
      </div>
      <div>
        <div class="title twitter">エンゲージメント率</div>
        <div class="value">{{ accountData.myTwitter.engagement ? accountData.myTwitter.engagement : '-' }}</div>
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
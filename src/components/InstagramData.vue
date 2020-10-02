<template>
  <div class="sns-data">
    <div class="sns-box">
      <div>
        <div class="title instagram">アカウントID</div>
        <div class="value">{{ accountData.myInstagram.accountId ? accountData.myInstagram.accountId : '-' }}</div>
      </div>
      <div>
        <div class="title instagram">フォロワー数</div>
        <div class="value">{{ accountData.myInstagram.followerCount ? accountData.myInstagram.followerCount : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title instagram">アカウント名</div>
        <div class="value">{{ accountData.myInstagram.accountName ? accountData.myInstagram.accountName : '-' }}</div>
      </div>
      <div>
        <div class="title instagram">平均いいね数</div>
        <div class="value">{{ accountData.myInstagram.goodAverage ? accountData.myInstagram.goodAverage : '-' }}</div>
      </div>
    </div>
    <div class="sns-box">
      <div>
        <div class="title instagram">アカウントジャンル</div>
        <div class="value">{{ accountData.myInstagram.accountType ? accountData.myInstagram.accountType : '-' }}</div>
      </div>
      <div>
        <div class="title instagram">エンゲージメント率</div>
        <div class="value">{{ accountData.myInstagram.engagement ? accountData.myInstagram.engagement : '-' }}</div>
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
    console.log('ok')
    const accountDb = firebase.firestore().collection('account');

    // (2) 選択したアカウントデータを取得し変数に格納する処理
    const getSelectAccount = async () => {
      console.log('ok')
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
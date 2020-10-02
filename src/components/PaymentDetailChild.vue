<template>
  <div>
    <div class="payment-flex" v-for="(payment,index) in paymentData" :key="index">
      <div class="payment-flex-item">{{ payment.month }}<span>月</span></div>
      <div class="payment-flex-item">{{ payment.payment }}<span>円</span></div>
      <div class="payment-flex-item">{{ payment.deadline }}<span>月末日</span></div>
    </div>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data() {
    return {
      year: 0,
      paymentData: []
    }
  },
  created() {
    this.year = this.$route.params['year']
    const uid = firebase.auth().currentUser.uid
    const now = new Date()
    const month = now.getMonth() + 1
    const campaignDb = firebase.firestore().collection('campaigns')
    let payment = 0
    let deadline = 0
    let docs = []
    let applys = []

    // (2) キャンペーンから自分のデータを取得し、ドキュメント名を変数に格納する処理
    const getCampaigns = async () => {
      const myCampaigns = await campaignDb.where('uid', '==', uid).get();
      myCampaigns.forEach(campaign => {
        docs.push(campaign.id)
      })
    }

    // (3) キャンペーンの応募者を取得し、変数に格納する処理
    const pushApplys = async () => {
      for(let i = 0; i < docs.length; i++) {
        const myApplys = await campaignDb.doc(docs[i]).collection('applys').where('complete', '==', true).get()
        myApplys.forEach(apply => {
          applys.push(apply.data())
        })
      } 
    }

    // (4) 支払い金額の取得
    const getPayment = () => {
      console.log(applys)
      for(let i = 1; i < month; i++) {
        applys.forEach(apply => {
          const campaignCompleteDate = apply.completeTime.toDate()
          const campaignCompleteYear = campaignCompleteDate.getFullYear()
          const campaignCompleteMonth = campaignCompleteDate.getMonth() + 1
          if(Number(this.year) === campaignCompleteYear && i === campaignCompleteMonth) {
            payment += Number(apply.price)
          }
        })
        
        if(i === 12) {
          deadline = 1
        } else {
          deadline = i + 1
        }
        this.paymentData.push({
          month: i,
          payment: payment,
          deadline: deadline
        })
        payment = 0
      }
      this.paymentData.sort((to, from) => {
        if(to.month > from.month) return -1;
        if(to.month < from.month) return 1;
        return 0;
      })
    }

    const allFunction = async () => {
      await getCampaigns()
      await pushApplys()
      await getPayment()
    }

    allFunction()

  }
}


</script>
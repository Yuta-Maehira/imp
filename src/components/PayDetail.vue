<template>
  <div>
    <div class="total">
      <div class="tax"><p>（消費税・手数料込）</p></div>
      <div class="payment-detail">
        <div class="text">
          <p>請求合計</p>
          <p>確定</p>
        </div>
        <div class="payment">
          <span class="large-text">{{ allPayment - (specialDiscount + campaignDiscount) }}</span>円
        </div>
      </div>
      <div class="dead-line">
        <p>支払期日：{{ year }}年{{ month }}月末日</p>
      </div>
    </div>

    <div class="detail">
      <div class="detail-title">
        <p>請求内訳</p>
      </div>
      <div class="break-down">


        <div>
          <div>小計</div>
          <div>{{ allPayment }}<span class="small-text">円</span></div>
        </div>
        <ul>
          <li>
            <div class="title">広告料</div>
            <div class="value">{{ payment }}<span class="small-text">円</span></div>
          </li>
          <li>
            <div class="title">手数料</div>
            <div class="value">{{ fee }}<span class="small-text">円</span></div>
          </li>
          <li>
            <div class="title">消費税</div>
            <div class="value">{{ tax }}<span class="small-text">円</span></div>
          </li>
        </ul>


        <div>
          <div>小計</div>
          <div>{{ specialDiscount + campaignDiscount }}<span class="small-text">円</span></div>
        </div>
        <ul>
          <li>
            <div class="title">特別割引額</div>
            <div class="value">{{ specialDiscount }}<span class="small-text">円</span></div>
          </li>
          <li>
            <div class="title">キャンペーン割引額</div>
            <div class="value">{{ campaignDiscount }}<span class="small-text">円</span></div>
          </li>
        </ul>


      </div>
    </div>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data() {
    return {
      allApplys: [],
      allPayment: 0,
      payment: 0,
      tax: 0,
      fee: 0,
      specialDiscount: 0,
      campaignDiscount: 0,
      clientData: '',
      campaignData: ''

    }
  },
  props: ['year', 'month'],
  created() {
    const uid = firebase.auth().currentUser.uid;
    const accountDb = firebase.firestore().collection('account');
    const campaignDb = firebase.firestore().collection('campaigns');

    // (2) キャンペーンから自分のデータを取得し、ドキュメント名を取得
    const getCampaigns = async () => {
      let docs = [];
      const myCampaigns = await campaignDb.where('uid', '==', uid).get();
      myCampaigns.forEach(campaign => {
        docs.push(campaign.id);
      })
      return docs;
    }

    // (3) 応募者を取得して、取引完了者を取得
    const pushApplys = async (docs) => {
      let applys = [];
      for(let i = 0; i < docs.length; i++) {
        const myApplys = await campaignDb.doc(docs[i]).collection('applys').where('complete', '==', true).get();
        myApplys.forEach(apply => {
          applys.push(apply.data());
        })
      } 
      this.allApplys = applys;
    }

    const getPayment = () => {
      this.allApplys.forEach(apply => {
        const campaignCompleteDate = apply.completeTime.toDate();
        const campaignCompleteYear = campaignCompleteDate.getFullYear();
        const campaignCompleteMonth = campaignCompleteDate.getMonth() + 1;
        if(Number(this.year) === campaignCompleteYear && this.month - 1 === campaignCompleteMonth) {
          this.payment += Number(apply.price);
        }
      })
    }

    const allPayment = () => {
      this.tax = this.payment * 0.1;
      this.fee = this.payment * 0.3;
      this.allPayment = this.payment + (this.tax + this.fee); 
    }

    const specialAmount = async () => {
      const myAccount = await accountDb.where('userId', '==', uid).get();
      const myData = myAccount.docs[0].data();

      // 割引登録日時のDateStringを取得
      const editDate = myData.specialEditDate.toDate();
      const editYearString = String(editDate.getFullYear());
      const editMonthString = String(editDate.getMonth() + 1);
      const editzero = '0';
      let editLinkNumber = '';
      if(editMonthString.length === 1) editLinkNumber = Number(editYearString + editzero + editMonthString);
      if(editMonthString.length === 2) editLinkNumber = Number(editYearString + editMonthString);

      // 現在のDateStringを取得
      const date = new Date();
      const yearString = String(date.getFullYear());
      const monthString = String(date.getMonth() + 1);
      const nowzero = '0';
      let nowLinkNumber = '';
      if(editMonthString.length === 1) nowLinkNumber = Number(yearString + nowzero + monthString);
      if(editMonthString.length === 2) nowLinkNumber = Number(yearString + monthString);

      if(editLinkNumber <= nowLinkNumber) {
        if(myData.specialPercent !== '未選択') {
          const special = Number(myData.specialPercent.substr(0, 2));
          this.specialDiscount = this.payment * (special / 100);
        }
        return myData;
      }
    }

    const campaignAmount = (myData) => {

      // 割引登録日時のDateStringを取得
      const editDate = myData.campaignEditDate.toDate();
      const editYearString = String(editDate.getFullYear());
      const editMonthString = String(editDate.getMonth() + 1);
      const editzero = '0';
      let editLinkNumber = '';
      if(editMonthString.length === 1) editLinkNumber = Number(editYearString + editzero + editMonthString);
      if(editMonthString.length === 2) editLinkNumber = Number(editYearString + editMonthString);

      // 現在のDateStringを取得
      const date = new Date();
      const yearString = String(date.getFullYear());
      const monthString = String(date.getMonth() + 1);
      const nowzero = '0';
      let nowLinkNumber = '';
      if(editMonthString.length === 1) nowLinkNumber = Number(yearString + nowzero + monthString);
      if(editMonthString.length === 2) nowLinkNumber = Number(yearString + monthString);

      if(editLinkNumber <= nowLinkNumber) {
        if(myData.campaignPercent !== '未選択') {
          const campaign = Number(myData.campaignPercent.substr(0, 2));
          this.campaignDiscount = this.payment * (campaign / 100);
          console.log()
        }
      }
    }

    const allFunction = async () => {
      const docs = await getCampaigns()
      await pushApplys(docs)
      await getPayment()
      allPayment()
      const myData = await specialAmount()
      campaignAmount(myData)
    }

    allFunction()
  },
  methods: {
    async reloadFunctions(monthNow) {
      await this.reloadGetPayment(monthNow)
      await this.reloadAllPayment()
      const myData = await this.reloadSpecialAmount()
      await this.reloadCampaignAmount(myData)

    },
    reloadGetPayment(monthNow) {
      this.payment = 0;
      this.allApplys.forEach(apply => {
        const campaignCompleteDate = apply.completeTime.toDate();
        const campaignCompleteYear = campaignCompleteDate.getFullYear();
        const campaignCompleteMonth = campaignCompleteDate.getMonth() + 1;
        if(Number(this.year) === campaignCompleteYear && monthNow - 1 === campaignCompleteMonth) {
          this.payment += Number(apply.price);
        }
      })
    },
    reloadAllPayment() {
      this.tax = this.payment * 0.1;
      this.fee = this.payment * 0.3;
      this.allPayment = this.payment + (this.tax + this.fee); 
    },
    async reloadSpecialAmount() {
      const uid = firebase.auth().currentUser.uid;
      const accountDb = firebase.firestore().collection('account');
      const myAccount = await accountDb.where('userId', '==', uid).get();
      const myData = myAccount.docs[0].data();
      if(myData.specialPercent !== '未選択') {
        const special = Number(myData.specialPercent.substr(0, 2));
        this.specialDiscount = this.payment * (special / 100);
      }
      return myData;
    },

    reloadCampaignAmount(myData) {
      if(myData.campaignPercent !== '未選択') {
        const campaign = Number(myData.campaignPercent.substr(0, 2));
        this.campaignDiscount = this.payment * (campaign / 100);
      }
    }
  }
}
</script>
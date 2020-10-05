<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>

      <div class="select-usage-month"> 

        <!-- 月選択ボタン -->
        <div class="select-month">
          <div class="left-arrow" @click="previousMonth">
            <p>{{ monthAgo }}月</p>
          </div>
          <div class="sqare">
            <p>{{ monthNow }}月</p>
          </div>
          <div class="right-arrow" @click="nextMonth">
            <p>{{ monthLater }}月</p>
          </div>
        </div>

        <!-- 選択した月の請求対象期間 -->
        <div class="usage-period">
          <p>利用期間</p>
          <p>{{ usageStartDate }} 〜 {{ usageEndDate }}</p>
        </div>

        <!-- 請求内容表示コンポーネント -->
        <router-view ref="payDetail" :year="yearNow" :month="monthNow"></router-view>

      </div>

    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
// import firebase from '@/plugins/firebase'

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      yearNow: "",
      monthAgo: "",
      monthNow: "",
      monthLater: "",
      usageStartDate: "",
      usageEndDate: "",
    }
  },
  created() {

    // 選択月を1〜12までの繰り返しにする
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    this.yearNow = year;
    this.monthNow = month;
    if(this.monthNow === 12) {
      this.monthLater = 1;
    } else {
      this.monthLater = this.monthNow + 1;
    }
    if(this.monthNow === 1) {
      this.monthAgo = 12;
    } else {
      this.monthAgo = this.monthNow - 1;
    }
    this.usageStartDate = year + '年' + (this.monthNow - 1) + '月' + '1日';
    this.usageEndDate = year + '年' + (this.monthNow - 1) + '月' + '末日';
  },
  methods: {

    // 前の月の請求情報表示(子コンポーネントの関数を実行)
    previousMonth() {
      if(this.monthNow === 1) {
        this.monthNow = 12;
        this.yearNow = this.yearNow - 1;
      } else {
        this.monthNow = this.monthNow - 1;
        this.monthAgo = this.monthNow - 1;
        this.monthLater = this.monthNow + 1;
      }
      this.usageStartDate = this.yearNow + '年' + (this.monthNow - 1) + '月' + '1日';
      this.usageEndDate = this.yearNow + '年' + (this.monthNow - 1) + '月' + '末日';
      this.$refs.payDetail.reloadFunctions(this.monthNow)
    },

    // 次の月の請求情報表示(子コンポーネントの関数を実行)
    nextMonth() {
      const now = new Date();
      const month = now.getMonth() + 1;
      if(this.monthLater > month) {
        return;
      }
      this.monthNow = this.monthNow + 1;
      this.monthAgo = this.monthNow - 1;
      this.monthLater = this.monthNow + 1;
      this.usageStartDate = this.yearNow + '年' + (this.monthNow - 1) + '月' + '1日';
      this.usageEndDate = this.yearNow + '年' + (this.monthNow - 1) + '月' + '末日';
      this.$refs.payDetail.reloadFunctions(this.monthNow)
    }
  }
}
</script>
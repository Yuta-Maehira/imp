<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="dashboard-section">
          <h2>ダッシュボード</h2>
          <TransactionData/>

          <!-- 新着クライアントリスト -->
          <div v-if="roll !== 'client'">
            <CampaignLimit/>
            <router-link to='/campaign' tag="div" class="btn">全件表示</router-link>
          </div>

          <!-- 新着キャストリスト -->
          <div v-if="roll !== 'cast'">
            <CastLimit/>
            <router-link to='/cast' tag="div" class="btn">全件表示</router-link>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import TransactionData from '@/components/TransactionData.vue';
import CampaignLimit from '@/components/CampaignLimit.vue';
import CastLimit from '@/components/CastLimit.vue';

export default {
  components: {
    Header,
    SideBar,
    TransactionData,
    CampaignLimit,
    CastLimit
  }
}
</script>
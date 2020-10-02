<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="discount-edit">
          <h2>割引設定</h2>
          <div class="select-discount-type">
            <label for="special"><input type="radio" name="type" id="special" value="special" v-model="type"  checked="checked">特別割引</label>
            <label for="campaign"><input type="radio" name="type" id="campaign" value="campaign" v-model="type">キャンペーン割引</label>
          </div>

          <section :class="[{'opacity': type !== 'special'}, 'discount-edit']">
            <h3>特別割引設定</h3>
            <table class="discount-edit-table">
              <tbody>
                <tr>
                  <th>
                    <div class="title">クライアント</div>
                  </th>
                  <td>
                    <select v-if="type === 'special'" class="select-box" v-model="specialClient">
                      <option selected>未選択</option>
                      <option v-for="client in clients" :key="client">{{ client }}</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div class="title">割引％</div>
                  </th>
                  <td>
                    <select v-if="type === 'special'" class="select-box" v-model="specialPercent">
                      <option selected>未選択</option>
                      <option v-for="percent in percents" :key="percent">{{ percent }}</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section :class="[{'opacity': type !== 'campaign'}, 'discount-edit']">
            <h3>キャンペーン割引設定</h3>
            <table class="discount-edit-table">
              <tbody>
                <tr>
                  <th>
                    <div class="title">クライアント</div>
                  </th>
                  <td>
                    <select v-if="type === 'campaign'" class="select-box" v-model="campaignClient">
                      <option selected>未選択</option>
                      <option v-for="client in clients" :key="client">{{ client }}</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div class="title">割引％</div>
                  </th>
                  <td>
                    <select v-if="type === 'campaign'" class="select-box" v-model="campaignPercent">
                      <option selected>未選択</option>
                      <option v-for="percent in percents" :key="percent">{{ percent }}</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <div class="btn" @click="changeDiscount">設定変更</div>

          <section class="discount-client-list">
            <h3>割引設定済クライアント</h3>
            <table>
              <thead>
                <tr>
                  <th><div>クライアント名</div></th>
                  <th><div>特別割引</div></th>
                  <th><div>キャンペーン割引</div></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(discountClient, index) in discountClients" :key="discountClient.accountId">
                  <td>
                    <div>{{ discountClient.client }}</div>
                  </td>
                  <td>
                    <div>
                      {{ discountClient.specialPercent === '未選択' ? '0%' : discountClient.specialPercent }}
                      <div @click="specialReset(discountClient.email, index)" class="special-reset-btn">×</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      {{ discountClient.campaignPercent === '未選択' ? '0%' : discountClient.campaignPercent }}
                      <div @click="campaignReset(discountClient.email, index)" class="campaign-reset-btn">×</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
// import router from '@/plugins/router'
import firebase from '@/plugins/firebase'

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return{
      type: 'special',   
      result: false,   
      clients: [],
      discountClients: [],
      percents: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%', ],
      specialClient: '未選択',
      specialPercent: '未選択',
      campaignClient: '未選択',
      campaignPercent: '未選択',
    }
  },
  created() {
    const accountDb = firebase.firestore().collection('account')
  
    const getAccount = async () => {
      const clients = await accountDb.where('roll', '==', 'client').get();
      clients.forEach(client => {
        const data = client.data();
        this.clients.push(data.client)
      })
    }

    const getDiscountAccount = async () => {
      const clientsData = [];
      const clients = await accountDb.where('roll', '==', 'client').get();
      clients.forEach(client => {
        clientsData.push(client.data());
      })
      return clientsData;
    }

    const squeezeData = (clientsData) => {
      clientsData.forEach(data => {
        const specialData = data.specialPercent;
        const campaignData = data.campaignPercent;
        if(specialData !== '未選択' || campaignData !== '未選択') {
          this.discountClients.push(data);
        }
      })
    }

    const allFunction = async () => {
      await getAccount()
      const clientsData = await getDiscountAccount()
      squeezeData(clientsData)
    }

    allFunction()
  },
  methods: {
    changeDiscount() {
      const accountDb = firebase.firestore().collection('account');

      if(this.type === 'special') {
        if(this.specialClient !== '未選択') {
          accountDb.where('client', '==', this.specialClient).get().then(response => {
            const doc = response.docs[0].id;
            if(this.specialPercent !== '未選択') {
              accountDb.doc(doc).update({
                specialPercent: String(this.specialPercent),
                specialEditDate: new Date()
              }).then(() => {
                this.reloadDiscountClient()
                this.specialClient = '未選択';
                this.specialPercent = '未選択';
              })
            } else {
              alert('割引パーセンテージを選択してください')
            }
          })
        } else {
          alert('クライアントを選択してください')
        }
      } else if(this.type === 'campaign') {
        if(this.campaignPercent !== '未選択') {
          accountDb.where('client', '==', this.campaignClient).get().then(response => {
            const doc = response.docs[0].id;
            if(this.campaignPercent !== '未選択') {
              accountDb.doc(doc).update({
                campaignPercent: String(this.campaignPercent),
                campaignEditDate: new Date()
              }).then(() => {
                this.reloadDiscountClient()
                this.campaignClient = '未選択';
                this.campaignPercent = '未選択';
              })
            } else {
              alert('割引パーセンテージを選択してください')
            }
          })
        } else {
          alert('クライアントを選択してください')
        }
      }
    },
    specialReset(doc, index) {
      const accountDb = firebase.firestore().collection('account');
      if(confirm('割引データを削除してもいいですか？')) {
        accountDb.doc(doc).update({ specialPercent: '未選択' }).then(() => {
          this.discountClients[index].specialPercent = '未選択'
          this.reloadDiscountClient()
        })
      }
    },
    campaignReset(doc, index) {
      const accountDb = firebase.firestore().collection('account');
      if(confirm('割引データを削除してもいいですか？')) {
        accountDb.doc(doc).update({ campaignPercent: '未選択' }).then(() => {
          this.discountClients[index].campaignPercent = '未選択'
          this.reloadDiscountClient()
        })
      }
    },
    reloadDiscountClient() {
      const accountDb = firebase.firestore().collection('account');

      accountDb.where('roll', '==', 'client').get().then(response => {
        this.discountClients = [];
        response.forEach(client => {
          const data = client.data();
          const specialData = data.specialPercent;
          const campaignData = data.campaignPercent;
          if(specialData !== '未選択' || campaignData !== '未選択') {
            this.discountClients.push(data);
          }
        })
      })
    }
  }
}
</script>
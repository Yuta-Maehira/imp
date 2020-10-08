<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="mypage-section">
          <h2>マイページ</h2>

          <section class="mypage-basic-section">
            <h3>基本データ</h3>
            <div class="basic-data">

              <!-- プロフィール画像 -->
              <div class="img-box">
                <img v-if="accountData.imgurl" :src="accountData.imgurl" alt="プロフィール画像">
                <img v-else src="../assets/image/no_image.png" alt="プロフィール画像">
              </div>

              <!-- キャストまたはクライアント情報 -->
              <table>
                <tbody>
                  <tr>
                    <th>
                      <div v-if="roll !== 'cast'">会社名</div>
                      <div v-if="roll === 'cast'">名前</div>
                    </th>
                    <td>
                      <div v-if="roll !== 'cast'">{{ accountData.client ? accountData.client : "未設定" }}</div>
                      <div v-if="roll === 'cast'">{{ accountData.name ? accountData.name : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div v-if="roll !== 'cast'">担当者名</div>
                      <div v-if="roll === 'cast'">年齢</div>
                    </th>
                    <td>
                      <div v-if="roll !== 'cast'">{{ accountData.staff ? accountData.staff : "未設定" }}</div>
                      <div v-if="roll === 'cast'">{{ accountData.age ? accountData.age : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div v-if="roll !== 'cast'">電話番号</div>
                      <div v-if="roll === 'cast'">性別</div>
                    </th>
                    <td>
                      <div v-if="roll !== 'cast'">{{ accountData.tell ? accountData.tell : "未設定" }}</div>
                      <div v-if="roll === 'cast'">{{ accountData.adult ? accountData.adult : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div v-if="roll !== 'cast'">アドレス</div>
                      <div v-if="roll === 'cast'">電話番号</div>
                    </th>
                    <td>
                      <div v-if="roll !== 'cast'">{{ accountData.email ? accountData.email : "未設定" }}</div>
                      <div v-if="roll === 'cast'">{{ accountData.tell ? accountData.tell : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr v-if="roll === 'cast'">
                    <th>
                      <div>アドレス</div>
                    </th>
                    <td>
                      <div>{{ accountData.email ? accountData.email : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div>所在地</div>
                    </th>
                    <td>
                      <div v-if="
                        accountData.adress1 !== '' ||
                        accountData.adress2 !== '' ||
                        accountData.apartment !== ''
                      ">
                        {{ accountData.adress1 }}{{ accountData.adress2 }}{{ accountData.apartment }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </section>

          <!-- プロフィール編集ボタン -->
          <router-link to="/mypage/edit/1" tag="div" class="btn">編集する</router-link>

          <!-- 自己PR -->
          <section v-if="roll === 'cast'"  class="pr-section">
            <div class="pr-data-inner">
              <h3 class="pr-title">自己PR</h3>
              <div class="pr-value">{{ accountData.pr ? accountData.pr : '設定されていません' }}</div>
            </div>
          </section>
          
          <!-- SNS情報 -->
          <section v-if="roll === 'cast'" class="sns-section">
            <h3>SNS情報</h3>
            <div class="tab">
              <div :class="{active : isInstagram}" @click="addActive('Instagram')">Instagram</div>
              <div :class="{active : isTwitter}" @click="addActive('Twitter')">Twitter</div>
              <div :class="{active : isYouTube}" @click="addActive('YouTube')">YouTube</div>
              <div :class="{active : isTikTok}" @click="addActive('TikTok')">TikTok</div>
            </div>
            <div class="sns-info">
              <router-view></router-view>
            </div>

          </section>

          <TransactionData></TransactionData>

          <router-link to="/claim/create" v-if="roll === 'admin'" tag="div" class="btn">請求書作成</router-link>

          <!-- 当月発生した支払額 -->
          <section v-if="roll === 'client'" class="client-pay-section">
            <h3>支払情報</h3>
            <ul class="payment-data">
              <li class="title">支払額</li>
              <li class="value">{{ paymentNum }}</li>
              <li class="caution">※受取額は取引完了月の翌々月振込</li>
            </ul>
            <!-- <router-link :to="'/payment/detail/' + year" tag="div" class="btn">支払詳細確認</router-link> -->
            <router-link to="/pay/detail" tag="div" class="btn">
              支払詳細確認</router-link>
          </section>

          <!-- 当月発生した受取額 -->
          <section v-if="roll === 'cast'" class="cast-pay-section">
            <h3>振込情報</h3>
            <ul class="payment-data">
              <li class="title">受取額</li>
              <li class="value">{{ paymentNum }}</li>
            </ul>
            <div class="caution">
              <p>※受取額は取引完了月の翌々月振込</p>
            </div>

            <!-- キャストの振込先情報 -->
            <ul class="bank-data">
              <li>
                <div class="title">銀行名</div>
                <div class="value">{{ accountData.bank ? accountData.bank : "未設定" }}</div>
              </li>
              <li>
                <div class="title">支店名</div>
                <div class="value">{{ accountData.branch ? accountData.branch : "未設定" }}</div>
              </li>
              <li>
                <div class="title">口座番号</div>
                <div class="value">{{ accountData.accountNum ? accountData.accountNum : "未設定" }}</div>
              </li>
            </ul>
          </section>

        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import router from '@/plugins/router'
import firebase from '@/plugins/firebase'
import TransactionData from '@/components/TransactionData.vue'

export default {
  components: {
    Header,
    SideBar,
    TransactionData
  },
  data() {
    return {
      roll: localStorage.roll,
      year: 0,
      accountData: {},
      paymentNum: 0,
      isInstagram: true,
      isTwitter: false,
      isYouTube: false,
      isTikTok: false,
    }
  },
  created() {
    const now = new Date()
    this.year = now.getFullYear()
    const uid = firebase.auth().currentUser.uid
    const accountDb = firebase.firestore().collection('account')
    const campaignDb = firebase.firestore().collection('campaigns')

    // (2) 自分のアカウントデータを取得
    const getMyAccountData = async () => {
      const myAccount = await accountDb.where('userId', '==', uid ).get();
      const myAccountData = myAccount.docs[0].data();
      return myAccountData;
    }

    // (3) 画像のパスがあればURLを取得
    const dataPush = async (myAccountData) => {
      if(myAccountData.imgpath !== '') {
        const imgpath = myAccountData.imgpath;
        const imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
        myAccountData.imgurl = imgurl;
        this.accountData = myAccountData;
      } else {
        this.accountData = myAccountData;
      }
    }
    
    // (4) 取引キャンペーンからドキュメント名とデータを取得
    const getTransactionCampiagn = async () => {
      const transactionCampaignObject = [];
      const transactionCampaigns = await campaignDb.where('contact', '==', true).get();
      transactionCampaigns.forEach(transactionCampaign => {
        transactionCampaignObject.push({
          doc: transactionCampaign.id,
          data: transactionCampaign.data()
        })
      })
      return transactionCampaignObject;
    }

    // (5) クライアントの場合は支払額、キャストの際は報酬額を取得
    const getCampaignApplys = async (transactionCampaignObject) => {
      const now = new Date()
      const month = now.getMonth() + 1
      for(let i = 0; i < transactionCampaignObject.length; i++) {
        const data = transactionCampaignObject[i].data;
        const doc = transactionCampaignObject[i].doc;
        if(this.roll === 'client') {
          if(transactionCampaignObject[0].data.uid === uid) {
            await campaignDb.doc(doc).collection('applys').get().then(response => {
              response.forEach(applysCast => {
                const applyData = applysCast.data()
                if(applyData.complete) {
                  const campaignCompleteDate = applyData.completeTime.toDate()
                  const campaignCompleteMonth = campaignCompleteDate.getMonth() + 1 
                  if(campaignCompleteMonth === month) {
                    this.paymentNum += Number(data.price)
                  }
                }
              })
            })
          }
        } else if(this.roll === 'cast') {
          await campaignDb.doc(doc).collection('applys').doc(uid).get().then(response => {
            if(response.exists) {
              const myApplyData = response.data();
              const campaignCompleteDate = myApplyData.completeTime.toDate()
              const campaignCompleteMonth = campaignCompleteDate.getMonth() + 1
              if(myApplyData.status && myApplyData.complete) {
                if(campaignCompleteMonth === month) {
                  this.paymentNum += Number(data.price);
                }
              }
            }
          })
        }
      }
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const myAccountData = await getMyAccountData()
      await dataPush(myAccountData)
      const transactionCampaignObject = await getTransactionCampiagn()
      await getCampaignApplys(transactionCampaignObject)
    }

    allFunction()

  },
  methods: {

    // キャストのsns活動チェック
    addActive(sns) {
      if(sns === 'Instagram') {
        this.isTwitter = false;
        this.isYouTube = false;
        this.isTikTok = false;
        this.isInstagram = true;
        router.push('/mypage/1')
      } else if(sns === 'Twitter') {
        this.isInstagram = false;
        this.isYouTube = false;
        this.isTikTok = false;
        this.isTwitter = true;
        router.push('/mypage/2')
      } else if(sns === 'YouTube') {
        this.isInstagram = false;
        this.isTwitter = false;
        this.isTikTok = false;
        this.isYouTube = true;
        router.push('/mypage/3')
      } else if(sns === 'TikTok') {
        this.isInstagram = false;
        this.isTwitter = false;
        this.isYouTube = false;
        this.isTikTok = true;
        router.push('/mypage/4')
      }

    }
  }
}
</script>
<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="contact-cast-section">
          <h2>コンタクト</h2>
          <div class="contact-box">
            <!--------------- 管理者、クライアントのみ表示のキャスト情報 --------------->

            <section class="contact-cast" v-if="roll !== 'cast'">
              <paginate class="paginate" name="paginate-log" :list="logs" :per="10" tag="div">
                <article class="cast-box" v-for="(log, index) in paginated('paginate-log')" :key="index">
                  <router-link :to="'/cast/detail/' + log.accountId + '/1'" tag="div" class="cast-link-box">
                    <div class="img-box">
                      <img v-if="log.imgurl" :src="log.imgurl" alt="キャストの画像">
                      <img v-else src="../assets/image/no_image.png" alt="キャストの画像">
                    </div>
                    <div class="cast-info">
                      <div class="cast-name-info">
                        <p class="cast-name">{{ log.name ? nameLimit(log.name) : nameLimit('未設定') }}</p>
                      </div>
                      <div class="category">
                        <p class="cast-category" v-for="(category, index) in log.category" :key="index">{{ category ? category : '未設定' }}</p>
                      </div>
                      <div class="sns-icon">
                        <span :class="{ active: isInstagramActive }"><i class="fab fa-instagram"></i></span>
                        <span :class="{ active: isTwitterActive }"><i class="fab fa-twitter active"></i></span>
                        <span :class="{ active: isYouTubeActive }"><i class="fab fa-youtube"></i></span>
                        <span :class="{ active: isTikTokActive }"><i class="fab fa-tiktok"></i></span>
                      </div>
                      <div v-if="roll === 'admin'" class="inquiry">
                        <p class="email">{{ log.email ? log.email : '未設定' }}</p>
                        <p class="tell">{{ log.tell ? log.tell : '未設定' }}</p>
                      </div>
                    </div>
                  </router-link>
                  <div class="message-btn">
                    <div @click="openModal(log.accountId, log.userId)">チャット</div>
                    <div v-if="roll === 'client' && !log.complete" v-show="isHidden" @click="CompleteOpenModal(log.userId)">取引完了</div>
                  </div>
                </article>
              </paginate>
              <paginate-links for="paginate-log" :limit="3" :show-step-links="true"
                :classes="{
                  'ul': 'pagination',
                  'li': 'pagination-list',
                  'li > a': 'pagination-link'
                }" 
              ></paginate-links>
            </section>


            <!------------------- キャストのみ表示のクライアント情報 ------------------->

            <article v-if="roll === 'cast'" class="client-box">
              <router-link :to="'/client/detail/' + clientData.accountId" tag="div" class="client-link-box">
                <div class="img-box">
                  <img v-if="clientData.imgurl" :src="clientData.imgurl" alt="クライアントの画像">
                  <img v-else src="../assets/image/no_image.png" alt="クライアントの画像">
                </div>
                <div class="client-info">
                  <div class="client-name-info">
                    <p class="client-name">{{ clientData.client ? nameLimit(clientData.client) : nameLimit('未設定') }}</p>
                  </div>
                  <div class="category">
                    <p class="client-category" v-for="(category, index) in clientData.category" :key="index">{{ category ? category : '未設定' }}</p>
                  </div>
                  <div class="inquiry">
                    <p class="email">{{ clientData.email ? clientData.email : '未設定' }}</p>
                    <p class="tell">{{ clientData.tell ? clientData.tell : '未設定' }}</p>
                  </div>
                </div>
              </router-link>
              <div class="message-btn">
                <div @click="openModal(clientData.myAccountId, clientData.myUid)">チャット</div>
              </div>
            </article>

            <!------------------- チャットボタンを押した際のモーダル ------------------->

            <section class="overlay-box" v-show="showModal" @click="closeModal">
              <div class="message-box" @click="stopEvent">
                <div :class="[{helfwidth: roll ==='admin'}, 'name']">
                  <div v-if="roll !== 'client'">
                    <p>{{ clientName ? clientName : '未設定' }}</p>
                  </div>
                  <div v-if="roll !== 'cast'">
                    <p>{{ castName ? castName : '未設定' }}</p>
                  </div>
                </div>

                <!----- クライアントとキャストでチャットの吹き出しを入れ替えている ----->
                <div class="message">
                  <div v-if="roll === 'cast' || roll === 'admin'">
                    <div v-for="(message, index) in messages" :key="index" :class="[{ clientmessage: !message.position }, 'castmessage']">
                      <p>{{ message.coment }}</p>
                    </div>
                  </div>
                  <div v-if="roll === 'client'">
                    <div v-for="(message, index) in messages" :key="index" :class="[{ clientmessage: message.position }, 'castmessage']">
                      <p>{{ message.coment }}</p>
                    </div>
                  </div>
                </div>
                <!---------------------------------------------------------------------->

                <div class="input-box" v-if="roll !== 'admin' && complete">
                  <textarea rows="2" v-model="inputMessage"></textarea>
                  <i @click="saveMessage" class="fas fa-share"></i>
                </div>
              </div>
            </section>

            <!------------------- 取引完了ボタンを押した際のモーダル ------------------->

            <section class="overlay-box" v-show="alertModal" @click="closeModal">
              <div class="alert-box" @click="stopEvent">
                <p>取引を完了してもいいですか？</p>
                <small>※これ以上の連絡はできなくなります</small><br>
                <small>※キャストへの報酬が発生します</small>
                <div class="btn-box">
                  <div @click="closeModal">キャンセル</div>
                  <div @click="transactionComplete">取引完了</div>
                </div>
              </div>
            </section>

          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import firebase from '@/plugins/firebase';

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      roll: localStorage.roll,
      doc: "",
      clientUid: "",
      campaignId: "",
      castId: "",
      castUid: "",
      clientName: "",
      castName: "",
      inputMessage: "",
      clientData: {},
      messages: [],
      logs: [],
      paginate: ['paginate-log'],
      showModal: false,
      alertModal: false,
      complete: true,
      isHidden: true,
      isInstagramActive: false,
      isTwitterActive: false,
      isYouTubeActive: false,
      isTikTokActive: false,
    }
  },
  created() {
    this.campaignId = this.$route.params['id'];
    this.clientUid = this.$route.query.uid
    const accountDb = firebase.firestore().collection('account')
    const campaignDb = firebase.firestore().collection('campaigns')
    const uid = firebase.auth().currentUser.uid

    // キャストの際にクライアントを表示させる処理===============================

    // <共通>選択したキャンペーンのドキュメント名を取得
    const getCampaignDoc = async () => {
      const campaignDoc = await campaignDb.where('campaignid', '==', this.campaignId).get();
      this.doc = campaignDoc.docs[0].id;
    }

    // () <キャスト>選択したキャンペーンの出稿クライアントのデータを取得
    const getClientAccountData = async () => {
      const accountData = [];
      const myAccount = await accountDb.where('userId', '==', uid).get();
      const clientAccount = await accountDb.where('userId', '==', this.clientUid).get();
      const myAccountData = myAccount.docs[0].data();
      const clientAccountData = clientAccount.docs[0].data();
      accountData.push({
        myData: myAccountData,
        clientData: clientAccountData
      })
      return accountData;
    }
    // (3) <キャスト>imgpathがあればimgurlを取得し、なければそのまま格納する処理
    const dataPush = async (accountData) => {
      const myData = accountData[0].myData;
      const clientData = accountData[0].clientData;
      if(clientData.imgpath !== "") {
        const imgpath = clientData.imgpath;
        await firebase.storage().ref().child(imgpath).getDownloadURL().then(response => {
          clientData.imgurl = response;
          clientData.myAccountId = myData.accountId;
          clientData.myUid = uid;
          this.clientData = clientData;
        })
      } else {
        clientData.myAccountId = myData.accountId;
        clientData.myUid = uid;
        this.clientData = clientData;
      }
    }

    // (2) <クライアント>取引中のキャスト応募データを取得
    const getTransactionCast = async () => {
      const transactionCastsArray = [];
      const transactionCasts = await campaignDb.doc(this.doc).collection('applys').where('status', '==', true).get();
      this.campaignId = transactionCasts.docs[0].data().campaignId
      transactionCasts.forEach(transactionCast => {
        transactionCastsArray.push(transactionCast.data())
      })
      return transactionCastsArray;
    }

    // (3) <クライアント>取引中のキャスト応募データからアカウント情報を取得
    const getTransactionCastAccount = async (transactionCastsArray) => {
      const transactionCastAccountArray = [];
      for(let i = 0; i < transactionCastsArray.length; i++) {
        const transactionCastAccount = await accountDb.where('userId', '==', transactionCastsArray[i].uid).get();
        const data = transactionCastAccount.docs[0].data();
        data.complete = transactionCastsArray.complete;
        transactionCastAccountArray.push(data);
      }
      return transactionCastAccountArray;
    }

    // (4) imgpathがあればimgurlを取得し、なければそのまま格納する処理
    const castDataPush = async (transactionCastAccountArray) => {
      for(let i = 0; i < transactionCastAccountArray.length; i++) {
        snsActiveCheck(transactionCastAccountArray[i])
        if(transactionCastAccountArray[i].imgpath !== "") {
          const imgpath = transactionCastAccountArray[i].imgpath;
          const imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
          transactionCastAccountArray[i].imgurl = imgurl;
          this.logs.push(transactionCastAccountArray[i]);
        } else {
          this.logs.push(transactionCastAccountArray[i]);
        }
      }
    }
    
    // キャストのsns活動チェック
    const snsActiveCheck = (data) => {
      if(
          data.myInstagram.accountId !== "" || data.myInstagram.accountName !== "" ||
          data.myInstagram.accountType !== "" || data.myInstagram.followerCount !== "" ||
          data.myInstagram.goodAverage !== "" || data.myInstagram.engagement !== ""
        ) this.isInstagramActive = true;

        if(
          data.myTwitter.accountId !== "" || data.myTwitter.accountName !== "" ||
          data.myTwitter.accountType !== "" || data.myTwitter.followerCount !== "" ||
          data.myTwitter.goodAverage !== "" || data.myTwitter.engagement !== ""
        ) this.isTwitterActive = true;

        if(
          data.myYouTube.accountId !== "" || data.myYouTube.accountName !== "" ||
          data.myYouTube.accountType !== "" || data.myYouTube.followerCount !== "" ||
          data.myYouTube.goodAverage !== "" || data.myYouTube.engagement !== ""
        ) this.isYouTubeActive = true;

        if(
          data.myTikTok.accountId !== "" || data.myTikTok.accountName !== "" ||
          data.myTikTok.accountType !== "" || data.myTikTok.followerCount !== "" ||
          data.myTikTok.goodAverage !== "" || data.myTikTok.engagement !== ""
        ) this.isTikTokActive = true;
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      await getCampaignDoc()
      if(this.roll === 'cast') {
        const accountData = await getClientAccountData()
        await dataPush(accountData)
      } else {
        const transactionCastsArray = await getTransactionCast()
        const transactionCastAccountArray = await getTransactionCastAccount(transactionCastsArray)
        await castDataPush(transactionCastAccountArray)
      }
    }

    allFunction()

  },
  methods: {
    nameLimit(text) {
      const maxLength = 18;
      if(text.length > maxLength) {
        return text.substr(0, maxLength) + '...';
      }
      return text;
    },
    openModal(castId, castUid) {
      this.castId = castId
      console.log(castId)
      console.log(castUid)
      this.showModal = true
      const accountDb = firebase.firestore().collection('account')
      const campaignsDb = firebase.firestore().collection('campaigns')
      const messageDb = firebase.firestore().collection('message')
      console.log(this.doc)
      campaignsDb.doc(this.doc).collection('applys').doc(castUid).get().then(response => {
        if(response.data().complete === true) {
          this.complete = false
        }
      })
      accountDb.where('accountId', '==', this.castId).get().then(response => { // キャストの名前を取得
        this.castName = response.docs[0].data().name
      })
      accountDb.where('userId', '==', this.clientUid).get().then(response => { // クライアントの名前を取得
        this.clientName = response.docs[0].data().client
      })
      messageDb.doc(this.campaignId + this.castId).get()
      .then(response => { this.messages = response.data().message })
    },
    CompleteOpenModal(castUid) {
      this.castUid = castUid
      this.alertModal = true
    },
    closeModal() {
      this.showModal = false
      this.alertModal = false
    },
    stopEvent(e) {
      e.stopPropagation()
    },
    saveMessage() {
      const messageDb = firebase.firestore().collection('message')
      const messageDoc = this.campaignId + this.castId
      let messageData = []
      if(this.messages.length === 0) {
        if(this.roll === "client") {
          messageData.push({ campaignId: this.campaignId, coment: this.inputMessage, position: true, date: new Date() })
        } else if(this.roll === "cast") {
          messageData.push({ campaignId: this.campaignId, coment: this.inputMessage, position: false, date: new Date() })
        }
        messageDb.doc(messageDoc).set({ message: messageData }).then(() => {
          this.inputMessage = ""
          this.messages = messageData
        })
      } else {
        messageDb.doc(messageDoc).get().then(response => { 
          messageData = response.data().message
          if(this.roll === "client") {
            messageData.push({ campaignId: this.campaignId, coment: this.inputMessage, position: true, date: new Date() })
          } else if(this.roll === "cast") {
            messageData.push({ campaignId: this.campaignId, coment: this.inputMessage, position: false, date: new Date() })
          }
          messageDb.doc(messageDoc).update({ message: messageData }).then(() => {
            this.inputMessage = ""
            this.messages = messageData
          })
        })
      }
    },
    transactionComplete() {
      const campaignDb = firebase.firestore().collection('campaigns')
      campaignDb.doc(this.doc).collection('applys').doc(this.castUid).update({
        complete: true,
        completeTime: new Date()
      }).then(() => {
        this.isHidden = false
        campaignDb.doc(this.doc).collection('applys')
        .where('status', '==', true).get().then(response => {
          if(response.size > 0) {
            let num = 0
            response.forEach(apply => {
              if(apply.data().complete === true) {
                num += 1
              }
            })
            if(this.logs.length === num) {
              campaignDb.doc(this.doc).update({ complete: true, completeDate: new Date() })
            }
          }
        })
      })
      campaignDb.where('campaignid', '==', this.campaignId).get().then(response => {
        const data = response.docs[0].data()
        const nowPayment = data.payment
        campaignDb.doc(this.doc).update({
          payment: Number(nowPayment) + Number(data.price)
        }).then(() => {
          this.closeModal()
        })
      })
    }
  }
}
</script>
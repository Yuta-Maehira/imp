<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="campaign-detail-section">
          <h2>キャンペーン詳細</h2>

          <!-- キャンペーンへの応募ボタン(キャストのみ) -->
          <div class="btn" v-if="roll === 'cast' && isApplied" @click="applyCampaign">応募する</div>
          <div class="btn already-apply" v-if="roll === 'cast' && !isApplied">応募済</div>

          <!-- キャンペーン画像のカルーセル -->
          <section>
            <carousel
              :per-page="1"
              :navigation-enabled="true"
              navigation-prev-label="〈"
              navigation-next-label="〉">
              <slide v-for="imgurl in campaignData.imgurl" :key="imgurl">
                <img v-if="imgurl" :src="imgurl" alt="キャンペーンの画像">
                <img v-else src="@/assets/image/no_image.png">
              </slide>
            </carousel>
          </section>

          <!-- キャンペーン情報 -->
          <section>
            <table class="campaign-detail-table">
              <tbody>
                <tr>
                  <th>
                    <div>タイトル</div>
                  </th>
                  <td>
                    <div>{{ campaignData.title }}</div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div>希望SNS</div>
                  </th>
                  <td>
                    <div>
                      <span v-if="campaignData.instagram"><i class="fab fa-instagram"></i></span>
                      <span v-if="campaignData.twitter"><i class="fab fa-twitter"></i></span>
                      <span v-if="campaignData.youtube"><i class="fab fa-youtube"></i></span>
                      <span v-if="campaignData.tiktok"><i class="fab fa-tiktok"></i></span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div>報酬金額</div>
                  </th>
                  <td>
                    <div>{{ campaignData.price }}円</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
          
          <!-- キャンペーン内容 -->
          <section>
            <h3 class="campaign-detail-h3">キャンペーン内容</h3>
            <p class="campaign-detail">{{ campaignData.description }}</p>
          </section>

          <!-- キャンペーンの応募者一覧(クライアントのみ) -->
          <section v-if="roll === 'client'">
            <h3>応募者一覧</h3>
            <paginate class="paginate" name="paginate-log" :list="logs" :per="10">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>ニックネーム</th>
                    <th>詳細 / 依頼ボタン</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(log, index) in paginated('paginate-log')" :key="index" class="cast-row">
                    <td>
                      <div  class="cast-img">
                        <img :src="log.imgurl" alt="キャストの画像">
                      </div>
                    </td>
                    <td>
                      <div>{{ log.nickName ? log.nickName : '未設定' }}</div>
                    </td>
                    <td class="detail-btn-box">
                      <router-link :to="'/cast/detail/' + log.accountId" tag="div" class="detail-btn">詳細</router-link>
                      <div class="detail-btn offer" @click="clientOffer(log.userId, index)" v-if="log.isAsigned">依頼</div>
                      <div class="detail-btn already-offer" v-else>依頼済</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </paginate>
            <paginate-links 
              for="paginate-log" 
              :limit="9"
              :classes="{
                'ul': 'pagination',
                'li': 'pagination-list',
                'li > a': 'pagination-link'
              }" 
              :show-step-links="true"
            ></paginate-links>
          </section>

          <!-- キャンペーンへの応募ボタン(キャストのみ) -->
          <div class="btn" v-if="roll === 'cast' && isApplied" @click="applyCampaign">応募する</div>
          <div class="btn already-apply" v-if="roll === 'cast' && !isApplied">応募済</div>
        </section>

      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import firebase from '@/plugins/firebase'

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      roll: localStorage.roll,
      campaignId: 0,
      campaignData: [],
      isApplied: true,
      logs: [],
      paginate: ['paginate-log']
    }
  },
  created() {
    this.campaignId = this.$route.params['id'];
    const campaignDb = firebase.firestore().collection('campaigns');
    const accountDb = firebase.firestore().collection('account');
    let campaign = {};
    let campaignDoc = '';

    // (2) キャンペーンデータを取得しデータとドキュメント名を変数に格納する処理
    const getCampaigns = async () => {
      const selectCampaign = await campaignDb.where('campaignid', '==', this.campaignId).get();
      campaign = selectCampaign.docs[0].data();
      campaignDoc = selectCampaign.docs[0].id;
      dataPush(campaign);
    }

    // (3) rollがcastの際に応募ボタンを表示させる処理
    const applyBtn = async () => {
      const uid = firebase.auth().currentUser.uid;
      const myApply = await campaignDb.doc(campaignDoc).collection('applys').doc(uid).get();
      if(myApply.exists) this.isApplied = false;
    }

    // (4) rollがclientの際に応募者一覧を表示させる処理
    const applysList = async () => {
      const applys = await campaignDb.doc(campaignDoc).collection('applys').get();
      for(let i = 0; i < applys.size; i++) {
        const applyData = applys.docs[i].data();
        let assign = false;
        if(!applyData.status) {
          assign = true;
        }
        const applyCast = await accountDb.where('userId', '==', applyData.uid).get();
        const castData = applyCast.docs[0].data();
        castData.isAsigned = assign;
        dataPush(castData);
      }
    }

    // imgpathがあればimgurlを取得し、なければそのまま格納する処理
    const dataPush = async (data) => {
      if(Array.isArray(data.imgpath)) { // キャンペーンデータ
        if(data.imgpath.length !== 0) {
          const imgpath = data.imgpath;
          let url = [];
          for(let i = 0; i < imgpath.length; i++) {
            const path = imgpath[i]
            const imgurl = await firebase.storage().ref().child(path).getDownloadURL();
            url.push(imgurl);
          }
          data.imgurl = url;
          this.campaignData = data;
        } else {
          this.campaignData = data;
        }
      } else { // 応募者データ
        if(data.imgpath !== '') {
          const imgpath = data.imgpath;
          const imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
          data.imgurl = imgurl;
          this.logs.push(data);
        } else {
          this.logs.push(data);
        }
      }
    }
    
    // (1) 全ての関数を実行
    const allFunction = async () => {
      await getCampaigns()
      if(campaign.contact && this.roll === 'cast') await applyBtn()
      if(this.roll === 'client') await applysList()
    }

    allFunction()

  },
  methods: {
    applyCampaign() {
      const uid = firebase.auth().currentUser.uid
      const campaignDb = firebase.firestore().collection('campaigns')
      if (confirm('本当に応募しますか？')) {
        campaignDb.where('campaignid', '==', this.campaignId).get().then(response => {
          const data = response.docs[0].data()
          const doc = response.docs[0].id
          campaignDb.doc(doc).update({ contact: true, complete: false })
          campaignDb.doc(doc).collection('applys').doc(uid).set({
            campaignId: this.campaignId,
            uid: uid,
            status: false,
            complete: false,
            applyDate: new Date(),
            price: data.price
          }).then(() => {
            this.isApplied = false
          })
        })
      }
    },
    clientOffer(uid, index) {
      const campaignDb = firebase.firestore().collection('campaigns')
      if(confirm('依頼してもいいですか？')) {
        campaignDb.where('campaignid', '==', this.campaignId).get().then(response => {
          const campaignDoc = response.docs[0].id
          campaignDb.doc(campaignDoc).collection('applys').doc(uid).update({
            status: true
          }).then(() => {
            this.logs[index].isAsigned = false
          })
        })
      }
    }
  }
}
</script>
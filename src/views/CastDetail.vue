<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="cast-detail-section">
          <h2>キャスト詳細</h2>

          <section class="cast-basic-section">
            <h3>基本データ</h3>
            <div class="basic-data">

              <!-- キャストの画像 -->
              <div class="img-box">
                <img v-if="castData[0].imgurl" :src="castData[0].imgurl">
                <img v-else src="@/assets/image/no_image.png" alt="キャストの画像">
              </div>

              <!-- キャスト情報 -->
              <table>
                <tbody>
                  <tr>
                    <th>
                      <div>名前</div>
                    </th>
                    <td>
                      <div>{{ castData[0].name ? castData[0].name : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                  <tr>
                    <th>
                      <div>年齢</div>
                    </th>
                    <td>
                      <div>{{ castData[0].age ? castData[0].age : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div>性別</div>
                    </th>
                    <td>
                      <div>{{ castData[0].adult ? castData[0].adult : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr v-if="roll === 'admin'">
                    <th>
                      <div>電話番号</div>
                    </th>
                    <td>
                      <div>{{ castData[0].tell ? castData[0].tell : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr v-if="roll === 'admin'">
                    <th>
                      <div>アドレス</div>
                    </th>
                    <td>
                      <div>{{ castData[0].email ? castData[0].email : "未設定" }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </section>

          <!-- 自己PR -->
          <section class="pr-section">
            <div class="pr-data-inner">
              <h3 class="pr-title">自己PR</h3>
              <div class="pr-value">{{ castData[0].pr ? castData[0].pr : '設定されていません' }}</div>
            </div>
          </section>

          <!-- sns情報 -->
          <section class="sns-section">
            <h3>SNS情報</h3>
            <div class="tab">
              <div :class="{active : isInstagram}" @click="addActive('Instagram')">Instagram</div>
              <div :class="{active : isTwitter}" @click="addActive('Twitter')">Twitter</div>
              <div :class="{active : isYouTube}" @click="addActive('YouTube')">YouTube</div>
              <div :class="{active : isTikTok}" @click="addActive('TikTok')">TikTok</div>
            </div>
            <div class="sns-info">
              <router-view :accountId="this.accountId"></router-view>
            </div>
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

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      roll: localStorage.roll,
      accountId: 0,
      castData: [],
      isInstagram: true,
      isTwitter: false,
      isYouTube: false,
      isTikTok: false,
    }
  },
  created() {
    this.accountId = this.$route.params['id'];
    const accountDb = firebase.firestore().collection('account');

    // (2) 選択したキャストデータを取得
    const getCast = async () => {
      const castDataArray = [];
      const selectCast = await accountDb.where('accountId', '==', this.accountId).get();
      selectCast.forEach(cast => {
        castDataArray.push(cast.data());
      })
      return castDataArray;
    }

    // (3) 画像のパスがあればURLを取得
    const pushData = async (castDataArray) => {
      for(let i = 0; i < castDataArray.length; i++) {
        if(castDataArray[i].imgpath !== '') {
          const imgpath = castDataArray[i].imgpath;
          const imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
          castDataArray[i].imgurl = imgurl;
          this.castData.push(castDataArray[i]);
        } else {
          this.castData.push(castDataArray[i]);
        }
      }
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const castDataArray = await getCast()
      await pushData(castDataArray)
    }

    allFunction()

  },
  methods: {

    // snsタブの切り替えでページの切り替え
    addActive(sns) {
      if(sns === 'Instagram') {
        this.isTwitter = false;
        this.isYouTube = false;
        this.isTikTok = false;
        this.isInstagram = true;
        if(this.roll === 'admin' || this.roll === 'client') router.push('/cast/detail/' + this.accountId + '/1')

      } else if(sns === 'Twitter') {
        this.isInstagram = false;
        this.isYouTube = false;
        this.isTikTok = false;
        this.isTwitter = true;
        if(this.roll === 'admin' || this.roll === 'client') router.push('/cast/detail/' + this.accountId + '/2')

      } else if(sns === 'YouTube') {
        this.isInstagram = false;
        this.isTwitter = false;
        this.isTikTok = false;
        this.isYouTube = true;
        if(this.roll === 'admin' || this.roll === 'client') router.push('/cast/detail/' + this.accountId + '/3')

      } else if(sns === 'TikTok') {
        this.isInstagram = false;
        this.isTwitter = false;
        this.isYouTube = false;
        this.isTikTok = true;
        if(this.roll === 'admin' || this.roll === 'client') router.push('/cast/detail/' + this.accountId + '/4')
      }
    }
  }
}
</script>
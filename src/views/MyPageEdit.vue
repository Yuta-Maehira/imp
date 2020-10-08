<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="mypage-edit-section">
          <h2>プロフィール編集</h2>

          <!-- 基本情報編集フォーム -->
          <section class="profile-edit-section">
            <h3>基本情報</h3>
            <div class="basic-data">
              <div class="img-box">
                <img v-if="profileData.imgurl" :src="profileData.imgurl">
                <img v-else src="../assets/image/no_image.png" alt="プロフィール画像">
              </div>
              <form class="profile-input-form" name="createprofile">
                <!-- プロフィール画像フォーム -->
                <div class="form-input">
                  <label for="image"><span class="required">必須</span>プロフィール画像</label>
                  <input type="file" id="image" name="image" @change="attachImage" required>
                </div>

                <!-- 会社名入力フォーム -->
                <div v-if="roll === 'admin' || roll === 'client'" class="form-input">
                  <label for="client"><span class="required">必須</span>会社名</label>
                  <input type="text" id="client" name="client" v-model.trim="profileData.client" required>
                </div>

                <!-- 担当者名入力フォーム -->
                <div v-if="roll === 'admin' || roll === 'client'" class="form-input">
                  <label for="staff"><span class="required">必須</span>担当者名</label>
                  <input type="text" id="staff" name="staff" v-model.trim="profileData.staff" required>
                </div>

                <!-- キャスト名入力フォーム -->
                <div v-if="roll === 'cast'" class="form-input">
                  <label for="client"><span class="required">必須</span>名前</label>
                  <input type="text" id="client" name="client" v-model.trim="profileData.name" required>
                </div>

                <!-- キャストニックネーム入力フォーム -->
                <div v-if="roll === 'cast'" class="form-input">
                  <label for="staff"><span class="required">必須</span>ニックネーム</label>
                  <input type="text" id="staff" name="staff" v-model.trim="profileData.nickName" required>
                </div>

                <!-- メールアドレス入力フォーム -->
                <div class="form-input">
                  <label for="email"><span class="required">必須</span>メールアドレス</label>
                  <input type="text" id="email" name="email" :value="profileData.email" required readonly>
                </div>

                <!-- 電話番号入力フォーム -->
                <div class="form-input">
                  <label for="tell"><span class="free">任意</span>電話番号</label>
                  <input type="text" id="tell" name="tell" v-model.trim="profileData.tell" required>
                </div>

                <div class="form-input">
                  <label for="adress1"><span class="free">任意</span>都道府県</label>
                  <select v-model="profileData.adress1">
                    <option v-for="prefecture in prefectures" :key="prefecture">{{ prefecture }}</option>
                  </select>
                </div>

                <div class="form-input">
                  <label for="adress2"><span class="free">任意</span>以降住所</label>
                  <input type="text" id="adress2" name="adress2" v-model.trim="profileData.adress2">
                </div>

                <div class="form-input">
                  <label for="apartment"><span class="free">任意</span>建物名</label>
                  <input type="text" id="apartment" name="apartment" v-model.trim="profileData.apartment">
                </div>

              </form>
            </div>
          </section>

          <!-- pr情報編集フォーム -->
          <section v-if="roll === 'cast'" class="pr-edit-section">
            <h3>PR情報</h3>
            <form class="pr-input-form" name="createpr">
              <label for="pr"><span class="free">任意</span>PR</label>
              <textarea name="pr" rows="10" placeholder="※ クライアントにむけたPR文を記入してください" v-model.trim="profileData.pr"></textarea>
            </form>
          </section>

          <!-- SNS情報編集フォーム -->
          <section v-if="roll === 'cast'" class="sns-edit-section">
            <h3>SNS情報</h3>
            <div class="tab">
              <div :class="{active : isInstagram}" @click="addActive('Instagram')">Instagram</div>
              <div :class="{active : isTwitter}" @click="addActive('Twitter')">Twitter</div>
              <div :class="{active : isYouTube}" @click="addActive('YouTube')">YouTube</div>
              <div :class="{active : isTikTok}" @click="addActive('TikTok')">TikTok</div>
            </div>
            <div class="sns-info">
              <router-view ref="profileConfirm"></router-view>
            </div>
          </section>

          <!-- 振込先情報編集フォーム -->
          <section v-if="roll === 'cast'" class="bank-edit-section">
            <h3 v-if="roll === 'cast'">振込先情報</h3>
            <form v-if="roll === 'cast'" class="bank-input-form" name="createbank">

              <div class="form-input">
                <label for="tell"><span class="free">任意</span>銀行名</label>
                <input type="text" id="tell" name="tell" v-model.trim="profileData.bank" placeholder="○○銀行" required>
              </div>

              <div class="form-input">
                <label for="tell"><span class="free">任意</span>支店名</label>
                <input type="text" id="tell" name="tell" v-model.trim="profileData.branch" placeholder="○○支店" required>
              </div>

              <div class="form-input">
                <label for="tell"><span class="free">任意</span>口座番号</label>
                <input type="text" id="tell" name="tell" v-model.trim="profileData.accountNum" required>
              </div>

            </form>
          </section>

          <div class="btn" @click="profileConfirm">確認する</div> 
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
      prefectures: ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"],
      profileData: {
        image: {},
        imgpath: '',
        imgurl: '',
        client: '',
        staff: '',
        name: '',
        nickName: '',
        adress1: '',
        adress2: '',
        apartment: '',
        email: '',
        tell: '',
        bank: '',
        branch: '',
        accountNum: '',
        pr: '',
      },
      uploadedImage: '',
      isInstagram: true,
      isTwitter: false,
      isYouTube: false,
      isTikTok: false,
    }
  },
  created() {
    const uid = firebase.auth().currentUser.uid
    const accountDb = firebase.firestore().collection('account')

    // (2) 自分のアカウントデータを取得
    const getMyAccountData = async () => {
      const myAccount = await accountDb.where('userId', '==', uid ).get();
      const myAccountData = myAccount.docs[0].data();
      return myAccountData;
    }

    // (3) 画像のパスがあればURLを取得
    const getImgUrl = async (myAccountData) => {
      if(myAccountData.imgpath !== '') {
        this.profileData.imgpath = myAccountData.imgpath;
        const imgurl = await firebase.storage().ref().child(this.profileData.imgpath).getDownloadURL();
        this.profileData.imgurl = imgurl;
      }
    }

    // (4) 変数にデータを代入する処理
    const dataAssignment = (myAccountData) => {
      this.profileData.client = myAccountData.client;
      this.profileData.staff = myAccountData.staff;
      this.profileData.adress1 = myAccountData.adress1;
      this.profileData.adress2 = myAccountData.adress2;
      this.profileData.apartment = myAccountData.apartment;
      this.profileData.email = myAccountData.email;
      this.profileData.tell = myAccountData.tell;
      if(this.roll === 'cast') {
        this.profileData.name = myAccountData.name
        this.profileData.nickName = myAccountData.nickName
        this.profileData.bank = myAccountData.bank;
        this.profileData.branch = myAccountData.branch;
        this.profileData.accountNum = myAccountData.accountNum;
      }
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const myAccountData = await getMyAccountData()
      await getImgUrl(myAccountData)
      await dataAssignment(myAccountData)
    }

    allFunction()

  },
  methods: {

    // アップロードした画像データからURLを取得
    attachImage(e) {
      this.profileData.image = e;
      let reader = new FileReader();
      reader.onload = (e) => {
        this.profileData.imgurl = e.target.result;
      };
      reader.readAsDataURL(this.profileData.image.target.files[0]);
    },

    // 子コンポーネントの実行とコミット
    profileConfirm() {
      if(this.roll === 'cast') {
        this.$refs.profileConfirm.profileConfirm()
      }
      this.$store.commit('myPageBasicDataMove', this.profileData);
    },

    // キャストのsns活動チェック
    addActive(sns) {
      if(sns === 'Instagram') {
        this.isTwitter = false;
        this.isYouTube = false;
        this.isTikTok = false;
        this.isInstagram = true;
        router.push('/mypage/edit/1')
      } else if(sns === 'Twitter') {
        this.isInstagram = false;
        this.isYouTube = false;
        this.isTikTok = false;
        this.isTwitter = true;
        router.push('/mypage/edit/2')
      } else if(sns === 'YouTube') {
        this.isInstagram = false;
        this.isTwitter = false;
        this.isTikTok = false;
        this.isYouTube = true;
        router.push('/mypage/edit/3')
      } else if(sns === 'TikTok') {
        this.isInstagram = false;
        this.isTwitter = false;
        this.isYouTube = false;
        this.isTikTok = true;
        router.push('/mypage/edit/4')
      }

    }
  }
}
</script>
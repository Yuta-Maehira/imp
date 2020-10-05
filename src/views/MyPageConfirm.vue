<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="mypage-section">
          <h2>マイページ</h2>

          <section class="mypage-basic-data">

            <!-- プロフィール画像 -->
            <div class="img-box">
              <img v-if="profileData.imgurl" :src="profileData.imgurl" alt="プロフィール画像">
              <img v-else src="../assets/image/no_image.png" alt="プロフィール画像">
            </div>

            <!-- キャストまたはクライアント情報 -->
            <section class="mypage-basic-data-section">
              <h3>基本データ</h3>
              <table>
                <tbody>
                  <tr>
                    <th>
                      <div v-if="roll !== 'cast'">会社名</div>
                      <div v-if="roll === 'cast'">名前</div>
                    </th>
                    <td>
                      <div v-if="roll !== 'cast'">{{ profileData.client ? profileData.client : "未設定" }}</div>
                      <div v-if="roll === 'cast'">{{ profileData.name ? profileData.name : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div v-if="roll !== 'cast'">担当者名</div>
                      <div v-if="roll === 'cast'">年齢</div>
                    </th>
                    <td>
                      <div v-if="roll !== 'cast'">{{ profileData.staff ? profileData.staff : "未設定" }}</div>
                      <div v-if="roll === 'cast'">{{ profileData.age ? profileData.age : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div v-if="roll !== 'cast'">電話番号</div>
                      <div v-if="roll === 'cast'">性別</div>
                    </th>
                    <td>
                      <div v-if="roll !== 'cast'">{{ profileData.tell ? profileData.tell : "未設定" }}</div>
                      <div v-if="roll === 'cast'">{{ profileData.adult ? profileData.adult : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div v-if="roll !== 'cast'">アドレス</div>
                      <div v-if="roll === 'cast'">電話番号</div>
                    </th>
                    <td>
                      <div v-if="roll !== 'cast'">{{ profileData.email ? profileData.email : "未設定" }}</div>
                      <div v-if="roll === 'cast'">{{ profileData.tell ? profileData.tell : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr v-if="roll === 'cast'">
                    <th>
                      <div>アドレス</div>
                    </th>
                    <td>
                      <div>{{ profileData.email ? profileData.email : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div>所在地</div>
                    </th>
                    <td>
                      <div v-if="
                        profileData.adress1 !== '' &&
                        profileData.adress2 !== '' &&
                        profileData.apartment !== ''
                      ">
                        {{ profileData.adress1 }}{{ profileData.adress2 }}{{ profileData.apartment }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

          </section>
          
          <!-- SNS情報 -->
          <section v-if="roll === 'cast'">
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

          <!-- キャストの振込先情報 -->
          <section v-if="roll === 'cast'">
            <h3>振込情報</h3>
            <ul class="bank-data">
              <li>
                <div class="title">銀行名</div>
                <div class="value">{{ profileData.bank ? profileData.bank : "未設定" }}</div>
              </li>
              <li>
                <div class="title">支店名</div>
                <div class="value">{{ profileData.branch ? profileData.branch : "未設定" }}</div>
              </li>
              <li>
                <div class="title">口座番号</div>
                <div class="value">{{ profileData.accountNum ? profileData.accountNum : "未設定" }}</div>
              </li>
            </ul>
          </section>
          <div class="btn" @click="saveProfileData">保存する</div> 
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import firebase from '@/plugins/firebase'
import router from '@/plugins/router'

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      roll: localStorage.roll,
      isInstagram: true,
      isTwitter: false,
      isYouTube: false,
      isTikTok: false,
    }
  },
  computed: {
    profileData() {
      return this.$store.state.profileData;
    },
    snsData() {
      return this.$store.state.snsData;
    }
  },
  methods: {

    // キャストのsns活動チェック
    addActive(sns) {
      if(sns === 'Instagram') {
        this.isTwitter = false;
        this.isYouTube = false;
        this.isTikTok = false;
        this.isInstagram = true;
        router.push('/mypage/confirm/1')
      } else if(sns === 'Twitter') {
        this.isInstagram = false;
        this.isYouTube = false;
        this.isTikTok = false;
        this.isTwitter = true;
        router.push('/mypage/confirm/2')
      } else if(sns === 'YouTube') {
        this.isInstagram = false;
        this.isTwitter = false;
        this.isTikTok = false;
        this.isYouTube = true;
        router.push('/mypage/confirm/3')
      } else if(sns === 'TikTok') {
        this.isInstagram = false;
        this.isTwitter = false;
        this.isYouTube = false;
        this.isTikTok = true;
        router.push('/mypage/confirm/4')
      }
    },

    // プロフィールデータをデータベースに保存
    saveProfileData() {
      const uid = firebase.auth().currentUser.uid;
      const accountDb = firebase.firestore().collection('account');
      const myProfileData = this.profileData;

      const saveImage = async () => {
        const uid = firebase.auth().currentUser.uid;
        const event = this.profileData.image;
        const uploadFile = event.target.files[0];
        const storepath = 'profileimages/' + uid + '/' + uploadFile.name;
        const storageRef = firebase.storage().ref().child(storepath);
        myProfileData.imgpath = storepath;
        storageRef.put(uploadFile);
      }

      const getAccount = async () => {
        const myAccount = await accountDb.where('userId', '==', uid).get();
        const myDoc = myAccount.docs[0].id;
        return myDoc;
      }

      const saveData = async (myDoc) => {
        if(this.roll === 'cast') {
          accountDb.doc(myDoc).update({
            name: myProfileData.name,
            tell: myProfileData.tell,
            email: myProfileData.email,
            adress1: myProfileData.adress1,
            adress2: myProfileData.adress2,
            apartment: myProfileData.apartment,
            imgpath: myProfileData.imgpath,
            bank: myProfileData.bank,
            branch: myProfileData.branch,
            accountNum: myProfileData.accountNum,
            myInstagram: {
              accountId: localStorage.instagramId,
              accountName: localStorage.instagramName,
              accountType: localStorage.instagramType,
              followerCount: localStorage.instagramFollower,
              goodAverage: localStorage.instagramAverage,
              engagement: localStorage.instagramEngage,
            },
            myTwitter: {
              accountId: localStorage.twitterId,
              accountName: localStorage.twitterName,
              accountType: localStorage.twitterType,
              followerCount: localStorage.twitterFollower,
              goodAverage: localStorage.twitterAverage,
              engagement: localStorage.twitterEngage,
            },
            myYouTube: {
              accountId: localStorage.youtubeId,
              accountName: localStorage.youtubeName,
              accountType: localStorage.youtubeType,
              followerCount: localStorage.youtubeFollower,
              goodAverage: localStorage.youtubeAverage,
              engagement: localStorage.youtubeEngage,
            },
            myTikTok: {
              accountId: localStorage.tiktokId,
              accountName: localStorage.tiktokName,
              accountType: localStorage.tiktokType,
              followerCount: localStorage.tiktokFollower,
              goodAverage: localStorage.tiktokAverage,
              engagement: localStorage.tiktokEngage,
            }
          })
        } else if(this.roll === 'admin' || this.roll === 'client') {
          accountDb.doc(myDoc).update({
            name: myProfileData.name,
            tell: myProfileData.tell,
            email: myProfileData.email,
            adress1: myProfileData.adress1,
            adress2: myProfileData.adress2,
            apartment: myProfileData.apartment,
            imgpath: myProfileData.imgpath,            
          })
        }
        router.push('/mypage')
      }

      const allFunction = async () => {
        if(Object.keys(this.profileData.image).length !== 0) {
          await saveImage();
        }
        const myDoc = await getAccount();
        await saveData(myDoc)
      }

      allFunction()
    }
  }
}
</script>
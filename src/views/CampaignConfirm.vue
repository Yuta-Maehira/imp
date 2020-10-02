<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="campaign-confirm-section">
          <h2>登録案件の確認</h2>

          <!-- キャンペーン画像のカルーセル -->
          <section>
            <carousel
              :per-page="1"
              :navigation-enabled="true"
              navigation-prev-label="〈"
              navigation-next-label="〉">
              <slide v-for="uploadedImage in uploadedImages" :key="uploadedImage">
                <img v-if="uploadedImage" :src="uploadedImage" alt="キャンペーンの画像">
                <img v-else src="@/assets/image/no_image.png">
              </slide>
            </carousel>
          </section>

          <!-- キャンペーン情報 -->
          <section>
            <table class="campaign-confirm-table">
              <tbody>
                <tr>
                  <th>
                    <div>タイトル</div>
                  </th>
                  <td>
                    <div>{{ campaignDataObject.campaignTitle }}</div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div>希望SNS</div>
                  </th>
                  <td>
                    <div>
                      <span v-if="campaignDataObject.instagram"><i class="fab fa-instagram"></i></span>
                      <span v-if="campaignDataObject.twitter"><i class="fab fa-twitter"></i></span>
                      <span v-if="campaignDataObject.youtube"><i class="fab fa-youtube"></i></span>
                      <span v-if="campaignDataObject.tiktok"><i class="fab fa-tiktok"></i></span>     
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div>報酬金額</div>
                  </th>
                  <td>
                    <div>{{ campaignDataObject.price }}円</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- キャンペーン内容 -->
          <section>
            <h3 class="campaign-confirm-h3">キャンペーン内容</h3>
            <p class="campaign-confirm-description">{{ campaignDataObject.campaignDescription }}</p>
          </section>
          
          <!-- キャンペーン内容 -->
          <div class="btn" @click="campaignCreate">登録する</div>
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
      imgPath: [],
      uploadedImages: [],
      uniqueNumber: 1,
    }
  },
  computed: {
    campaignDataObject() {
      return this.$store.state;
    },
  },
  created() {
    const events = this.campaignDataObject.campaignImg;
    events.forEach(event => {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.uploadedImages.push(event.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    })
  },
  methods: {
    campaignCreate() {

      // 画像をfirestoreのstorageに保存する処理
      if(this.campaignDataObject.campaignImg.length !== 0) {
        const uid = firebase.auth().currentUser.uid;
        const events = this.campaignDataObject.campaignImg;
        events.forEach(event => {
          const uploadFile = event.target.files[0];
          const storepath = 'campaignimages/' + uid + '/' + uploadFile.name;
          const storageRef = firebase.storage().ref().child(storepath);
          this.imgPath.push(storepath);
          storageRef.put(uploadFile);
        })
      }
      
      const campaignDb = firebase.firestore().collection('campaigns')

      // (2) キャンペーンにユニークなidをつける処理
      const getUniqueNumber = async () => {
        await campaignDb.orderBy("date", "desc").limit(1).get()
        .then(response => {
          const lastCampaignNumber = response.docs[0].data().campaignid;
          this.campaignDataObject.campaignid = Number(lastCampaignNumber) + 1;
        })
        .catch(() => {
          this.campaignDataObject.campaignid = 1;
        })
      }

      // (3) キャンペーンをfirestoreに保存する処理
      const addData = () => {
        campaignDb.add({
          campaignid: String(this.campaignDataObject.campaignid),
          title: this.campaignDataObject.campaignTitle,
          description: this.campaignDataObject.campaignDescription,
          instagram: this.campaignDataObject.instagram,
          twitter: this.campaignDataObject.twitter,
          youtube: this.campaignDataObject.youtube,
          tiktok: this.campaignDataObject.tiktok,
          price: this.campaignDataObject.price,
          roll: this.campaignDataObject.roll,
          uid: this.campaignDataObject.uid,
          imgpath: this.imgPath,
          date: new Date(),
          contact: false,
          complete: false,
          completeDate: new Date(),
          payment: 0
        }).then(() => {
          router.push('/campaign')
        })
      }
      
      // (1) 全ての関数を実行
      const allFunction = async () => {
        await getUniqueNumber()
        await addData()
      }

      allFunction()

    }
  }
}
</script>
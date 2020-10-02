<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <h2>新規案件登録</h2>
        <section class="campaign-input">
          <form class="campaign-input-form" name="createcampaign">
            
            <!-- キャンペーンタイトル入力欄 -->
            <div class="form-input">
              <label for="title"><span class="required">必須</span>タイトル</label>
              <input type="text" id="title" name="title" placeholder="例: 1日1万個売れた!新コスメのPR案件" v-model.trim="campaignData.campaignTitle" required>
            </div>

            <!-- キャンペーン説明文入力欄 -->
            <div class="form-input">
              <label for="description"><span class="required">必須</span>説明</label>
              <textarea name="description" rows="10" placeholder="※ 案件の説明を記入してください" v-model.trim="campaignData.campaignDescription" required></textarea>
            </div>

            <!-- 希望snsチェック欄 -->
            <div class="sns">
              <div>
                <input type="checkbox" id="instagram" name="sns" v-model="campaignData.instagram" value="instagram">
                <label for="instagram"><i class="fab fa-instagram active"></i></label>
              </div>
              <div>
                <input type="checkbox" id="twitter" name="sns" v-model="campaignData.twitter" value="twitter">
                <label for="twitter"><i class="fab fa-twitter"></i></label>
              </div>
              <div>
                <input type="checkbox" id="youtube" name="sns" v-model="campaignData.youtube" value="youtube">
                <label for="youtube"><i class="fab fa-youtube"></i></label>
              </div>
              <div>
                <input type="checkbox" id="tiktok" name="sns" v-model="campaignData.tiktok" value="tiktok">
                <label for="tiktok"><i class="fab fa-tiktok"></i></label>
              </div>
            </div>

            <!-- 報酬金額入力欄 -->
            <div class="form-input">
              <label for="price"><span class="required">必須</span>報酬額<small>※数字のみ記入してください</small></label>
              <input type="text" id="price" name="price" placeholder="例: 10000" v-model.trim="campaignData.price" required>
            </div>
            
            <!-- キャンペーン画像選択欄 -->
            <div class="form-input">
              <label for="image"><span class="required">必須</span>キャンペーン画像</label>
              <input type="file" id="image" name="image" @change="attachImage" required>
            </div>

            <!-- キャンペーン画像確認表示 -->
            <div class="select-img">
              <div class="check-img" v-for="uploadedImage in uploadedImages" :key="uploadedImage">
                <img v-if="uploadedImage" :src="uploadedImage" alt="キャンペーン確認画像">
                <img v-else src="@/assets/image/no_image.png" alt="画像なし">
              </div>
            </div>

          </form>

          <!-- 確認ボタン -->
          <div class="missed">
            <p>{{ message }}</p>
          </div>
          <div class="btn" @click="campaignConfirm">確認する</div> 

        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      campaignData: {
        campaignTitle: "",
        campaignDescription: "",
        instagram: false,
        twitter: false,
        youtube: false,
        tiktok: false,
        price: "",
        roll: 'client',
        img: []
      },
      uploadedImages: [],
      message: "",
    }
  },
  methods: {

    // 画像ファイルが選択されたら表示する処理
    attachImage(e) {
      this.campaignData.img.push(e);
      let reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImages.push(e.target.result);
      };
      reader.readAsDataURL(this.campaignData.img[0].target.files[0]);
    },

    // 未入力項目がないか確認する処理
    campaignConfirm(e) {
      if(this.campaignData.campaignTitle === "") {
        e.stopPropagation()
        this.message = '※タイトルを入力してください'
      } else if(this.campaignData.campaignDescription === "") {
        e.stopPropagation()
        this.message = '※説明を入力してください'
      } else if(this.campaignData.price === "") {
        e.stopPropagation()
        this.message = '※報酬金額を入力してください'
      } else {
        this.$store.commit('campaignDataMove', this.campaignData);
      }
    }
  }
}
</script>
<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="client-detail-section">
          <h2>クライアント詳細</h2>

          <section class="client-basic-data">

            <!-- クライアントの画像 -->
            <div class="img-box client-detail">
              <img v-if="clientData[0].imgurl" :src="clientData[0].imgurl">
              <img v-else src="@/assets/image/no_image.png" alt="クライアントの画像">
            </div>

            <!-- クライアントの基本データ -->
            <section class="client-basic-data-section">
              <h3>基本データ</h3>
              <table>
                <tbody>
                  <tr>
                    <th>
                      <div>会社名</div>
                    </th>
                    <td>
                      <div>{{ clientData[0].client ? clientData[0].client : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                  <tr>
                    <th>
                      <div>担当者名</div>
                    </th>
                    <td>
                      <div>{{ clientData[0].staff ? clientData[0].staff : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr v-if="roll === 'admin'">
                    <th>
                      <div>電話番号</div>
                    </th>
                    <td>
                      <div>{{ clientData[0].tell ? clientData[0].tell : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr v-if="roll === 'admin'">
                    <th>
                      <div>アドレス</div>
                    </th>
                    <td>
                      <div>{{ clientData[0].email ? clientData[0].email : "未設定" }}</div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div>所在地</div>
                    </th>
                    <td>
                      <div v-if="
                        clientData[0].adress1 !== '' &&
                        clientData[0].adress2 !== '' &&
                        clientData[0].apartment !== ''
                      ">
                        {{ clientData[0].adress1 }}{{ clientData[0].adress2 }}{{ clientData[0].apartment }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

          </section>

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
      accountId: 0,
      clientData: [],
    }
  },
  created() {
    this.accountId = this.$route.params['id']
    const accountDb = firebase.firestore().collection('account')

    // (2) 選択したクライアントデータを取得
    const getClient = async () => {
      const client = await accountDb.where('accountId', '==', this.accountId).get();
      const clientData = client.docs[0].data();
      return clientData;
    }

    // (3) 画像のパスがあればURLを取得
    const dataPush = async (clientData) => {
      if(clientData.imgpath !== "") {
        const imgpath = clientData.imgpath;
        const imgurl = await firebase.storage().ref().child(imgpath).getDownloadURL();
        clientData.imgurl = imgurl;
        this.clientData.push(clientData);
      } else {
        this.clientData.push(clientData);
      }
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const clientData = await getClient()
      await dataPush(clientData)
    }

    allFunction()

  }
}
</script>


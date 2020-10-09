<template>
  <div>
    <Header/>
    <div class="container">
      <SideBar/>
      <main>
        <section class="claim-create-section">
          <h2>請求書作成</h2>

          <!-- 注釈 -->
          <section class="notes">
            <h3>※請求書の作成は発行月の翌月に行ってください。</h3>
            <p>同月に発行すると、誤った請求内容での作成となります</p>
          </section>

          <!-- 請求書作成クライアント一覧 -->
          <table class="claim-create-table">
            <tbody>
              <tr v-for="(account,index) in accounts" :key="index">
                <th>
                  <div class="claim-client">{{ account.client }}</div>
                </th>
                <td>
                  <div class="claim-create-btn" @click="getMyCampaignData(account)">
                    <i class="far fa-file-pdf"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </section>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SideBar from '../components/SideBar.vue';
import firebase from '@/plugins/firebase';
import pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts.js';

export default {
  components: {
    Header,
    SideBar
  },
  data() {
    return {
      campaignData: [],
      accounts: [],
    }
  },
  created() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const accountDb = firebase.firestore().collection('account');
    const campaignDb = firebase.firestore().collection('campaigns');

    // (2) 全てのキャンペーンデータを取得
    const getCampaigns = async () => {
      const campaignDocs = [];
      const campaigns = await campaignDb.get();
      campaigns.forEach(campaign => {
        campaignDocs.push(campaign.id);
      })
      return campaignDocs;
    }

    // (3) 応募者の中から取引が完了している者を取得
    const getTransactionCompleteCast = async (campaignDocs) => {
      const transactionCompleteCastsArray = [];
      for(let i = 0; i < campaignDocs.length; i++) {
        const doc = campaignDocs[i];
        const transactionCompleteCasts = await campaignDb.doc(doc).collection('applys').where('complete', '==', true).get();
        transactionCompleteCasts.forEach(transactionCompleteCast => {
          transactionCompleteCastsArray.push(transactionCompleteCast.data());
        })
      }
      return transactionCompleteCastsArray;
    }

    // (4) 取引が完了している応募者の中から完了月が請求書発行月の者を取得
    const checkCompleteDate = (transactionCompleteCastsArray) => {
      const campaignId = [];
      for(let i = 0; i < transactionCompleteCastsArray.length; i++) {
        const campaignCompleteDate = transactionCompleteCastsArray[i].completeTime.toDate();
        const campaignCompleteYear = campaignCompleteDate.getFullYear();
        const campaignCompleteMonth = campaignCompleteDate.getMonth() + 1;
        if(Number(year) === campaignCompleteYear && month - 1 === campaignCompleteMonth) {
          campaignId.push(transactionCompleteCastsArray[i].campaignId);
        }
      }
      return campaignId;
    }

    // (5) 取引完了者のいるキャンペーンデータと作成クライアントのuidを取得
    const getTransactionCompleteCampaign = async (campaignId) => {
      const campaignUid = [];
      const newCampaignId = campaignId.filter((x, i, self) => self.indexOf(x) === i);
      for(let i = 0; i < newCampaignId.length; i++) {
        const transactionCompleteCampaign = await campaignDb.where('campaignid', '==', newCampaignId[i]).get();
        this.campaignData.push(transactionCompleteCampaign.docs[0].data());
        campaignUid.push(transactionCompleteCampaign.docs[0].data().uid);
      }
      return campaignUid;
    }

    // (6) 取引完了者のいるキャンペーンの作成クライアントデータを取得
    const getTransactionCompletecast = async (campaignUid) => {
      const newCampaignUid = campaignUid.filter((x, i, self) => self.indexOf(x) === i);
      for(let i = 0; i < newCampaignUid.length; i++) {
        const transactionCompleteCast = await accountDb.where('userId', '==', newCampaignUid[i]).get();
        this.accounts.push(transactionCompleteCast.docs[0].data());
      }
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const campaignDocs = await getCampaigns();
      const transactionCompleteCastsArray = await getTransactionCompleteCast(campaignDocs);
      const campaignId = await checkCompleteDate(transactionCompleteCastsArray);
      const campaignUid = await getTransactionCompleteCampaign(campaignId);
      await getTransactionCompletecast(campaignUid);
    }

    allFunction()

  },
  methods: {

    // 全キャンペーンから請求対象クライアントのキャンペーンを選択し取引完了者を取得
    getMyCampaignData(account) {
      const campaignDb = firebase.firestore().collection('campaigns')
      const pdfData = []
      const pdfDataPush = async () => {
        for(let i = 0; i < this.campaignData.length; i++) {
          if(this.campaignData[i].uid === account.userId) {
            const myCampaign = await campaignDb.where('campaignid', '==', this.campaignData[i].campaignid).get()
            const doc = myCampaign.docs[0].id
            const completeApplys = await campaignDb.doc(doc).collection('applys').where('complete', '==', true).get()
            pdfData.push({
              clientName: account.client,
              clientAdress1: account.adress1,
              clientAdress2: account.adress2,
              clientApartment: account.apartment,
              clientCampaignPercent: account.campaignPercent,
              clientSpecialPercent: account.specialPercent,
              campaignComplete: completeApplys.size,
              campaignTitle: this.campaignData[i].title,
              campaignPrice: this.campaignData[i].price,
            })
          }
        }
      }

      const pdfCreate = () => {
        this.onDownloadPDFClickWithPDFMake(pdfData)
      }

      const allFunction = async () => {
        await pdfDataPush()
        await pdfCreate()
      }

      allFunction()
    },

    // 取引完了データを元に請求書作成
    onDownloadPDFClickWithPDFMake(data) {
      let total = 0
      const tableList = [[ '案件名', '件数', '金額', '合計' ]]
      for(let i = 0; i < 10; i++) {
        if(i >= data.length) {
          tableList.push([
            { text: '-', margin: [ 0, 7 ] },
            { text: '-', margin: [ 0, 7 ] },
            { text: '-', margin: [ 0, 7 ] },
            { text: '-', margin: [ 0, 7 ] },
          ])
        } else {
          tableList.push([
            { text: data[i].campaignTitle, margin: [ 0, 7 ] },
            { text: data[i].campaignComplete, margin: [ 0, 7 ] },
            { text: data[i].campaignPrice, margin: [ 0, 7 ] },
            { text: Number(data[i].campaignComplete) * Number(data[i].campaignPrice), margin: [ 0, 7 ] },
          ])
        }
      }
      for(let i = 0; i < data.length; i++) {
        total += Number(data[i].campaignPrice) * Number(data[i].campaignComplete)
      }
      console.log(data[0].clientSpecialPercent)
      const taxAndFee = (total * 0.3) + (total * 0.1);
      if(data[0].clientCampaignPercent !== '未選択' && data[0].clientSpecialPercent === '未選択') {
        const leadNumber = data[0].clientCampaignPercent.slice(0,1);
        total -= total * Number('0.' + leadNumber);
      } else if(data[0].clientCampaignPercent === '未選択' && data[0].clientSpecialPercent !== '未選択') {
        const leadNumber = data[0].clientSpecialPercent.slice(0,1);
        total -= total * Number('0.' + leadNumber)
      } else if(data[0].clientCampaignPercent !== '未選択' && data[0].clientSpecialPercent !== '未選択') {
        const campaignLeadNumber = data[0].clientCampaignPercent.slice(0,1);
        const specialLeadNumber = data[0].clientSpecialPercent.slice(0,1);
        total -= (total * Number('0.' + campaignLeadNumber) + total * Number('0.' + specialLeadNumber))
      }
      total += taxAndFee;

      pdfMake.fonts = {
          GenShin: {
              normal: 'GenShinGothic-Normal-Sub.ttf',
              bold: 'GenShinGothic-Normal-Sub.ttf',
              italics: 'GenShinGothic-Normal-Sub.ttf',
              bolditalics: 'GenShinGothic-Normal-Sub.ttf',
          },
      };
      const defaultStyle = 'GenShin';

      // PDF出力する内容の定義
      const docDefinition = {
          content: [
            {
              text: '御請求書',
              style: 'header'
            },
            {
              columns: [
                [
                  { text: data[0].clientName + '    御中    ', style: 'subheader' },
                  { 
                    text: [
                      data[0].clientAdress1,
                      data[0].clientAdress2 + '\n',
                      data[0].clientApartment + '\n',
                      '0345678912',
                    ],
                    margin: [ 20, 0, 0, 50 ],
                    style: 'adress'
                  },
                  {
                    text: ' ご請求金額                ' + total + '   ',
                    style: 'total'
                  },
                  {
                    text: '※ 振込手数料は貴社にてご負担をお願いします',
                    style: 'small'
                  },
                ],
                [
                  { text: '締日:       2020/07/31', margin: [ 70, 0, 0, 0 ]},
                  { text: '発行日:   2020/08/01', margin: [ 70, 0, 0, 50 ]},
                  { text: '   株式会社メディア   ', style: 'mysubheader' },
                  { 
                    text: [
                      '東京都千代田区丸の内一丁目9-1\n',
                      'インフルハイツ403\n',
                      '0345678912\n\n',
                    ],
                    style: 'myadress'
                  },
                  {
                    text: [
                      'インフル銀行   エンサー支店\n',
                      '普通   1234567   ｶ)ﾒﾃﾞｨｱ'
                    ],
                    margin: [ 70, 0, 0, 60 ],
                    style: 'myadress'
                  }
                ]
              ],
            }, 
            {
              layout: 'lightHorizontalLines', // optional
              table: {
                headerRows: 1,
                widths: [ 200, '*', '*', '*' ],
                body: tableList
              }
            },
          ],
          defaultStyle: {
            font: defaultStyle,
          },
          styles: {
            header: {
              fontSize: 30,
              alignment: 'center',
              lineHeight: 2,
              margin: [ 0, 20, 0, 0 ]
            },
            subheader: {
              width: '80%',
              fontSize: 15,
              decoration: 'underline',
              lineHeight: 1.5,
              margin: [ 20, 0, 0, 0 ]
            },
            mysubheader: {
              width: '20%',
              fontSize: 14,
              lineHeight: 1.2,
              margin: [ 70, 0, 0, 0 ]
            },
            adress: {
              width: '80%',
              fontSize: 12,
            },
            myadress: {
              width: '20%',
              fontSize: 10,
              margin: [ 70, 0, 0, 0 ]
            },
            total: {
              fontSize: 18,
              decoration: 'underline',
              lineHeight: 1.5,
              margin: [ 20, 0, 0, 0 ],
              bold: true,
            },
            small: {
              fontSize: 8,
              margin: [ 20, 0, 0, 0 ],
              padding: [ 10, 10 ],
              bold: true,
            }
          },
        };
        
      pdfMake.createPdf(docDefinition).open();
    },
  }
}
</script>
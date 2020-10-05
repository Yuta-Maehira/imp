<template>
  <div>
    <div v-if="roll === 'admin' || roll === 'client'">
      <h3>クライアントデータ</h3>

      <!-- 取引の各件数 -->
      <ul class="transaction-data">
        <li>
          <div class="title">案件登録数</div>
          <div class="value">{{ campaignNum }}</div>
        </li>
        <li>
          <div class="title">取引案件数</div>
          <div class="value">{{ clientTransactionNum }}</div>
        </li>
        <li>
          <div class="title">案件取引完了数</div>
          <div class="value">{{ clientCompleteNum }}</div>
        </li>
        <li>
          <div class="title">取引人数</div>
          <div class="value">{{ transactionCastNum }}</div>
        </li>
      </ul>
      <div class="caution">
        <p>※案件登録数、案件取引完了数は今月のもの</p>
      </div>
    </div>

    <!-- キャストの各アクション件数 -->
    <div v-if="roll === 'admin' || roll === 'cast'">
      <h3>キャストデータ</h3>
      <ul class="transaction-data">
        <li>
          <div class="title">案件応募数</div>
          <div class="value">{{ applyNum }}</div>
        </li>
        <li>
          <div class="title">取引案件数</div>
          <div class="value">{{ castTransactionNum }}</div>
        </li>
        <li>
          <div v-if="roll === 'admin'" class="title">取引完了人数</div>
          <div v-else class="title">取引完了数</div>
          <div class="value">{{ castCompleteNum }}</div>
        </li>
      </ul>
      <div class="caution">
        <p>※案件応募数、取引完了数は今月のもの</p>
      </div>
    </div>
      
    
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data() {
    return {
      roll: localStorage.roll,
      campaignNum: 0,
      clientTransactionNum: 0,
      clientCompleteNum: 0,
      transactionCastNum: 0,
      applyNum: 0,
      castTransactionNum: 0,
      castCompleteNum: 0,
      paymentNum: 0,
    }
  },
  created() {
    const uid = firebase.auth().currentUser.uid
    const now = new Date()
    const month = now.getMonth() + 1
    const campaignDb = firebase.firestore().collection('campaigns')

    // (2) 全てのキャンペーンを取得
    const getCampaign = async () => {
      const campaignsArray = [];
      const campaigns = await campaignDb.get();
      campaigns.forEach(campaign => {
        campaignsArray.push(campaign.data());
      })
      return campaignsArray;
    }

    // (3) キャンペーン作成日時を取得してカウント
    const checkMonth = (campaignsArray) => {
      for(let i = 0; i < campaignsArray.length; i++) {
        const campaignCreateDate = campaignsArray[i].date.toDate()
        const campaignCreateMonth = campaignCreateDate.getMonth() + 1
        if(campaignCreateMonth === month) {
          if(this.roll === 'admin') {
            this.campaignNum += 1;
          } else if(this.roll === 'client' && campaignsArray[i].uid === uid) {
            this.campaignNum += 1;
          }
        }
      }
    }

    // (4) 取引中のキャンペーンからデータとドキュメント名を取得
    const getTransactionCampaign = async () => {
      const transactionCampaignArray = [];
      const transactionCampaign = await campaignDb.where('contact', '==', true).get();
      transactionCampaign.forEach(campaign => {
        transactionCampaignArray.push({
          data: campaign.data(),
          doc: campaign.id
        })
      })
      return transactionCampaignArray;
    }

    // (5) <管理者> 各取引データをカウント
    const getTransaction = (transactionCampaignArray) => {
      for(let i = 0; i < transactionCampaignArray.length; i++) {
        const data = transactionCampaignArray[i].data;
        const doc = transactionCampaignArray[i].doc;
        if(this.roll === 'admin') {

          // (5-2) 取引中のキャンペーンの応募者を取得
          const getApplys = async () => {
            const applyArray = [];
            const applys = await campaignDb.doc(doc).collection('applys').get();
            applys.forEach(apply => {
              applyArray.push(apply.data());
            })
            return applyArray;
          }

          // (5-3) 取引人数と取引案件数をカウント
          const getAdminTransactionData = (applyArray) => {
            let num = 0;
            for(let i = 0; i < applyArray.length; i++) {
              const applyData = applyArray[i];
              if(applyData.status) {
                if(!data.complete) {
                  num += 1;
                  this.transactionCastNum += 1; // 取引人数
                }
                if(applyData.complete) {
                  this.castCompleteNum += 1; 
                }
              } else if(!applyData.status) {
                this.applyNum += 1;
              }
            }
            if(num > 0) {
              this.clientTransactionNum += 1; // 取引案件数
              this.castTransactionNum += 1;
            }
          }

          // (5-4) 取引中のキャンペーンから取引完了者を取得
          const getCompleteCampaign = async () => {
            const completeCampaignArray = [];
            const completeCampaigns = await campaignDb.where('complete', '==', true).get();
            completeCampaigns.forEach(completeCampaign => {
              completeCampaignArray.push(completeCampaign.data());
            })
            return completeCampaignArray;
          }

          // (5-5) 取引完了者から当月完了した者をカウント
          const adminCheckMonth = (completeCampaignArray) => {
            for(let i = 0; i < completeCampaignArray.length; i++) {
              const campaignCompleteDate = completeCampaignArray[i].data().completeDate.toDate()
              const campaignCompleteMonth = campaignCompleteDate.getMonth() + 1
              if(campaignCompleteMonth === month) {
                this.clientCompleteNum += 1;
              }
            }
          }

          // (5-1) 全ての関数を実行
          const adminAllFunction = async () => {
            const applyArray = await getApplys()
            await getAdminTransactionData(applyArray)
            const completeCampaignArray = await getCompleteCampaign()
            await adminCheckMonth(completeCampaignArray)
          }

          adminAllFunction()

        } else if(this.roll === 'client') {
          if(data.uid === uid) {

            // (5-7) キャンペーンの応募者から取引中の者を取得
            const getCompleteApplys = async () => {
              const completeApplysArray = [];
              const completeApplys = await campaignDb.doc(doc).collection('applys').where('status', '==', true).get();
              completeApplys.forEach(completeApply => {
                completeApplysArray.push(completeApply.data());
              })
              return completeApplysArray;
            }

            // (5-8) 取引人数と取引案件数をカウント/取引完了者から当月完了した者をカウント
            const getClientTransactionData = async (completeApplysArray) => {
              if(!data.complete && completeApplysArray.length > 0) {
                this.clientTransactionNum += 1; // 取引案件数
                completeApplysArray.forEach(apply => {
                  if(!apply.complete) {
                    this.transactionCastNum += 1; // 取引人数
                  }
                })
              }
              if(data.complete) {
                const campaignCompleteDate = data.completeDate.toDate()
                const campaignCompleteMonth = campaignCompleteDate.getMonth() + 1
                if(campaignCompleteMonth === month) {
                  this.clientCompleteNum += 1;
                }
              }
            }

            // (5-6) 全ての関数を実行
            const clientAllFunction = async () => {
              const completeApplysArray = await getCompleteApplys()
              await getClientTransactionData(completeApplysArray)
            }

            clientAllFunction()
          }

        } else if(this.roll === 'cast') {
          
          // (5-9)

          // キャンペーンから自分の応募したキャンペーンを取得
          const getMyApply = async () => {
            const myApply = await campaignDb.doc(doc).collection('applys').doc(uid).get();
            if(myApply.exists) {
              const applyData = myApply.data()
              const campaignApplyDate = applyData.applyDate.toDate()
              const campaignApplyMonth = campaignApplyDate.getMonth() + 1
              
              // 応募数をカウント
              if(!applyData.status && !applyData.complete) {
                if(campaignApplyMonth === month) {
                  this.applyNum += 1
                }

              // 取引件数をカウント
              } else if(applyData.status && !applyData.complete) {
                this.castTransactionNum += 1;

              // 報酬金額をカウント
              } else if(applyData.status && applyData.complete) {
                const campaignCompleteDate = applyData.completeTime.toDate()
                const campaignCompleteMonth = campaignCompleteDate.getMonth() + 1
                if(campaignCompleteMonth === month) {
                  this.castCompleteNum += 1;
                  this.paymentNum += Number(data.price)
                }
              }
            }
          }

          // 関数の実行
          getMyApply()
        }
      }
    }

    // (1) 全ての関数を実行
    const allFunction = async () => {
      const campaignsArray = await getCampaign()
      if(this.roll === 'admin' || this.roll === 'client') {
        await checkMonth(campaignsArray)
      }
      const transactionCampaignArray = await getTransactionCampaign()
      await getTransaction(transactionCampaignArray)
    }

    allFunction()
  }
}
</script>
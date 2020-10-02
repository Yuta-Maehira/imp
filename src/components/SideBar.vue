<template>
  <aside>
    <div class="site-logo">
      <router-link to="/dashboard">
        <img src="../assets/image/site_logo.jpg" alt="サイトのロゴ画像">
      </router-link>
    </div>
    <nav>
      <ul>
        <li>
          <router-link to="/campaign">
            <i class="far fa-clipboard"></i>
            <p>キャンペーン</p>
          </router-link>
        </li>
        <li>
          <router-link to="/contact">
            <i class="far fa-comments"></i>
            <p>コンタクト</p>
          </router-link>
        </li>
        <li v-if="roll === 'admin' || roll === 'cast'">
          <router-link to="/client">
            <i class="far fa-building"></i>
            <p>クライアント</p>
          </router-link>
        </li>
        <li v-if="roll === 'admin' || roll === 'client'">
          <router-link to="/cast">
            <i class="far fa-user"></i>
            <p>キャスト</p>
          </router-link>
        </li>
        <li>
          <router-link to="/notification">
            <i class="far fa-bell"></i>
            <p>通知</p>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="promotion">
      <img src="../assets/image/promotiongif.gif" alt="広告画像">
    </div>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      roll: localStorage.roll
    }
  }
}
</script>
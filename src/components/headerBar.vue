<template>
  <div class="header_bar">
    <div class="header_table">
      <!-- logo items -->
      <div class="logo_items">
        <img class="logo_img" src="../assets/images/Audience-Key-Logo.jpg" @click="logout" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'initial_page',
  props: ['page'],
  components: {},
  data() {
    return {
      connected: false,
      showLoading: false,
      showMenu: false,
    };
  },
  created() {
    // const self = this;
  },
  mounted() {
    // const self = this;
  },
  methods: {
    changePage(page) {
      const self = this;
      self.showMenu = false;
      self.$root.$emit('header_bar_action', page);
    },
    hamburgerClick() {
      const self = this;
      self.showMenu = true;
    },
    logout() {
      const self = this;
      self.$root.$emit('logout');
    },
  },
  computed: {},
};
</script>

<style lang="scss">
/*******************HEADER BAR*******************/
.header_bar {
  position: relative;
  width: 100%;
  height: 100px;
  border-top: 4px solid var(--red-hex);
  text-align: right;
  background: var(--header-bg);
  color: var(--header-color);
  z-index: 2;

  .header_table {
    display: table;
    width: 100%;
    height: 100%;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .logo_items {
    display: table-cell;
    vertical-align: middle;
    text-align: left;
    height: 100%;
    padding: 0% 2%;

    @media (max-width: 768px) {
      width: 76%;
      padding: 0% 2%;
    }

    .logo_img {
      width: 100%;
      max-width: 213px;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
    }
    .slash {
      display: inline-block;
      margin: 0 20px;
      width: 100%;
      max-width: 7px;
      vertical-align: middle;
    }
    .page {
      display: inline-block;
      font-size: 30px;
      vertical-align: middle;
    }
  }
}
</style>

<template>
  <div class="base">
    <div class="loading loading_base" v-show="showLoading"></div>
    <!-- header menu -->
    <headerBar :page="currentPage" />
    <!-- body content holder -->
    <div class="body_content">
      <div class="base_buttons_holder">
        <button @click="createContact">CREATE</button>
      </div>
      <addressBook />
    </div>
    <!-- content modal -->
    <div class="content-modal" v-if="showModal">
      <addressModal v-if="showModal === 'address_modal'" :userid="userSelected" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import addressBook from '@/components/addressBook.vue';
import addressModal from '@/components/addressModal.vue';
import headerBar from '@/components/headerBar.vue';

export default {
  name: 'basePage',
  components: {
    headerBar,
    addressBook,
    addressModal,
  },
  data() {
    return {
      connected: false,
      showLoading: false,
      currentPage: false,
      showModal: false,
      userSelected: false,
    };
  },
  created() {
    // const self = this;
  },
  mounted() {
    const self = this;
    self.$loading.service({
      lock: false,
      target: '.loading_base',
      background: 'rgba(255,255,255,0.7)',
    });

    // open panorama content modal
    self.$root.$on('open_modal', (page, user) => {
      self.userSelected = false;
      if (user) {
        self.userSelected = user;
      }
      self.updateModal(page);
    });

    // close modal
    self.$root.$on('close_modal', () => {
      self.updateModal();
    });
  },
  methods: {
    updateModal(data) {
      const self = this;
      if (data) {
        self.showModal = data;
      } else {
        self.showModal = false;
      }
    },
    createContact() {
      const self = this;
      self.userSelected = -1;
      self.updateModal('address_modal');
    },
  },
  computed: {
    instance() {
      return this.$store.getters.getInstance;
    },
    user() {
      return this.$store.getters.getUserData;
    },
  },
};
</script>

<style lang="scss">
.base {
  position: relative;
  min-height: 100vh;

  /*******************body content*******************/
  .body_content {
    position: relative;
    width: 100%;
    padding-bottom: 150px;
    z-index: 1;

    .base_buttons_holder {
      display: block;
      width: 96%;
      padding: 10px 2%;
    }
  }
  /****************content modal ******************/
  .content-modal {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.25);
    z-index: 10;
    top: 0;
    left: 0;
  }
}
</style>

<template>
  <div class="address_book">
    <div class="loading loading_address" v-show="showLoading"></div>
    <div class="address_book_holder" v-if="contacts.length > 0">
      <input
        class="search_input"
        type="text"
        v-model.trim="searchInput"
        name="search_input"
        autocomplete="off"
        placeholder="Search for contact by Name, Email, Phone Number..."
      />

      <div class="total_holder" v-if="searchInput !== ''">
        Total Contacts: {{ contactCounter }} / {{ contacts.length }}
      </div>
      <div class="total_holder" v-else>Total Contacts: {{ contacts.length }}</div>

      <div class="address_letter_box" v-for="(contacts, key) in contactsData" :key="key">
        <div class="address_header_bar" @click="menuClick(key)">
          <div class="address_header_text">
            <div class="text">{{ key }}</div>
            <div class="text smaller">(Total: {{ contacts.length }})</div>
          </div>
        </div>
        <div class="address_letter_items" :class="{ active: addressOpen.indexOf(key) > -1 }">
          <div class="address_letter_item" v-for="contact in contacts" :key="contact.id" @click="loadModal(contact.id)">
            <div class="address_letter_item_text">{{ contact.firstname }} {{ contact.lastname }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="address_book_empty" v-else>Address book is empty. Please add a contact to continue.</div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'address_book',
  props: ['page'],
  components: {},
  data() {
    return {
      showLoading: true,
      addressOpen: [],
      contacts: [],
      contactCounter: 0,
      searchInput: '',
    };
  },
  created() {
    // const self = this;
  },
  mounted() {
    const self = this;
    self.$loading.service({
      lock: false,
      target: '.loading_address',
      background: 'rgba(255,255,255,0.7)',
    });
    self.getContacts();

    self.$root.$on('update_address_book', () => {
      self.getContacts();
    });
  },
  methods: {
    menuClick(k) {
      const self = this;
      if (self.addressOpen.indexOf(k) > -1) {
        self.addressOpen.splice(self.addressOpen.indexOf(k), 1);
      } else {
        self.addressOpen.push(k);
      }
    },
    loadModal(user) {
      const self = this;
      self.$root.$emit('open_modal', 'address_modal', user);
    },
    getContacts() {
      const self = this;
      self.showLoading = true;
      self.$http
        .post(`${process.env.VUE_APP_API}allContacts`, {}, {})
        .then((res) => {
          if (res.status === 200 && res.data) {
            self.contacts = res.data;
          }
          self.showLoading = false;
        })
        .catch(() => {
          self.showLoading = false;
        });
    },
  },
  computed: {
    contactsData() {
      const self = this;
      const v = {};
      self.contactCounter = 0;
      self.contacts.forEach((e) => {
        const si = self.searchInput.toLowerCase();
        if (
          si === '' ||
          (si !== '' &&
            (e.firstname.includes(si) ||
              e.lastname.includes(si) ||
              e.emailaddress.includes(si) ||
              e.phonenumber.includes(si)))
        ) {
          const lastInitial = e.lastname.charAt(0).toUpperCase();
          if (v[lastInitial] === undefined) {
            v[lastInitial] = [];
          }
          self.contactCounter += 1;
          v[lastInitial].push(e);
        }
      });
      return v;
    },
  },
};
</script>

<style lang="scss">
/*******************HEADER BAR*******************/
.address_book {
  position: relative;
  text-align: left;
  height: 100%;

  .address_book_empty {
    display: block;
    width: 90%;
    padding: 40px 5%;
    text-align: center;
    font-size: 20px;
  }

  .address_book_holder {
    display: block;
    width: 90%;
    padding: 40px 5%;

    .total_holder {
      font-size: 20px;
      padding: 10px 0;
    }

    input[type='text'] {
      text-align: left;
      width: 96%;
      display: inline-block;
      padding: 15px 2%;
      font-size: 16pt;
      margin: 0 0 10px;
      background: #fff;
      position: relative;
      -moz-appearance: none;
      -webkit-appearance: none;
      resize: none;
      border: 3px solid var(--light-teal-hex);
    }

    .address_letter_box {
      display: block;
      width: 100%;
      margin-bottom: 10px;

      .address_header_bar {
        display: table;
        width: 96%;
        background: var(--teal-hex);
        color: var(--white-hex);
        padding: 10px 2%;
        cursor: pointer;

        .address_header_text {
          display: table-cell;
          vertical-align: middle;
          text-align: left;
          height: 100%;
          font-size: 25px;
          font-weight: bold;

          .text {
            display: inline-block;
            vertical-align: middle;
          }
          .text.smaller {
            font-size: 15px;
            margin-left: 5%;
          }
        }
      }

      .address_letter_items.active {
        display: block;
      }

      .address_letter_items {
        width: 100%;
        display: none;

        .address_letter_item:nth-child(even) {
          background: #dedddd;
        }
        .address_letter_item {
          display: table;
          width: 96%;
          background: #cacaca;
          padding: 10px 2%;
          cursor: pointer;

          .address_letter_item_text {
            display: table-cell;
            vertical-align: middle;
            text-align: left;
            height: 100%;
            font-size: 18px;
            text-transform: capitalize;
          }
        }
      }
    }
  }
}
</style>

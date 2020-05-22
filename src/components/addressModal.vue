<template>
  <div class="address_modal">
    <div class="connect_holder">
      <div class="loading loading_address_modal" v-show="showLoading"></div>
      <div class="close_modal_holder">
        <div class="close_modal" @click="closeModal">X</div>
      </div>
      <div class="form_holder">
        <div class="item">
          <label class="labelname" for="first_name">FIRST NAME</label>
          <input
            class="text_field"
            type="text"
            v-model.trim="userData.firstname"
            name="first_name"
            autocomplete="off"
            :disabled="!editUser"
            @keyup.enter="submitUser"
          />
        </div>

        <div class="item">
          <label class="labelname" for="last_name">LAST NAME</label>
          <input
            class="text_field"
            type="text"
            v-model.trim="userData.lastname"
            name="last_name"
            autocomplete="off"
            :disabled="!editUser"
            @keyup.enter="submitUser"
          />
        </div>

        <div class="item long">
          <label class="labelname" for="email_address">EMAIL ADDRESS</label>
          <input
            class="text_field long"
            type="text"
            v-model.trim="userData.emailaddress"
            name="email_address"
            autocomplete="off"
            :disabled="!editUser"
            @keyup.enter="submitUser"
          />
        </div>

        <div class="item long">
          <label class="labelname" for="phone_number">PHONE NUMBER</label>
          <input
            class="text_field long"
            type="text"
            v-model.trim="userData.phonenumber"
            name="phone_number"
            autocomplete="off"
            :disabled="!editUser"
            @keyup.enter="submitUser"
          />
        </div>

        <div class="item long">
          <label class="labelname" for="street_address">STREET ADDRESS</label>
          <input
            class="text_field long"
            type="text"
            v-model.trim="userData.streetaddress"
            name="street_address"
            autocomplete="off"
            :disabled="!editUser"
            @keyup.enter="submitUser"
          />
        </div>

        <div class="item mid">
          <label class="labelname" for="city">CITY</label>
          <input
            class="text_field"
            type="text"
            v-model.trim="userData.city"
            name="city"
            autocomplete="off"
            :disabled="!editUser"
            @keyup.enter="submitUser"
          />
        </div>

        <div class="item small">
          <label class="labelname" for="state">STATE</label>
          <select type="text" v-model.trim="userData.state" name="state" :disabled="!editUser">
            <option v-for="state in statesList" :key="state">
              {{ state }}
            </option>
          </select>
        </div>

        <div class="item midsmall">
          <label class="labelname" for="zip_code">ZIP CODE</label>
          <input
            class="text_field"
            type="text"
            v-model.trim="userData.zipcode"
            name="zip_code"
            autocomplete="off"
            :disabled="!editUser"
            @keyup.enter="submitUser"
          />
        </div>

        <div class="buttons_holder" v-if="editUser">
          <button class="submit_btn" @click="submitUser">
            SUBMIT
          </button>
          <button class="canel_btn reverse" @click="canEditUser(false)" v-if="userid !== -1">
            CANCEL
          </button>
        </div>
        <div class="buttons_holder" v-else>
          <button class="edit_btn" @click="canEditUser(true)">
            EDIT
          </button>
          <button class="delete_btn reverse" @click="confirmDelete">
            DELETE
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'address_modal',
  props: ['userid'],
  components: {},
  data() {
    return {
      showLoading: false,
      editUser: false,
      userData: {
        firstname: '',
        lastname: '',
        emailaddress: '',
        phonenumber: '',
        streetaddress: '',
        city: '',
        state: '',
        zipcode: '',
      },
      statesList: [
        'AL',
        'AK',
        'AS',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'DC',
        'FM',
        'FL',
        'GA',
        'GU',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MH',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'MP',
        'OH',
        'OK',
        'OR',
        'PW',
        'PA',
        'PR',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VI',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
      ],
    };
  },
  created() {
    // const self = this;
  },
  mounted() {
    const self = this;
    self.$loading.service({
      lock: false,
      target: '.loading_address_modal',
      background: 'rgba(255,255,255,0.7)',
    });
    self.userData.id = self.userid;
    if (self.userid === -1) {
      self.editUser = true;
    } else {
      self.getUserData();
    }
  },
  methods: {
    closeModal(bypass) {
      const self = this;
      if (self.editUser && !bypass) {
        self
          .$confirm('Are you sure you want to leave without saving?', 'Leave', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
          })
          .then(() => {
            self.$root.$emit('close_modal');
          });
      } else {
        self.$root.$emit('close_modal');
      }
    },
    canEditUser(isEdit) {
      const self = this;
      if (isEdit) {
        self.editUser = true;
      } else {
        self
          .$confirm('Are you sure you want to quit before saving?', 'Quit', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
          })
          .then(() => {
            self.editUser = false;
          });
      }
    },
    getUserData() {
      const self = this;
      self.showLoading = true;
      self.$http
        .post(
          `${process.env.VUE_APP_API}contact`,
          {
            user: self.userData,
          },
          {},
        )
        .then((res) => {
          self.showLoading = false;
          if (res.status === 200 && res.data && res.data.id) {
            self.userData = res.data;
          } else {
            self.$message({
              type: 'error',
              message: 'Error loading contact information',
            });
            self.closeModal(true);
          }
        })
        .catch(() => {
          self.showLoading = false;
          self.$message({
            type: 'error',
            message: 'Error loading contact information',
          });
          self.closeModal(true);
        });
    },
    confirmDelete() {
      const self = this;
      self
        .$confirm('Are you sure you want to delete this contact?', 'Delete', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        })
        .then(() => {
          self.deleteUser();
        });
    },
    deleteUser() {
      const self = this;
      self.showLoading = true;
      self.$http
        .post(
          `${process.env.VUE_APP_API}deleteContact`,
          {
            user: self.userData,
          },
          {},
        )
        .then((res) => {
          self.showLoading = false;
          if (res.status === 200) {
            self.$message({
              type: 'success',
              message: `Successfully deleted ${self.userData.firstname} ${self.userData.lastname}`,
            });
            self.$root.$emit('update_address_book');
            self.closeModal(true);
          } else {
            self.$message({
              type: 'error',
              message: 'Error deleting contact information',
            });
          }
        })
        .catch(() => {
          self.showLoading = false;
          self.$message({
            type: 'error',
            message: 'Error deleting contact information',
          });
        });
    },
    submitUser() {
      const self = this;
      const ud = self.userData;
      if (
        ud.firstname !== '' &&
        ud.lastname !== '' &&
        ud.emailaddress !== '' &&
        self.validEmail(ud.emailaddress) &&
        ud.phonenumber &&
        self.validPhone(ud.phonenumber) &&
        ud.streetaddress !== '' &&
        ud.city !== '' &&
        ud.state !== '' &&
        ud.zipcode !== ''
      ) {
        self.showLoading = true;
        self.$http
          .post(
            `${process.env.VUE_APP_API}updateContact`,
            {
              user: self.userData,
            },
            {},
          )
          .then((response) => {
            if (response.status === 200) {
              self.$message({
                type: 'success',
                message: 'Contact has been successfully saved',
              });
              self.$root.$emit('update_address_book');
              if (self.userid !== -1) {
                self.editUser = false;
                self.getUserData();
              } else {
                self.closeModal(true);
              }
            } else {
              self.$message({
                type: 'error',
                message: 'Error saving contact. Please try again.',
              });
            }
            self.showLoading = false;
          })
          .catch(() => {
            self.$message({
              type: 'error',
              message: 'Error saving contact. Please try again.',
            });
            self.showLoading = false;
          });
      } else {
        self.$message({
          type: 'error',
          message: 'Please fill out all fields correctly.',
        });
      }
    },
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    validPhone(phone) {
      // eslint-disable-next-line
      const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
      return re.test(phone);
    },
  },
  computed: {
    instance() {
      return this.$store.getters.getInstance;
    },
    assetPath() {
      return this.$store.getters.getAssetPath;
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  outline: 0;
  -webkit-font-smoothing: antialiased;
  -ms-overflow-style: none;
}
*::-webkit-scrollbar {
  display: none;
}
.address_modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5678587;
  background: rgba(0, 0, 0, 0.3);

  .connect_holder {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-height: 90%;
    overflow: scroll;
    background: #fff;
    max-width: 1000px;
    text-align: center;

    .close_modal_holder {
      display: block;
      text-align: right;
      padding: 10px;

      .close_modal {
        display: inline-block;
        font-size: 20px;
        padding: 20px;
        cursor: pointer;
      }
    }

    .form_holder {
      display: inline-block;
      width: 85%;
      text-align: left;
      padding-bottom: 40px;

      .item {
        width: 48%;
        margin-right: 1%;
        display: inline-block;

        @media (max-width: 768px) {
          width: 100%;
          margin-right: 0%;
        }
      }

      .item.long {
        width: 98%;

        @media (max-width: 768px) {
          width: 100%;
        }
      }

      .item.mid {
        width: 36%;

        @media (max-width: 768px) {
          width: 100%;
        }
      }

      .item.midsmall {
        width: 36%;

        @media (max-width: 768px) {
          width: 60%;
        }
      }

      .item.small {
        width: 22%;

        @media (max-width: 768px) {
          width: 40%;
        }
      }

      label.labelname {
        width: 100%;
        text-align: left;
        display: inline-block;
        font-size: 17pt;
        margin-bottom: 10px;
      }
      input[type='text'],
      .text_field {
        text-align: left;
        width: 86%;
        display: inline-block;
        border-radius: 40px;
        padding: 15px 6%;
        font-size: 16pt;
        margin: 0 0 40px;
        background: #fff;
        position: relative;
        -moz-appearance: none;
        -webkit-appearance: none;
        resize: none;
        border: 3px solid var(--light-teal-hex);
      }
      select {
        text-align: left;
        width: 98%;
        padding: 15px 20% 15px 6%;
        display: inline-block;
        border: 3px solid var(--light-teal-hex);
        border-radius: 40px;
        font-size: 16pt;
        margin: 0 0 40px;
        background: #fff;
        position: relative;
      }
      input[type='text']:disabled,
      select:disabled {
        border: 0;
        border-bottom: 3px solid var(--light-teal-hex);
        border-radius: 0;
        background: #fff;
        -moz-appearance: none;
        -webkit-appearance: none;
      }
      input[type='text']::-ms-expand,
      select::-ms-expand {
        display: none;
      }
      input[type='text'].error,
      select.error {
        border-color: var(--connect-modal-input-error);
      }
      input[type='text'].long,
      .text_field.long,
      select.long {
        width: 90%;
        padding: 15px 4%;

        @media (max-width: 768px) {
          width: 90%;
          padding: 15px 4%;
        }
      }

      .submit_btn,
      .edit_btn {
        margin-right: 20px;
      }
    }
  }
}
</style>

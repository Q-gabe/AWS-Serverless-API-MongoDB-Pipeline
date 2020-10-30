<template>
  <div class="dashboard uk-padding-large" :key="componentKey">
    <section v-if="errored">
      <p>
        We're sorry, we're not able to retrieve this information at the moment,
        please try back later.
      </p>
    </section>
    <section v-else>
      <div v-if="loading" class="uk-text-center">
        <p>
          <span uk-spinner="ratio: 4.5"></span>
        </p>
        <p>
          Just a second...
        </p>
      </div>

      <div v-else>
        <button
          class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom"
          type="button"
          v-on:click="openCreateModal"
        >
          Create Pet Entry
        </button>

        <div id="create-modal" v-show="showCreateModal" ref="create-modal">
          <div
            class="uk-card uk-card-default uk-margin-medium uk-padding uk-animation-slide-top-medium"
          >
            <h2 class="uk-modal-title">Create Pet Entry</h2>
            <p>
              Enter in our new friend's details!
            </p>
            <span v-if="showFormWarning" class="uk-text-danger uk-text-bold"
              >Kindly ensure all fields are filled!</span
            >
            <form class="uk-form-stacked" @submit.prevent="processForm">
              <div class="uk-margin">
                <label class="uk-form-label" for="form-name">Name</label>
                <div class="uk-form-controls">
                  <input
                    class="uk-input uk-form-width-medium"
                    id="form-name"
                    type="text"
                    placeholder="Name"
                    @input="form_name = $event.target.value"
                    :value="form_name"
                    :disabled="disable_form"
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-species">Species</label>
                <div class="uk-form-controls">
                  <input
                    class="uk-input uk-form-width-medium"
                    id="form-species"
                    type="text"
                    placeholder="Species"
                    @input="form_species = $event.target.value"
                    :value="form_species"
                    :disabled="disable_form"
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-age">Age</label>
                <div class="uk-form-controls">
                  <input
                    class="uk-input uk-form-width-medium"
                    id="form-age"
                    type="number"
                    placeholder="Age"
                    @input="form_age = $event.target.value"
                    :value="form_age"
                    :disabled="disable_form"
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-status">Status</label>
                <div class="uk-form-controls">
                  <input
                    class="uk-input uk-form-width-medium"
                    id="form-status"
                    type="text"
                    placeholder="Status"
                    @input="form_status = $event.target.value"
                    :value="form_status"
                    :disabled="disable_form"
                  />
                </div>
              </div>
              <p class="uk-text-right">
                <button
                  class="uk-button uk-button-default"
                  type="button"
                  v-on:click="
                    clearFormData();
                    hideCreateModal();
                  "
                >
                  Cancel
                </button>
                <button class="uk-button uk-button-primary" type="submit">
                  Create
                </button>
                <span
                  id="form-spinner"
                  class="uk-margin-small-left"
                  v-bind:style="{ visibility: spinner_show }"
                  uk-spinner
                >
                </span>
              </p>
            </form>
          </div>
        </div>

        <div id="update-modal" v-show="showUpdateModal" ref="update-modal">
          <div
            class="uk-card uk-card-default uk-margin-medium uk-padding uk-animation-slide-top-medium"
          >
            <h2 class="uk-modal-title">Update Pet Entry</h2>
            <p>
              Enter in new details!
            </p>
            <span v-if="showFormWarning" class="uk-text-danger uk-text-bold"
              >Kindly ensure all fields are filled!</span
            >
            <form class="uk-form-stacked" @submit.prevent="processUpdateForm">
              <div class="uk-margin">
                <label class="uk-form-label" for="form-update-name">Name</label>
                <div class="uk-form-controls">
                  <input
                    class="uk-input uk-form-width-medium"
                    id="form-update-name"
                    type="text"
                    placeholder="Name"
                    @input="form_update_name = $event.target.value"
                    :value="form_update_name"
                    :disabled="disable_form"
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-update-species"
                  >Species</label
                >
                <div class="uk-form-controls">
                  <input
                    class="uk-input uk-form-width-medium"
                    id="form-update-species"
                    type="text"
                    placeholder="Species"
                    @input="form_update_species = $event.target.value"
                    :value="form_update_species"
                    :disabled="disable_form"
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-update-age">Age</label>
                <div class="uk-form-controls">
                  <input
                    class="uk-input uk-form-width-medium"
                    id="form-update-age"
                    type="number"
                    placeholder="Age"
                    @input="form_update_age = $event.target.value"
                    :value="form_update_age"
                    :disabled="disable_form"
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-update-status"
                  >Status</label
                >
                <div class="uk-form-controls">
                  <input
                    class="uk-input uk-form-width-medium"
                    id="form-update-status"
                    type="text"
                    placeholder="Status"
                    @input="form_update_status = $event.target.value"
                    :value="form_update_status"
                    :disabled="disable_form"
                  />
                </div>
              </div>
              <p class="uk-text-right">
                <button
                  class="uk-button uk-button-default"
                  type="button"
                  v-on:click="
                    clearUpdateFormData();
                    hideUpdateModal();
                  "
                >
                  Cancel
                </button>
                <button class="uk-button uk-button-primary" type="submit">
                  Update
                </button>
                <span
                  id="form-spinner"
                  class="uk-margin-small-left"
                  v-bind:style="{ visibility: spinner_show }"
                  uk-spinner
                >
                </span>
              </p>
            </form>
          </div>
        </div>

        <div
          class="uk-grid-column-small uk-grid-row-large uk-child-width-1-3@s uk-text-center"
          uk-grid
        >
          <div v-for="pet in info" v-bind:key="pet._id" class="pet">
            <PetCard
              v-bind:id="pet._id"
              v-bind:name="pet.name"
              v-bind:species="pet.species"
              v-bind:age="pet.age"
              v-bind:status="pet.status"
              @update-event="handlePetUpdate"
              @delete-event="handlePetDelete"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import PetCard from "@/components/PetCard.vue";

export default {
  name: "Dashboard",
  components: {
    PetCard
  },
  data: function() {
    return {
      componentKey: 0,
      // Initial load specific
      target: null,
      info: null,
      loading: true,
      errored: false,
      // Form controls specific
      showCreateModal: false,
      form_name: "",
      form_species: "",
      form_age: null,
      form_status: "",
      spinner_show: "hidden",
      disable_form: false,
      showFormWarning: false,
      // Update form
      showUpdateModal: false,
      form_update_id: "",
      form_update_name: "",
      form_update_species: "",
      form_update_age: null,
      form_update_status: ""
    };
  },
  mounted() {
    this.$nextTick(this.resolveTarget);
    this.$nextTick(this.fetchAPIData);
  },
  methods: {
    // BROWSER METHODS
    openCreateModal: function() {
      this.showCreateModal = true;
      this.showUpdateModal = false;
      setTimeout(() => {
        this.goto("create-modal");
      });
    },
    hideCreateModal: function() {
      this.showCreateModal = false;
    },
    openUpdateModal: function() {
      this.showUpdateModal = true;
      this.showCreateModal = false;
      setTimeout(() => {
        this.goto("update-modal");
      });
    },
    hideUpdateModal: function() {
      this.showUpdateModal = false;
    },
    goto(refName) {
      var element = this.$refs[refName];
      var top = element.offsetTop;
      window.scrollTo(0, top);
    },
    // FORM METHODS
    processForm: async function() {
      // Disable form and start spinner
      this.spinner_show = "visible";
      this.disable_form = true;

      // Basic form validation
      if (
        this.form_name &&
        this.form_species &&
        this.form_age &&
        this.form_status
      ) {
        // Create request and wait for data to resolve
        this.handlePetCreate();
      } else {
        // Form incomplete. Show warning and enable form
        this.showFormWarning = true;
        this.spinner_show = "hidden";
        this.disable_form = false;
        return;
      }
    },
    processUpdateForm: async function() {
      // Disable form and start spinner
      this.spinner_show = "visible";
      this.disable_form = true;

      // Basic form validation
      if (
        this.form_update_name &&
        this.form_update_species &&
        this.form_update_age &&
        this.form_update_status
      ) {
        // Create request and wait for data to resolve
        this.petUpdate();
      } else {
        // Form incomplete. Show warning and enable form
        this.showFormWarning = true;
        this.spinner_show = "hidden";
        this.disable_form = false;
        return;
      }
    },
    clearFormData: function() {
      this.form_name = "";
      this.form_species = "";
      this.form_age = null;
      this.form_status = "";
    },
    clearUpdateFormData: function() {
      this.form_update_name = "";
      this.form_update_species = "";
      this.form_update_age = null;
      this.form_update_status = "";
    },
    // API METHODS
    resolveTarget: function() {
      let target =
        process.env.VUE_APP_NODE_ENV == "development"
          ? `${process.env.VUE_APP_DEV_ADDRESS}:${process.env.VUE_APP_DEV_PORT}/dev`
          : `${process.env.VUE_APP_PROD_ADDRESS}/prod`;
      this.target = target;
    },
    // API Calls to API server
    fetchAPIData: function() {
      axios
        .get(this.target + "/pet")
        .then(res => {
          console.log(
            "Successfully fetched all pets: " + JSON.stringify(res.data)
          );
          this.info = res.data;
        })
        .catch(err => {
          console.log(err);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    handlePetCreate: function() {
      axios
        .post(this.target + "/pet", {
          name: this.form_name,
          species: this.form_species,
          age: Number(this.form_age),
          status: this.form_status
        })
        .then(res => {
          console.log("Successfully created: " + JSON.stringify(res.data));
          // Close modal and reset form
          this.hideCreateModal();
          this.clearFormData();
          this.showFormWarning = false;
          this.spinner_show = "hidden";
          this.disable_form = false;
          // Refresh dashboard
          this.loading = true;
          this.fetchAPIData();
        })
        .catch(err => {
          this.showFormWarning = false;
          this.spinner_show = "hidden";
          this.disable_form = false;
          console.log(err);
        });
    },
    handlePetUpdate: function(event) {
      this.form_update_id = event.id;
      this.form_update_name = event.name;
      this.form_update_species = event.species;
      this.form_update_age = event.age;
      this.form_update_status = event.status;
      this.openUpdateModal();
    },
    petUpdate: function() {
      axios
        .put(this.target + "/pet/" + this.form_update_id, {
          name: this.form_update_name,
          species: this.form_update_species,
          age: Number(this.form_update_age),
          status: this.form_update_status
        })
        .then(res => {
          console.log("Successfully updated: " + JSON.stringify(res.data));
          // Close modal and reset form
          this.hideUpdateModal();
          this.clearUpdateFormData();
          this.showFormWarning = false;
          this.spinner_show = "hidden";
          this.disable_form = false;

          // Refresh dashboard
          this.loading = true;
          this.fetchAPIData();
        })
        .catch(err => {
          this.showFormWarning = false;
          this.spinner_show = "hidden";
          this.disable_form = false;
          console.log(err);
        });
    },
    handlePetDelete: function(event) {
      axios
        .delete(`${this.target}/pet/${event}`)
        .then(res => {
          console.log("Successfully deleted: " + JSON.stringify(res.data));

          // Refresh dashboard
          this.loading = true;
          this.fetchAPIData();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

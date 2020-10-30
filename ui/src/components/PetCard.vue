<template>
  <div class="uk-card uk-card-default uk-card-body">
    <p><b>Name:</b> <span v-html="this.name"></span></p>
    <p><b>Species:</b> <span v-html="this.species"></span></p>
    <p><b>Age:</b> <span v-html="this.age"></span></p>
    <p><b>Status:</b> <span v-html="this.status"></span></p>
    <p uk-margin>
      <button class="uk-button uk-button-primary" v-on:click="updateCallback">
        Update
      </button>
      <button class="uk-button uk-button-secondary" v-on:click="deleteCallback">
        Delete
      </button>
    </p>
    <span
      id="form-spinner"
      class="uk-position-top-right uk-padding"
      v-bind:style="{ visibility: spinner_show }"
      uk-spinner
    ></span>
  </div>
</template>

<script>
import UIkit from "uikit";

export default {
  name: "PetCard",
  props: {
    id: String,
    name: String,
    species: String,
    age: Number,
    status: String
  },
  data: function() {
    return {
      target: null,
      info: null,
      loading: true,
      errored: false,
      spinner_show: "hidden"
    };
  },
  methods: {
    deleteCallback: async function() {
      const message = "Are you sure you want to delete this entry?";
      let confirmation;
      await UIkit.modal.confirm(message).then(
        () => {
          confirmation = true;
        },
        () => {
          confirmation = false;
        }
      );
      if (confirmation) {
        this.spinner_show = "visible";
        this.$emit("delete-event", this.id);
      }
    },

    updateCallback: function() {
      this.$emit("update-event", {
        id: this.id,
        name: this.name,
        species: this.species,
        age: this.age,
        status: this.status
      });
    }
  }
};
</script>

<template>
  <div id="navbar" class="uk-navbar-container uk-padding-large" uk-navbar>
    <div class="uk-navbar-left">
      <a href="" class="uk-navbar-item uk-logo">
        <img :src="require('@/assets/logo.png')" uk-img />
      </a>
      <div class="uk-navbar-item">
        <h1 class="uk-heading-medium uk-margin-remove-bottom">
          <span>Pet Dashboard</span>
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header"
};
</script>

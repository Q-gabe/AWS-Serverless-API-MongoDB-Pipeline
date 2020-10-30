<script>
export default {
  el: "#dashboard",
  name: "Api",
  data: function() {
    return {
      result: "",
      responseAvailable: false
    };
  },
  methods: {
    fetchAPIData() {
      this.responseAvailable = false;

      let target =
        process.env.NODE_ENV == "development"
          ? `${process.env.DEV_ADDRESS}:${process.env.DEV_PORT}`
          : `${process.env.PROD_ADDRESS}:${process.env.PROD_PORT}`;

      fetch(target, {
        method: "GET"
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            alert(
              "Server returned " + response.status + " : " + response.statusText
            );
          }
        })
        .then(response => {
          this.result = response.body;
          this.responseAvailable = true;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

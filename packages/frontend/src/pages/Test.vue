<template>
    <v-menu
      v-model="dateMenu"
      :close-on-content-click="false"
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
      max-width="290px"
    >
      <template v-slot:activator="{on}">
        <v-text-field
          :label="label"
          prepend-inner-icon="event"
          readonly
          hide-details
          :value="dateValue"
          v-on="on"
          @focus="focusDate"
          @blur="blurDate"
        ></v-text-field>
      </template>
      <v-date-picker
        locale="en-in"
        v-model="dateValue"
        no-title
        @input="dateMenu = false"
      ></v-date-picker>
    </v-menu>
  </template>
  <script>
  export default {
    data() {
      return {
        dateMenu: false,
        dateValue: null,
      };
    },
    props: {
      label: {
        type: String,
        required: true,
      },
    },
    methods: {
      focusDate() {
        setTimeout(() => {
          if (!this.dateMenu) {
            this.dateMenu = true;
          }
        }, 200);
      },
      blurDate() {
        setTimeout(() => {
          if (this.dateMenu) {
            this.dateMenu = false;
          }
        }, 200);
      },
    },
  };
  </script>
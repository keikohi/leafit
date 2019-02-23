<template>
  <v-app >
    <Navbar/>
    <v-content class="mx-4">
      <nuxt/>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navigation/Navbar'
  export default {
    data () {
      return {

      }
    },
    components: {
      Navbar
    }
  }
</script>

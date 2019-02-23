<template>
    <div>
      <v-toolbar flat app>
        <v-toolbar-side-icon class="grey--text" @click="drawerVisiblity = !drawerVisiblity"></v-toolbar-side-icon>
        <v-toolbar-title class="grey--text">
          <span class="font-weight-light">Leafit</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-menu offset-y>
          <v-btn flat slot="activator" color="grey">
            <v-icon left>expand_more</v-icon>
            <span>menu</span>
          </v-btn>
          <v-list>
            <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
              <v-list-tile-title>{{ link.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-btn flat small color="grey">
          <span class="hidden-sm-and-down">Sign Out</span>
          <v-icon right>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar>

      <v-navigation-drawer app v-model="drawerVisiblity" class="grey">
        <v-layout column align-center >
          <v-flex class="mt-5">
            <v-avatar size="100">
              <img src="~/assets/images/kei.jpeg"/>
            </v-avatar>
            <p class="white--text subheading mt-1 text-xs-center">Keisuke</p>
          </v-flex>
          <v-flex>
            <Popup />
          </v-flex>
        </v-layout>
        <v-list>
          <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
            <v-list-tile-action>
              <v-icon class="white--text">{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile class="white--text">{{ link.text }}</v-list-tile>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </div>
</template>

<script>
import Popup from '@/components/Popup/Popup'
export default {
  data(){
    return {
      drawerVisiblity: false,
      links: [
        { icon: 'dashboard', text: 'Dashbosrd', route: '/dashboard'},
        { icon: 'folder', text: 'My Projects', route: '/projects' },
        { icon: 'person', text: 'Team', route: '/team'}
      ]

    }
  },
  components:{
    Popup
  }
}
</script>


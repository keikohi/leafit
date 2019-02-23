<template>
  <div class="dashboad">
    <h1 class="subheading grey--text">keisuke</h1>
      <v-container class="my-5">
        
        <v-layout row class="mb-3">
          <v-tooltip top>
            <v-btn small flat color="grey" @click="sortBy('title')" slot="activator" >
              <v-icon left small> folder</v-icon>
              <span class="caption text-lowercase">By project name</span>
            </v-btn>
            <span>Sort projects by project name</span>
          </v-tooltip>

          <v-tooltip top>
            <v-btn small flat color="grey" @click="sortBy('due')" slot="activator">
              <v-icon left small> person</v-icon>
              <span class="caption text-lowercase">By Due Date</span>
            </v-btn>
            <span>Sort projects by due date</span>
          </v-tooltip>
        </v-layout>
        


        <v-card flat v-for="project in projects" :key="project.title">
          <v-layout row wrap :class="`project pa-3 ${project.status}`">
            <v-flex xs12 md6 >
              <div class="caption grey--text">Project title</div>
              <div>{{ project.title }}</div>
            </v-flex>
            <v-flex xs6 sm4 md2>
              <div class="caption grey--text">Person</div>
              <div>{{ project.person }}</div>
            </v-flex>
            <v-flex xs6 sm4 md2>
              <div class="caption grey--text">Due by</div>
              <div>{{ project.due }}</div>
            </v-flex>
            <v-flex xs6 sm4 md2>
              <div class="right">
                <v-chip small :class="`${project.status} white--text caption my-2`">{{ project.status }}</v-chip>
              </div>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
        </v-card>

      </v-container>
  </div>
</template>



<script>
export default {
  data(){
    return {
      projects: [
        {title: 'Learing Vue and Nuxt and Firebase', person: 'Keisuke', due: 'Third, Feb 2019', status: 'ongoing', content: 'I live Rin chan'},
        {title: 'I wanna kiss her', person: 'Keisuke', due: 'Third, Feb 2019', status: 'ongoing', content: 'I live Rin chan'},
        {title: 'Bought Cofee in Dubai', person: 'Keisuke', due: 'Third, Feb 2018', status: 'complete', content: 'I live Rin chan'},
        {title: 'Geeee', person: 'Keisuke', due: 'Third, Feb 2019', status: 'complete', content: 'I live Rin chan'},
        {title: 'Ushishi', person: 'Keisuke', due: 'Third, Feb 2019', status: 'overdue', content: 'I live Rin chan'},
      ]
    }
  },
  methods: {
    sortBy(prop){
      this.projects.sort((a, b) => a[prop] < b[prop] ? -1 : 1)
    }
  }
}
</script>


<style>
.project.complete {
  border-left: 4px solid #3cd1c2;
}

.project.ongoing{
  border-left: 4px solid orange;
}

.project.overdue{
  border-left: 4px solid tomato;
}

.v-chip.complete {
  background: #3cd1c2;
}

.v-chip.ongoing{
  background: orange;
}

.v-chip.overdue{
  background: tomato;
}

</style>

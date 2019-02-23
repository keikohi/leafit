<template>
    <div class="projects">
        <H1 class="subheading grey--text">Projects</H1>
        <v-container class="my-5">

            <v-expansion-panel>
                <v-expansion-panel-content v-for="project in myProjects" :key="project.title">
                    <div slot="header">{{ project.title }}</div>
                    <v-card-text class="px-4 grey--text">
                        <div class="font-weight-bold">{{project.due}}</div>
                        <div>{{ project.content }}</div>
                    </v-card-text>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-container>
    </div>
</template>


<script>
export default {
    data(){
        return {
            projects: [
                {title: 'Learing Vue and Nuxt and Firebase', person: 'Rin', due: 'Third, Feb 2019', status: 'ongoing', content: 'I live Rin chan'},
                {title: 'I wanna kiss her', person: 'Rin', due: 'Third, Feb 2019', status: 'ongoing', content: 'I live Rin chan'},
                {title: 'Bought Cofee in Dubai', person: 'Keisuke', due: 'Third, Feb 2018', status: 'complete', content: 'I live Rin chan'},
                {title: 'Geeee', person: 'Keisuke', due: 'Third, Feb 2019', status: 'complete', content: 'I live Rin chan'},
                {title: 'I love Rin', person: 'Keisuke', due: 'Third, Feb 2019', status: 'overdue', content: 'I live Rin chan'},
            ]

        }
    },
    computed: {
        myProjects(){
            return this.projects.filter(project => {
                return project.person === 'Keisuke'
            })
        }
    }
}
</script>

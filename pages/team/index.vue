<template>
    <div class="team">
        <H1 class="subheading grey--text">Team</H1>

        <v-container class="my-5">
            <v-layout row wrap>
                <v-flex xs12 sm6 md4 lg3 v-for="person in team" :key="person.name">
                    <v-card flat class="text-xs-center ma-3">
                        <v-responsive class="pt-4">
                            <v-avatar size="100" class="grey lighten-2">
                                <img :src="require(`~/assets/images/${person.avatar}`)" alt="avatar">
                            </v-avatar>
                        </v-responsive>
                        <v-card-text>
                            <div class="subheading">{{ person.name }}</div>
                            <div class="grey--text">{{ person.role }}</div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn flat color="grey">
                                <v-icon small left> message </v-icon>
                                <span>message</span>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

    </div>
</template>


<script>
export default {
    data(){
        return {
            team: [
                {name: 'Keisuke', role: 'Web developer', avatar: 'kei.png'},
                {name: 'Rin', role: 'Web developer', avatar: 'kei.png'},
                {name: 'Masaya', role: 'Web developer', avatar: 'kei.png'},
                {name: 'Oka', role: 'Web developer', avatar: 'kei.png'}
            ]
        }
    }
}
</script>

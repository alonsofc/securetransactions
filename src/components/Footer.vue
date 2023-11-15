<template>
    <div>
        <v-footer color="grey-lighten-3" app>
            <v-row no-gutters>
                <v-col cols="8" sm="6">
                    &copy; {{ new Date().getFullYear() + ' ' + this.$config.ProjectName }}. Todos los derechos reservados.
                </v-col>
                <v-col cols="4" sm="6">
                    <div class="text-end">
                        <v-icon title="Twitter" color="blue">mdi-twitter</v-icon>
                        <v-icon class="ml-4" title="Instagram" color="pink">mdi-instagram</v-icon>
                        <v-icon class="ml-4" title="Facebook" color="indigo">mdi-facebook</v-icon>
                    </div>
                </v-col>
            </v-row>
        </v-footer>
    </div>
</template>
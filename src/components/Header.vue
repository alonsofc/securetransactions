<template>
    <div>
        <v-toolbar>
            <v-app-bar-nav-icon class="d-none d-sm-flex">
                <router-link class="text-decoration-none" to="/home" title="Inicio">
                    <v-icon color="primary" size="35">mdi-shield-lock</v-icon>
                </router-link>
            </v-app-bar-nav-icon>

            <v-toolbar-title class="text-primary font-weight-bold d-none d-sm-flex">{{ $config.ProjectName
            }}</v-toolbar-title>

            <v-toolbar-items>
                <v-btn @click="RedirectTo('/transactions')">Mis Transacciones</v-btn>
                <v-btn @click="RedirectTo('/account')">Mi Cuenta</v-btn>
            </v-toolbar-items>

            <v-spacer></v-spacer>

            <!-- <span class="mr-1">
                <h5 class="text-primary"><v-icon>mdi-account-circle</v-icon> {{ this.$store.getters.getCurrentUser.name }}
                </h5>
                <h6 class="ml-6 font-weight-regular">{{ this.$store.getters.getCurrentUser.email }}</h6>
            </span> -->

            <v-divider vertical class="mx-2 d-none d-sm-flex"></v-divider>

            <v-btn icon title="Cerrar Sesión" @click="LogoutUser">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-toolbar>
    </div>
</template>

<script>
export default {
    methods: {
        LogoutUser() {
            this.$store.dispatch("logout");
            this.$router.push("/login");
        },

        RedirectTo(url) {
            this.$router.push(url);
        }
    },
};
</script>
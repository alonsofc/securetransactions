<template>
    <v-card class="mx-auto" rounded="0">
        <div class="pa-5">
            <v-row>
                <v-col cols="12" sm="12" md="3" class="d-flex align-center justify-center flex-column">
                    <v-avatar size="150" rounded="0">
                        <v-img cover src="../assets/account.png"></v-img>
                    </v-avatar>
                    <v-list-item class="text-center" v-if="currentUser" :title="currentUser.name"
                        :subtitle="currentUser.email"></v-list-item>
                </v-col>

                <v-col cols="12" sm="12" md="9">
                    <v-form @submit.prevent="saveUser">
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-model="v$.name.$model" label="Nombre completo" autocomplete="off"
                                    :error-messages="v$.name?.$errors?.[0]?.$message"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-model="v$.email.$model" label="Correo electrónico" autocomplete="off"
                                    :error-messages="v$.email?.$errors?.[0]?.$message"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-model="password" label="Contraseña" type="password"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-model="v$.confirmPassword.$model" label="Repetir contraseña" type="password"
                                    :error-messages="v$.confirmPassword?.$errors?.[0]?.$message"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-alert type="info" variant="outlined">
                                    Si no desea modificar la contraseña puede dejar el campo vacío.
                                </v-alert>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-btn type="submit" color="primary">Guardar</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>
  
<script>
import { setupVuelidate, $required, $email, $sameAs } from '@/configs/vuelidateConfig.js';
import { apiAuth } from "@/configs/axiosConfig.js";

export default {
    setup() {
        const v$ = setupVuelidate();
        return { v$ };
    },
    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
    },
    validations() {
        return {
            name: { $required },
            email: { $required, $email },
            confirmPassword: { $sameAs: $sameAs(this.password) },
        }
    },
    created() {
        this.setCurrentUserInfo();
    },
    computed: {
        currentUser() {
            return this.$store.getters.getCurrentUser;
        },
    },
    methods: {
        setCurrentUserInfo() {
            this.email = this.currentUser.email;
            this.name = this.currentUser.name;
        },

        async saveUser() {
            if (await this.v$.$validate()) {
                const formData = {
                    id: this.currentUser.id,
                    name: this.name,
                    email: this.email,
                    password: this.password,
                };

                const handleSuccess = () => {
                    formData.password = null;
                    this.$store.dispatch('updateUser', formData);
                };

                await apiAuth.putRequest("user", formData, handleSuccess);
            }
            else return;
        },
    },
};
</script>
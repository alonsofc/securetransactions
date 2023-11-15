<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="login-card" :loading="loading ? 'primary' : null">
                    <v-card-title class="text-center">
                        <h2 class="headline mt-5 mb-5"><v-icon color="primary" size="35">mdi-shield-lock</v-icon>
                            {{ $config.ProjectName }}</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-sheet class="mx-7">
                            <v-form @submit.prevent="LoginUser">
                                <v-text-field variant="underlined" v-model="v$.email.$model" label="Correo electrónico"
                                    :error-messages="v$.email?.$errors?.[0]?.$message"></v-text-field>

                                <v-text-field variant="underlined" v-model="v$.password.$model" label="Contraseña"
                                    type="password" class="mt-2"
                                    :error-messages="v$.password?.$errors?.[0]?.$message"></v-text-field>

                                <v-btn type="submit" color="primary" block class="mt-4 mb-3" :disabled="loading">Iniciar
                                    Sesión</v-btn>

                                <div class="text-right">
                                    <a href="#" class="text-body-2 font-weight-regular">¿Olvidó su contraseña?</a>
                                </div>
                            </v-form>
                            <div class="mt-8 text-center">
                                <p class="text-body-2">¿No tiene cuenta? <a href="#">Registre una aquí</a></p>
                            </div>
                        </v-sheet>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { setupVuelidate, $required, $email } from '@/configs/vuelidateConfig';
import { api } from '@/configs/axiosConfig';

export default {
    setup() {
        const v$ = setupVuelidate();
        return { v$ };
    },
    data() {
        return {
            email: 'alonsofc22@gmail.com',
            password: '1',
            loading: false
        }
    },
    validations() {
        return {
            email: { $required, $email },
            password: { $required }
        }
    },
    methods: {
        async LoginUser() {
            if (await this.v$.$validate()) {
                this.loading = true;

                const formData = {
                    email: this.email,
                    password: this.password,
                };

                const handleSuccess = (response) => {
                    this.$store.dispatch('login', { user: response.info });
                    this.$router.push('/home');
                };

                const handleFinally = () => {
                    this.loading = false
                };

                await api.PostRequest("user/login", formData, handleSuccess, null, handleFinally);
            }
            else return;
        },
    },
};
</script>
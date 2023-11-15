<template>
    <v-card>
        <v-tabs v-model="tab" fixed-tabs bg-color="grey-lighten-3">
            <v-tab :value=buy @click="GetTransactions(buy)" class="text-blue">Mis Compras</v-tab>
            <v-tab :value=sell @click="GetTransactions(sell)" class="text-error">Mis Ventas</v-tab>
        </v-tabs>

        <v-card-text>
            <v-window v-model="tab">
                <v-window-item :value=buy>
                    <div class="mt-3">
                        <v-btn prepend-icon="mdi-plus" color="blue" @click="Dialog(true)">Registrar compra</v-btn>

                        <DataTable :options="options" :data="buyData" ref="dtBuy" class="table display responsive">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Vendedor</th>
                                    <th>Detalle</th>
                                    <th>Fecha</th>
                                    <th>Precio</th>
                                    <th>
                                        Total
                                        <v-tooltip>
                                            <template v-slot:activator="{ props }">
                                                <v-icon icon="mdi-information-outline" color="blue" v-bind="props"></v-icon>
                                            </template>
                                            <span>Incluye la comisión.</span>
                                        </v-tooltip>
                                    </th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                        </DataTable>
                    </div>
                </v-window-item>

                <v-window-item :value=sell>
                    <div class="mt-3">
                        <v-btn prepend-icon="mdi-plus" color="error" @click="Dialog(true)">Registrar venta</v-btn>

                        <DataTable :options="options" :data="sellData" ref="dtSell" class="table display responsive">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Comprador</th>
                                    <th>Detalle</th>
                                    <th>Fecha</th>
                                    <th>Precio</th>
                                    <th>
                                        Total
                                        <v-tooltip>
                                            <template v-slot:activator="{ props }">
                                                <v-icon icon="mdi-information-outline" color="error"
                                                    v-bind="props"></v-icon>
                                            </template>
                                            <span>Incluye la comisión.</span>
                                        </v-tooltip>
                                    </th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                        </DataTable>
                    </div>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>

    <!-- Dialog con el formulario de transacción -->
    <v-dialog v-model="transactionDialog" width="1024px">
        <v-form @submit.prevent="ProcessTransaction" :readonly="isFormReadOnly" class="overflow-auto">
            <v-card :loading="loading ? (this.action === this.buy ? 'blue' : 'error') : null">
                <v-card-title>
                    <v-row no-gutters>
                        <v-col cols="12" sm="6">
                            <span class="text-h5 d-block text-truncate"
                                :class="this.action === this.buy ? 'text-blue' : 'text-error'">Transacción
                                de {{ this.action === this.buy ? 'Compra' : 'Venta' }}
                            </span>
                        </v-col>
                        <v-col cols="12" sm="6" class="text-end">
                            <v-chip class="ma-2" :color="ColorByStatus()" v-if="statusName">{{ statusName
                            }}</v-chip>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete label="Correo electrónico de la otra persona..." :items="userItems"
                                    item-title="email" item-value="id" v-model="v$.userId.$model" autocomplete="off"
                                    :error-messages="v$.userId?.$errors?.[0]?.$message"
                                    @update:model-value="SelectedItemChange">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="Detalle de la transacción" v-model="v$.information.$model"
                                    :error-messages="v$.information?.$errors?.[0]?.$message"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-select v-model="currency" :items="currencyItems" label="Moneda"></v-select>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-text-field label="Precio" type="number" v-model="v$.price.$model"
                                    :prefix="GetCurrencySymbol()"
                                    :error-messages="v$.price?.$errors?.[0]?.$message"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-text-field :label="`Comisión del ${this.commissionPercentage.toFixed(2)}%`"
                                    :model-value="FormatCurrency(commission)" :prefix="GetCurrencySymbol()" color="red"
                                    readonly></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-text-field label="Total a pagar" :model-value="FormatCurrency(total)"
                                    :prefix="GetCurrencySymbol()" color="success" readonly></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <div class="w-100">
                        <v-row no-gutters>
                            <v-col cols="12" class="text-end">
                                <div :class="this.action === this.buy ? 'text-blue' : 'text-error'">{{ actionMessage }}
                                </div>
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols="3">
                                <v-btn type="button" color="grey" @click="Dialog(false)">Cerrar</v-btn>
                            </v-col>
                            <v-col cols="9" class="text-end">
                                <v-btn type="button" v-if="statusId === $config.Statuses.Draft" @click="SaveTransaction()"
                                    :disabled="loading">Guardar</v-btn>
                                <v-btn v-if="showNoProcessBtn" type="button" :disabled="loading">{{ noProcessBtnTxt
                                }}</v-btn>
                                <v-btn v-if="showProcessBtn" type="submit"
                                    :color="this.action === this.buy ? 'blue' : 'error'" :disabled="loading">{{
                                        processBtnTxt }}</v-btn>
                            </v-col>
                        </v-row>
                    </div>

                    <!-- <v-spacer></v-spacer>
                    <div class="text-end">
                        <div :class="this.action === this.buy ? 'text-blue' : 'text-error'">{{ actionMessage }}</div>
                        <v-btn type="button" color="grey" @click="Dialog(false)">Cerrar</v-btn>
                        <v-btn type="button" v-if="statusId === $config.Statuses.Draft" @click="SaveTransaction()"
                            :disabled="loading">Guardar</v-btn>
                        <v-btn v-if="showNoProcessBtn" type="button" :disabled="loading">{{ noProcessBtnTxt }}</v-btn>
                        <v-btn v-if="showProcessBtn" type="submit" :color="this.action === this.buy ? 'blue' : 'error'"
                            :disabled="loading">{{ processBtnTxt }}</v-btn>
                    </div> -->
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>

    <!-- Modal de confirmación para eliminar -->
    <v-dialog v-model="deleteDialog" width="auto">
        <v-card>
            <v-card-title class="text-h5 text-red">
                Eliminar
            </v-card-title>
            <v-card-text>¿Realmente desea eliminar el registro?.</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="deleteDialog = false">Cancelar</v-btn>
                <v-btn color="red" @click="DeleteTransaction()">Sí, eliminarlo</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { apiAuth } from "@/configs/axiosConfig.js";
import { setupVuelidate, $required, $minValue } from '@/configs/vuelidateConfig.js';
import { DataTable, dtOptions, GenerateEditViewBtn, GenerateDeleteBtn, AttachEditViewEvent, AttachDeleteEvent, GenerateChip } from '@/configs/datatable/dataTableConfig';
import '@/configs/datatable/dataTableStyles.css';
import { format } from 'date-fns';

export default {
    setup() {
        const v$ = setupVuelidate();
        return { v$ };
    },
    data() {
        return {
            tab: null,
            buy: 'buy',
            sell: 'sell',
            transactionDialog: false,
            deleteDialog: false,
            options: dtOptions,
            buyData: [],
            sellData: [],
            action: '',

            currencyItems: ['₡ ¢ (Colones)', '$ (Dólares)'],
            userItems: [],
            commissionPercentage: 0,
            loading: false,
            isFormReadOnly: false,
            showProcessBtn: true,
            showNoProcessBtn: false,
            processBtnTxt: '',
            noProcessBtnTxt: '',
            actionMessage: '',
            statusId: this.$config.Statuses.Draft,
            statusName: '',

            id: null,
            userId: null,
            currency: '',
            information: '',
            price: 0,
            commission: 0,
            total: 0
        }
    },
    validations() {
        return {
            userId: { $required },
            information: { $required },
            price: { $required, $minValue: $minValue(0.01) }
        }
    },
    mounted() {
        this.GetAllUsers();
        this.GetParameterPercent();
        this.GetTransactions(this.buy);
    },
    computed: {
        currentUser() {
            return this.$store.getters.getCurrentUser;
        }
    },
    watch: {
        price(newPrice) {
            this.CalculateCommissionAndTotal(newPrice);
        }
    },
    methods: {
        async GetTransactions(action) {
            this.action = action;
            const userId = this.currentUser.id;

            const handleSuccess = (response) => {
                if (action === this.buy) {
                    this.buyData = response.info.filter(item => item.idBuyingUser === userId).map(item => [
                        item.id,
                        item.idSellingUserNavigation.name,
                        item.information,
                        format(new Date(item.modificationDate ?? item.creationDate), 'dd/MM/yyyy hh:mm a'),
                        this.GetCurrencySymbol(item.currency) + this.FormatCurrency(item.price, item.currency),
                        this.GetCurrencySymbol(item.currency) + this.FormatCurrency(item.total, item.currency),
                        GenerateChip(item.idStatusNavigation.name, 'text-' + this.ColorByStatus(item.idStatus)),
                        this.TableButtonsbyStatus(item)
                    ]);

                    const dtBuy = this.$refs.dtBuy.dt;
                    AttachEditViewEvent(dtBuy, this.EditTransaction);
                    AttachDeleteEvent(dtBuy, this.DialogDelete);
                }
                else {
                    this.sellData = response.info.filter(item => item.idSellingUser === userId).map(item => [
                        item.id,
                        item.idBuyingUserNavigation.name,
                        item.information,
                        format(new Date(item.modificationDate ?? item.creationDate), 'dd/MM/yyyy hh:mm a'),
                        this.GetCurrencySymbol(item.currency) + this.FormatCurrency(item.price, item.currency),
                        this.GetCurrencySymbol(item.currency) + this.FormatCurrency(item.total, item.currency),
                        GenerateChip(item.idStatusNavigation.name, 'text-' + this.ColorByStatus(item.idStatus)),
                        this.TableButtonsbyStatus(item)
                    ]);

                    const dtSell = this.$refs.dtSell.dt;
                    AttachEditViewEvent(dtSell, this.EditTransaction);
                    AttachDeleteEvent(dtSell, this.DialogDelete);
                }
            };

            await apiAuth.GetRequest(`transaction/GetByUser/${userId}`, handleSuccess);
        },

        async GetParameterPercent() {
            const handleSuccess = (response) => { this.commissionPercentage = parseFloat(response.info.value); };
            await apiAuth.GetRequest('parameter/1', handleSuccess);
        },

        async GetAllUsers() {
            const handleSuccess = (response) => {
                this.userItems = response.info
                    .filter(item => item.id !== this.currentUser.id)
                    .map(item => ({
                        id: item.id,
                        email: item.email + ' (' + item.name + ')',
                        name: item.name
                    }));
            };
            await apiAuth.GetRequest('user', handleSuccess);
        },

        async EditTransaction(itemId) {
            const handleSuccess = (response) => {
                this.Dialog(true);

                const item = response.info[0];

                this.id = item.id;
                this.userId = this.userItems.find(i => i.id === (this.action === this.buy ? item.idSellingUser : item.idBuyingUser) ?? null)?.id;
                this.information = item.information;
                this.currency = item.currency;
                this.commission = item.commission;
                this.total = item.total;
                this.price = item.price;
                this.statusId = item.idStatus;
                this.statusName = item.idStatusNavigation.name

                this.FormByStatus(item);
            };

            await apiAuth.GetRequest(`transaction/${itemId}`, handleSuccess);
        },

        async DeleteTransaction() {
            const formData = {
                id: this.id,
                idStatus: this.$config.Statuses.Deleted
            };

            const handleSuccess = () => {
                this.deleteDialog = false;
                this.GetTransactions(this.action);
            };

            await apiAuth.PutRequest("transaction", formData, handleSuccess);
        },

        async SaveTransaction() {
            this.loading = true;

            const formData = {
                idBuyingUser: this.action === this.buy ? this.currentUser.id : this.userId,
                idSellingUser: this.action === this.sell ? this.currentUser.id : this.userId,
                information: this.information,
                currency: this.currency,
                price: this.price,
                commission: this.commission,
                total: this.total,
                idStatus: this.statusId
            };

            const handleSuccess = () => {
                this.Dialog(false);
                this.GetTransactions(this.action);
            };

            const handleFinally = () => {
                this.loading = false
            };

            if (this.id !== null) {
                // Edit
                formData.id = this.id;
                formData.idModificationUser = this.currentUser.id;
                await apiAuth.PutRequest("transaction", formData, handleSuccess, null, handleFinally);
            }
            else {
                // Insert
                formData.idCreationUser = this.currentUser.id;
                await apiAuth.PostRequest("transaction", formData, handleSuccess, null, handleFinally);
            }
        },

        async ProcessTransaction() {
            if (await this.v$.$validate()) {

                switch (this.statusId) {
                    case this.$config.Statuses.Draft: this.statusId = this.$config.Statuses.Acceptance; break;
                    case this.$config.Statuses.Acceptance: this.statusId = this.$config.Statuses.Paying; break;
                    case this.$config.Statuses.Paying: this.statusId = this.$config.Statuses.Revision; break;
                    case this.$config.Statuses.Revision: this.statusId = this.$config.Statuses.Sending; break;
                    case this.$config.Statuses.Sending: this.statusId = this.$config.Statuses.Receiving; break;
                    case this.$config.Statuses.Receiving: this.statusId = this.$config.Statuses.Finished; break;
                };

                await this.SaveTransaction();
            }
            else return;
        },

        Dialog(show) {
            this.transactionDialog = show;

            if (show)
                this.InitForm();
        },

        DialogDelete(itemId) {
            this.id = itemId;
            this.deleteDialog = true;
        },

        FormByStatus(item) {
            this.loading = false;
            this.isFormReadOnly = true;
            this.showProcessBtn = false;
            this.showNoProcessBtn = false;

            // if (this.statusId !== this.$config.Statuses.Draft)
            //     this.price = this.FormatCurrency(item.price, item.currency);

            switch (this.statusId) {
                case this.$config.Statuses.Deleted:
                case this.$config.Statuses.Discarded:
                case this.$config.Statuses.Finished: {
                    this.actionMessage = '';
                    break;
                }

                case this.$config.Statuses.Draft: {
                    this.showProcessBtn = true;
                    this.isFormReadOnly = false;
                    this.SelectedItemChange();
                    break;
                }

                case this.$config.Statuses.Acceptance: {
                    this.processBtnTxt = 'Sí, la acepto';
                    this.noProcessBtnTxt = 'No, la rechazo';
                    this.showProcessBtn = item.idCreationUser !== this.currentUser.id;
                    this.showNoProcessBtn = this.showProcessBtn;

                    let message = '', idUserGet;
                    if (item.idBuyingUser === this.currentUser.id) {
                        message = 'Esperando a que {0} acepte la transacción.';
                        idUserGet = item.idSellingUser;
                    }
                    else {
                        message = '¿Acepta la transacción que le envió {0}?.';
                        idUserGet = item.idBuyingUser;
                    }
                    const userNameGet = this.userItems.find(user => user.id === idUserGet).name
                    this.actionMessage = message.replace('{0}', userNameGet);

                    break;
                }

                case this.$config.Statuses.Paying: {
                    this.processBtnTxt = 'Sí, pagado';
                    this.showProcessBtn = item.idBuyingUser === this.currentUser.id;
                    this.showNoProcessBtn = false;

                    let message = '', idUserGet;
                    if (item.idBuyingUser === this.currentUser.id) {
                        message = '¿Ya realizó el pago total de la transacción?.';
                        idUserGet = item.idSellingUser;
                    }
                    else {
                        message = 'Esperando a que {0} haga el pago de la transacción.';
                        idUserGet = item.idBuyingUser;
                    }
                    const userNameGet = this.userItems.find(user => user.id === idUserGet).name
                    this.actionMessage = message.replace('{0}', userNameGet);

                    break;
                }

                case this.$config.Statuses.Revision: {
                    this.processBtnTxt = '';
                    this.showProcessBtn = item.idSecureTransactionsUser === this.currentUser.id;
                    this.showNoProcessBtn = this.showProcessBtn;
                    this.actionMessage = "Por favor espere mientras el personal de " + this.$config.ProjectName + " revisa la transacción.";
                    break;
                }

                case this.$config.Statuses.Sending: {
                    this.processBtnTxt = 'Sí, enviado';
                    this.showProcessBtn = item.idSellingUser === this.currentUser.id;
                    this.showNoProcessBtn = this.showProcessBtn;

                    let message = '', idUserGet;
                    if (item.idBuyingUser === this.currentUser.id) {
                        message = 'Esperando a que {0} haga el envío del producto.';
                        idUserGet = item.idSellingUser;
                    }
                    else {
                        message = '¿Ya realizó el envío del producto?.';
                        idUserGet = item.idBuyingUser;
                    }
                    const userNameGet = this.userItems.find(user => user.id === idUserGet).name
                    this.actionMessage = message.replace('{0}', userNameGet);

                    break;
                }

                case this.$config.Statuses.Receiving: {
                    this.processBtnTxt = 'Sí, recibido';
                    this.noProcessBtnTxt = 'No lo recibí';
                    this.showProcessBtn = item.idBuyingUser === this.currentUser.id;
                    this.showNoProcessBtn = this.showProcessBtn;

                    let message = '', idUserGet;
                    if (item.idBuyingUser === this.currentUser.id) {
                        message = '¿Ya recibió el producto?.';
                        idUserGet = item.idSellingUser;
                    }
                    else {
                        message = 'Esperando a que {0} confirme que ya recibió el producto.';
                        idUserGet = item.idBuyingUser;
                    }
                    const userNameGet = this.userItems.find(user => user.id === idUserGet).name
                    this.actionMessage = message.replace('{0}', userNameGet);

                    break;
                }

                case this.$config.Statuses.Analysis: {
                    this.processBtnTxt = '';
                    this.showProcessBtn = item.idSecureTransactionsUser === this.currentUser.id;
                    this.showNoProcessBtn = this.showProcessBtn;
                    this.actionMessage = "Por favor espere mientras el personal de " + this.$config.ProjectName + " analiza el caso.";
                    break;
                }
            };
        },

        ColorByStatus(idStatus) {
            idStatus = idStatus ?? this.statusId;

            let color;
            switch (idStatus) {
                case this.$config.Statuses.Deleted:
                case this.$config.Statuses.Discarded: color = 'red'; break;
                case this.$config.Statuses.Finished: color = 'success'; break;
                case this.$config.Statuses.Draft: color = 'primary'; break;
                case this.$config.Statuses.Acceptance: color = 'warning'; break;
                case this.$config.Statuses.Paying: color = 'indigo'; break;
                case this.$config.Statuses.Revision: color = 'teal'; break;
                case this.$config.Statuses.Sending: color = 'black'; break;
                case this.$config.Statuses.Receiving: color = 'light-blue-accent-3'; break;
                case this.$config.Statuses.Analysis: color = 'orange'; break;
            };
            return color;
        },

        TableButtonsbyStatus(item) {
            let htmlButtons = '', isEdit = false;

            switch (item.idStatus) {
                case this.$config.Statuses.Discarded:
                case this.$config.Statuses.Finished:
                    htmlButtons = GenerateEditViewBtn(item.id, isEdit); break;

                case this.$config.Statuses.Draft: htmlButtons = GenerateEditViewBtn(item.id) + GenerateDeleteBtn(item.id); break;

                case this.$config.Statuses.Acceptance: {
                    isEdit = item.idCreationUser !== this.currentUser.id;
                    htmlButtons = GenerateEditViewBtn(item.id, isEdit); break;
                }

                case this.$config.Statuses.Paying: {
                    isEdit = item.idBuyingUser === this.currentUser.id;
                    htmlButtons = GenerateEditViewBtn(item.id, isEdit);
                    break;
                }

                case this.$config.Statuses.Revision: {
                    isEdit = item.idSecureTransactionsUser === this.currentUser.id;
                    htmlButtons = GenerateEditViewBtn(item.id, isEdit);
                    break;
                }

                case this.$config.Statuses.Sending: {
                    isEdit = item.idSellingUser === this.currentUser.id;
                    htmlButtons = GenerateEditViewBtn(item.id, isEdit);
                    break;
                }

                case this.$config.Statuses.Receiving: {
                    isEdit = item.idBuyingUser === this.currentUser.id;
                    htmlButtons = GenerateEditViewBtn(item.id, isEdit);
                    break;
                }

                case this.$config.Statuses.Analysis: {
                    isEdit = item.idSecureTransactionsUser === this.currentUser.id;
                    htmlButtons = GenerateEditViewBtn(item.id, isEdit);
                    break;
                }
            };

            return htmlButtons;
        },

        GetCurrencySymbol(currency = null) {
            currency = currency !== null ? currency : this.currency;
            return currency.charAt(0);
        },

        CalculateCommissionAndTotal(newPrice) {
            if (newPrice === '' || newPrice === 0) {
                this.commission = 0;
                this.total = 0;
            }
            else {
                newPrice = parseFloat(newPrice);
                let commission = newPrice * (this.commissionPercentage / 100);
                this.commission = commission < 0.01 ? 0.01 : commission;
                this.total = newPrice + this.commission;
            }
        },

        FormatCurrency(value, currency) {
            if (value !== null) {
                const currencySymbol = this.GetCurrencySymbol(currency) === this.GetCurrencySymbol(this.currencyItems[0]) ? 'CRC' : 'USD';
                return value.toLocaleString(undefined, {
                    style: 'currency',
                    currency: currencySymbol,
                    minimumFractionDigits: 2,
                }).replace(currencySymbol, '');
            }
            else return '';
        },

        SelectedItemChange() {
            if (this.userId !== undefined) {
                const selectedUserName = this.userItems.find(user => user.id === this.userId).name
                const question = '¿Desea enviarle la transacción a {0}?';
                this.actionMessage = question.replace('{0}', selectedUserName);
            }
        },

        InitForm() {
            this.id = null;
            this.userId = null;
            this.currency = this.currencyItems[0];
            this.information = '';
            this.price = 0;
            this.commission = 0;
            this.total = 0;

            this.statusId = this.$config.Statuses.Draft;
            this.statusName = '';
            this.loading = false;
            this.isFormReadOnly = false;
            this.showProcessBtn = true;
            this.actionMessage = '¿Desea enviar la transacción?';
            this.processBtnTxt = 'Sí, enviarla';
            this.noProcessBtnTxt = '';
        }
    },
    components: {
        DataTable
    },
};
</script>
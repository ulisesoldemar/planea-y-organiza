<template>
    <div style="margin-left: 70px;" class="mt-4 mr-4">
        <v-data-table height="500" :headers="headers" :items="players" :sort-by="[{ key: 'firstName', order: 'asc' }]" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Sujetos</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="700px">
                        <template v-slot:activator="{ props }">
                            <v-btn color="primary" dark class="mb-2" v-bind="props">
                                Agregar sujeto
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
    
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.name" label="Nombre(s)"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.calories" label="Primer apellido"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.fat" label="Segundo apellido"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.fat" label="Correo"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.carbs" label="Edad"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.protein" label="Sexo"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
    
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click="close">
                                    Cancel
                                </v-btn>
                                <v-btn color="blue-darken-1" variant="text" @click="save">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                    mdi-pencil
                </v-icon>
                <v-icon size="small" @click="deleteItem(item.raw)">
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">
                    Reset
                </v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>

import { useAdmins } from '@/stores/admin';

export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        adminStore: useAdmins(),
        headers: [
            {
                title: 'Nombre',
                align: 'start',
                key: 'firstName',
            },
            { title: 'Apellido paterno', key: 'surName' },
            { title: 'Apellido materno', key: 'secondSurName' },
            { title: 'Correo', key: 'email' },
            { title: 'Edad', key: 'age' },
            { title: 'Actions', key: 'actions', sortable: false },
        ],
        players: [],
        editedIndex: -1,
        editedItem: {
            firstName: '',
            surName: '',
            secondSurName: '',
            email: '',
            age: '',
        },
        defaultItem: {
            firstName: '',
            surName: '',
            secondSurName: '',
            email: '',
            age: '',
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Jugador' : 'Editar Jugador'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.listPlayerData()
    },

    methods: {
        async listPlayerData() {
            this.players =  await this.adminStore.fetchPlayersData();
            // this.players = [
            //     {
            //         firstName: 'Frozen Yogurt',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            //     {
            //         firstName: 'Ice cream sandwich',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            //     {
            //         firstName: 'Eclair',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            //     {
            //         firstName: 'Cupcake',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            //     {
            //         firstName: 'Gingerbread',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            //     {
            //         firstName: 'Jelly bean',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            //     {
            //         firstName: 'Lollipop',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            //     {
            //         firstName: 'Honeycomb',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            //     {
            //         firstName: 'Donut',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            //     {
            //         firstName: 'KitKat',
            //         surName: '',
            //         secondSurName: '',
            //         email: '',
            //         age: '',
            //     },
            // ]
        },

        editItem(item) {
            this.editedIndex = this.players.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.players.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            // this.players.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async save() {
            // if (this.editedIndex > -1) {
            //     //Update User
            //     Object.assign(this.players[this.editedIndex], this.editedItem)
            // } else {
            //     //New User
            //     this.players.push(this.editedItem)
            // }
        
            //Se envian los datos y el Index para saber si fue Nuevo o Actualizar
            await this.adminStore.createPlayer(this.editedItem, this.editedIndex)
            .then(() => {
                this.listPlayerData();
                setTimeout(() => {
                    //loading.value = false;
                    this.close()
                }, "1000");
            });
        },
    },
}
</script>
<template>
  <div class="animated fadeIn">
    <b-card header="Datos Generales" header-tag="header" footer-tag="footer">
      <div>
        <b-form>
          <div>
            <b-card bg-variant="light">
              <b-row>
                <b-col class="pad-x">
                  <b-form-group>
                    <b-row>Nombre:</b-row>
                    <b-row>
                      <b-form-input id="nombre" v-model="personaDto.perNombre" aria-required></b-form-input>
                    </b-row>
                  </b-form-group>
                </b-col>
                <b-col class="pad-x">
                  <b-form-group>
                    <b-row>Apellido:</b-row>
                    <b-row>
                      <b-form-input id="apellido" v-model="personaDto.perApellido"></b-form-input>
                    </b-row>
                  </b-form-group>
                </b-col>
                <b-col class="pad-x">
                  <b-form-group>

                  </b-form-group>
                </b-col>
              </b-row>

              <b-form-group>
                <b-row>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Tipo de Documento:</b-row>
                      <b-row>
                        <b-form-select id="comboTipoDocumento" v-model="tipoDocumentoSelected" @change="getSelectedItem"
                                       :options="tipoDocumentoOptions">
                          <template slot="first">
                            <option :value="null" disabled>-- Seleccionar una opcion --</option>
                          </template>
                        </b-form-select>
                      </b-row>
                    </b-form-group>
                  </b-col>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Numero Documento:</b-row>
                      <b-row>
                        <b-form-input type="number" id="numeroDocumento" min="10000"
                                      v-model="personaDto.perNumeroDocumento"></b-form-input>
                      </b-row>
                    </b-form-group>
                  </b-col>
                  <b-col class="pad-x">
                    <b-form-group>
                      <b-row>Fecha Nacimiento:</b-row>
                      <b-row>
                        <datepicker id="fechaNacimiento" v-model="personaDto.perFechaNacimiento" format="dd/MM/yyyy"
                                    bootstrap-styling input-class="fechas"></datepicker>
                      </b-row>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-card>
          </div>
        </b-form>
      </div>
      <hr/>
      <div>
        <router-link to="/personas">
          <b-button class="m-1">
            <v-icon name="arrow-left"></v-icon>
            Volver
          </b-button>
        </router-link>
        <b-button class="m-1" variant="blue" @click="savePersona()">
          <v-icon name="save"></v-icon>
          Guardar
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
	import axios from 'axios';

	export default {
		name: 'alta-persona',
		mounted() {
			this.getTiposDocumento();
		},
		data() {
			return {
				tipoDocumentoSelected: null,
				tipoDocumentoOptions: {},
				personaDto: {
					perApellido: null,
					perFechaNacimiento: null,
					perId: null,
					perNombre: null,
					perNumeroDocumento: null,
					perTpoId: null
				}
			};
		},
		methods: {
			getTiposDocumento() {
				axios.get('http://localhost:8080/documentos').then(respuesta => {
					this.tipoDocumentoOptions = respuesta.data.data;
					this.tipoDocumentoOptions.forEach(element => {
						element.value = element.tpoId;
						element.text = element.tpoDescripcion;
					});
				});
			},
			getSelectedItem(tipoDocumentoSelected) {
				this.personaDto.perTpoId = tipoDocumentoSelected;
			},
			savePersona() {
				const mensaje = this.validar();
				if (mensaje === null) {
					axios
						.post('http://localhost:8080/personas', this.personaDto)
						.then(respuesta => {
							this.makeToast(
								'success',
								'Felicitaciones!',
								'Se ha guardado correctamente',
								true
							);
						})
						.catch(error => {
							console.log(error);
							this.makeToast('danger', 'Ups!', 'Ha ocurrido un error', false);
						});
				} else {
					this.makeToast('warning', 'Ups!', mensaje, false);
				}
			},
			validar() {
				let mensaje = null;
				if (this.personaDto.perNombre === null || this.personaDto.perNombre.length <  3) {
            return mensaje = 'Debe ingresar un nombre con al menos 3 caracteres';
        }
        if (this.personaDto.perApellido === null || this.personaDto.perApellido.length <  3) {
            return mensaje = 'Debe ingresar un apellido con al menos 3 caracteres';
        }
				if (this.tipoDocumentoSelected === null ) {
            return mensaje = 'Debe seleccionar un tipoDocumento';
				}
        if (this.personaDto.perNumeroDocumento === null || this.personaDto.perNumeroDocumento.length < 8) {
            return mensaje = 'Debe ingresar un numero de documento con al menos 8 numeros';
        }
        if (this.personaDto.perFechaNacimiento === null) {
            return mensaje = 'Debe seleccionar una fecha de nacimiento';
        }
        return mensaje;
			},
			makeToast(variant = null, titulo, msj, redirect) {
				const router = this.$router;
				setTimeout(resolve => {
					this.$bvToast.toast(`${msj}`, {
						title: `${titulo}`,
						variant: variant,
						solid: true
					});
				}, 1000);
				if (redirect) router.push('/personas');
			}
		}
	};
</script>

<style lang="scss">
  .pad-x {
    padding-left: 2%;
    padding-right: 2%;
  }

  .fechas {
    background-color: white !important;
  }
</style>

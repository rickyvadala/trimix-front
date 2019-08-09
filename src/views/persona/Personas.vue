<template>
  <div class="animated fadeIn">
    <b-card header="Personas" header-tag="header" footer-tag="footer">
      <div>
        <b-form>
          <div>
            <b-card bg-variant="light">
              <b-row>
                <b-col class="pad-x">
                  <b-form-group>
                    <b-row>
                      Nombre:
                    </b-row>
                    <b-row>
                      <b-form-input id="nombre" v-model="nombreBuscar"></b-form-input>
                    </b-row>
                  </b-form-group>
                </b-col>
                <b-col class="pad-x">
                  <b-form-group>
                    <b-row>
                      Tipo de Documento:
                    </b-row>
                    <b-row>
                      <b-form-select id="comboTipoDocumento" v-model="tipoDocumentoSelected" @change="getSelectedItem"
                                     :options="tipoDocumentoOptions">
                        <template slot="first">
                          <option :value="null">-- Seleccionar una opcion --</option>
                        </template>
                      </b-form-select>
                    </b-row>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>
          </div>
        </b-form>
        <b-row>
          <b-col>
            <b-button class="m-1 float-left" variant="blue" @click="buscarPersona()">
              <v-icon name="search"></v-icon>
              Buscar
            </b-button>
          </b-col>
          <b-col>
            <router-link to="/alta-persona">
              <b-button variant="green" class="m-1 float-right"><v-icon name="plus"/> Nuevo</b-button>
            </router-link>
          </b-col>
        </b-row>
      </div>
      <br />
      <div v-if="items != null">
        <b-table :small="true" bordered responsive striped hover :items="items" :fields="fields">
          <template slot="actions" slot-scope="row">
            <b-button size="sm" class="mr-2" variant="blue" @click="editPersona(row.item)"><v-icon name="edit"/></b-button>
            <b-button size="sm" @click="deletePersona(row.item, row.index)" class="mr-2"><v-icon name="trash-alt"/></b-button>
          </template>
        </b-table>
      </div>
      <span v-else>Cargando Personas...</span>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "personas",
  mounted() {
    this.getPersonas();
    this.getTiposDocumento();
  },
  data() {
    return {
      cantidadPersonas:0,
      tipoDocumentoOptions: {},
      tipoDocumentoSelected: null,
      documentoBuscar: null,
      nombreBuscar: null,
      items: null,
      fields: {
        perId: {
          label: "Id",
          sortable: true
        },
        perNombre: {
          label: "Nombre",
          sortable: true
        },
        perApellido: {
          label: "Apellido",
          sortable: true
        },
        perNumeroDocumento: {
          label: "Nro Documento",
          sortable: false
        },
        perTipoDocumento: {
          label: "Tipo Documento",
          sortable: false
        },
				fechaNacimientoFormat: {
          label: "Fecha Nacimiento",
          sortable: false
        },
        actions: {
          label: "",
          sortable: false
        }
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
          console.log(tipoDocumentoSelected);
          this.documentoBuscar = tipoDocumentoSelected;
      },
      buscarPersona() {
          this.items = [];
          if (this.nombreBuscar !== null && this.nombreBuscar !== ''){
              var nombreBuscarLC = this.nombreBuscar.toLowerCase();
              axios.get("http://localhost:8080/personas").then(respuesta => {
                    respuesta.data.data.forEach(element => {
                      var perNombreLC = element.perNombre.toLowerCase();
                      if (perNombreLC.search(nombreBuscarLC) >= 0) {
                          if (this.documentoBuscar!==null) {
                              //Entra cuando nombreBuscar no es vacio y tipoDocumentoBuscar es distinto a null

                              if (this.documentoBuscar===element.perTipoDocumento.tpoId) {
                                  element.perTipoDocumento = element.perTipoDocumento.tpoDescripcion;
                                  this.items.push(element);
                              }
                          } else {
                              //Entra cuando nombreBuscar no es vacio y tipoDocumentoBuscar es null
                              element.perTipoDocumento = element.perTipoDocumento.tpoDescripcion;
                              this.items.push(element);
                          }
                      }
                  });
            });
          } else {
              if (this.documentoBuscar!==null) {
                  //Entra cuando nombreBuscar es vacio y tipoDocumentoBuscar distinto a null
                  axios.get("http://localhost:8080/personas").then(respuesta => {
                      respuesta.data.data.forEach(element => {
                              if (this.documentoBuscar!==null) {
                                  if (this.documentoBuscar===element.perTipoDocumento.tpoId) {
                                      element.perTipoDocumento = element.perTipoDocumento.tpoDescripcion;
                                      this.items.push(element);
                                  }
                              }
                      });
                  });
              } else {
                  //Refresca la tabla, no busca con parametros (nombreBuscar y tipoDocumentoBuscar son null)
                  this.getPersonas();
              }
              return;
          }
      },
    getPersonas() {
      axios.get("http://localhost:8080/personas").then(respuesta => {
        this.items = respuesta.data.data;
        console.log(this.items)
          this.cantidadPersonas =this.items.length;
          this.items.forEach(element => {
            element.perTipoDocumento = element.perTipoDocumento.tpoDescripcion;
        });
      });
    },
    editPersona(item){
    	this.$router.push({path: 'editar-persona/' + item.perId});
    },
		deletePersona(item, index){
        let x;
        let y = confirm("Seguro que desea borrar esta persona?")
        if (y==true) {
            axios.delete("http://localhost:8080/personas/" + item.perId).then(respuesta => {
                console.log(`respuesta.data.message: ` + respuesta.data.message);
                this.getPersonas();
            });
        }
		}
  }
};
</script>

<style lang="scss">
  .pad-x {
    margin-left: 2%;
    margin-right: 2%;
  }

</style>

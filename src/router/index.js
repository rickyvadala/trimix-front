import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Personas from '@/views/persona/Personas'
import AltaPersona from '@/views/persona/AltaPersona'
import EditarPersona from '@/views/persona/EditarPersona'
import Documentos from '@/views/documento/Documentos'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/personas',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'personas',
          name: 'Personas',
          component: Personas
        },
        {
          path: 'alta-persona',
          name: 'AltaPersona',
          component: AltaPersona
        },
        {
          path: 'editar-persona/:id',
          name: 'editar-persona',
          component: EditarPersona
        },
        {
          path: 'documentos',
          name: 'Documentos',
          component: Documentos
        }
      ]
    }
  ]
})

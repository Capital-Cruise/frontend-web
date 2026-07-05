import LoginView from './iam/pages/LoginView.page.vue'
import DefaultLayout from './public/layouts/DefaultLayout.page.vue'
import DashboardView from './loans/pages/DashboardView.page.vue'
import ClientsView from './clients/pages/ClientsView.page.vue'
import VehiclesView from './vehicles/pages/VehiclesView.page.vue'
import SimulationView from './loans/pages/SimulationView.page.vue'
import SimulationResultView from './loans/pages/SimulationResultView.page.vue'
import OperationsView from './loans/pages/OperationsView.page.vue'
import OperationDetailView from './loans/pages/OperationDetailView.page.vue'
import OperationShareView from './loans/pages/OperationShareView.page.vue'
import PublicQuoteView from './public/pages/PublicQuoteView.page.vue'
import PageNotFound from './public/pages/PageNotFound.page.vue'
import SupportView from './public/pages/SupportView.page.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/quote/:shareToken',
    name: 'public-quote',
    component: PublicQuoteView,
    props: true,
    meta: {
      public: true,
      title: 'Compartir operación',
      subtitle: 'Vista pública de una operación compartida.'
    }
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: DashboardView, meta: { title: 'Panel principal' } },
      {
        path: 'clients',
        name: 'clients',
        component: ClientsView,
        meta: { title: 'Clientes', subtitle: 'Gestiona el registro de clientes y su perfil financiero.' }
      },
      {
        path: 'vehicles',
        name: 'vehicles',
        component: VehiclesView,
        meta: { title: 'Vehículos', subtitle: 'Gestiona el inventario vehicular y su valorización comercial.' }
      },
      {
        path: 'simulation',
        name: 'simulation',
        component: SimulationView,
        meta: {
          title: 'Simulación de crédito vehicular',
          subtitle: 'Crea una nueva operación de crédito y su cronograma de pagos.'
        }
      },
      {
        path: 'simulation/result',
        name: 'simulation-result',
        component: SimulationResultView,
        meta: { title: 'Resultado de la simulación', subtitle: 'Revisa la cotización financiera generada.' }
      },
      {
        path: 'operations',
        name: 'operations',
        component: OperationsView,
        meta: { title: 'Operaciones guardadas', subtitle: 'Revisa las simulaciones financieras guardadas.' }
      },
      {
        path: 'operations/:id',
        name: 'operation-detail',
        alias: 'operation/:id',
        component: OperationDetailView,
        props: true,
        meta: { title: 'Detalle de operación', subtitle: 'Consulta la operación financiera guardada.' }
      },
      {
        path: 'operations/:id/share',
        name: 'operation-share',
        alias: 'operation/:id/share',
        component: OperationShareView,
        props: true,
        meta: { title: 'Compartir operación', subtitle: 'Genera y comparte el enlace público de la operación.' }
      },
      {
        path: 'support',
        name: 'support',
        component: SupportView,
        meta: { title: 'Ayuda y asistencia técnica', subtitle: 'Preguntas frecuentes, contacto y términos de uso.' }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound }
]

export default routes

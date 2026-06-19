import LoginView from './iam/pages/LoginView.page.vue'
import DefaultLayout from './public/layouts/DefaultLayout.page.vue'
import DashboardView from './loans/pages/DashboardView.page.vue'
import ClientsView from './clients/pages/ClientsView.page.vue'
import VehiclesView from './vehicles/pages/VehiclesView.page.vue'
import SimulationView from './loans/pages/SimulationView.page.vue'
import OperationsView from './loans/pages/OperationsView.page.vue'
import OperationDetailView from './loans/pages/OperationDetailView.page.vue'
import PageNotFound from './public/pages/PageNotFound.page.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { public: true }
    },
    {
        path: '/',
        component: DefaultLayout,
        meta: { requiresAuth: true },
        children: [
            { path: '', name: 'dashboard', component: DashboardView },
            { path: 'clients', name: 'clients', component: ClientsView },
            { path: 'vehicles', name: 'vehicles', component: VehiclesView },
            { path: 'simulation', name: 'simulation', component: SimulationView },
            { path: 'operations', name: 'operations', component: OperationsView },
            { path: 'operation/:id', name: 'operation-detail', component: OperationDetailView, props: true }
        ]
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound }
]

export default routes
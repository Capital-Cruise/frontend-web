import LoginView from './iam/pages/LoginView.page.vue'
import DefaultLayout from './public/layouts/DefaultLayout.page.vue'
import DashboardView from './loans/pages/DashboardView.page.vue'
import ClientsView from './clients/pages/ClientsView.page.vue'
import VehiclesView from './vehicles/pages/VehiclesView.page.vue'
import SimulationView from './loans/pages/SimulationView.page.vue'
import SimulationResultView from './loans/pages/SimulationResultView.page.vue'
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
            { path: '', name: 'dashboard', component: DashboardView, meta: { title: 'Dashboard' } },
            { path: 'clients', name: 'clients', component: ClientsView, meta: { title: 'Clients', subtitle: 'Manage advisory clients.' } },
            { path: 'vehicles', name: 'vehicles', component: VehiclesView, meta: { title: 'Vehicles', subtitle: 'Manage vehicle inventory.' } },
            { path: 'simulation', name: 'simulation', component: SimulationView, meta: { title: 'New Simulation', subtitle: 'Create a new loan operation.' } },
            { path: 'simulation/result', name: 'simulation-result', component: SimulationResultView, meta: { title: 'Simulation Result', subtitle: 'Review the generated loan quote.' } },
            { path: 'operations', name: 'operations', component: OperationsView, meta: { title: 'Saved Operations', subtitle: 'Review saved financial simulations.' } },
            { path: 'operation/:id', name: 'operation-detail', component: OperationDetailView, props: true }
        ]
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound }
]

export default routes

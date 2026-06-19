<template>
  <form class="simulation-form" @submit.prevent="handleCalculate">
    <div class="layout-quote">
      <div class="left-stack">
        <!-- Entity Selection -->
        <section class="card">
          <h2>Entity Selection</h2>
          <div class="two-cols">
            <label>Primary Client
              <select v-model="selectedClientId" required>
                <option v-for="c in clients" :key="c.identifier" :value="c.identifier">
                  {{ c.displayName }}
                </option>
              </select>
            </label>
            <label>Vehicle Asset
              <select v-model="selectedVehicleId" required>
                <option v-for="v in vehicles" :key="v.identifier" :value="v.identifier">
                  {{ v.displayName }} · {{ formatMoney(v.price, v.currency) }}
                </option>
              </select>
            </label>
          </div>
        </section>

        <!-- Loan Structure -->
        <section class="card">
          <h2>Loan Structure</h2>
          <div class="two-cols">
            <label>Operation Currency
              <select v-model="loan.operationCurrency">
                <option>USD</option>
                <option>PEN</option>
              </select>
            </label>
            <label>Vehicle Price
              <input type="number" step="0.01" v-model.number="vehiclePrice" />
            </label>
            <label>Down Payment Mode
              <select v-model="downPaymentMode">
                <option value="percent">Percentage</option>
                <option value="amount">Amount</option>
              </select>
            </label>
            <label v-show="downPaymentMode === 'percent'">Down Payment Percent
              <input type="number" step="0.01" v-model.number="downPaymentPercent" />
            </label>
            <label v-show="downPaymentMode === 'amount'">Down Payment Amount
              <input type="number" step="0.01" v-model.number="downPaymentAmount" />
            </label>
            <label>Term Months
              <input type="number" min="1" v-model.number="loan.termMonths" @change="updateDueInstallment" />
            </label>
            <label>Start Date
              <input type="date" v-model="loan.startDate" />
            </label>
          </div>
          <p class="hint">Backend defaults: FRENCH, MONTHLY, ORDINARY_ARREARS, COMMERCIAL_30_360.</p>
        </section>

        <!-- Interest Configuration -->
        <section class="card">
          <h2>Interest Configuration</h2>
          <div class="two-cols">
            <label>Rate Type
              <select v-model="rate.rateType">
                <option value="EFFECTIVE">EFFECTIVE</option>
                <option value="NOMINAL">NOMINAL</option>
              </select>
            </label>
            <label>Rate Value (%)
              <input type="number" step="0.01" v-model.number="rate.rateValue" />
            </label>
            <label>Rate Period
              <select v-model="rate.ratePeriod">
                <option value="ANNUAL">ANNUAL</option>
                <option value="MONTHLY">MONTHLY</option>
              </select>
            </label>
            <label v-show="rate.rateType === 'NOMINAL'">Capitalization Frequency
              <select v-model="rate.capitalizationFrequency">
                <option value="MONTHLY">MONTHLY</option>
                <option value="DAILY">DAILY</option>
                <option value="QUARTERLY">QUARTERLY</option>
                <option value="SEMI_ANNUAL">SEMI_ANNUAL</option>
                <option value="ANNUAL">ANNUAL</option>
              </select>
            </label>
            <label>Discount Rate Type
              <select v-model="financialEvaluation.discountRateType">
                <option value="EFFECTIVE">EFFECTIVE</option>
              </select>
            </label>
            <label>Discount Rate Period
              <select v-model="financialEvaluation.discountRatePeriod">
                <option value="ANNUAL">ANNUAL</option>
                <option value="MONTHLY">MONTHLY</option>
              </select>
            </label>
            <label>COK / Discount Rate Value (%)
              <input type="number" step="0.01" v-model.number="financialEvaluation.discountRateValue" />
            </label>
            <label>Exchange Rate
              <input type="number" step="0.0001" v-model.number="exchangeRate.value" />
            </label>
          </div>
        </section>

        <!-- Balloon Payment & Grace Period -->
        <div class="two-card-row">
          <section class="card">
            <h2>Balloon Payment</h2>
            <label>Enabled
              <select v-model="balloon.enabled">
                <option :value="false">Disabled</option>
                <option :value="true">Enabled</option>
              </select>
            </label>
            <div v-show="balloon.enabled" id="balloonFields">
              <label>Mode
                <select v-model="balloonMode">
                  <option value="percent">Percent</option>
                  <option value="amount">Amount</option>
                </select>
              </label>
              <label v-show="balloonMode === 'percent'">Balloon Percent
                <input type="number" step="0.01" v-model.number="balloon.balloonPercent" />
              </label>
              <label v-show="balloonMode === 'amount'">Balloon Amount
                <input type="number" step="0.01" v-model.number="balloon.balloonAmount" />
              </label>
              <label>Balloon Base
                <select v-model="balloon.balloonBase">
                  <option value="VEHICLE_PRICE">VEHICLE_PRICE</option>
                  <option value="PRINCIPAL_FINANCED">PRINCIPAL_FINANCED</option>
                </select>
              </label>
              <label>Due Installment
                <input type="number" v-model.number="balloon.dueInstallment" />
              </label>
            </div>
          </section>
          <section class="card">
            <h2>Grace Period</h2>
            <label>Type
              <select v-model="grace.graceType">
                <option value="NONE">NONE</option>
                <option value="PARTIAL">PARTIAL</option>
                <option value="TOTAL">TOTAL</option>
              </select>
            </label>
            <label v-show="grace.graceType !== 'NONE'">Duration Months
              <input type="number" min="0" v-model.number="grace.gracePeriods" />
            </label>
          </section>
        </div>

        <!-- Initial Charges -->
        <section class="card">
          <div class="section-head">
            <h2>Initial Charges</h2>
            <button type="button" class="secondary" @click="addInitialCharge">Add Initial Charge</button>
          </div>
          <div class="mini-table">
            <table>
              <thead>
              <tr><th>Code</th><th>Label</th><th>Amount</th><th>Mode</th><th>Actions</th></tr>
              </thead>
              <tbody>
              <tr v-for="(charge, index) in initialCharges" :key="index">
                <td>{{ charge.code }}</td>
                <td>{{ charge.label }}</td>
                <td>{{ formatMoney(charge.amount, charge.currency) }}</td>
                <td>{{ charge.financingMode }}</td>
                <td>
                  <button type="button" class="secondary small" @click="editInitialCharge(index)">Edit</button>
                  <button type="button" class="danger small" @click="removeInitialCharge(index)">Delete</button>
                </td>
              </tr>
              </tbody>
            </table>
            <p v-if="initialCharges.length === 0">No initial charges added.</p>
          </div>
        </section>

        <!-- Periodic Charges -->
        <section class="card">
          <div class="section-head">
            <h2>Periodic Charges</h2>
            <button type="button" class="secondary" @click="addPeriodicCharge">Add Periodic Charge</button>
          </div>
          <div class="mini-table">
            <table>
              <thead>
              <tr><th>Code</th><th>Label</th><th>Type</th><th>Value</th><th>Base</th><th>Frequency</th><th>Range</th><th>Actions</th></tr>
              </thead>
              <tbody>
              <tr v-for="(charge, index) in periodicCharges" :key="index">
                <td>{{ charge.code }}</td>
                <td>{{ charge.label }}</td>
                <td>{{ charge.chargeType }}</td>
                <td>{{ charge.chargeType === 'FIXED_AMOUNT' ? formatMoney(charge.amount, charge.currency) : formatPercent(charge.ratePercent) }}</td>
                <td>{{ charge.rateBase || '---' }}</td>
                <td>{{ charge.frequency }}</td>
                <td>{{ charge.fromInstallment }}-{{ charge.toInstallment }}</td>
                <td>
                  <button type="button" class="secondary small" @click="editPeriodicCharge(index)">Edit</button>
                  <button type="button" class="danger small" @click="removePeriodicCharge(index)">Delete</button>
                </td>
              </tr>
              </tbody>
            </table>
            <p v-if="periodicCharges.length === 0">No periodic charges added.</p>
          </div>
        </section>
      </div>

      <aside class="summary-panel card dark-card">
        <h2>Simulation Summary</h2>
        <div class="summary-metric">
          <span>Estimated Monthly Installment</span>
          <strong>$------</strong>
        </div>
        <div class="summary-row">
          <span>Total Interest</span>
          <strong>$------</strong>
        </div>
        <div class="summary-row">
          <span>TCEA</span>
          <strong>------</strong>
        </div>
        <button class="primary light full" type="submit">Calculate Quote</button>
        <button class="danger full" type="button" @click="resetForm">Reset Simulation</button>
      </aside>
    </div>

    <!-- Dialog for Initial Charge -->
    <dialog ref="initialChargeDialog" class="dialog">
      <form class="dialog-form" @submit.prevent="saveInitialCharge">
        <h2>Initial Charge</h2>
        <div class="two-cols">
          <label>Charge Code
            <select v-model="editingInitialCharge.code">
              <option>NOTARY_FEES</option>
              <option>REGISTRATION_FEES</option>
              <option>STUDY_COMMISSION</option>
              <option>APPRAISAL</option>
              <option>GPS</option>
              <option>SOAT</option>
              <option>OTHER</option>
            </select>
          </label>
          <label>Label
            <input v-model="editingInitialCharge.label" required />
          </label>
          <label>Amount
            <input type="number" min="0" step="0.01" v-model.number="editingInitialCharge.amount" required />
          </label>
          <label>Currency
            <select v-model="editingInitialCharge.currency">
              <option>USD</option>
              <option>PEN</option>
            </select>
          </label>
          <label>Financing Mode
            <select v-model="editingInitialCharge.financingMode">
              <option>FINANCED</option>
              <option>PAID_UPFRONT</option>
              <option>WITHHELD</option>
            </select>
          </label>
          <label class="check">
            <input type="checkbox" v-model="editingInitialCharge.taxable" /> Taxable
          </label>
        </div>
        <div class="dialog-actions">
          <button type="button" class="secondary" @click="closeInitialDialog">Cancel</button>
          <button type="submit" class="primary">Save</button>
        </div>
      </form>
    </dialog>

    <!-- Dialog for Periodic Charge -->
    <dialog ref="periodicChargeDialog" class="dialog">
      <form class="dialog-form" @submit.prevent="savePeriodicCharge">
        <h2>Periodic Charge</h2>
        <div class="two-cols">
          <label>Charge Code
            <select v-model="editingPeriodicCharge.code">
              <option>POSTAGE</option>
              <option>ADMIN_FEE</option>
              <option>LIFE_INSURANCE</option>
              <option>VEHICLE_INSURANCE</option>
              <option>MONTHLY_COMMISSION</option>
              <option>OTHER</option>
            </select>
          </label>
          <label>Charge Type
            <select v-model="editingPeriodicCharge.chargeType">
              <option>FIXED_AMOUNT</option>
              <option>RATE</option>
            </select>
          </label>
          <label>Label
            <input v-model="editingPeriodicCharge.label" required />
          </label>
          <template v-if="editingPeriodicCharge.chargeType === 'FIXED_AMOUNT'">
            <label>Amount
              <input type="number" min="0" step="0.01" v-model.number="editingPeriodicCharge.amount" />
            </label>
            <label>Currency
              <select v-model="editingPeriodicCharge.currency">
                <option>USD</option>
                <option>PEN</option>
              </select>
            </label>
          </template>
          <template v-if="editingPeriodicCharge.chargeType === 'RATE'">
            <label>Rate Percent
              <input type="number" min="0" step="0.01" v-model.number="editingPeriodicCharge.ratePercent" />
            </label>
            <label>Rate Base
              <select v-model="editingPeriodicCharge.rateBase">
                <option>VEHICLE_PRICE</option>
                <option>PRINCIPAL_FINANCED</option>
                <option>OPENING_BALANCE</option>
                <option>REMAINING_BALANCE</option>
                <option>BALLOON</option>
              </select>
            </label>
          </template>
          <label>Frequency
            <select v-model="editingPeriodicCharge.frequency">
              <option>MONTHLY</option>
              <option>ANNUAL_PRORATED_MONTHLY</option>
            </select>
          </label>
          <label>Applies During Grace
            <select v-model="editingPeriodicCharge.appliesDuringGrace">
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>
          </label>
          <label>From Installment
            <input type="number" min="1" v-model.number="editingPeriodicCharge.fromInstallment" />
          </label>
          <label>To Installment
            <input type="number" min="1" v-model.number="editingPeriodicCharge.toInstallment" />
          </label>
        </div>
        <div class="dialog-actions">
          <button type="button" class="secondary" @click="closePeriodicDialog">Cancel</button>
          <button type="submit" class="primary">Save</button>
        </div>
      </form>
    </dialog>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toastService } from '../../shared/services/toast.service.js'

const props = defineProps({
  clients: { type: Array, default: () => [] },
  vehicles: { type: Array, default: () => [] }
})

const emit = defineEmits(['calculate'])

const router = useRouter()

// ===== Form State =====
const selectedClientId = ref('')
const selectedVehicleId = ref('')
const vehiclePrice = ref(15000)

const loan = reactive({
  operationCurrency: 'USD',
  termMonths: 48,
  startDate: new Date().toISOString().split('T')[0]
})

const downPaymentMode = ref('percent')
const downPaymentPercent = ref(20)
const downPaymentAmount = ref(3000)

const rate = reactive({
  rateType: 'EFFECTIVE',
  ratePeriod: 'ANNUAL',
  rateValue: 9,
  capitalizationFrequency: 'MONTHLY'
})

const grace = reactive({
  graceType: 'NONE',
  gracePeriods: 0
})

const balloon = reactive({
  enabled: false,
  balloonPercent: 40,
  balloonAmount: null,
  balloonBase: 'VEHICLE_PRICE',
  dueInstallment: 48
})

const balloonMode = ref('percent')

const financialEvaluation = reactive({
  discountRateType: 'EFFECTIVE',
  discountRatePeriod: 'ANNUAL',
  discountRateValue: 12
})

const exchangeRate = reactive({
  mode: 'MANUAL',
  value: 3.75
})

// ===== Charges =====
const initialCharges = ref([
  { code: 'NOTARY_FEES', label: 'Gastos notariales', amount: 100, currency: 'USD', financingMode: 'FINANCED', taxable: false },
  { code: 'REGISTRATION_FEES', label: 'Costos registrales', amount: 50, currency: 'USD', financingMode: 'FINANCED', taxable: false },
  { code: 'STUDY_COMMISSION', label: 'Comisión de estudio', amount: 30, currency: 'USD', financingMode: 'FINANCED', taxable: false }
])

const periodicCharges = ref([
  { code: 'POSTAGE', label: 'Portes', chargeType: 'FIXED_AMOUNT', amount: 20, currency: 'USD', ratePercent: null, rateBase: null, frequency: 'MONTHLY', appliesDuringGrace: true, fromInstallment: 1, toInstallment: 48 },
  { code: 'ADMIN_FEE', label: 'Gastos de administración', chargeType: 'FIXED_AMOUNT', amount: 40, currency: 'USD', ratePercent: null, rateBase: null, frequency: 'MONTHLY', appliesDuringGrace: true, fromInstallment: 1, toInstallment: 48 },
  { code: 'LIFE_INSURANCE', label: 'Seguro de desgravamen', chargeType: 'RATE', amount: null, currency: null, ratePercent: 0.05, rateBase: 'OPENING_BALANCE', frequency: 'MONTHLY', appliesDuringGrace: true, fromInstallment: 1, toInstallment: 48 },
  { code: 'VEHICLE_INSURANCE', label: 'Seguro vehicular todo riesgo', chargeType: 'RATE', amount: null, currency: null, ratePercent: 4.50, rateBase: 'VEHICLE_PRICE', frequency: 'ANNUAL_PRORATED_MONTHLY', appliesDuringGrace: true, fromInstallment: 1, toInstallment: 48 }
])

// ===== Dialog State =====
const initialChargeDialog = ref(null)
const periodicChargeDialog = ref(null)
const editingInitialIndex = ref(null)
const editingPeriodicIndex = ref(null)

const editingInitialCharge = reactive({
  code: 'NOTARY_FEES',
  label: '',
  amount: 0,
  currency: 'USD',
  financingMode: 'FINANCED',
  taxable: false
})

const editingPeriodicCharge = reactive({
  code: 'POSTAGE',
  label: '',
  chargeType: 'FIXED_AMOUNT',
  amount: null,
  currency: 'USD',
  ratePercent: null,
  rateBase: 'VEHICLE_PRICE',
  frequency: 'MONTHLY',
  appliesDuringGrace: true,
  fromInstallment: 1,
  toInstallment: 48
})

// ===== Computed =====
const selectedVehicle = computed(() => {
  return props.vehicles.find(v => String(v.identifier) === String(selectedVehicleId.value))
})

// ===== Methods =====
function updateDueInstallment() {
  balloon.dueInstallment = loan.termMonths
}

function formatMoney(value, currency = 'USD') {
  const n = Number(value ?? 0)
  return `${currency} ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatPercent(value) {
  const n = Number(value ?? 0)
  return `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

function getSelectedClient() {
  return props.clients.find(c => String(c.identifier) === String(selectedClientId.value))
}

function getSelectedVehicle() {
  return props.vehicles.find(v => String(v.identifier) === String(selectedVehicleId.value))
}

// ===== Charge Management =====
function addInitialCharge() {
  editingInitialIndex.value = null
  Object.assign(editingInitialCharge, {
    code: 'NOTARY_FEES',
    label: '',
    amount: 0,
    currency: 'USD',
    financingMode: 'FINANCED',
    taxable: false
  })
  initialChargeDialog.value?.showModal()
}

function editInitialCharge(index) {
  editingInitialIndex.value = index
  const charge = initialCharges.value[index]
  Object.assign(editingInitialCharge, { ...charge })
  initialChargeDialog.value?.showModal()
}

function saveInitialCharge() {
  const charge = { ...editingInitialCharge }
  if (editingInitialIndex.value === null) {
    initialCharges.value.push(charge)
  } else {
    initialCharges.value[editingInitialIndex.value] = charge
  }
  closeInitialDialog()
}

function removeInitialCharge(index) {
  initialCharges.value.splice(index, 1)
}

function closeInitialDialog() {
  initialChargeDialog.value?.close()
}

function addPeriodicCharge() {
  editingPeriodicIndex.value = null
  Object.assign(editingPeriodicCharge, {
    code: 'POSTAGE',
    label: '',
    chargeType: 'FIXED_AMOUNT',
    amount: null,
    currency: 'USD',
    ratePercent: null,
    rateBase: 'VEHICLE_PRICE',
    frequency: 'MONTHLY',
    appliesDuringGrace: true,
    fromInstallment: 1,
    toInstallment: loan.termMonths || 48
  })
  periodicChargeDialog.value?.showModal()
}

function editPeriodicCharge(index) {
  editingPeriodicIndex.value = index
  const charge = periodicCharges.value[index]
  Object.assign(editingPeriodicCharge, { ...charge })
  periodicChargeDialog.value?.showModal()
}

function savePeriodicCharge() {
  const charge = { ...editingPeriodicCharge }
  if (editingPeriodicIndex.value === null) {
    periodicCharges.value.push(charge)
  } else {
    periodicCharges.value[editingPeriodicIndex.value] = charge
  }
  closePeriodicDialog()
}

function removePeriodicCharge(index) {
  periodicCharges.value.splice(index, 1)
}

function closePeriodicDialog() {
  periodicChargeDialog.value?.close()
}

// ===== Build Request =====
function buildQuoteRequest() {
  const client = getSelectedClient()
  const vehicle = getSelectedVehicle()
  if (!client || !vehicle) {
    throw new Error('Select client and vehicle first')
  }

  const termMonths = loan.termMonths
  const downMode = downPaymentMode.value

  return {
    client: {
      clientId: client.identifier,
      displayName: client.displayName
    },
    vehicle: {
      vehicleId: vehicle.identifier,
      brand: vehicle.brand,
      model: vehicle.model,
      year: Number(vehicle.year),
      vehicleType: vehicle.vehicleType || 'OTHER',
      vehiclePrice: Number(vehiclePrice.value || vehicle.price),
      currency: vehicle.currency || loan.operationCurrency
    },
    loan: {
      operationCurrency: loan.operationCurrency,
      downPaymentAmount: downMode === 'amount' ? Number(downPaymentAmount.value || 0) : null,
      downPaymentPercent: downMode === 'percent' ? Number(downPaymentPercent.value || 0) : null,
      termMonths,
      startDate: loan.startDate
    },
    rate: {
      rateType: rate.rateType,
      ratePeriod: rate.ratePeriod,
      rateValue: Number(rate.rateValue || 0),
      capitalizationFrequency: rate.rateType === 'NOMINAL' ? rate.capitalizationFrequency : null
    },
    grace: {
      graceType: grace.graceType,
      gracePeriods: grace.graceType === 'NONE' ? 0 : Number(grace.gracePeriods || 0)
    },
    balloon: {
      enabled: balloon.enabled,
      balloonAmount: balloon.enabled && balloonMode.value === 'amount' ? Number(balloon.balloonAmount || 0) : null,
      balloonPercent: balloon.enabled && balloonMode.value === 'percent' ? Number(balloon.balloonPercent || 0) : null,
      balloonBase: balloon.balloonBase,
      dueInstallment: balloon.dueInstallment || termMonths
    },
    additionalCharges: {
      initialCharges: initialCharges.value,
      periodicCharges: periodicCharges.value.map(p => ({
        ...p,
        toInstallment: Math.min(Number(p.toInstallment || termMonths), termMonths)
      }))
    },
    financialEvaluation: {
      discountRateType: financialEvaluation.discountRateType,
      discountRatePeriod: financialEvaluation.discountRatePeriod,
      discountRateValue: Number(financialEvaluation.discountRateValue || 0)
    },
    exchangeRate: {
      mode: exchangeRate.mode,
      value: Number(exchangeRate.value || 0)
    }
  }
}

// ===== Calculate =====
async function handleCalculate() {
  try {
    const request = buildQuoteRequest()
    emit('calculate', request)
  } catch (err) {
    toastService.error(err.message)
  }
}

// ===== Reset =====
function resetForm() {
  loan.operationCurrency = 'USD'
  loan.termMonths = 48
  loan.startDate = new Date().toISOString().split('T')[0]
  downPaymentMode.value = 'percent'
  downPaymentPercent.value = 20
  downPaymentAmount.value = 3000
  rate.rateType = 'EFFECTIVE'
  rate.ratePeriod = 'ANNUAL'
  rate.rateValue = 9
  rate.capitalizationFrequency = 'MONTHLY'
  grace.graceType = 'NONE'
  grace.gracePeriods = 0
  balloon.enabled = false
  balloon.balloonPercent = 40
  balloon.balloonAmount = null
  balloon.balloonBase = 'VEHICLE_PRICE'
  balloon.dueInstallment = 48
  financialEvaluation.discountRateType = 'EFFECTIVE'
  financialEvaluation.discountRatePeriod = 'ANNUAL'
  financialEvaluation.discountRateValue = 12
  exchangeRate.value = 3.75

  initialCharges.value = [
    { code: 'NOTARY_FEES', label: 'Gastos notariales', amount: 100, currency: 'USD', financingMode: 'FINANCED', taxable: false },
    { code: 'REGISTRATION_FEES', label: 'Costos registrales', amount: 50, currency: 'USD', financingMode: 'FINANCED', taxable: false },
    { code: 'STUDY_COMMISSION', label: 'Comisión de estudio', amount: 30, currency: 'USD', financingMode: 'FINANCED', taxable: false }
  ]

  periodicCharges.value = [
    { code: 'POSTAGE', label: 'Portes', chargeType: 'FIXED_AMOUNT', amount: 20, currency: 'USD', ratePercent: null, rateBase: null, frequency: 'MONTHLY', appliesDuringGrace: true, fromInstallment: 1, toInstallment: 48 },
    { code: 'ADMIN_FEE', label: 'Gastos de administración', chargeType: 'FIXED_AMOUNT', amount: 40, currency: 'USD', ratePercent: null, rateBase: null, frequency: 'MONTHLY', appliesDuringGrace: true, fromInstallment: 1, toInstallment: 48 },
    { code: 'LIFE_INSURANCE', label: 'Seguro de desgravamen', chargeType: 'RATE', amount: null, currency: null, ratePercent: 0.05, rateBase: 'OPENING_BALANCE', frequency: 'MONTHLY', appliesDuringGrace: true, fromInstallment: 1, toInstallment: 48 },
    { code: 'VEHICLE_INSURANCE', label: 'Seguro vehicular todo riesgo', chargeType: 'RATE', amount: null, currency: null, ratePercent: 4.50, rateBase: 'VEHICLE_PRICE', frequency: 'ANNUAL_PRORATED_MONTHLY', appliesDuringGrace: true, fromInstallment: 1, toInstallment: 48 }
  ]
}

// ===== Watch for vehicle selection =====
watch(selectedVehicleId, (newVal) => {
  const vehicle = props.vehicles.find(v => String(v.identifier) === String(newVal))
  if (vehicle) {
    vehiclePrice.value = vehicle.price
    loan.operationCurrency = vehicle.currency
  }
})

// ===== Lifecycle =====
onMounted(() => {
  if (props.clients.length > 0) {
    selectedClientId.value = props.clients[0]?.identifier || ''
  }
  if (props.vehicles.length > 0) {
    selectedVehicleId.value = props.vehicles[0]?.identifier || ''
    const vehicle = props.vehicles[0]
    if (vehicle) {
      vehiclePrice.value = vehicle.price
      loan.operationCurrency = vehicle.currency
    }
  }

  // Check for selected vehicle from Vehicles page
  if (window.selectedVehicleId) {
    selectedVehicleId.value = window.selectedVehicleId
    window.selectedVehicleId = null
  }
})
</script>

<style scoped>
.simulation-form {
  width: 100%;
}
.layout-quote {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 28px;
  align-items: start;
}
.left-stack {
  display: grid;
  gap: 0;
}
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(8, 38, 74, 0.08);
  border: 1px solid #edf1f6;
  margin-bottom: 22px;
}
.card h2 {
  font-size: 20px;
  margin-bottom: 18px;
}
.dark-card {
  background: #08264a;
  color: white;
  align-self: start;
  position: sticky;
  top: 24px;
}
.dark-card p, .dark-card span {
  color: #b9c9dd;
}
.dark-card h2 {
  color: white;
}
.two-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.two-card-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.section-head h2 {
  margin: 0;
}
label {
  display: grid;
  gap: 8px;
  font-size: 12px;
  text-transform: uppercase;
  color: #3f4957;
  font-weight: 800;
  letter-spacing: 0.08em;
}
.dark-card label {
  color: #b9c9dd;
}
input, select {
  width: 100%;
  border: 1px solid transparent;
  background: #dfe4e9;
  border-radius: 8px;
  padding: 12px 14px;
  color: #1d2632;
  outline: none;
  font: inherit;
}
input:focus, select:focus {
  border-color: #9bbcff;
  background: #eef4ff;
}
.dark-card input, .dark-card select {
  background: rgba(255,255,255,0.12);
  color: white;
}
.dark-card input:focus, .dark-card select:focus {
  background: rgba(255,255,255,0.2);
}
.hint {
  font-size: 13px;
  margin-bottom: 0;
  color: #6f7d8f;
}
.primary {
  background: #08264a;
  color: white;
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
}
.primary.light {
  background: white;
  color: #08264a;
}
.secondary {
  background: #e2e7ed;
  color: #26394e;
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
}
.danger {
  background: #f9d9dc;
  color: #8f1521;
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
}
.small {
  padding: 6px 10px;
  font-size: 12px;
}
.full {
  width: 100%;
}
.summary-panel {
  display: grid;
  gap: 18px;
}
.summary-metric strong {
  font-size: 34px;
  display: block;
  margin-top: 8px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255,255,255,0.18);
  padding-top: 12px;
}
.mini-table table {
  width: 100%;
  border-collapse: collapse;
}
.mini-table th, .mini-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #e3e8ef;
  text-align: left;
  vertical-align: top;
  font-size: 13px;
}
.mini-table th {
  background: #e7ebf0;
  color: #455466;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.dialog {
  border: 0;
  border-radius: 14px;
  padding: 0;
  width: min(720px, calc(100% - 32px));
  box-shadow: 0 20px 80px rgba(0,0,0,0.25);
}
.dialog::backdrop {
  background: rgba(5, 18, 34, 0.45);
}
.dialog-form {
  display: grid;
  gap: 16px;
  padding: 28px;
}
.dialog-form h2 {
  margin: 0;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
.check {
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: none;
  letter-spacing: 0;
  font-size: 14px;
}
.check input {
  width: auto;
}
@media (max-width: 1180px) {
  .layout-quote {
    grid-template-columns: 1fr;
  }
  .dark-card {
    position: static;
  }
}
@media (max-width: 760px) {
  .two-cols, .two-card-row {
    grid-template-columns: 1fr;
  }
}
</style>
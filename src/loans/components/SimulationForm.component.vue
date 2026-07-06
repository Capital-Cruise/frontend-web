<template>
  <form class="simulation-form" @submit.prevent="handleCalculate">
    <div class="layout-quote">
      <div class="left-stack">
        <section class="card">
          <h2><span class="section-icon">01</span>Selección de cliente y vehículo</h2>
          <div class="two-cols">
            <FieldHelp topic="simulationClient">
              <template #label>Cliente</template>
              <select v-model="selectedClientId" required>
                <option v-for="c in clients" :key="c.identifier" :value="c.identifier">
                  {{ c.displayName }}
                </option>
              </select>
            </FieldHelp>
            <FieldHelp topic="simulationVehicle">
              <template #label>Vehículo</template>
              <select v-model="selectedVehicleId" required>
                <option v-for="v in vehicles" :key="v.identifier" :value="v.identifier">
                  {{ v.displayName }} · {{ formatMoney(v.price, v.currency) }}
                </option>
              </select>
            </FieldHelp>
          </div>
        </section>

        <section class="card">
          <h2><span class="section-icon">02</span>Estructura del crédito</h2>
          <div class="two-cols">
            <FieldHelp topic="operationCurrency">
              <template #label>Moneda de la operación</template>
              <div class="segmented-control">
                <button
                  v-for="currency in currencyOptions"
                  :key="currency"
                  type="button"
                  :class="{ active: loan.operationCurrency === currency }"
                  @click="loan.operationCurrency = currency"
                >
                  {{ currency }}
                </button>
              </div>
            </FieldHelp>
            <FieldHelp topic="vehiclePrice">
              <template #label>Precio del vehículo</template>
              <input type="number" step="0.01" v-model.number="vehiclePrice" />
            </FieldHelp>
            <FieldHelp topic="downPaymentMode">
              <template #label>Modo de cuota inicial</template>
              <select v-model="downPaymentMode">
                <option value="percent">Porcentaje</option>
                <option value="amount">Monto</option>
              </select>
            </FieldHelp>
            <FieldHelp v-show="downPaymentMode === 'percent'" topic="downPaymentPercent">
              <template #label>Cuota inicial en porcentaje</template>
              <input type="number" step="0.01" v-model.number="downPaymentPercent" />
            </FieldHelp>
            <FieldHelp v-show="downPaymentMode === 'amount'" topic="downPaymentAmount">
              <template #label>Cuota inicial en monto</template>
              <input type="number" step="0.01" v-model.number="downPaymentAmount" />
            </FieldHelp>
            <FieldHelp topic="termMonths">
              <template #label>Plazo en meses</template>
              <input type="number" min="1" v-model.number="loan.termMonths" @change="updateDueInstallment" />
            </FieldHelp>
            <FieldHelp topic="startDate">
              <template #label>Fecha de inicio</template>
              <input type="date" v-model="loan.startDate" />
            </FieldHelp>
          </div>
          <p class="hint">
            Valores predeterminados del backend: método francés vencido ordinario, periodicidad mensual, gracia ordinaria y base comercial 30/360.
          </p>
        </section>

        <section class="card">
          <h2><span class="section-icon">03</span>Configuración de tasa</h2>
          <div class="two-cols">
            <FieldHelp topic="rateType">
              <template #label>Tipo de tasa</template>
              <select v-model="rate.rateType">
                <option value="EFFECTIVE">Efectiva</option>
                <option value="NOMINAL">Nominal</option>
              </select>
            </FieldHelp>
            <FieldHelp topic="rateValue">
              <template #label>Valor de la tasa (%)</template>
              <input type="number" step="0.01" v-model.number="rate.rateValue" />
            </FieldHelp>
            <FieldHelp topic="ratePeriod">
              <template #label>Periodo de la tasa</template>
              <select v-model="rate.ratePeriod">
                <option value="ANNUAL">Anual</option>
                <option value="MONTHLY">Mensual</option>
              </select>
            </FieldHelp>
            <FieldHelp v-show="rate.rateType === 'NOMINAL'" topic="capitalizationFrequency">
              <template #label>Frecuencia de capitalización</template>
              <select v-model="rate.capitalizationFrequency">
                <option value="MONTHLY">Mensual</option>
                <option value="DAILY">Diaria</option>
                <option value="QUARTERLY">Trimestral</option>
                <option value="SEMI_ANNUAL">Semestral</option>
                <option value="ANNUAL">Anual</option>
              </select>
            </FieldHelp>
            <FieldHelp topic="discountRateType">
              <template #label>Tipo de tasa de descuento</template>
              <select v-model="financialEvaluation.discountRateType">
                <option value="EFFECTIVE">Efectiva</option>
              </select>
            </FieldHelp>
            <FieldHelp topic="discountRatePeriod">
              <template #label>Periodo de la tasa de descuento</template>
              <select v-model="financialEvaluation.discountRatePeriod">
                <option value="ANNUAL">Anual</option>
                <option value="MONTHLY">Mensual</option>
              </select>
            </FieldHelp>
            <FieldHelp topic="discountRateValue">
              <template #label>COK / valor de la tasa de descuento (%)</template>
              <input type="number" step="0.01" v-model.number="financialEvaluation.discountRateValue" />
            </FieldHelp>
            <FieldHelp topic="exchangeRateValue">
              <template #label>Tipo de cambio</template>
              <input type="number" step="0.0001" v-model.number="exchangeRate.value" />
            </FieldHelp>
          </div>
        </section>

        <div class="two-card-row">
          <section class="card">
            <h2>Cuota balloon</h2>
            <FieldHelp topic="balloonEnabled">
              <template #label>Habilitado</template>
              <select v-model="balloon.enabled">
                <option :value="false">Deshabilitado</option>
                <option :value="true">Habilitado</option>
              </select>
            </FieldHelp>
            <div v-show="balloon.enabled" id="balloonFields">
              <FieldHelp topic="balloonMode">
                <template #label>Modo</template>
                <select v-model="balloonMode">
                  <option value="percent">Porcentaje</option>
                  <option value="amount">Monto</option>
                </select>
              </FieldHelp>
              <FieldHelp v-show="balloonMode === 'percent'" topic="balloonPercent">
                <template #label>Cuota balloon en porcentaje</template>
                <input type="number" step="0.01" v-model.number="balloon.balloonPercent" />
              </FieldHelp>
              <FieldHelp v-show="balloonMode === 'amount'" topic="balloonAmount">
                <template #label>Cuota balloon en monto</template>
                <input type="number" step="0.01" v-model.number="balloon.balloonAmount" />
              </FieldHelp>
              <FieldHelp topic="balloonBase">
                <template #label>Base de la cuota balloon</template>
                <select v-model="balloon.balloonBase">
                  <option value="VEHICLE_PRICE">Precio del vehículo</option>
                  <option value="PRINCIPAL_FINANCED">Principal financiado</option>
                </select>
              </FieldHelp>
              <FieldHelp topic="balloonDueInstallment">
                <template #label>Cuota de vencimiento</template>
                <input type="number" v-model.number="balloon.dueInstallment" />
              </FieldHelp>
            </div>
          </section>

          <section class="card">
            <h2>Periodo de gracia</h2>
            <FieldHelp topic="graceType">
              <template #label>Tipo</template>
              <select v-model="grace.graceType">
                <option value="NONE">Sin gracia</option>
                <option value="PARTIAL">Gracia parcial</option>
                <option value="TOTAL">Gracia total</option>
              </select>
            </FieldHelp>
            <FieldHelp v-show="grace.graceType !== 'NONE'" topic="gracePeriods">
              <template #label>Duración en meses</template>
              <input type="number" min="0" v-model.number="grace.gracePeriods" />
            </FieldHelp>
          </section>
        </div>

        <section class="card">
          <div class="section-head">
            <div>
              <h2>Cargos iniciales</h2>
              <p class="section-note">Costos aplicados al inicio de la operación.</p>
            </div>
            <button type="button" class="secondary" @click="addInitialCharge">Agregar cargo inicial</button>
          </div>
          <div class="mini-table">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Monto</th>
                  <th>Modo</th>
                  <th>Efecto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(charge, index) in initialCharges" :key="index">
                  <td>{{ formatChargeCodeLabel(charge.code) }}</td>
                  <td>{{ charge.label }}</td>
                  <td>{{ formatMoney(charge.amount, charge.currency) }}</td>
                  <td>{{ formatFinancingModeLabel(charge.financingMode) }}</td>
                  <td>{{ formatChargeEffectLabel(charge.financingMode) }}</td>
                  <td>
                    <button type="button" class="secondary small" @click="editInitialCharge(index)">Editar</button>
                    <button type="button" class="danger small" @click="removeInitialCharge(index)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="initialCharges.length === 0">No hay cargos iniciales agregados.</p>
          </div>
        </section>

        <section class="card">
          <div class="section-head">
            <div>
              <h2>Cargos periódicos</h2>
              <p class="section-note">Conceptos recurrentes que incrementan la cuota total.</p>
            </div>
            <button type="button" class="secondary" @click="addPeriodicCharge">Agregar cargo periódico</button>
          </div>
          <div class="mini-table">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Base</th>
                  <th>Frecuencia</th>
                  <th>Rango</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(charge, index) in periodicCharges" :key="index">
                  <td>{{ formatChargeCodeLabel(charge.code) }}</td>
                  <td>{{ charge.label }}</td>
                  <td>{{ formatChargeTypeLabel(charge.chargeType) }}</td>
                  <td>{{ charge.chargeType === 'FIXED_AMOUNT' ? formatMoney(charge.amount, charge.currency) : formatPercent(charge.ratePercent) }}</td>
                  <td>{{ formatChargeBaseLabel(charge.rateBase) }}</td>
                  <td>{{ formatFrequencyLabel(charge.frequency) }}</td>
                  <td>{{ formatInstallmentRangeLabel(charge.fromInstallment, charge.toInstallment) }}</td>
                  <td>
                    <button type="button" class="secondary small" @click="editPeriodicCharge(index)">Editar</button>
                    <button type="button" class="danger small" @click="removePeriodicCharge(index)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="periodicCharges.length === 0">No hay cargos periódicos agregados.</p>
          </div>
        </section>
      </div>

      <aside class="right-rail">
        <section class="summary-panel card dark-card">
          <h2>Resumen de la simulación</h2>
          <div class="summary-metric">
            <span>Cuota mensual estimada</span>
            <strong>{{ summaryMonthlyInstallment }}</strong>
          </div>
          <div class="summary-grid">
            <div>
              <span>Total de intereses</span>
              <strong>{{ summaryTotalInterest }}</strong>
            </div>
            <div>
              <span>TCEA</span>
              <strong>{{ summaryTcea }}</strong>
            </div>
          </div>
          <button class="primary light full" type="submit" :disabled="calculating">
            {{ calculating ? 'Calculando...' : 'Calcular' }}
          </button>
          <button class="danger full" type="button" @click="handleReset">Reiniciar simulación</button>
        </section>

        <section class="side-card exchange-card">
          <div class="side-title">
            <span>Tipo de cambio en vivo</span>
            <strong>En vivo</strong>
          </div>
          <div class="exchange-row">
            <span>USD</span>
            <small>to</small>
            <span>PEN</span>
            <strong>{{ exchangeRate.value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) }}</strong>
          </div>
          <button class="exchange-refresh" type="button" :disabled="loadingExchange" @click="loadCurrentExchangeRate">
            {{ loadingExchange ? 'Actualizando...' : 'Actualizar tipo de cambio' }}
          </button>
          <p>Valor manual usado para cálculos de cotización entre monedas distintas.</p>
        </section>

        <section class="side-card advisor-tip">
          <strong>Recomendación</strong>
          <p>Completa los datos del crédito y calcula la cotización para obtener los indicadores financieros.</p>
        </section>
      </aside>
    </div>

    <dialog ref="initialChargeDialog" class="dialog">
      <form class="dialog-form" @submit.prevent="saveInitialCharge">
        <h2>Cargo inicial</h2>
        <div class="two-cols">
          <FieldHelp topic="initialChargeCode">
            <template #label>Código del cargo</template>
            <select v-model="editingInitialCharge.code">
              <option v-for="code in initialChargeCodes" :key="code" :value="code">
                {{ formatChargeCodeLabel(code) }}
              </option>
            </select>
          </FieldHelp>
          <FieldHelp topic="initialChargeName">
            <template #label>Nombre</template>
            <input v-model="editingInitialCharge.label" required />
          </FieldHelp>
          <FieldHelp topic="initialChargeAmount">
            <template #label>Monto</template>
            <input type="number" min="0" step="0.01" v-model.number="editingInitialCharge.amount" required />
          </FieldHelp>
          <FieldHelp topic="initialChargeCurrency">
            <template #label>Moneda</template>
            <select v-model="editingInitialCharge.currency">
              <option v-for="currency in currencyOptions" :key="currency" :value="currency">
                {{ formatCurrencyLabel(currency) }}
              </option>
            </select>
          </FieldHelp>
          <FieldHelp topic="initialChargeFinancingMode">
            <template #label>Modo de financiamiento</template>
            <select v-model="editingInitialCharge.financingMode">
              <option v-for="mode in financingModeOptions" :key="mode" :value="mode">
                {{ formatFinancingModeLabel(mode) }}
              </option>
            </select>
          </FieldHelp>
          <FieldHelp topic="initialChargeTaxable" tag="div">
            <template #label>Afecto a impuesto</template>
            <label class="check">
              <input type="checkbox" v-model="editingInitialCharge.taxable" />
              <span>Aplica impuesto</span>
            </label>
          </FieldHelp>
        </div>
        <div class="dialog-actions">
          <button type="button" class="secondary" @click="closeInitialDialog">Cancelar</button>
          <button type="submit" class="primary">Guardar</button>
        </div>
      </form>
    </dialog>

    <dialog ref="periodicChargeDialog" class="dialog">
      <form class="dialog-form" @submit.prevent="savePeriodicCharge">
        <h2>Cargo periódico</h2>
        <div class="two-cols">
          <FieldHelp topic="periodicChargeCode">
            <template #label>Código del cargo</template>
            <select v-model="editingPeriodicCharge.code">
              <option v-for="code in periodicChargeCodes" :key="code" :value="code">
                {{ formatChargeCodeLabel(code) }}
              </option>
            </select>
          </FieldHelp>
          <FieldHelp topic="periodicChargeType">
            <template #label>Tipo de cargo</template>
            <select v-model="editingPeriodicCharge.chargeType">
              <option v-for="type in chargeTypeOptions" :key="type" :value="type">
                {{ formatChargeTypeLabel(type) }}
              </option>
            </select>
          </FieldHelp>
          <FieldHelp topic="periodicChargeName">
            <template #label>Nombre</template>
            <input v-model="editingPeriodicCharge.label" required />
          </FieldHelp>
          <template v-if="editingPeriodicCharge.chargeType === 'FIXED_AMOUNT'">
            <FieldHelp topic="periodicChargeAmount">
              <template #label>Monto</template>
              <input type="number" min="0" step="0.01" v-model.number="editingPeriodicCharge.amount" />
            </FieldHelp>
            <FieldHelp topic="periodicChargeCurrency">
              <template #label>Moneda</template>
              <select v-model="editingPeriodicCharge.currency">
                <option v-for="currency in currencyOptions" :key="currency" :value="currency">
                  {{ formatCurrencyLabel(currency) }}
                </option>
              </select>
            </FieldHelp>
          </template>
          <template v-if="editingPeriodicCharge.chargeType === 'RATE'">
            <FieldHelp topic="periodicChargeRatePercent">
              <template #label>Porcentaje de tasa</template>
              <input type="number" min="0" step="0.01" v-model.number="editingPeriodicCharge.ratePercent" />
            </FieldHelp>
            <FieldHelp topic="periodicChargeRateBase">
              <template #label>Base de la tasa</template>
              <select v-model="editingPeriodicCharge.rateBase">
                <option v-for="base in chargeBaseOptions" :key="base" :value="base">
                  {{ formatChargeBaseLabel(base) }}
                </option>
              </select>
            </FieldHelp>
          </template>
          <FieldHelp topic="periodicChargeFrequency">
            <template #label>Frecuencia</template>
            <select v-model="editingPeriodicCharge.frequency">
              <option v-for="frequency in frequencyOptions" :key="frequency" :value="frequency">
                {{ formatFrequencyLabel(frequency) }}
              </option>
            </select>
          </FieldHelp>
          <FieldHelp topic="periodicChargeGrace">
            <template #label>Aplica durante gracia</template>
            <select v-model="editingPeriodicCharge.appliesDuringGrace">
              <option :value="true">{{ formatBooleanLabel(true) }}</option>
              <option :value="false">{{ formatBooleanLabel(false) }}</option>
            </select>
          </FieldHelp>
          <FieldHelp topic="periodicChargeFromInstallment">
            <template #label>Desde la cuota</template>
            <input type="number" min="1" v-model.number="editingPeriodicCharge.fromInstallment" />
          </FieldHelp>
          <FieldHelp topic="periodicChargeToInstallment">
            <template #label>Hasta la cuota</template>
            <input type="number" min="1" v-model.number="editingPeriodicCharge.toInstallment" />
          </FieldHelp>
        </div>
        <div class="dialog-actions">
          <button type="button" class="secondary" @click="closePeriodicDialog">Cancelar</button>
          <button type="submit" class="primary">Guardar</button>
        </div>
      </form>
    </dialog>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { loanService } from '../services/loan.service.js'
import { toastService } from '../../shared/services/toast.service.js'
import FieldHelp from '../../shared/components/FieldHelp.component.vue'
import {
  CHARGE_BASES,
  CHARGE_TYPES,
  CURRENCIES,
  FINANCING_MODES,
  FREQUENCIES,
  GRACE_TYPES,
  INITIAL_CHARGE_CODES,
  PERIODIC_CHARGE_CODES,
  RATE_TYPES,
  formatBooleanLabel,
  formatChargeBaseLabel,
  formatChargeCodeLabel,
  formatChargeEffectLabel,
  formatChargeTypeLabel,
  formatCurrencyLabel,
  formatFinancingModeLabel,
  formatFrequencyLabel,
  formatGraceTypeLabel,
  formatInstallmentRangeLabel,
  formatRateTypeLabel
} from '../../shared/utils/loan-labels.js'

const props = defineProps({
  clients: { type: Array, default: () => [] },
  vehicles: { type: Array, default: () => [] },
  calculation: { type: Object, default: null },
  lastRequest: { type: Object, default: null },
  calculating: { type: Boolean, default: false },
  initialRequest: { type: Object, default: null }
})

const emit = defineEmits(['calculate', 'clear-result'])

const currencyOptions = CURRENCIES
const initialChargeCodes = INITIAL_CHARGE_CODES
const periodicChargeCodes = PERIODIC_CHARGE_CODES
const financingModeOptions = FINANCING_MODES
const chargeTypeOptions = CHARGE_TYPES
const chargeBaseOptions = CHARGE_BASES
const frequencyOptions = FREQUENCIES
const rateTypeOptions = RATE_TYPES
const graceTypeOptions = GRACE_TYPES

// ===== Form State =====
const selectedClientId = ref('')
const selectedVehicleId = ref('')
const vehiclePrice = ref(15000)
const hydratingRequest = ref(false)

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
const loadingExchange = ref(false)

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

const quoteSummary = computed(() => props.calculation?.summary || props.calculation?.calculation?.summary || {})
const quoteIndicators = computed(() => props.calculation?.indicators || props.calculation?.calculation?.indicators || {})
const summaryCurrency = computed(() => props.lastRequest?.loan?.operationCurrency || loan.operationCurrency || 'USD')
const summaryMonthlyInstallment = computed(() => {
  const value = quoteSummary.value.baseInstallment
  return value === undefined || value === null ? '$------' : formatMoney(value, summaryCurrency.value)
})
const summaryTotalInterest = computed(() => {
  const value = quoteSummary.value.totalInterest
  return value === undefined || value === null ? '$------' : formatMoney(value, summaryCurrency.value)
})
const summaryTcea = computed(() => {
  const value = quoteIndicators.value.effectiveAnnualCost
  if (value === undefined || value === null) return '------'
  const numeric = Number(value)
  return formatPercent(Math.abs(numeric) < 1 ? numeric * 100 : numeric)
})

// ===== Methods =====
function updateDueInstallment() {
  balloon.dueInstallment = loan.termMonths
}

function roundCurrency(value) {
  return Math.round(Number(value || 0) * 100) / 100
}

function formatMoney(value, currency = 'USD') {
  const n = Number(value ?? 0)
  return `${currency} ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatPercent(value) {
  const n = Number(value ?? 0)
  return `${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

function getSelectedClient() {
  return props.clients.find(c => String(c.identifier) === String(selectedClientId.value))
}

function getSelectedVehicle() {
  return props.vehicles.find(v => String(v.identifier) === String(selectedVehicleId.value))
}

function convertAmount(value, fromCurrency, toCurrency) {
  const amount = Number(value ?? 0)
  if (!amount) return 0
  if (fromCurrency === toCurrency) return roundCurrency(amount)

  const rateValue = Number(exchangeRate.value || 0)
  if (!rateValue) return roundCurrency(amount)

  if (fromCurrency === 'USD' && toCurrency === 'PEN') {
    return roundCurrency(amount * rateValue)
  }

  if (fromCurrency === 'PEN' && toCurrency === 'USD') {
    return roundCurrency(amount / rateValue)
  }

  return roundCurrency(amount)
}

function syncVehiclePriceFromSelection() {
  const vehicle = getSelectedVehicle()
  if (!vehicle) return

  const baseCurrency = vehicle.currency || 'USD'
  const targetCurrency = loan.operationCurrency || baseCurrency
  vehiclePrice.value = convertAmount(vehicle.price, baseCurrency, targetCurrency)
}

function applyRequestToForm(request) {
  if (!request) return

  hydratingRequest.value = true

  selectedClientId.value = request.client?.clientId || selectedClientId.value
  selectedVehicleId.value = request.vehicle?.vehicleId || selectedVehicleId.value

  loan.operationCurrency = request.loan?.operationCurrency || 'USD'
  loan.termMonths = Number(request.loan?.termMonths || 48)
  loan.startDate = request.loan?.startDate || new Date().toISOString().split('T')[0]

  downPaymentMode.value = request.loan?.downPaymentAmount !== null && request.loan?.downPaymentAmount !== undefined
    ? 'amount'
    : 'percent'
  downPaymentAmount.value = Number(request.loan?.downPaymentAmount || 0)
  downPaymentPercent.value = Number(request.loan?.downPaymentPercent || 0)

  vehiclePrice.value = Number(request.vehicle?.vehiclePrice || vehiclePrice.value)

  rate.rateType = request.rate?.rateType || 'EFFECTIVE'
  rate.ratePeriod = normalizeRatePeriod(request.rate?.ratePeriod || 'ANNUAL')
  rate.rateValue = Number(request.rate?.rateValue || 0)
  rate.capitalizationFrequency = normalizeCapitalizationFrequency(request.rate?.capitalizationFrequency || 'MONTHLY')

  grace.graceType = request.grace?.graceType || 'NONE'
  grace.gracePeriods = Number(request.grace?.gracePeriods || 0)

  balloon.enabled = !!request.balloon?.enabled
  balloon.balloonPercent = request.balloon?.balloonPercent !== null && request.balloon?.balloonPercent !== undefined
    ? Number(request.balloon.balloonPercent)
    : 40
  balloon.balloonAmount = request.balloon?.balloonAmount !== null && request.balloon?.balloonAmount !== undefined
    ? Number(request.balloon.balloonAmount)
    : null
  balloon.balloonBase = request.balloon?.balloonBase || 'VEHICLE_PRICE'
  balloon.dueInstallment = Number(request.balloon?.dueInstallment || loan.termMonths)
  balloonMode.value = request.balloon?.balloonAmount !== null && request.balloon?.balloonAmount !== undefined
    ? 'amount'
    : 'percent'

  financialEvaluation.discountRateType = request.financialEvaluation?.discountRateType || 'EFFECTIVE'
  financialEvaluation.discountRatePeriod = normalizeRatePeriod(request.financialEvaluation?.discountRatePeriod || 'ANNUAL')
  financialEvaluation.discountRateValue = Number(request.financialEvaluation?.discountRateValue || 0)

  exchangeRate.mode = request.exchangeRate?.mode || 'MANUAL'
  exchangeRate.value = Number(request.exchangeRate?.value || exchangeRate.value)

  initialCharges.value = Array.isArray(request.additionalCharges?.initialCharges)
    ? request.additionalCharges.initialCharges.map(charge => ({ ...charge }))
    : []
  periodicCharges.value = Array.isArray(request.additionalCharges?.periodicCharges)
    ? request.additionalCharges.periodicCharges.map(charge => ({
      ...charge,
      frequency: normalizeChargeFrequency(charge.frequency)
    }))
    : []

  hydratingRequest.value = false
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

function handleReset() {
  resetForm()
  emit('clear-result')
}

async function loadCurrentExchangeRate(showToast = true) {
  loadingExchange.value = true
  try {
    const current = await loanService.getCurrentExchangeRate('USD', 'PEN')
    exchangeRate.value = Number(current?.rate || exchangeRate.value)
    if (showToast) {
      toastService.success('Tipo de cambio actualizado')
    }
  } catch (err) {
    toastService.error(err.message)
  } finally {
    loadingExchange.value = false
  }
}

function normalizeMonthlyEnum(value) {
  if (!value) return 'MONTHLY'
  const normalized = String(value).trim().toUpperCase()
  if (normalized === 'MENSUAL') return 'MONTHLY'
  return normalized
}

function normalizeRatePeriod(value) {
  const normalized = normalizeMonthlyEnum(value)
  return ['MONTHLY', 'ANNUAL'].includes(normalized) ? normalized : 'ANNUAL'
}

function normalizeCapitalizationFrequency(value) {
  const normalized = normalizeMonthlyEnum(value)
  return ['DAILY', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'].includes(normalized)
    ? normalized
    : 'MONTHLY'
}

function normalizeChargeFrequency(value) {
  const normalized = normalizeMonthlyEnum(value)
  return ['MONTHLY', 'ANNUAL_PRORATED_MONTHLY'].includes(normalized)
    ? normalized
    : 'MONTHLY'
}

// ===== Build Request =====
function buildQuoteRequest() {
  const client = getSelectedClient()
  const vehicle = getSelectedVehicle()
  if (!client || !vehicle) {    throw new Error('Selecciona primero un cliente y un vehículo.')
  }

  const termMonths = loan.termMonths
  const downModo = downPaymentMode.value

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
      currency: loan.operationCurrency
    },
    loan: {
      operationCurrency: loan.operationCurrency,
      downPaymentAmount: downModo === 'amount' ? Number(downPaymentAmount.value || 0) : null,
      downPaymentPercent: downModo === 'percent' ? Number(downPaymentPercent.value || 0) : null,
      termMonths,
      startDate: loan.startDate
    },
    rate: {
      rateType: rate.rateType,
      ratePeriod: normalizeRatePeriod(rate.ratePeriod),
      rateValue: Number(rate.rateValue || 0),
      capitalizationFrequency: rate.rateType === 'NOMINAL'
        ? normalizeCapitalizationFrequency(rate.capitalizationFrequency)
        : null
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
        frequency: normalizeChargeFrequency(p.frequency),
        toInstallment: Math.min(Number(p.toInstallment || termMonths), termMonths)
      }))
    },
    financialEvaluation: {
      discountRateType: financialEvaluation.discountRateType,
      discountRatePeriod: normalizeRatePeriod(financialEvaluation.discountRatePeriod),
      discountRateValue: Number(financialEvaluation.discountRateValue || 0)
    },
    exchangeRate: {
      mode: exchangeRate.mode,
      value: Number(exchangeRate.value || 0)
    }
  }
}

// ===== Calcular =====
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
  syncVehiclePriceFromSelection()
}

// ===== Watch for vehicle selection =====
watch(selectedVehicleId, () => {
  if (!hydratingRequest.value) {
    syncVehiclePriceFromSelection()
  }
})

watch(
  () => loan.operationCurrency,
  () => {
    if (!hydratingRequest.value) {
      syncVehiclePriceFromSelection()
    }
  }
)

watch(
  () => exchangeRate.value,
  () => {
    if (!hydratingRequest.value && loan.operationCurrency === 'PEN') {
      syncVehiclePriceFromSelection()
    }
  }
)

function syncInitialSelections() {
  if (props.clients.length > 0) {
    const hasClient = props.clients.some(c => String(c.identifier) === String(selectedClientId.value))
    if (!selectedClientId.value || !hasClient) {
      selectedClientId.value = props.clients[0]?.identifier || ''
    }
  }

  if (props.vehicles.length > 0) {
    const hasVehicle = props.vehicles.some(v => String(v.identifier) === String(selectedVehicleId.value))
    if (!selectedVehicleId.value || !hasVehicle) {
      selectedVehicleId.value = props.vehicles[0]?.identifier || ''
    }
    if (!props.initialRequest) {
      syncVehiclePriceFromSelection()
    }
  }
}

watch(
  () => [props.clients.length, props.vehicles.length],
  () => {
    syncInitialSelections()
    if (props.initialRequest && props.clients.length > 0 && props.vehicles.length > 0) {
      applyRequestToForm(props.initialRequest)
    }
  },
  { immediate: true }
)

watch(
  () => props.initialRequest,
  (request) => {
    if (request && props.clients.length > 0 && props.vehicles.length > 0) {
      applyRequestToForm(request)
    }
  },
  { immediate: true }
)

// ===== Lifecycle =====
onMounted(() => {
  syncInitialSelections()
  loadCurrentExchangeRate(false)

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
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 32px;
  align-items: start;
  max-width: none;
  width: 100%;
}
.left-stack {
  display: grid;
  gap: 20px;
  min-width: 0;
}
.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 22px;
  box-shadow: 0 10px 24px rgba(8, 38, 74, 0.06);
  border: 1px solid #edf1f6;
  min-width: 0;
}
.card h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  margin: 0 0 18px;
  color: #08264a;
}
.section-icon {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: #eaf1fb;
  color: #315f95;
  font-size: 10px;
  font-weight: 800;
}
.dark-card {
  background: #08264a;
  color: white;
  width: 100%;
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
  gap: 16px;
}
.two-card-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
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
  gap: 7px;
  font-size: 10px;
  text-transform: uppercase;
  color: #3f4957;
  font-weight: 800;
  letter-spacing: 0.07em;
}
.dark-card label {
  color: #b9c9dd;
}
input, select {
  width: 100%;
  border: 1px solid transparent;
  background: #dfe4e9;
  border-radius: 5px;
  padding: 11px 12px;
  color: #1d2632;
  outline: none;
  font: inherit;
  min-height: 42px;
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
.segmented-control {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background: #dfe4e9;
  border-radius: 5px;
  padding: 3px;
  min-height: 42px;
}
.segmented-control button {
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #506070;
  font-weight: 800;
  cursor: pointer;
}
.segmented-control button.active {
  background: #ffffff;
  color: #08264a;
  box-shadow: 0 1px 4px rgba(8, 38, 74, 0.12);
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
.primary.save {
  background: #e8f0fb;
  color: #08264a;
}
.primary:disabled,
.secondary:disabled,
.danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  gap: 16px;
  min-width: 0;
}
.summary-metric strong {
  font-size: 32px;
  display: block;
  margin-top: 8px;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  border-top: 1px solid rgba(255,255,255,0.18);
  padding-top: 14px;
}
.summary-grid div {
  display: grid;
  gap: 6px;
}
.summary-grid strong {
  color: #ffffff;
  font-size: 13px;
}
.right-rail {
  display: grid;
  gap: 14px;
  position: sticky;
  top: 24px;
  width: 100%;
}
.side-card {
  background: #ffffff;
  border: 1px solid #edf1f6;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(8, 38, 74, 0.05);
}
.side-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #3f4957;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.side-title strong {
  background: #ffe3e5;
  border-radius: 999px;
  color: #a0182b;
  padding: 3px 7px;
  font-size: 9px;
}
.exchange-row {
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}
.exchange-row span {
  background: #eef3f8;
  border-radius: 999px;
  color: #08264a;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 8px;
}
.exchange-row small {
  color: #6f7d8f;
  font-weight: 800;
  text-align: center;
}
.exchange-row strong {
  color: #08264a;
  font-size: 20px;
  text-align: right;
}
.exchange-refresh {
  width: 100%;
  border: 0;
  border-radius: 6px;
  background: #e8f0fb;
  color: #08264a;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  margin-top: 12px;
  padding: 9px 12px;
}
.exchange-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.side-card p {
  color: #6f7d8f;
  font-size: 12px;
  line-height: 1.45;
  margin: 10px 0 0;
}
.advisor-tip {
  border-left: 3px solid #315f95;
  background: #edf5ff;
}
.advisor-tip strong {
  color: #315f95;
  font-size: 12px;
}
.mini-table table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
}
.mini-table {
  max-width: 100%;
  overflow-x: auto;
}
.mini-table th, .mini-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #e3e8ef;
  text-align: left;
  vertical-align: top;
  font-size: 13px;
}
.mini-table td {
  word-break: break-word;
}
.mini-table th {
  background: #e7ebf0;
  color: #455466;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
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
  .right-rail {
    position: static;
  }
}
@media (max-width: 760px) {
  .two-cols, .two-card-row {
    grid-template-columns: 1fr;
  }
}
</style>

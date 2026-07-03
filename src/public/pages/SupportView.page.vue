<template>
  <div class="support-page">
    <header class="support-header">
      <div>
        <h1>Soporte</h1>
        <p>
          Encuentra respuestas frecuentes, envía sugerencias o solicita ayuda, y consulta los
          términos y condiciones de uso de Capital Cruise.
        </p>
      </div>
    </header>

    <nav class="section-nav" aria-label="Secciones de soporte">
      <button
        v-for="section in supportSections"
        :key="section.id"
        type="button"
        class="section-tab"
        :class="{ active: activeSection === section.id }"
        @click="scrollToSection(section.id)"
      >
        {{ section.label }}
      </button>
    </nav>

    <section id="faq" class="support-section">
      <div class="section-heading">
        <h2>Preguntas frecuentes</h2>
        <p>Respuestas sobre el uso de Capital Cruise y el crédito vehicular simulado.</p>
      </div>

      <div class="faq-list">
        <article
          v-for="(item, index) in faqItems"
          :key="item.question"
          class="faq-item"
          :class="{ open: openFaqIndex === index }"
        >
          <button
            type="button"
            class="faq-question"
            :aria-expanded="openFaqIndex === index"
            @click="toggleFaq(index)"
          >
            <span>{{ item.question }}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
            </svg>
          </button>
          <div v-show="openFaqIndex === index" class="faq-answer">
            <p>{{ item.answer }}</p>
          </div>
        </article>
      </div>
    </section>

    <section id="contact" class="support-section">
      <div class="section-heading">
        <h2>Contacto y ayuda</h2>
        <p>Envíanos sugerencias, quejas o solicitudes de asistencia técnica.</p>
      </div>

      <div class="contact-grid">
        <aside class="contact-info">
          <h3>Información de contacto</h3>
          <ul>
            <li>
              <span class="info-label">Correo</span>
              <a :href="`mailto:${supportContactInfo.email}`">{{ supportContactInfo.email }}</a>
            </li>
            <li>
              <span class="info-label">Horario</span>
              <span>{{ supportContactInfo.hours }}</span>
            </li>
            <li>
              <span class="info-label">Tiempo de respuesta</span>
              <span>{{ supportContactInfo.responseTime }}</span>
            </li>
          </ul>
          <p class="contact-note">
            Este formulario es informativo. Al enviarlo recibirá una confirmación local; el equipo
            de soporte revisará su mensaje según la prioridad del caso.
          </p>
        </aside>

        <form class="contact-form" @submit.prevent="submitContactForm">
          <div class="form-row">
            <label for="contact-name">Nombre completo</label>
            <input
              id="contact-name"
              v-model.trim="form.name"
              type="text"
              required
              maxlength="120"
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div class="form-row">
            <label for="contact-email">Correo electrónico</label>
            <input
              id="contact-email"
              v-model.trim="form.email"
              type="email"
              required
              maxlength="120"
              placeholder="usuario@entidadfinanciera.pe"
            />
          </div>

          <div class="form-row">
            <label for="contact-category">Tipo de mensaje</label>
            <select id="contact-category" v-model="form.category" required>
              <option disabled value="">Seleccione una opción</option>
              <option
                v-for="category in contactCategories"
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <label for="contact-subject">Asunto</label>
            <input
              id="contact-subject"
              v-model.trim="form.subject"
              type="text"
              required
              maxlength="160"
              placeholder="Resumen breve de su consulta"
            />
          </div>

          <div class="form-row">
            <label for="contact-message">Mensaje</label>
            <textarea
              id="contact-message"
              v-model.trim="form.message"
              required
              rows="6"
              maxlength="2000"
              placeholder="Describa su sugerencia, queja o solicitud de ayuda con el mayor detalle posible."
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn secondary" @click="resetForm">Limpiar</button>
            <button type="submit" class="btn primary">Enviar mensaje</button>
          </div>
        </form>
      </div>
    </section>

    <section id="terms" class="support-section">
      <div class="section-heading">
        <h2>Términos y condiciones</h2>
        <p>
          Condiciones de uso de Capital Cruise, alineadas al marco legal y de transparencia del
          sistema financiero peruano.
        </p>
      </div>

      <div class="terms-card">
        <p class="terms-updated">Última actualización: julio 2026</p>

        <article
          v-for="section in termsSections"
          :key="section.title"
          class="terms-block"
        >
          <h3>{{ section.title }}</h3>
          <p v-for="(paragraph, index) in section.paragraphs" :key="index">
            {{ paragraph }}
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  supportSections,
  faqItems,
  contactCategories,
  termsSections,
  supportContactInfo
} from '../data/support-content.js'
import { toastService } from '../../shared/services/toast.service.js'

const openFaqIndex = ref(0)
const activeSection = ref('faq')

const form = ref(createEmptyForm())

function createEmptyForm() {
  return {
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  }
}

function toggleFaq(index) {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}

function scrollToSection(sectionId) {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function resetForm() {
  form.value = createEmptyForm()
}

function submitContactForm() {
  const categoryLabel =
    contactCategories.find((item) => item.value === form.value.category)?.label || 'Consulta'

  toastService.success(
    `Mensaje registrado (${categoryLabel}). El equipo de soporte revisará su solicitud.`
  )
  resetForm()
}
</script>

<style scoped>
.support-page {
  display: grid;
  gap: 28px;
  max-width: 980px;
}

.support-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #0b1f3a;
}

.support-header p {
  margin: 8px 0 0;
  color: #6f7d8f;
  font-size: 15px;
  max-width: 720px;
  line-height: 1.6;
}

.section-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.section-tab {
  border: 1px solid #d8e2ef;
  background: #fff;
  color: #53657c;
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-tab.active,
.section-tab:hover {
  background: #d9e6ff;
  color: #08264a;
  border-color: #b8ccf0;
}

.support-section {
  scroll-margin-top: 24px;
}

.section-heading h2 {
  margin: 0;
  font-size: 22px;
  color: #0b1f3a;
}

.section-heading p {
  margin: 6px 0 0;
  color: #6f7d8f;
  font-size: 14px;
}

.faq-list {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.faq-item {
  background: #fff;
  border: 1px solid #e3e8ef;
  border-radius: 12px;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 0;
  background: transparent;
  text-align: left;
  font-size: 15px;
  font-weight: 700;
  color: #0b1f3a;
  cursor: pointer;
}

.faq-question svg {
  width: 20px;
  height: 20px;
  color: #53657c;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.faq-item.open .faq-question svg {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 18px 16px;
}

.faq-answer p {
  margin: 0;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.65;
}

.contact-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(240px, 280px) 1fr;
  gap: 20px;
}

.contact-info,
.contact-form,
.terms-card {
  background: #fff;
  border: 1px solid #e3e8ef;
  border-radius: 14px;
  padding: 22px;
}

.contact-info h3,
.terms-block h3 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #0b1f3a;
}

.contact-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}

.contact-info li {
  display: grid;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6f7d8f;
}

.contact-info a {
  color: #0b4f9c;
  text-decoration: none;
  font-weight: 600;
}

.contact-info a:hover {
  text-decoration: underline;
}

.contact-note {
  margin: 18px 0 0;
  font-size: 13px;
  color: #6f7d8f;
  line-height: 1.55;
}

.contact-form {
  display: grid;
  gap: 16px;
}

.form-row {
  display: grid;
  gap: 6px;
}

.form-row label {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.form-row input,
.form-row select,
.form-row textarea {
  width: 100%;
  border: 1px solid #d8e2ef;
  border-radius: 10px;
  padding: 11px 12px;
  font: inherit;
  color: #0b1f3a;
  background: #fbfdff;
}

.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  outline: 2px solid #b8ccf0;
  border-color: #7ea6e6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: 0;
  border-radius: 10px;
  padding: 11px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn.primary {
  background: #0b4f9c;
  color: #fff;
}

.btn.primary:hover {
  background: #094080;
}

.btn.secondary {
  background: #eef3fa;
  color: #334155;
}

.btn.secondary:hover {
  background: #e2ebf6;
}

.terms-card {
  margin-top: 18px;
  display: grid;
  gap: 22px;
}

.terms-updated {
  margin: 0;
  font-size: 13px;
  color: #6f7d8f;
  font-weight: 600;
}

.terms-block p {
  margin: 0 0 10px;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.65;
}

.terms-block p:last-child {
  margin-bottom: 0;
}

@media (max-width: 860px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>

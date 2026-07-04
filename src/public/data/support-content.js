export const supportSections = [
  { id: 'faq', label: 'Preguntas frecuentes' },
  { id: 'contact', label: 'Contacto y ayuda' },
  { id: 'terms', label: 'Términos y condiciones' }
]

export const faqItems = [
  {
    question: '¿Qué es Capital Cruise?',
    answer:
      'Capital Cruise es una aplicación web interna para entidades financieras en el Perú, orientada a la simulación y gestión de créditos vehiculares. Permite registrar clientes y vehículos, configurar condiciones de financiamiento y generar cronogramas de pago mediante el método francés vencido ordinario.'
  },
  {
    question: '¿Qué método de amortización utiliza el sistema?',
    answer:
      'El sistema utiliza el método francés vencido ordinario con meses comerciales de treinta días y base anual de 360 días. Las cuotas periódicas se mantienen constantes durante los periodos ordinarios, siempre que no cambien la tasa ni las condiciones principales de la operación.'
  },
  {
    question: '¿Qué monedas y tasas puedo configurar?',
    answer:
      'Puede simular operaciones en soles (PEN) o dólares (USD). El sistema acepta tasas nominales o efectivas. Si ingresa una tasa nominal, debe indicar también la frecuencia de capitalización. Todas las tasas se convierten internamente a tasa efectiva mensual antes del cálculo del cronograma.'
  },
  {
    question: '¿Qué es la Compra Inteligente y la cuota balloon?',
    answer:
      'La Compra Inteligente es una modalidad en la que el cliente paga cuotas menores durante el plazo principal y deja una cuota final elevada (balloon o valor residual). Capital Cruise modela esta modalidad separando el capital amortizable del pago final, calculando cuotas ordinarias menores y registrando la cuota balloon al final del plazo.'
  },
  {
    question: '¿Qué indicadores financieros muestra una simulación?',
    answer:
      'Cada simulación presenta el cronograma completo de pagos junto con VAN, TIR, TCEA, total de intereses, total de seguros, total de cargos y total a pagar. Estos indicadores se calculan desde la perspectiva del deudor, conforme a los criterios de transparencia del sistema financiero peruano.'
  },
  {
    question: '¿Qué son los periodos de gracia total y parcial?',
    answer:
      'En gracia total el deudor no paga capital ni intereses durante los periodos definidos, pero los intereses se capitalizan y aumentan el saldo. En gracia parcial el deudor paga solo los intereses sin amortizar capital, manteniendo el saldo constante. Ambos deben configurarse al inicio de la operación.'
  },
  {
    question: '¿Cómo se registran seguros, comisiones y gastos?',
    answer:
      'Los seguros (desgravamen, vehicular), comisiones, portes y gastos administrativos se configuran como conceptos separados. Aparecen diferenciados en el cronograma y afectan la cuota total y la TCEA cuando forman parte de la oferta financiera.'
  },
  {
    question: '¿Las simulaciones guardadas pueden modificarse?',
    answer:
      'Las operaciones guardadas conservan un snapshot del cálculo para mantener trazabilidad histórica. Puede consultar el detalle, duplicar una operación para probar variantes de tasa, plazo o valor residual, o crear una nueva simulación sin modificar el registro original.'
  },
  {
    question: '¿Capital Cruise reemplaza la contratación formal del crédito?',
    answer:
      'No. Capital Cruise opera como simulador bajo el supuesto de cumplimiento, tal como define la normativa de conducta de mercado del sistema financiero. Los resultados son referenciales para que asesores estructuren ofertas vehiculares antes de la contratación formal.'
  },
  {
    question: '¿Quién puede acceder al portal?',
    answer:
      'El acceso está restringido a usuarios internos autorizados de la entidad financiera mediante credenciales de inicio de sesión. Los clientes finales no utilizan directamente la aplicación; la información del cliente se registra para estructurar la oferta de financiamiento.'
  }
]

export const contactCategories = [
  { value: 'suggestion', label: 'Sugerencia' },
  { value: 'complaint', label: 'Queja' },
  { value: 'help', label: 'Solicitud de ayuda' }
]

export const termsSections = [
  {
    title: '1. Aceptación y naturaleza del servicio',
    paragraphs: [
      'Al utilizar Capital Cruise, el usuario interno acepta estos términos y condiciones. La plataforma es una herramienta de simulación y gestión de créditos vehiculares destinada exclusivamente al uso interno de entidades financieras autorizadas en el Perú.',
      'Capital Cruise no constituye una oferta vinculante de crédito ni sustituye los procesos formales de evaluación crediticia, contratación y desembolso regulados por el sistema financiero peruano.'
    ]
  },
  {
    title: '2. Marco normativo aplicable',
    paragraphs: [
      'El diseño y uso de la aplicación se alinea con el marco legal del sistema financiero peruano, incluyendo la Ley N.º 26702, la Resolución SBS N.º 8181-2012, la Resolución SBS N.º 3274-2017, la Resolución SBS N.º 3748-2021 y las disposiciones vigentes sobre seguros asociados al crédito.',
      'El usuario se compromete a utilizar la información generada conforme a los principios de transparencia, trazabilidad y sustento financiero exigidos por la Superintendencia de Banca, Seguros y AFP (SBS).'
    ]
  },
  {
    title: '3. Uso permitido y restricciones',
    paragraphs: [
      'El acceso está limitado a personal autorizado mediante credenciales personales e intransferibles. Queda prohibido compartir credenciales, manipular datos de clientes sin autorización o utilizar la plataforma con fines distintos a la simulación y gestión interna de operaciones crediticias vehiculares.',
      'El usuario es responsable de verificar la exactitud de los datos ingresados (cliente, vehículo, tasas, plazos, seguros, cargos y demás parámetros) antes de presentar una oferta o guardar una operación.'
    ]
  },
  {
    title: '4. Transparencia y presentación de resultados',
    paragraphs: [
      'Conforme al Reglamento de Transparencia, la aplicación debe presentar de manera clara y separada: datos de entrada, resultados financieros, cronograma de pagos, cargos aplicados e indicadores finales (VAN, TIR, TCEA, totales de intereses, seguros y cargos).',
      'La TCEA refleja el costo real del crédito considerando intereses, comisiones, gastos, seguros y demás componentes del flujo de caja del deudor. Una tasa de interés aparentemente baja no implica necesariamente un menor costo total si existen cargos recurrentes, seguros obligatorios o cuota balloon elevada.',
      'El sistema distingue entre cuota financiera base y cuota total pagada por el deudor, evitando presentar información incompleta o ambigua sobre el costo de la operación.'
    ]
  },
  {
    title: '5. Simulaciones y trazabilidad',
    paragraphs: [
      'Las simulaciones se realizan bajo el supuesto de cumplimiento de las condiciones configuradas. Los resultados son referenciales y pueden variar según la evaluación crediticia final, condiciones comerciales vigentes y aprobación institucional.',
      'Las operaciones guardadas conservan snapshots de cálculo para auditoría y consulta posterior. El usuario no debe alterar ni eliminar registros con fines de ocultar información relevante para la toma de decisiones o cumplimiento normativo.'
    ]
  },
  {
    title: '6. Protección de datos',
    paragraphs: [
      'La información de clientes, vehículos y operaciones crediticias es confidencial y debe tratarse conforme a las políticas internas de la entidad financiera y la normativa aplicable en materia de protección de datos personales.',
      'Queda prohibido exportar, divulgar o utilizar datos registrados en Capital Cruise para fines ajenos a la gestión autorizada de créditos vehiculares.'
    ]
  },
  {
    title: '7. Limitación de responsabilidad',
    paragraphs: [
      'Capital Cruise es una herramienta de apoyo al asesoramiento financiero interno. La entidad financiera es responsable de validar los parámetros comerciales, cumplir la normativa vigente y comunicar adecuadamente al cliente final las condiciones contractuales aplicables.',
      'El equipo de Capital Cruise no se responsabiliza por decisiones comerciales adoptadas sin verificación de datos, ni por discrepancias derivadas de configuraciones incorrectas ingresadas por el usuario.'
    ]
  },
  {
    title: '8. Soporte, sugerencias y quejas',
    paragraphs: [
      'Los usuarios pueden enviar sugerencias, quejas o solicitudes de ayuda a través del formulario de contacto en la sección de Soporte. Las consultas serán atendidas por el equipo responsable de la plataforma en un plazo razonable.',
      'Para incidencias críticas que afecten cálculos financieros o acceso al sistema, se recomienda reportar el problema con el mayor detalle posible, incluyendo fecha, operación afectada y capturas descriptivas si corresponde.'
    ]
  },
  {
    title: '9. Modificaciones',
    paragraphs: [
      'Estos términos y condiciones pueden actualizarse para reflejar cambios normativos, mejoras del sistema o nuevas funcionalidades. Las versiones vigentes estarán disponibles en esta sección. El uso continuado de la plataforma implica la aceptación de las modificaciones publicadas.'
    ]
  }
]

export const supportContactInfo = {
  email: 'soporte@capitalcruise.pe',
  hours: 'Lunes a viernes, 9:00 a.m. - 6:00 p.m. (hora de Lima)',
  responseTime: 'Respuesta estimada en 1 a 2 días hábiles'
}

const support = (anchor) => `/support#${anchor}`

export const supportGuideTopics = [
  {
    id: 'datos-cliente',
    title: 'Datos del cliente',
    description:
      'Estos campos identifican al titular de la operación y permiten relacionar la evaluación financiera con un perfil real del cliente.'
  },
  {
    id: 'datos-vehiculo',
    title: 'Datos del vehículo',
    description:
      'El vehículo es el activo subyacente de la operación. Su precio, tipo y descripción afectan la estructura del financiamiento y la garantía.'
  },
  {
    id: 'moneda-operacion',
    title: 'Moneda de la operación',
    description:
      'Define si la simulación se calcula en Soles o en Dólares. La moneda impacta cuotas, tipo de cambio y presentación de resultados.'
  },
  {
    id: 'cuota-inicial',
    title: 'Cuota inicial',
    description:
      'La cuota inicial es el aporte del cliente al inicio del crédito. Puede expresarse como monto o como porcentaje del precio del vehículo.'
  },
  {
    id: 'plazo-fecha',
    title: 'Plazo y fecha de inicio',
    description:
      'El plazo determina la cantidad de cuotas del cronograma. La fecha de inicio fija el punto de partida para los vencimientos.'
  },
  {
    id: 'tipo-tasa',
    title: 'Tipo de tasa',
    description:
      'Define si la tasa ingresada es nominal o efectiva. Si es nominal, se requiere capitalización para convertirla a una tasa efectiva.'
  },
  {
    id: 'capitalizacion',
    title: 'Capitalización',
    description:
      'La capitalización indica cada cuánto los intereses se incorporan al capital. Solo aplica cuando la tasa informada es nominal.'
  },
  {
    id: 'tem',
    title: 'TEM',
    description:
      'La tasa efectiva mensual es la tasa interna de trabajo usada para calcular intereses, amortización y saldos del cronograma.'
  },
  {
    id: 'cok',
    title: 'COK y tasa de descuento',
    description:
      'El costo de oportunidad del capital se usa para traer los flujos del deudor a valor presente y calcular el VAN.'
  },
  {
    id: 'tipo-cambio',
    title: 'Tipo de cambio',
    description:
      'Se utiliza para convertir montos entre Soles y Dólares cuando la moneda del vehículo y la moneda de la operación no coinciden.'
  },
  {
    id: 'periodo-gracia',
    title: 'Periodo de gracia',
    description:
      'Durante la gracia, la cuota recibe un tratamiento especial. Puede ser parcial o total según cómo se atienden intereses y capital.'
  },
  {
    id: 'compra-inteligente',
    title: 'Compra Inteligente',
    description:
      'Esquema de crédito vehicular que deja una cuota final elevada o valor residual para reducir las cuotas ordinarias.'
  },
  {
    id: 'cuota-balloon',
    title: 'Cuota balloon',
    description:
      'Monto final diferido que se paga al cierre del crédito. Reduce cuotas ordinarias, pero incrementa la cuota final.'
  },
  {
    id: 'cargos-iniciales',
    title: 'Cargos iniciales',
    description:
      'Son costos que se aplican al inicio de la operación. Según su modo, pueden financiarse, pagarse al contado o retenerse del desembolso.'
  },
  {
    id: 'cargos-periodicos',
    title: 'Cargos periódicos',
    description:
      'Son costos que se aplican durante el cronograma. Aumentan la cuota total, pero no necesariamente reducen el capital.'
  },
  {
    id: 'cronograma-pagos',
    title: 'Cronograma de pagos',
    description:
      'Resume cuota por cuota la evolución del crédito, incluyendo saldo inicial, interés, amortización, cargos, seguros y saldo final.'
  },
  {
    id: 'van',
    title: 'VAN',
    description:
      'El valor actual neto actualiza los flujos del deudor con la tasa de descuento. Es un monto monetario, no un porcentaje.'
  },
  {
    id: 'tir',
    title: 'TIR',
    description:
      'La tasa interna de retorno es la tasa que hace que el VAN del flujo del deudor sea igual a cero.'
  },
  {
    id: 'tcea',
    title: 'TCEA',
    description:
      'La tasa de costo efectivo anual resume el costo real del crédito considerando intereses, seguros, comisiones y gastos.'
  },
  {
    id: 'filtros',
    title: 'Filtros e historial',
    description:
      'Los filtros permiten ubicar registros, operaciones y activos sin cambiar la información persistida.'
  }
]

export const fieldHelpContent = {
  clientFirstName: {
    title: 'Nombres',
    description: 'Ingresa los nombres del cliente tal como figuran en su documento de identidad.',
    supportAnchor: support('datos-cliente')
  },
  clientLastName: {
    title: 'Apellidos',
    description: 'Registra los apellidos del cliente para identificar correctamente al titular de la operación.',
    supportAnchor: support('datos-cliente')
  },
  clientDocumentType: {
    title: 'Tipo de documento',
    description: 'Selecciona el documento que respalda la identificación del cliente en la operación.',
    supportAnchor: support('datos-cliente')
  },
  clientDocumentNumber: {
    title: 'Número de documento',
    description: 'Ingresa el número del documento de identidad o registro tributario sin alterar el formato requerido por tu entidad.',
    supportAnchor: support('datos-cliente')
  },
  clientEmail: {
    title: 'Correo electrónico',
    description: 'Permite registrar un medio de contacto del cliente para seguimiento comercial y coordinación documental.',
    supportAnchor: support('datos-cliente')
  },
  clientPhone: {
    title: 'Teléfono',
    description: 'Registra un número de contacto operativo para el seguimiento de la evaluación y de la propuesta.',
    supportAnchor: support('datos-cliente')
  },
  clientAddress: {
    title: 'Dirección',
    description: 'Consigna la dirección de referencia del cliente para completar su perfil y documentación.',
    supportAnchor: support('datos-cliente')
  },
  clientMonthlyIncome: {
    title: 'Ingreso mensual',
    description: 'Dato clave para estimar la relación cuota-ingreso y validar la capacidad de pago del cliente.',
    supportAnchor: support('datos-cliente')
  },
  clientNotes: {
    title: 'Observaciones',
    description: 'Espacio para anotar consideraciones comerciales o documentarias relevantes para el asesor.',
    supportAnchor: support('datos-cliente')
  },
  vehicleBrand: {
    title: 'Marca',
    description: 'Marca comercial del vehículo que formará parte de la simulación o del portafolio.',
    supportAnchor: support('datos-vehiculo')
  },
  vehicleModel: {
    title: 'Modelo',
    description: 'Modelo específico del activo para identificar correctamente la unidad evaluada.',
    supportAnchor: support('datos-vehiculo')
  },
  vehicleYear: {
    title: 'Año',
    description: 'Año de fabricación o modelo comercial usado para la identificación y valorización del vehículo.',
    supportAnchor: support('datos-vehiculo')
  },
  vehicleType: {
    title: 'Tipo de vehículo',
    description: 'Clasifica el activo dentro del portafolio y ayuda a contextualizar su uso y valorización.',
    supportAnchor: support('datos-vehiculo')
  },
  vehicleDescription: {
    title: 'Descripción',
    description: 'Detalle técnico o comercial del vehículo, útil para distinguir versiones, estado o equipamiento.',
    supportAnchor: support('datos-vehiculo')
  },
  vehicleImageUrl: {
    title: 'URL de imagen',
    description: 'Enlace a una imagen del vehículo para mejorar su identificación visual dentro del catálogo.',
    supportAnchor: support('datos-vehiculo')
  },
  vehicleCommercialPrice: {
    title: 'Precio comercial',
    description: 'Valor referencial del vehículo que sirve como base para la simulación del crédito.',
    supportAnchor: support('datos-vehiculo')
  },
  vehicleCurrency: {
    title: 'Moneda',
    description: 'Moneda en la que está valorizado el vehículo dentro del catálogo.',
    supportAnchor: support('moneda-operacion')
  },
  vehicleSearchFilter: {
    title: 'Buscar en la base',
    description: 'Filtra el catálogo por marca, modelo o VIN para ubicar más rápido el vehículo deseado.',
    supportAnchor: support('filtros')
  },
  vehicleBrandFilter: {
    title: 'Marca',
    description: 'Restringe la lista a una marca específica sin modificar el inventario registrado.',
    supportAnchor: support('filtros')
  },
  vehicleYearFilter: {
    title: 'Año',
    description: 'Filtra vehículos por año comercial para acotar la búsqueda del activo.',
    supportAnchor: support('filtros')
  },
  operationClientFilter: {
    title: 'Nombre del cliente',
    description: 'Busca operaciones por el nombre visible del cliente sin alterar los registros guardados.',
    supportAnchor: support('filtros')
  },
  operationCurrencyFilter: {
    title: 'Moneda',
    description: 'Filtra operaciones guardadas por moneda de originación o simulación.',
    supportAnchor: support('filtros')
  },
  simulationClient: {
    title: 'Cliente',
    description: 'Selecciona al cliente titular de la operación para asociar el cálculo a su perfil financiero.',
    supportAnchor: support('datos-cliente')
  },
  simulationVehicle: {
    title: 'Vehículo',
    description: 'Selecciona el vehículo que se financiará. Su precio y moneda alimentan la estructura del crédito.',
    supportAnchor: support('datos-vehiculo')
  },
  operationCurrency: {
    title: 'Moneda de la operación',
    description: 'Define si la simulación se expresa en Soles o Dólares. Impacta cuotas, saldos y presentación de resultados.',
    supportAnchor: support('moneda-operacion')
  },
  vehiclePrice: {
    title: 'Precio del vehículo',
    description: 'Monto base sobre el cual se calcula la cuota inicial, el principal y ciertos cargos o seguros.',
    supportAnchor: support('datos-vehiculo')
  },
  downPaymentMode: {
    title: 'Modo de cuota inicial',
    description: 'Permite definir la cuota inicial como porcentaje del precio o como monto absoluto.',
    supportAnchor: support('cuota-inicial')
  },
  downPaymentPercent: {
    title: 'Cuota inicial en porcentaje',
    description: 'Porcentaje del precio del vehículo que el cliente aportará al inicio de la operación.',
    supportAnchor: support('cuota-inicial')
  },
  downPaymentAmount: {
    title: 'Cuota inicial en monto',
    description: 'Monto monetario que el cliente pagará al inicio para reducir el financiamiento requerido.',
    supportAnchor: support('cuota-inicial')
  },
  termMonths: {
    title: 'Plazo en meses',
    description: 'Número de cuotas mensuales del financiamiento. Un mayor plazo suele reducir la cuota, pero aumenta intereses.',
    supportAnchor: support('plazo-fecha')
  },
  startDate: {
    title: 'Fecha de inicio',
    description: 'Fecha base desde la cual se construyen los vencimientos del cronograma.',
    supportAnchor: support('plazo-fecha')
  },
  rateType: {
    title: 'Tipo de tasa',
    description: 'Define si la tasa ingresada es nominal o efectiva. Si es nominal, se requiere capitalización para convertirla a una tasa efectiva.',
    supportAnchor: support('tipo-tasa')
  },
  rateValue: {
    title: 'Valor de la tasa',
    description: 'Valor numérico de la tasa contractual que se usará como base para el cálculo del cronograma.',
    supportAnchor: support('tipo-tasa')
  },
  ratePeriod: {
    title: 'Periodo de la tasa',
    description: 'Indica si la tasa informada corresponde a un periodo mensual o anual.',
    supportAnchor: support('tipo-tasa')
  },
  capitalizationFrequency: {
    title: 'Frecuencia de capitalización',
    description: 'Frecuencia con la que los intereses se incorporan al capital. Solo aplica cuando la tasa es nominal.',
    supportAnchor: support('capitalizacion')
  },
  discountRateType: {
    title: 'Tipo de tasa de descuento',
    description: 'Define el tipo de tasa usado para actualizar flujos y calcular VAN desde la perspectiva del deudor.',
    supportAnchor: support('cok')
  },
  discountRatePeriod: {
    title: 'Periodo de la tasa de descuento',
    description: 'Periodo en que se expresa la tasa de descuento antes de convertirse a la periodicidad de evaluación.',
    supportAnchor: support('cok')
  },
  discountRateValue: {
    title: 'COK / tasa de descuento',
    description: 'Costo de oportunidad usado para actualizar los flujos del deudor y calcular el VAN.',
    supportAnchor: support('cok')
  },
  exchangeRateValue: {
    title: 'Tipo de cambio',
    description: 'Valor usado para convertir montos entre Soles y Dólares cuando la operación lo requiere.',
    supportAnchor: support('tipo-cambio')
  },
  balloonEnabled: {
    title: 'Compra Inteligente',
    description: 'Activa una estructura con cuota final o valor residual para reducir cuotas ordinarias durante el plazo.',
    supportAnchor: support('compra-inteligente')
  },
  balloonMode: {
    title: 'Modo de cuota balloon',
    description: 'Permite definir la cuota final como porcentaje o como monto absoluto.',
    supportAnchor: support('cuota-balloon')
  },
  balloonPercent: {
    title: 'Cuota balloon en porcentaje',
    description: 'Porcentaje del precio o del principal que se deja como cuota final diferida.',
    supportAnchor: support('cuota-balloon')
  },
  balloonAmount: {
    title: 'Cuota balloon en monto',
    description: 'Monto final diferido que se paga al cierre del crédito.',
    supportAnchor: support('cuota-balloon')
  },
  balloonBase: {
    title: 'Base de la cuota balloon',
    description: 'Define si la cuota final se calcula sobre el precio del vehículo o sobre el principal financiado.',
    supportAnchor: support('cuota-balloon')
  },
  balloonDueInstallment: {
    title: 'Cuota de vencimiento',
    description: 'Número de cuota en la que se exigirá el pago balloon o valor residual.',
    supportAnchor: support('cuota-balloon')
  },
  graceType: {
    title: 'Tipo de gracia',
    description: 'Periodo en el que el pago recibe un tratamiento especial. Puede ser gracia parcial o total.',
    supportAnchor: support('periodo-gracia')
  },
  gracePeriods: {
    title: 'Duración en meses',
    description: 'Cantidad de periodos a los que se aplicará la gracia al inicio del cronograma.',
    supportAnchor: support('periodo-gracia')
  },
  initialChargesSection: {
    title: 'Cargos iniciales',
    description: 'Costo aplicado al inicio de la operación. Puede financiarse, pagarse al contado o retenerse del desembolso.',
    supportAnchor: support('cargos-iniciales')
  },
  initialChargeCode: {
    title: 'Código del cargo',
    description: 'Clasifica el tipo de gasto inicial para mantener trazabilidad financiera y presentación consistente.',
    supportAnchor: support('cargos-iniciales')
  },
  initialChargeName: {
    title: 'Nombre',
    description: 'Descripción visible del cargo inicial que aparecerá en tablas y detalle de operación.',
    supportAnchor: support('cargos-iniciales')
  },
  initialChargeAmount: {
    title: 'Monto',
    description: 'Importe monetario del cargo inicial aplicado al inicio de la operación.',
    supportAnchor: support('cargos-iniciales')
  },
  initialChargeCurrency: {
    title: 'Moneda de cargo inicial',
    description: 'Moneda en la que está expresado el cargo inicial antes de cualquier conversión.',
    supportAnchor: support('cargos-iniciales')
  },
  initialChargeFinancingMode: {
    title: 'Modo de aplicación del cargo inicial',
    description: 'Financiado: se suma al préstamo. Pagado al contado: no forma parte del crédito. Retenido: reduce el desembolso neto.',
    supportAnchor: support('cargos-iniciales')
  },
  initialChargeTaxable: {
    title: 'Afecto a impuesto',
    description: 'Indica si el cargo inicial está sujeto a impuesto según la política del producto o de la entidad.',
    supportAnchor: support('cargos-iniciales')
  },
  periodicChargesSection: {
    title: 'Cargos periódicos',
    description: 'Costo aplicado durante el cronograma. Aumenta la cuota total, pero no reduce el capital.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeCode: {
    title: 'Código del cargo',
    description: 'Clasifica el concepto periódico para identificar si corresponde a porte, seguro, comisión u otro gasto.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeType: {
    title: 'Tipo',
    description: 'Define si el cargo se aplica como monto fijo, tasa o porcentaje.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeName: {
    title: 'Nombre',
    description: 'Nombre visible del cargo periódico dentro de la simulación y del detalle guardado.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeAmount: {
    title: 'Monto de cargo periódico',
    description: 'Valor monetario cuando el cargo se aplica como monto fijo en cada periodo.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeCurrency: {
    title: 'Moneda de cargo periódico',
    description: 'Moneda usada cuando el cargo periódico se aplica como monto fijo.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeRatePercent: {
    title: 'Valor',
    description: 'Valor porcentual o de tasa usado para calcular el cargo periódico sobre una base definida.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeRateBase: {
    title: 'Base de aplicación',
    description: 'Monto base sobre el cual se calcula un cargo periódico cuando se expresa como tasa o porcentaje.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeFrequency: {
    title: 'Frecuencia',
    description: 'Periodicidad con la que el cargo se aplica dentro del cronograma.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeGrace: {
    title: 'Aplica durante gracia',
    description: 'Define si el cargo también se cobra durante los periodos de gracia parcial o total.',
    supportAnchor: support('periodo-gracia')
  },
  periodicChargeFromInstallment: {
    title: 'Mes de inicio',
    description: 'Primera cuota o mes desde el cual se empezará a cobrar el cargo periódico.',
    supportAnchor: support('cargos-periodicos')
  },
  periodicChargeToInstallment: {
    title: 'Mes de fin',
    description: 'Última cuota o mes en la que se cobrará el cargo periódico.',
    supportAnchor: support('cargos-periodicos')
  },
  supportContactName: {
    title: 'Nombre completo',
    description: 'Identifica a la persona que registra la consulta, sugerencia o incidencia.',
    supportAnchor: support('filtros')
  },
  supportContactEmail: {
    title: 'Correo electrónico',
    description: 'Medio al que se enviará seguimiento o coordinación sobre la solicitud registrada.',
    supportAnchor: support('filtros')
  },
  supportContactCategory: {
    title: 'Tipo de mensaje',
    description: 'Clasifica la naturaleza de la solicitud para priorizar su atención.',
    supportAnchor: support('filtros')
  },
  supportContactSubject: {
    title: 'Asunto',
    description: 'Resumen breve del tema a tratar para contextualizar la atención del soporte.',
    supportAnchor: support('filtros')
  },
  supportContactMessage: {
    title: 'Mensaje',
    description: 'Describe el caso con detalle suficiente para reproducirlo o atenderlo correctamente.',
    supportAnchor: support('filtros')
  }
}

export function getFieldHelp(topic) {
  return (
    fieldHelpContent[topic] || {
      title: 'Ayuda contextual',
      description: 'Consulta esta ayuda para entender el propósito del campo y su impacto en la operación.',
      supportAnchor: support('faq')
    }
  )
}

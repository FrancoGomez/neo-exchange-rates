const obtenerTiposDeCambio = async (base) => {
    let tiposDeCambio = await fetch(`https://api.exchangerate.host/lastest?base=${base}`)
    let tiposDeCambioJSON = tiposDeCambio.json()

    return tiposDeCambioJSON
}

obtenerTiposDeCambio("USD")
    .then(respuesta => {console.log(respuesta.rates)})

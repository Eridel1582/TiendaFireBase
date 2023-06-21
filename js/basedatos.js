const getMovieFromTmbd = async () => {
    try {
            const datos = await axios.get('https://tienda-virtual-fb0df-default-rtdb.firebaseio.com/productos.json')
            if (datos.status !== 200) return;
            const { data } = datos
            console.log(data)
            return data;
        } catch (error) {
            console.log('error al obtener los datos ', error);
        }
}


export default getMovieFromTmbd;
import { Fragment, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import DetallesPedido from "./DetallesPedido";
// importar el context
import { CRMContext } from '../../context/CRMContext';

function Pedidos() {
    
    // Hook para la navegación
    const navigate = useNavigate();

    const [pedidos, guardarPedidos] = useState([]);

    // Utilizar valores del context
    const [auth, guardarAuth] = useContext(CRMContext);

    useEffect(() => {
       
        if(auth.token != ''){
            
            try {
                
                const consultarAPI = async () => {
                    // obtner los pedidos
                    const resultado = await clienteAxios.get('/pedidos',
                        {
                            headers: {
                                Authorization: `Bearer ${auth.token}`
                            }
                        }
                    );
                    guardarPedidos(resultado.data);
                }
                consultarAPI();

            } catch (error) {
                // Error con la autorización
                if(error.response.status = 500){
                    navigate('/iniciar-sesion');
                }
            }
    
        }else{
            navigate('/iniciar-sesion');
        }

    }, [])
    
    return (
        <Fragment>
            <h2>Pedidos</h2>

            <ul class="listado-pedidos">
                {pedidos.map(pedido => (
                    <DetallesPedido 
                        key={pedido._id}
                        pedido={pedido}
                        
                    />
                ))}
            </ul>
        </Fragment>
    )
}

export default Pedidos;
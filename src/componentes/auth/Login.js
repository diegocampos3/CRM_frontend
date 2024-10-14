import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

// Context
import { CRMContext } from "../../context/CRMContext";


function Login() {

    // Auth y token

    const [auth, guardarAuth] = useContext(CRMContext);
    console.log(auth);




    // State con los datos del formulario
    const [ credenciales, guardarCredenciales] = useState({});

    // Hook para la navegación
    const navigate = useNavigate();

    // Iniciar sesión en el servidor

    const iniciarSesion = async e => {
        e.preventDefault();

        // autenticar al usuario

        try {

            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);
            
            // extraer el token y almacenarlo en local storage
            const { token } = respuesta.data;
            localStorage.setItem('token', token);

            // colocarlo en el state

            guardarAuth({
                token,
                auth: true
            })


            // alerta
            Swal.fire({
                icon: 'success',
                title: 'Login correcto',
                text: 'Has iniciado Sesión'
            }
            )

            // redireccionar 
            navigate('/');


        } catch (error) {
            //console.log(error);

            if(error.response){
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: error.response.data.mensaje
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                })
            }

        }
    }


    // Almacenar lo que el usuario escribe en el state
    const leerDatos = e => {
        // State con los datos del formulario
        guardarCredenciales({
            ...credenciales,
            [e.target.name] :  e.target.value
        })
    }

    return (
        <div className="login">
            <h2>iniciar Sesión</h2>
            <div className="contenedor-formulario">
                <form
                    onSubmit={iniciarSesion}
                
                >
                    <div className="campo">
                        <label>Email</label>
                        <input 
                            type="text"
                            name="email"
                            placeholder="Email para Iniciar Sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div>
                    <div className="campo">
                        <label>Password</label>
                        <input 
                            type="password"
                            name="password"
                            placeholder="Password para Iniciar Sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div> 
                    <input type="submit" value="Iniciar Sesión" className="btn btn-verde btn-block"/>
                </form>
            </div>
        </div>

    )
}

export default Login;
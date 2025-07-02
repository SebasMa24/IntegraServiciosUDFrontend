import type React from "react";
import '../styles/Resource.css'
import { useState } from "react";
import ResourceForm from "../components/ResourceForm";

const Resource: React.FC = () => {
    const [show, setShow] = useState('buttons');
    const [type, setType] = useState(false);

    function changeShow(txt: string, bool: boolean) {
        setShow(txt)
        setType(bool)
    };



    return (
        <section className="c-resource">
            <h1 className="txt-p">Registro de Recursos</h1>
            {
                show === 'buttons' ? (
                    <section className="c-buttons">
                        <button onClick={() => changeShow('Hardware', true)}>Registrar un tipo de Hardware</button>
                        <button onClick={() => changeShow('Espacio', true)}>Registrar un tipo de Espacio</button>
                        <button onClick={() => changeShow('Hardware', false)}>Registrar un Hardware</button>
                        <button onClick={() => changeShow('Espacio', false)}>Registrar un Espacio</button>
                    </section>
                ) : (
                    <ResourceForm resource={show} typeC={type} change={changeShow}/>
                )
            }
        </section>
    );
};

export default Resource;
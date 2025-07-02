import type React from "react";
import { useEffect, useRef, useState } from "react";
import { getInfoResource, sendHardware, sendSpace, sendTypeHardware, sendTypeSpace } from "../services/resource";
import type { InfoTypeAndState, infoSpace, InfoHardware, InfoHardwareType, InfoSpaceType } from "../services/resource";

type ResourceFormProps = {
    resource: string;
    typeC: boolean;
    change: (newValue: string, newBool: boolean) => void;
};

type dataState = {
    status: number,
    data: InfoTypeAndState[],
}

const ResourceForm: React.FC<ResourceFormProps> = ({ resource, typeC, change }) => {

    const ulrs = ['spaces/listStates', 'spaces/listTypeSpace', 'hardware/listTypeHardware']
    const [error, setError] = useState("")
    const [codeSend, setCodeSend] = useState(0)

    const [nametype, setNameType] = useState('')
    const [desctype, setDescType] = useState('')

    const [building, setBuilding] = useState(0)
    const [code, setCode] = useState(0)
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [state, setState] = useState('')
    const [tipoSelec, setTipoSelec] = useState('')
    const [schedule, setSchedule] = useState('')
    const [capacity, setcapacity] = useState(0)

    const [states, setStates] = useState<dataState>({
        status: 0,
        data: []
    })

    const [tipo, setTipo] = useState<dataState>({
        status: 0,
        data: []
    })

    const hasRun = useRef(false);

    useEffect(() => {
        setError(codeSend !== undefined && (codeSend === 200 || codeSend === 0) ? "" : "Error al guardar la información.")
    }, [codeSend])

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        async function load() {
            try {
                const promesas = ulrs.map(url => getInfoResource(url))
                const datos = await Promise.all(promesas);
                setStates({
                    status: 200,
                    data: datos[0],
                })
                setTipo({
                    status: 200,
                    data: resource === "Hardware" ? datos[2] : datos[1],
                })
            } catch (e) {
                console.error(e)
            }
        }

        load();
    }, []);

    async function sendInfo() {
        const data1: InfoHardwareType = {
            name_hardwareType: nametype,
            desc_hardwareType: desctype
        }

        const data2: InfoSpaceType = {
            name_spaceType: nametype,
            desc_spaceType: desctype
        }

        const data3: InfoHardware = {
            typeHardware: tipoSelec,
            nameHardware: name,
            scheduleHardware: schedule,
            descHardware: desc
        }

        const data4: infoSpace = {
            building_space: building,
            code_space: code,
            type_space: tipoSelec,
            name_space: name,
            desc_space: desc,
            schedule_space: schedule,
            capacity_space: capacity,
            state_space: state
        }

        if (typeC) {
            if (resource === "Hardware" && hasEmptyFields(data1, setError)) {
                setCodeSend(await sendTypeHardware(data1));
            } else if (resource === "Espacio" && hasEmptyFields(data2, setError)) {
                setCodeSend(await sendTypeSpace(data2));
            }
        } else {
            if (resource === "Hardware" && hasEmptyFields(data3, setError)) {
                setCodeSend(await sendHardware(data3));
            } else if (resource === "Espacio" && hasEmptyFields(data4, setError)) {
                setCodeSend(await sendSpace(data4));
            }
        }
    }

    function hasEmptyFields<T extends object>(data: T, setError: (msg: string) => void): boolean {
        for (const key in data) {
            const value = data[key as keyof T];
            if (value === "" || value === null || value === undefined || value === 0) {
                setError(`hay campos que están vacíos o inválidos`);
                return false;
            }
        }

        setError("");
        return true;
    }

    return (
        <>
            {
                states.status === 200 ? (
                    <section className="resourceForm">
                        <h2><em>Registrar {
                            typeC ? (<>tipo de {resource}</>) : (<>un {resource}</>)
                        }</em></h2>
                        {
                            typeC ? (
                                <>
                                    <label htmlFor="name">Nombre</label>
                                    <input value={nametype} onChange={(e) => setNameType(e.target.value)} id="name" type="text" />
                                    <label htmlFor="desc">Descripción</label>
                                    <input value={desctype} onChange={(e) => setDescType(e.target.value)} id="desc" type="text" />
                                </>
                            ) : (
                                <section className="c-res">
                                    {resource === "Espacio" ? (
                                        <>
                                            <label htmlFor="">Constructor</label>
                                            <label htmlFor="">Código</label>
                                            <input value={building} onChange={(e) => { setBuilding(parseInt(e.target.value)) }} type="number" />
                                        </>
                                    )
                                        : (<></>
                                        )}
                                    {
                                        resource === "Espacio" ?
                                            (<><input value={code} onChange={(e) => { setCode(parseInt(e.target.value)) }} type="number" /></>) : (<></>)
                                    }
                                    <label htmlFor="">Tipo</label>
                                    {resource === "Espacio" ? (<><label htmlFor="">Estado</label></>) : (<></>)}
                                    {
                                        <select value={tipoSelec} onChange={(e) => setTipoSelec(e.target.value)}>
                                            {
                                                tipo.data.map((value, index) => {
                                                    return (
                                                        <option key={index}>{value.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    }
                                    {resource === "Espacio" ? (
                                        <select value={state} onChange={(e) => setState(e.target.value)}>
                                            {
                                                states.data.map((value, index) => {
                                                    return (
                                                        <option key={index}>{value.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    ) : (<></>)}
                                    <label htmlFor="">Nombre</label>
                                    {resource === "Espacio" ? (<><label htmlFor="">Capacidad</label></>) : (<></>)}
                                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" />
                                    {resource === "Espacio" ? (<><input value={capacity} onChange={(e) => setcapacity(parseInt(e.target.value))} type="number" /></>) : (<></>)}
                                    <label htmlFor="">Horario</label>
                                    <label htmlFor="">Descripción</label>
                                    <input value={schedule} onChange={(e) => setSchedule(e.target.value)} type="text" />
                                    <input value={desc} onChange={(e) => setDesc(e.target.value)} type="text" />
                                </section>
                            )
                        }
                        <section className="btn">
                            <button onClick={sendInfo}>Guardar</button>
                            <button onClick={() => change("buttons", false)}>Regresar</button>
                        </section>
                        {
                            error !== "" ? (<h3 className="h-red">{error}</h3>) : (<></>)
                        }
                        {
                            codeSend === 200 ? (<h3 className="h-green">Guardado exitosamente</h3>) : (<></>)
                        }
                    </section>
                ) : (<h1>Cargando...</h1>)
            }
        </>
    );
}

export default ResourceForm;
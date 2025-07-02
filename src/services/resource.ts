
const URL = "http://localhost:8083/";

export interface InfoTypeAndState {
    name: string;
    desc: string;
}

export interface InfoHardware {
    typeHardware: string;
    nameHardware: string;
    scheduleHardware: string;
    descHardware: string;
}

export interface InfoHardwareType {
    name_hardwareType: string;
    desc_hardwareType: string; 
}

export interface infoSpace {
    code_space: number;
    building_space: number;
    type_space: string;
    state_space: string;
    name_space: string;
    capacity_space: number;
    schedule_space: string;
    desc_space: string;
}

export interface InfoSpaceType {
    name_spaceType: string;
    desc_spaceType: string;
}

export async function getInfoResource(url: string): Promise<InfoTypeAndState[]> {
    const response = await fetch(URL + url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data.data;
    }

    return [];
}

export async function  sendTypeHardware(info: InfoHardwareType): Promise<number> {
    const request = await fetch(URL + 'hardware/createHardwareType', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(info)
    });

    return request.status;
}

export async function  sendTypeSpace(info: InfoSpaceType): Promise<number> {
    const request = await fetch(URL + 'spaces/createSpacesType', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(info)
    });

    return request.status;
}

export async function  sendHardware(info: InfoHardware): Promise<number> {
    const request = await fetch(URL + 'hardware/createHardware', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(info)
    });

    return request.status;
}

export async function  sendSpace(info: infoSpace): Promise<number> {
    const request = await fetch(URL + 'spaces/createSpaces', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(info)
    });

    return request.status;
}
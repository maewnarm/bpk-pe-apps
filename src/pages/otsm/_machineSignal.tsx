import { useState, useRef, useCallback } from "react"
import useEffectDidMount from "@/hooks/useEffectDidMount"
import { useAppSelector } from "@/app/hooks"
import {
    selectedProject,
    projectSelected,
    selectedMachine,
    machineSelected,
} from '@/app/features/otsm/otsmSlice'
import Paho from 'paho-mqtt'
import mqtt from 'mqtt'
import { useEffect } from "react"

// global.WebSocket = require('websocket')
var mqttConnected = false

const MqttConnection = () => {
    const selectedProjectValue = useAppSelector(selectedProject)
    const selectedMachineValue = useAppSelector(selectedMachine)
    const [connectionState, setConnectionState] = useState("Not connected")
    const [subscribesStatus, setSubscribesStatus] = useState({})
    var client: Paho.Client

    // const host = "mqtt://192.168.152.128"
    const host = "broker.emqx.io"

    function onConnect() {
        setConnectionState("Connected")
        console.log("connected")
    }

    const connectMQTT = useCallback(() => {
        client = new Paho.Client(host, 8083, "asd")
        client.connect({
            onSuccess: onConnect,
            // useSSL: true,
        })
    }, [])

    useEffect(() => {
        connectMQTT()
        return () => {
            console.log("out")
            client.disconnect()
        }
    }, [connectMQTT])

    // const connectMQTT = () => {
    //     client = new Paho.Client(host, 8083, "asd")
    //     client.connect({
    //         onSuccess: onConnect,
    //         // useSSL: true,
    //     })
    // }

    const publish = async (pubTopic: string) => {
        // const pubTopic = document.getElementById('topic_pub').value
        const elementID = `msg-${pubTopic}`
        const message = new Paho.Message("")
        message.destinationName = pubTopic
        message.qos = 0
        message.retained = false
        client.send(message)
        console.log("publish: " + pubTopic + ", msg: " + message)
    }

    const subscribe = (subTopic: string) => {
        // const subTopic = document.getElementById('topic_sub').value
        client.subscribe(subTopic)
        setSubscribesStatus({ ...subscribesStatus, [subTopic]: true })
        console.log("subscribe: " + subTopic)
    }

    const unsubscribe = (subTopic: string) => {
        client.unsubscribe(subTopic)
        setSubscribesStatus({ ...subscribesStatus, [subTopic]: false })
        console.log("unsubscribe: " + subTopic)
    }

    return (
        <div className="otsm__machine-signal__mqtt">
            <h1>MQTT</h1>
            <button className="button" onClick={() => connectMQTT()}>Connect</button>
        </div>
    )
}

const MachineSignal = () => {
    const projectSelectedValue = useAppSelector(projectSelected)
    const machineSelectedValue = useAppSelector(machineSelected)

    const buttonSignals = [
        "Home position",
        "Auto condition",
        "Auto run",
        "Cycle stop",
        "Fault stop",
        "Emergency stop",
    ]
    var signalsValue: { [key: string]: number } = buttonSignals.reduce(
        (prevVal, curVal) => ({ ...prevVal, [curVal]: 0 }), {}
    )

    function toggleSignal(signalKey: string) {
        console.log(signalKey)
    }

    return (
        <div className="otsm__machine-signal">
            <div className="otsm__machine-signal__button">
                {Object.keys(signalsValue).map((key, idx) => {
                    var classSet = "button"
                    const value = signalsValue[key]
                    if (key.includes("stop")) {
                        classSet += " is-danger"
                    } else {
                        classSet += " is-info"
                    }

                    if (value === 0) {
                        classSet += " is-outlined"
                    }
                    return (
                        <button key={idx} className={classSet}
                            onClick={() => toggleSignal(key)}
                            disabled={!(projectSelectedValue && machineSelectedValue)}>
                            {key}
                        </button>
                    )
                })}
            </div>
            <MqttConnection />
        </div>
    )
}

export default MachineSignal
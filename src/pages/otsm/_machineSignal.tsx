import { useState, FC, CSSProperties, useRef } from "react"
import useEffectDidMount from "@/hooks/useEffectDidMount"
import Timer from "@/components/timer/timer"
import { useAppSelector } from "@/app/hooks"
import {
    selectedProject,
    projectSelected,
    selectedMachine,
    machineSelected,
} from '@/app/features/otsm/otsmSlice'
import { MqttConnectionProps } from "./_types"
import Paho from 'paho-mqtt'
import { useEffect } from "react"

// const host = "192.168.152.128"
const host = "127.0.0.1"
// const host = "broker.emqx.io"

const buttonSignals = [
    "Home position",
    "Auto condition",
    "Auto run",
    "Cycle stop",
    "Fault stop",
    "Emergency stop",
]
var initialSignalsValue: { [key: string]: number } = buttonSignals.reduce(
    (prevVal, curVal) => ({ ...prevVal, [curVal]: 0 }), {}
)

const MqttConnection: FC<MqttConnectionProps> = (props) => {
    const selectedProjectValue = useAppSelector(selectedProject)
    const selectedMachineValue = useAppSelector(selectedMachine)
    const [mqttClient, setMqttClient] = useState<Paho.Client>()
    const [connectionState, setConnectionState] = useState("Not connect")
    const [subscribedLists, setSubscribedLists] = useState<string[]>([])
    const onMessageArrived = useRef<(message: Paho.Message) => void>()

    const ConnectionButton = () => {
        if (mqttClient && mqttClient.isConnected()) {
            return (
                <button className="button" onClick={() => disconnectMQTT()} style={{ color: "#ff5f5f" }}>
                    <i className="fas fa-power-off" style={{ color: "#ff5f5f", marginRight: "0.2rem" }} />
                    Disconnect
                </button>
            )
        } else {
            return (
                <button className="button" onClick={() => setMQTT()} style={{ color: "#80ff00" }} disabled={!(props.projectSelected && machineSelected)}>
                    <i className="fas fa-power-off" style={{ color: "#80ff00", marginRight: "0.2rem" }} />
                    Connect
                </button>
            )
        }
    }

    const setMQTT = () => {
        setMqttClient(new Paho.Client(host, 8083, "asd"))
    }

    function onConnect() {
        setConnectionState("Connected")
        props.setIsConnected(true)
        document.getElementById('connectionState')?.classList.toggle("is-connected", true)
        console.log("connected")
        const subTopic = `otsm/${selectedProjectValue}/${selectedMachineValue}/#`
        subscribe(subTopic)
    }

    function onFailure() {
        setConnectionState("Connection failed")
    }

    function onConnectionLost(response: Paho.MQTTError) {
        setConnectionState("Disconnected")
        props.setIsConnected(false)
        props.setSignalStatus(initialSignalsValue)
        setSubscribedLists([])
        document.getElementById('connectionState')?.classList.toggle("is-connected", false)
        console.log("Connection lost: " + response.errorMessage)
    }

    useEffect(() => {
        onMessageArrived.current = function (message: Paho.Message) {
            console.log("Message arrived: " + message.payloadString + " from Topic: " + message.destinationName)
            const topic = message.destinationName.split("/")
            if (topic) {
                let topicValue = parseInt(message.payloadString)
                let topicProject = topic[1]
                let topicMachine = topic[2]
                let topicSignal = topic[3]
                // console.log(signalStatus)
                props.setSignalStatus({ ...props.signalStatus, [topicSignal]: topicValue })
            }
        }
    }, [props.signalStatus])

    const connectMQTT = () => {
        // console.log(mqttClient?.isConnected())
        if (mqttClient && !mqttClient.isConnected()) {
            setConnectionState("Connecting ...")
            mqttClient.connect({
                onSuccess: onConnect,
                // useSSL: true,
                onFailure: onFailure,
            })
            mqttClient.onConnectionLost = (response) => onConnectionLost(response)
            mqttClient.onMessageArrived = (message) => {
                if (onMessageArrived.current) {
                    onMessageArrived.current(message)
                }
            }
        }
    }

    useEffect(() => {
        if (mqttClient && !mqttClient.isConnected()) {
            connectMQTT()
        }
        return () => {
            if (mqttClient && mqttClient.isConnected()) {
                console.log("out")
                mqttClient.disconnect()
            }
        }
    }, [mqttClient])

    useEffectDidMount(() => {
        // disconnectMQTT()
        //unsubscribe all
        subscribedLists.forEach(list => {
            unsubscribe(list)
        })
        //subscribe new
        subscribe(`otsm/${selectedProjectValue}/${selectedMachineValue}/#`)
    }, [selectedProjectValue, selectedMachineValue])

    const disconnectMQTT = () => {
        if (mqttClient && mqttClient.isConnected()) {
            setConnectionState("Disconnecting ...")
            mqttClient.disconnect()
        }
    }

    const subscribe = (subTopic: string) => {
        if (mqttClient && mqttClient.isConnected()) {
            // const subTopic = document.getElementById('topic_sub').value
            mqttClient.subscribe(subTopic)
            var newSubscribeLists = subscribedLists
            if (!newSubscribeLists.includes(subTopic)) {
                newSubscribeLists = [...subscribedLists, subTopic]
            }
            setSubscribedLists(newSubscribeLists)
            console.log("subscribe: " + subTopic)
        }
    }

    useEffectDidMount(() => {
        const sendSignalType = Object.keys(props.sendSignalStatus)[0]
        const sendSignalValue = Object.values(props.sendSignalStatus)[0]
        publish(sendSignalType, sendSignalValue)
    }, [props.sendSignalStatus])

    const publish = async (signalType: string, value: number) => {
        if (mqttClient && mqttClient.isConnected()) {
            const pubTopic = `otsm/${selectedProjectValue}/${selectedMachineValue}/${signalType}`
            const message = new Paho.Message(value.toString())
            message.destinationName = pubTopic
            message.qos = 0
            message.retained = true
            mqttClient.send(message)
            console.log("publish: " + pubTopic + ", msg: " + message)
        }
    }

    const unsubscribe = (subTopic: string) => {
        if (mqttClient && mqttClient.isConnected()) {
            mqttClient.unsubscribe(subTopic)
            console.log("unsubscribe: " + subTopic)
        }
    }

    return (
        <div className="otsm__machine-signal__connection">
            <div className="otsm__machine-signal__connect">
                <p>MQTT Connection : </p>
                <p id="connectionState" className="connection-state">{connectionState}</p>
                <ConnectionButton />
            </div>
            <div className="otsm__machine-signal__subscribe">
                <p>Subscribed : </p>
                {subscribedLists.map((list, idx) => <p key={idx} className="subscribed-list"><strong>{list}</strong></p>)}
            </div>
        </div>
    )
}

const MachineSignal = () => {
    const projectSelectedValue = useAppSelector(projectSelected)
    const machineSelectedValue = useAppSelector(machineSelected)
    const [isConnected, setIsConnected] = useState(false)
    const [signalStatus, setSignalStatus] = useState(initialSignalsValue)
    const [sendSignalStatus, setSendSignalStatus] = useState(initialSignalsValue)

    function toggleSignal(signalKey: string, currentValue: number) {
        console.log(signalKey)
        if (currentValue === 0) {
            setSendSignalStatus({ [signalKey]: 1 })
        } else {
            setSendSignalStatus({ [signalKey]: 0 })
        }
    }

    return (
        <div className="otsm__machine-signal">
            <MqttConnection
                setIsConnected={setIsConnected}
                signalStatus={signalStatus}
                setSignalStatus={setSignalStatus}
                sendSignalStatus={sendSignalStatus}
                setSendSignalStatus={setSendSignalStatus}
                projectSelected={projectSelectedValue}
                machineSelected={machineSelectedValue}
            />
            <div className="otsm__machine-signal__button">
                {buttonSignals.map((key, idx) => {
                    var classSet = "button"
                    var bgColor = "#3e8ed055"
                    const value = signalStatus[key]
                    console.log(value+key)
                    if (value === 0) {
                        classSet += " is-outlined"
                    }
                    let timer = null
                    if (key.includes("stop")) {
                        classSet += " is-danger"
                        bgColor = "#f1466855"
                        timer = <Timer
                            startSignal={value === 1 ? true : false}
                            stopSignal={signalStatus["Ready"] === 1 ? true : false}
                        />
                    } else {
                        classSet += " is-info"
                    }
                    return (
                        <div key={idx} className="otsm__machine-signal__button__item">
                            <button className={classSet}
                                onClick={() => toggleSignal(key, value)}
                                disabled={!(projectSelectedValue && machineSelectedValue && isConnected)}
                                style={{ "--bg-clr": bgColor } as CSSProperties}
                            >
                                {key}
                            </button>
                            {timer}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MachineSignal
import { useState, FC, CSSProperties, useRef } from "react";
import useEffectDidMount from "@/hooks/useEffectDidMount";
import Timer from "@/components/timer/timer";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectedProject,
  projectSelected,
  projectSelectDisabled,
  setProjectDisable,
  selectedMachine,
  machineSelected,
  machineSelectDisabled,
  setMachineDisable,
} from "@/app/features/otsm/otsmSlice";
import { MqttConnectionProps } from "./_types";
import Paho from "paho-mqtt";
import { useEffect } from "react";

// const host = "192.168.152.128"
const host = "127.0.0.1";
// const host = "broker.emqx.io"

const buttonSignals = [
  "Home position",
  "Auto condition",
  "Auto run",
  "Cycle stop",
  "Fault stop",
  "Emergency stop",
];
var initialSignalsValue: { [key: string]: number } = buttonSignals.reduce(
  (prevVal, curVal) => ({ ...prevVal, [curVal]: 0 }),
  {}
);
var subscribedListsArray: string[] = [];

const MqttConnection: FC<MqttConnectionProps> = (props) => {
  const selectedProjectValue = useAppSelector(selectedProject);
  const selectedMachineValue = useAppSelector(selectedMachine);
  const [mqttClient, setMqttClient] = useState<Paho.Client>();
  const [connectionState, setConnectionState] = useState("Not connect");
  const [subscribedLists, setSubscribedLists] = useState<string[]>([]);
  const onMessageArrived = useRef<(message: Paho.Message) => void>();

  const ConnectionButton = () => {
    if (mqttClient && mqttClient.isConnected()) {
      return (
        <button
          className="button"
          onClick={() => disconnectMQTT()}
          style={{ color: "#ff5f5f" }}
        >
          <i
            className="fas fa-power-off"
            style={{ color: "#ff5f5f", marginRight: "0.2rem" }}
          />
          Disconnect
        </button>
      );
    } else {
      return (
        <button
          className="button"
          onClick={() => setMQTT()}
          style={{ color: "#80ff00" }}
          disabled={!(props.projectSelected && machineSelected)}
        >
          <i
            className="fas fa-power-off"
            style={{ color: "#80ff00", marginRight: "0.2rem" }}
          />
          Connect
        </button>
      );
    }
  };

  const setMQTT = () => {
    setMqttClient(new Paho.Client(host, 8083, "asd"));
  };

  function onConnect() {
    setConnectionState("Connected");
    props.setIsConnected(true);
    document
      .getElementById("connectionState")
      ?.classList.toggle("is-connected", true);
    console.log("connected");
    subscribe(
      `otsm/${selectedProjectValue.name}/${selectedMachineValue.name}/#`
    );
    subscribe(`otsm/${selectedProjectValue.name}/Ready`);
  }

  function onFailure() {
    setConnectionState("Connection failed");
  }

  function onConnectionLost(response: Paho.MQTTError) {
    setConnectionState("Disconnected");
    props.setIsConnected(false);
    props.setSignalStatus(initialSignalsValue);
    setSubscribedLists([]);
    document
      .getElementById("connectionState")
      ?.classList.toggle("is-connected", false);
    console.log("Connection lost: " + response.errorMessage);
  }

  useEffect(() => {
    onMessageArrived.current = function (message: Paho.Message) {
      console.log(
        "Message arrived: " +
          message.payloadString +
          " from Topic: " +
          message.destinationName
      );
      const topic = message.destinationName.split("/");
      if (topic) {
        if (topic.includes("Ready")) {
          let topicValue = parseInt(message.payloadString);
          props.setSignalReadyStatus(topicValue);
        } else {
          let topicValue = parseInt(message.payloadString);
          // let topicProject = topic[1]
          // let topicMachine = topic[2]
          let topicSignal = topic[3];
          // console.log(signalStatus)
          props.setSignalStatus({
            ...props.signalStatus,
            [topicSignal]: topicValue,
          });
        }
      }
    };
  }, [props.signalStatus]);

  const connectMQTT = () => {
    // console.log(mqttClient?.isConnected())
    if (mqttClient && !mqttClient.isConnected()) {
      setConnectionState("Connecting ...");
      mqttClient.connect({
        onSuccess: onConnect,
        // useSSL: true,
        onFailure: onFailure,
      });
      mqttClient.onConnectionLost = (response) => onConnectionLost(response);
      mqttClient.onMessageArrived = (message) => {
        if (onMessageArrived.current) {
          onMessageArrived.current(message);
        }
      };
    }
  };

  useEffect(() => {
    if (mqttClient && !mqttClient.isConnected()) {
      connectMQTT();
    }
    return () => {
      if (mqttClient && mqttClient.isConnected()) {
        console.log("out");
        mqttClient.disconnect();
      }
    };
  }, [mqttClient]);

  useEffectDidMount(() => {
    //reset signalStatus
    props.setSignalStatus(initialSignalsValue);
    //unsubscribe all
    subscribedListsArray.forEach((list) => {
      unsubscribe(list);
    });
    //subscribe new
    subscribe(
      `otsm/${selectedProjectValue.name}/${selectedMachineValue.name}/#`
    );
    subscribe(`otsm/${selectedProjectValue.name}/Ready`);
  }, [selectedProjectValue, selectedMachineValue]);

  const disconnectMQTT = () => {
    if (mqttClient && mqttClient.isConnected()) {
      setConnectionState("Disconnecting ...");
      mqttClient.disconnect();
    }
  };

  function addSubscribeTopic(subTopic: string) {
    let newSubscribeLists = subscribedListsArray;
    if (!newSubscribeLists.includes(subTopic)) {
      newSubscribeLists = [...subscribedListsArray, subTopic];
    }
    subscribedListsArray = newSubscribeLists;
    setSubscribedLists(newSubscribeLists);
  }

  function removeSubscribeTopic(subTopic: string) {
    let newSubscribeLists = subscribedListsArray.filter(
      (list) => list !== subTopic
    );
    subscribedListsArray = newSubscribeLists;
    setSubscribedLists(newSubscribeLists);
  }

  const subscribe = (subTopic: string) => {
    if (mqttClient && mqttClient.isConnected()) {
      mqttClient.subscribe(subTopic);
      addSubscribeTopic(subTopic);
      console.log("subscribe: " + subTopic);
    }
  };

  const unsubscribe = (subTopic: string) => {
    if (mqttClient && mqttClient.isConnected()) {
      mqttClient.unsubscribe(subTopic);
      removeSubscribeTopic(subTopic);
      console.log("unsubscribe: " + subTopic);
    }
  };

  useEffect(() => {
    console.log(subscribedListsArray);
    console.log(subscribedLists);
    subscribedListsArray = subscribedLists;
  }, [subscribedLists]);

  useEffectDidMount(() => {
    const sendSignalType = Object.keys(props.sendSignalStatus)[0];
    const sendSignalValue = Object.values(props.sendSignalStatus)[0];
    publish(sendSignalType, sendSignalValue);
  }, [props.sendSignalStatus]);

  useEffectDidMount(() => {
    publish("", props.signalReadyStatus, true);
  }, [props.signalReadyStatus]);

  const publish = async (
    signalType: string,
    value: number,
    isReady?: boolean
  ) => {
    let pubTopic = `otsm/${selectedProjectValue.name}/${selectedMachineValue.name}/${signalType}`;
    if (isReady) {
      pubTopic = `otsm/${selectedProjectValue.name}/Ready`;
    }
    if (mqttClient && mqttClient.isConnected()) {
      const message = new Paho.Message(value.toString());
      message.destinationName = pubTopic;
      message.qos = 0;
      message.retained = true;
      mqttClient.send(message);
      console.log("publish: " + pubTopic + ", msg: " + message);
    }
  };

  return (
    <div className="otsm__machine-signal__connection">
      <div className="otsm__machine-signal__connect">
        <p>MQTT Connection : </p>
        <p id="connectionState" className="connection-state">
          {connectionState}
        </p>
        <ConnectionButton />
      </div>
      <div className="otsm__machine-signal__subscribe">
        <p>Subscribed : </p>
        <ul>
          {subscribedLists.map((list, idx) => (
            <li key={idx} className="subscribed-list">
              <strong>{list}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const MachineSignal = () => {
  const projectSelectedValue = useAppSelector(projectSelected);
  const machineSelectedValue = useAppSelector(machineSelected);
  // const projectSelectDisabledValue = useAppSelector(projectSelectDisabled)
  // const machineSelectDisabledValue = useAppSelector(machineSelectDisabled)
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const [signalStatus, setSignalStatus] = useState(initialSignalsValue);
  const [sendSignalStatus, setSendSignalStatus] = useState(initialSignalsValue);
  const [signalReadyStatus, setSignalReadyStatus] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);

  function toggleSignal(
    signalKey: string,
    currentValue: number,
    effectToReady: boolean
  ) {
    // console.log(signalKey)
    if (currentValue === 0) {
      setSendSignalStatus({ [signalKey]: 1 });
      if (effectToReady) {
        setSignalReadyStatus(0);
      }
    } else {
      setSendSignalStatus({ [signalKey]: 0 });
    }
  }

  function toggleReadySignal(currentValue: number) {
    if (currentValue === 0) {
      setSignalReadyStatus(1);
    } else {
      setSignalReadyStatus(0);
    }
  }

  useEffect(() => {
    console.log("signalStatus changed");
    console.log(timerIsRunning);
    let haveTimerStopOn = false;
    Object.keys(signalStatus).forEach((signal) => {
      if (signal.includes("stop") && signalStatus[signal] === 1) {
        haveTimerStopOn = true;
      }
    });
    if (timerIsRunning) {
      haveTimerStopOn = true;
    } else if (!timerIsRunning && !haveTimerStopOn) {
      haveTimerStopOn = false;
    }
    dispatch(setProjectDisable(haveTimerStopOn));
    dispatch(setMachineDisable(haveTimerStopOn));
  }, [signalStatus, timerIsRunning]);

  return (
    <div className="otsm__machine-signal">
      <MqttConnection
        setIsConnected={setIsConnected}
        signalStatus={signalStatus}
        setSignalStatus={setSignalStatus}
        sendSignalStatus={sendSignalStatus}
        setSendSignalStatus={setSendSignalStatus}
        signalReadyStatus={signalReadyStatus}
        setSignalReadyStatus={setSignalReadyStatus}
        projectSelected={projectSelectedValue}
        machineSelected={machineSelectedValue}
      />
      <div className="otsm__machine-signal__button__ready">
        <button
          className={`button is-success ${
            signalReadyStatus === 1 ? "" : "is-outlined"
          }`}
          onClick={() => toggleReadySignal(signalReadyStatus)}
          disabled={
            !(projectSelectedValue && machineSelectedValue && isConnected)
          }
        >
          Ready
        </button>
      </div>
      <div className="otsm__machine-signal__button">
        {buttonSignals.map((key, idx) => {
          let classSet = "button";
          let bgColor = "#3e8ed055";
          const value = signalStatus[key];
          let effectToReady = false;
          let timer = null;
          if (value === 0) {
            classSet += " is-outlined";
          }
          if (key.includes("stop")) {
            classSet += " is-danger";
            bgColor = "#f1466855";
            effectToReady = true;
            timer = (
              <Timer
                startSignal={value === 1 ? true : false}
                stopSignal={signalReadyStatus === 1 ? true : false}
                abbrMessage="Timer will stop by 'Ready' signal is ON"
                returnTimerRunningFlagFunction={setTimerIsRunning}
              />
            );
          } else {
            classSet += " is-info";
          }
          return (
            <div key={idx} className="otsm__machine-signal__button__item">
              <button
                className={classSet}
                onClick={() => toggleSignal(key, value, effectToReady)}
                disabled={
                  !(projectSelectedValue && machineSelectedValue && isConnected)
                }
                style={{ "--bg-clr": bgColor } as CSSProperties}
              >
                {key}
              </button>
              {timer}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MachineSignal;

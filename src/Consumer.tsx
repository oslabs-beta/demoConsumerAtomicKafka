import React, { useState, useEffect , useRef } from "react";
import io from "socket.io-client";
import AtomicKafkaClient from "./AtomicKafkaClient";

// const socket = io("http://localhost:3001");

function useInterval(callback, delay) {
  const savedCallback = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // const node = savedCallback;
      // if (savedCallback === undefined) throw new TypeError('');
      savedCallback?.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Consumer() {
  const [sku, setSku] = useState([10]);
  const akc = new AtomicKafkaClient("http://localhost:3001");

  useInterval(() => akc.consumer(sku, setSku), 4000);
    // const socket = io("http://localhost:3001");
    // akc.clientSocketConsume(socket, truck, setTruck);
    // const socket = io("http://localhost:3001");
      // console.log('In useEffect of App!!');
      // socket.on("newMessage",  (arg) => {
      //   console.log("new data: ", arg);
      //   // console.log("data type: ", typeof arg);
      //   console.log("new truck state: ", truck);
      //   return setTruck([...truck, arg]);
      // });

      // return () => {
      //   console.log("is App ever off?");
      //   socket.off();
      // }, 5000);

  return (
    <div>
      <h1>LIVE DATA:</h1>
      <ul>
        {sku.map((num, indx) => {
          return (
            <li key={indx}>{num}</li>
          )
        })}
      </ul>
    </div>
  );
}

export default Consumer;
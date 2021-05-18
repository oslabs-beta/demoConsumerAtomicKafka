import React, { useState, useEffect , useRef } from "react";
import io from "socket.io-client";
import AtomicKafkaClient from "./AtomicKafkaClient";

// const socket = io("http://localhost:3001");

interface Inventory {
  [SKU: string]: number
}

const inventory: Inventory = {
  X01: 3000,
  X02: 1700,
  X03: 200, 
  X04: 9000,
  X05: 2400,
}

function useInterval(callback, delay) {
  const savedCallback = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback?.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Consumer() {
  const [inv, setInv] = useState(inventory);
  const [sku, setSku] = useState([]);
  const akc = new AtomicKafkaClient("http://localhost:3001");


  useInterval(() => akc.consumer(sku, setSku, inv, setInv), 4000);
  // useInterval(() => {
  //   if (sku.length > 0) {
  //     const newInv = {...inv};
  //     const latest = JSON.parse(sku[sku.length - 1]);
  //     console.log('sku latest: ', latest);
  //     // const newInv = inv[latest.SKU] - latest.qty;
  
  //     newInv[latest.SKU] -= latest.qty;
  
  //     // const skuUpdate = latest.SKU;
  //     // const newInv = {
  //     //   ...inv,
  //     //   skuUpdate : inv[latest.SKU] - latest.qty,
  //     // }
  //     return setInv(newInv);
  //   }
  // }, 4000)
  
  // function displayInventory () {
  //   let output = [];
  //   for (const sku in inv) {
  //     output.push(<li key={sku}>{`${sku}: ${inv[sku]}`}</li>);
  //   }
  //   return output;
  // }
  // const dispInv = displayInventory();

  return (
    <div>
      <div>
        {Object.keys(inv).map((key, idx) => {
          return (
            <li key={idx}>{`${key}: ${inv[key]}`}</li>
          )
        })}
      </div>
      <h1>LIVE DATA:</h1>
      <ul>
        {sku.map((num, idx) => {
          return (
            <li key={idx}>{num}</li>
          )
        })}
      </ul>
    </div>
  );
}

export default Consumer;
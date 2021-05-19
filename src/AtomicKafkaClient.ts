import io from "socket.io-client";

class AtomicKafkaClient {
  address: string;
  constructor(kafkaServer){
    this.address = kafkaServer;
    // this.io = require('socket.io-client')(kafkaServer, {
		// 	cors: {
		// 		origin: '*',
		// 	}
		// });
  }

  consumer(state, setState, inv = null, setInv = null){
    const socket = io(this.address);
    // const socket = io(this.address);
    console.log('in clientSocketConsume()');
    console.log('state in clientSocketConsume(): ', state);
    // console.log('setState in clientSocketConsume(): ', setState);

    socket.on("newMessage", (arg) => {
      console.log("new data: ", arg);
      // console.log("data type: ", typeof arg);
      console.log("new truck state: ", state);
      // if(arg.SKU === state[state.length - 1].SKU) return;
      let dupe = false;
      const latest = JSON.parse(arg);
      if (Object.keys(state).length > 0) {
        // if (state[state.length - 1].SKU === latest.SKU && state[state.length - 1].qty === latest.qty) dupe = true;
        if (latest.id in state) dupe = true;
      }
      if (!dupe) {
        const newState = {...state};
        newState[latest.id] = latest;
        setState(newState);
      }
      //  setState([...state, latest]);
      
      if (inv && !dupe) {
        const newInv = {...inv};
        // const latest = JSON.parse(arg);
        newInv[latest.SKU] -= latest.qty;
        setInv(newInv);
      }
    });
    return () => {
      console.log("is App ever off?");
      socket.off();
    }
  }
}



export default AtomicKafkaClient;

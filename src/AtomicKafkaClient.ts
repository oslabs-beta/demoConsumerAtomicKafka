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
      setState([...state, arg]);
      if (inv && arg) {
        const newInv = {...inv};
        const latest = JSON.parse(arg);
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

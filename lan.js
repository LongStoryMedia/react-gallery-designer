const os = require("os");

const nets = os.networkInterfaces();
const netKeys = Object.keys(nets);
const localNet = netKeys.filter(
  key => !/^lo/.test(key) && nets[key].address !== "127.0.0.1"
);
const wifi = localNet.filter(key => !/^(eth|enp)/.test(key));
const selectedInterface = Boolean(wifi[0]) ? wifi[0] : localNet[0];
const localServerAddress = nets[selectedInterface].filter(
  net => net.family === "IPv4"
)[0].address;

process.env.LSM_LAN_IP = `${localServerAddress}`;

console.log(`available network interfaces: `,
  netKeys, "\n"
);
console.log(`selected network interface: `,
  selectedInterface, "\n"
);

module.exports = {
  networks: {
    development: {
      host: "localhost",     // local ethureum network
      port: 8545,            // Port of operation for ganache
      network_id: "*"        // * to match any network ID, it is a required field
    }
  }
}

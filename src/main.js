import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import Lijst from './Lijst.vue'
import Nieuw from './Nieuw.vue'
import Contact from './Contact.vue'
import VueRouter from 'vue-router'
import Web3 from 'web3'




Vue.use(VueRouter);


const routes = [
  { path: '/lijst', component: Home },
  { path: '/', component: Lijst },
  { path: '/nieuw', component: Nieuw },
  { path: '/contact', component: Contact }]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes: routes,
})

const config = {
    dappInterface:[{"constant":false,"inputs":[{"name":"_admin","type":"address"}],"name":"removeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"acceptRequest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getVereniging","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newAdmin","type":"address"}],"name":"addAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"denyRequest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_naam","type":"string"},{"name":"_ondernemingsnummer","type":"string"},{"name":"_beschrijving","type":"string"}],"name":"addVereniging","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numVerenigingen","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"checkIfAdmin","outputs":[{"name":"admin","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"_naam","type":"string"},{"name":"_ondernemingsnummer","type":"string"},{"name":"_beschrijving","type":"string"}],"name":"editVereniging","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"_naam","type":"string"},{"indexed":false,"name":"_ondernemingsnummer","type":"string"},{"indexed":false,"name":"_beschrijving","type":"string"},{"indexed":false,"name":"datetime","type":"uint256"}],"name":"addVerenigingEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"_naam","type":"string"},{"indexed":false,"name":"_ondernemingsnummer","type":"string"},{"indexed":false,"name":"_beschrijving","type":"string"},{"indexed":false,"name":"datetime","type":"uint256"}],"name":"editVerenigingEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"status","type":"uint8"},{"indexed":false,"name":"datetime","type":"uint256"}],"name":"statuschangedEvent","type":"event"}],
    contractAddress: "0x9ddc38056c23ee0608b3cf90e8d0caea68f28d00"
    //account: "0x28827fb87DC6C70a482A1B3C3dD4FDA6cD499126"
}

var web3 = new Web3();

 if (typeof web3 !== "undefined") {
    // Use MetaMask's provider
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/28CFvZ2PJoIKHUT761RQ"));
}
const contract = web3.eth.contract(config.dappInterface).at(config.contractAddress); 



new Vue({
  el: '#page',
  data () {
    return {
      verenigingList: {},
    }
  },
  created: function() {
    this.fetchVerenigingenLijst();
    var self = this;
    var event = contract.statuschangedEvent(function(error, result) {
      if (!error){
        self.verenigingList[result.args.id].status = result.args.status
        self.verenigingList[result.args.id].lastChange = new Date(result.args.datetime * 1000)
      }
    });
    var event = contract.editVerenigingEvent(function(error, result) {
      if (!error){
        self.verenigingList[result.args.id] = {'naam': result.args._naam, 'ondernemingsnummer': result.args._ondernemingsnummer, 'beschrijving': result.args._beschrijving, 'status': 2, 'lastChange' : new Date(result.args.datetime * 1000), 'id' : result.args.id};
      }
    });
    var event = contract.addVerenigingEvent(function(error, result) {
      if (!error){
        self.verenigingList[result.args.id] = {'naam': result.args._naam, 'ondernemingsnummer': result.args._ondernemingsnummer, 'beschrijving': result.args._beschrijving, 'status': 2, 'lastChange' : new Date(result.args.datetime * 1000), 'id' : result.args.id};
      }
    });
  },
  methods: {
    addVereniging: function(naam, ondernemingsnummer, beschrijving){
      contract.addVereniging(naam, ondernemingsnummer, beschrijving, (error, value) => {
        console.log(error);
      });
    },
    editVereniging: function(id, naam, ondernemingsnummer, beschrijving) {
      contract.editVereniging(id, naam, ondernemingsnummer, beschrijving, (error, value) => {
        console.log(error);
      });
    },
    fetchVerenigingenLijst: function(){
      this.getNumVereniging().then( (num) => this.fetchVereniging(num)).then( (result) => {this.verenigingList = result});
    },
    getNumVereniging: function() {
      return new Promise((resolve, reject) => contract.numVerenigingen.call(function(error, result) {
        if(error){
          reject()
        } else {
          resolve(result)
        }
      })).catch(e => {
        console.log(e);
    });
    },
    fetchVereniging: function(index) {
      var dict = {}
      for (var i = 0; i < index; i++) {
        contract.getVereniging(i, function(err, res){
          dict[res[5]] = {'naam': res[0], 'ondernemingsnummer': res[1], 'beschrijving': res[2], 'status': res[3], 'lastChange' : new Date(res[4] * 1000), 'id' : res[5]};
        })
      }
      return dict;
    },
    acceptRequest: function(id) {
      contract.acceptRequest(id, (error, value) => {
        console.log(error);
      })
    },
    denyRequest: function(id) {
      contract.denyRequest(id, (error, value) => {
        console.log(error);
      })
    }
  },
  render: h => h(App),
  router: router,
})

const NETWORK_ID = 5

const MY_CONTRACT_ADDRESS = "0x47cd7ad1741c93FBb44c3bb88158f8bC60B3CA5D"
const MY_CONTRACT_ABI_PATH = "./json_abi/MyContract.json"
var my_contract

var accounts
var web3

function metamaskReloadCallback() {
  window.ethereum.on('accountsChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Se cambió el account, refrescando...";
    window.location.reload()
  })
  window.ethereum.on('networkChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Se el network, refrescando...";
    window.location.reload()
  })
}

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    if(document.readyState=="complete")
    {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        window.location.reload()
        resolve(web3)
      } else {
        reject("must install MetaMask")
        document.getElementById("web3_message").textContent="Error: Porfavor conéctate a Metamask";
      }
    }else
    {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          resolve(web3)
        } else {
          reject("must install MetaMask")
          document.getElementById("web3_message").textContent="Error: Please install Metamask";
        }
      });
    }
  });
};

const getContract = async (web3, address, abi_path) => {
  const response = await fetch(abi_path);
  const data = await response.json();
  
  const netId = await web3.eth.net.getId();
  contract = new web3.eth.Contract(
    data,
    address
    );
  return contract
}

async function loadDapp() {
  metamaskReloadCallback()
  document.getElementById("web3_message").textContent="Please connect to Metamask"
  var awaitWeb3 = async function () {
    web3 = await getWeb3()
    web3.eth.net.getId((err, netId) => {
      if (netId == NETWORK_ID) {
        var awaitContract = async function () {
          my_contract = await getContract(web3, MY_CONTRACT_ADDRESS, MY_CONTRACT_ABI_PATH)
          document.getElementById("web3_message").textContent="You are connected to Metamask"
          onContractInitCallback()
          web3.eth.getAccounts(function(err, _accounts){
            accounts = _accounts
            if (err != null)
            {
              console.error("An error occurred: "+err)
            } else if (accounts.length > 0)
            {
              onWalletConnectedCallback()
              document.getElementById("account_address").style.display = "block"
            } else
            {
              document.getElementById("connect_button").style.display = "block"
            }
          });
        };
        awaitContract();
      } else {
        document.getElementById("web3_message").textContent="Please connect to Goerli";
      }
    });
  };
  awaitWeb3();
}

async function connectWallet() {
  await window.ethereum.request({ method: "eth_requestAccounts" })
  accounts = await web3.eth.getAccounts()
  onWalletConnectedCallback()
}

loadDapp()

const onContractInitCallback = async () => {
  var hello = await my_contract.methods.hello().call()
  var count = await my_contract.methods.count().call()
  var last_writer = await my_contract.methods.count().call()

  var contract_state = "Hello: " + hello
    + ", Count: " + count
    + ", Last Writer: " + last_writer
  
  document.getElementById("contract_state").textContent = contract_state;
}

const onWalletConnectedCallback = async () => {
}


//// Functions ////

const setHello = async (_hello) => {
  const result = await my_contract.methods.setHello(_hello)
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Executing...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

// IDE

var OPCODE_STOP =           "00";
var OPCODE_ADD =            "01";
var OPCODE_MUL =            "02";
var OPCODE_SUB =            "03";
var OPCODE_DIV =            "04";
var OPCODE_SDIV =           "05";
var OPCODE_MOD =            "06";
var OPCODE_SMOD =           "07";
var OPCODE_ADDMOD =         "08";
var OPCODE_MULMOD =         "09";
var OPCODE_EXP =            "0A";
var OPCODE_SIGNEXTEND =     "0B";
var OPCODE_0F =             "0C";
var OPCODE_LT =             "10";
var OPCODE_GT =             "11";
var OPCODE_SLT =            "12";
var OPCODE_SGT =            "13";
var OPCODE_EQ =             "14";
var OPCODE_ISZERO =         "15";
var OPCODE_AND =            "16";
var OPCODE_OR =             "17";
var OPCODE_XOR =            "18";
var OPCODE_NOT =            "19";
var OPCODE_BYTE =           "1A";
var OPCODE_SHL =            "1B";
var OPCODE_SHR =            "1C";
var OPCODE_SAR =            "1D";
var OPCODE_KECCAK256 =      "20";
var OPCODE_ADDRESS =        "30";
var OPCODE_BALANCE =        "31";
var OPCODE_ORIGIN =         "32";
var OPCODE_CALLER =         "33";
var OPCODE_CALLVALUE =      "34";
var OPCODE_CALLDATALOAD =   "35";
var OPCODE_CALLDATASIZE =   "36";
var OPCODE_CALLDATACOPY =   "37";
var OPCODE_CODESIZE =       "38";
var OPCODE_CODECOPY =       "39";
var OPCODE_GASPRICE =       "3A";
var OPCODE_EXTCODESIZE =    "3B";
var OPCODE_EXTCODECOPY =    "3C";
var OPCODE_RETURNDATASIZE = "3D";
var OPCODE_RETURNDATACOPY = "3E";
var OPCODE_EXTCODEHASH =    "3F";
var OPCODE_BLOCKHASH =      "40";
var OPCODE_COINBASE =       "41";
var OPCODE_TIMESTAMP =      "42";
var OPCODE_NUMBER =         "43";
var OPCODE_PREVRANDAO =     "44";
var OPCODE_GASLIMIT =       "45";
var OPCODE_CHAINID =        "46";
var OPCODE_SELFBALANCE =    "47";
var OPCODE_BASEFEE =        "48";
var OPCODE_POP =            "50";
var OPCODE_MLOAD =          "51";
var OPCODE_MSTORE =         "52";
var OPCODE_MSTORE8 =        "53";
var OPCODE_SLOAD =          "54";
var OPCODE_SSTORE =         "55";
var OPCODE_JUMP =           "56";
var OPCODE_JUMPI =          "57";
var OPCODE_PC =             "58";
var OPCODE_MSIZE =          "59";
var OPCODE_GAS =            "5A";
var OPCODE_JUMPDEST =       "5B";
var OPCODE_PUSH0 =          "5F";
var OPCODE_PUSH1 =          "60";
var OPCODE_PUSH2 =          "61";
var OPCODE_PUSH3 =          "62";
var OPCODE_PUSH4 =          "63";
var OPCODE_PUSH5 =          "64";
var OPCODE_PUSH6 =          "65";
var OPCODE_PUSH7 =          "66";
var OPCODE_PUSH8 =          "67";
var OPCODE_PUSH9 =          "68";
var OPCODE_PUSH10 =         "69";
var OPCODE_PUSH11 =         "6A";
var OPCODE_PUSH12 =         "6B";
var OPCODE_PUSH13 =         "6C";
var OPCODE_PUSH14 =         "6D";
var OPCODE_PUSH15 =         "6E";
var OPCODE_PUSH16 =         "6F";
var OPCODE_PUSH17 =         "70";
var OPCODE_PUSH18 =         "71";
var OPCODE_PUSH19 =         "72";
var OPCODE_PUSH20 =         "73";
var OPCODE_PUSH21 =         "74";
var OPCODE_PUSH22 =         "75";
var OPCODE_PUSH23 =         "76";
var OPCODE_PUSH24 =         "77";
var OPCODE_PUSH25 =         "78";
var OPCODE_PUSH26 =         "79";
var OPCODE_PUSH27 =         "7A";
var OPCODE_PUSH28 =         "7B";
var OPCODE_PUSH29 =         "7C";
var OPCODE_PUSH30 =         "7D";
var OPCODE_PUSH31 =         "7E";
var OPCODE_PUSH32 =         "7F";
var OPCODE_DUP1 =           "80";
var OPCODE_DUP2 =           "81";
var OPCODE_DUP3 =           "82";
var OPCODE_DUP4 =           "83";
var OPCODE_DUP5 =           "84";
var OPCODE_DUP6 =           "85";
var OPCODE_DUP7 =           "86";
var OPCODE_DUP8 =           "87";
var OPCODE_DUP9 =           "88";
var OPCODE_DUP10 =          "89";
var OPCODE_DUP11 =          "8A";
var OPCODE_DUP12 =          "8B";
var OPCODE_DUP13 =          "8C";
var OPCODE_DUP14 =          "8D";
var OPCODE_DUP15 =          "8E";
var OPCODE_DUP16 =          "8F";
var OPCODE_SWAP1 =          "90";
var OPCODE_SWAP2 =          "91";
var OPCODE_SWAP3 =          "92";
var OPCODE_SWAP4 =          "93";
var OPCODE_SWAP5 =          "94";
var OPCODE_SWAP6 =          "95";
var OPCODE_SWAP7 =          "96";
var OPCODE_SWAP8 =          "97";
var OPCODE_SWAP9 =          "98";
var OPCODE_SWAP10 =         "99";
var OPCODE_SWAP11 =         "9A";
var OPCODE_SWAP12 =         "9B";
var OPCODE_SWAP13 =         "9C";
var OPCODE_SWAP14 =         "9D";
var OPCODE_SWAP15 =         "9E";
var OPCODE_SWAP16 =         "9F";
var OPCODE_LOG0 =           "A0";
var OPCODE_LOG1 =           "A1";
var OPCODE_LOG2 =           "A2";
var OPCODE_LOG3 =           "A3";
var OPCODE_LOG4 =           "A4";
var OPCODE_CREATE =         "F0";
var OPCODE_CALL =           "F1";
var OPCODE_CALLCODE =       "F2";
var OPCODE_RETURN =         "F3";
var OPCODE_DELEGATECALL =   "F4";
var OPCODE_CREATE2 =        "F5";
var OPCODE_STATICCALL =     "FA";
var OPCODE_REVERT =         "FD";
var OPCODE_INVALID =        "FE";
var OPCODE_SELFDESTRUCT =   "FF";

function getSelector(functionName) {
  let hash = web3.utils.soliditySha3(web3.utils.toHex(functionName))
  return hash.substring(2).substring(0, 8)
}

function push(value) {
  if(value.length == 2)
    return OPCODE_PUSH1 + value
  if(value.length == 4)
    return OPCODE_PUSH2 + value
  if(value.length == 6)
    return OPCODE_PUSH3 + value
  if(value.length == 8)
    return OPCODE_PUSH4 + value
  if(value.length == 58)
    return OPCODE_PUSH29 + value
}

function codeCopy(destOffest, offest, size) {
  returnValue = push(size)
    + push(offest)
    + push(destOffest)
    + OPCODE_CODECOPY
  return returnValue
}

function rReturn(offset, size) {
  returnValue = push(size)
    + push(offset)
    + OPCODE_RETURN
  return returnValue
}

const compile = async (_code) => {
  functionSelector = getSelector(_code)

  begin = ""
  + codeCopy("00", "0d", "55")
  + rReturn("00", "55")
  + OPCODE_INVALID
  + push("00")
  + OPCODE_CALLVALUE
  + OPCODE_GT
  + OPCODE_ISZERO  
  + push("0c")
  + OPCODE_JUMPI
  + push("00")
  + OPCODE_DUP1
  + OPCODE_REVERT
  + OPCODE_JUMPDEST
  + push("12")
  + push("2c")
  + OPCODE_JUMP
  + OPCODE_JUMPDEST

  end =
  + OPCODE_DUP2
  + OPCODE_EQ
  + push("21")
  + OPCODE_JUMPI
  + push("00")
  + OPCODE_DUP1
  + OPCODE_REVERT
  + OPCODE_JUMPDEST
  + push("0c")
  + push("00")
  + OPCODE_MSTORE
  + rReturn("00", "20")
  + OPCODE_JUMPDEST
  + push("00")
  + push("0100000000000000000000000000000000000000000000000000000000")
  + push("00")
  + OPCODE_CALLDATALOAD
  + OPCODE_DIV
  + OPCODE_SWAP1
  + OPCODE_POP
  + OPCODE_SWAP1
  + OPCODE_JUMP

  document.getElementById("_bytecode").value = begin + push(functionSelector) + end
  document.getElementById("_abi").value = 123
}
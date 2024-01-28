var labelMap = new Map()

var web3
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
async function loadWeb3() {
  web3 = await getWeb3()
}
loadWeb3()

function getSelector(functionName) {
  let hash = web3.utils.soliditySha3(web3.utils.toHex(functionName))
  return hash.substring(2)
}
  
function contractHeader(contractSize) {
  offetPlaceholder = "QQ"//intToHex((deltaWithoutContractSizeAdjutment + (contractSize.length*3)/2))
  while(contractSize.length > offetPlaceholder.length)
  {
    offetPlaceholder = "QQ" + offetPlaceholder
  }

  irCode = []
  convertInstructionToBytecodeIR(constructorInstructions)

  let constructorBytecode = irCodeToBytecode()

  irCode = []
  addBytecode(constructorBytecode)
  codeCopyIR("00", offetPlaceholder, contractSize)
  rReturnIR("00", contractSize)
  addOpcode("INVALID")

  let irSize = 0
  for(let i=0; i<irCode.length; i++)
  {
    irSize += irCode[i].byteSize
  }

  for(let i=0; i<irCode.length; i++)
  {
    if(irCode[i].value && irCode[i].value[0]=="Q")
    {
      irCode[i].value = intToHex(irSize)
    }
  }

  let headerBytecode = irCodeToBytecode()

  return headerBytecode
}

function intToHex(num) {

  returnValue = (num).toString(16).toUpperCase()

  if(returnValue.length%2 != 0)
  {
    returnValue = "0" + returnValue
  }
  return returnValue.toUpperCase()
}

function modifyChar(originalString, index, newChar) {
  if (index < 0 || index >= originalString.length) {
      // Index out of bounds
      return originalString;
  }

  // Create a new string with the modified character
  return (
      originalString.substr(0, index) + newChar + originalString.substr(index + 1)
  );
}

function selectorLookupIr(signature, destination) {
  if(destination.length==2)
    destination = destination+"00"
  addPush(getSelector(signature).substring(0, 8).toUpperCase())
  addOpcode("DUP2")
  addOpcode("EQ")
  addPushJump(destination)
  addOpcode("JUMPI")
}

function functionLogicIR(jumpLocation, functionData)
{
  let functionName = functionData.name
  let parameters = functionData.parameters
  let instructions = functionData.instructions

  let literalValue = intToHex(parseInt(instructions[0].value))
  let literalInstructionLength = intToHex(literalValue.length/2)

  while(literalValue.length < 64)
  {
    literalValue+="0"
  }

  addJumpDestination(jumpLocation)
  addPush("20")//start?
  addPush("00")
  addOpcode("MSTORE")
  addPush(literalInstructionLength)// length
  addPush("20")
  addOpcode("MSTORE")
  addPush(literalValue)
  addPush("40")
  addOpcode("MSTORE")
  rReturnIR("00", "60")
}

function functionIntLogicIR(jumpLocation, functionData)
{
  let functionName = functionData.name
  let parameters = functionData.parameters
  let instructions = functionData.instructions

  labelMap = new Map()
  for(i=0; i<parameters.length; i++)
  {
    let paramSize = 0
    if(parameters[i].type == "address")
    {
      paramSize = 20
    }else if(parameters[i].type == "string")
    {
      paramSize = 32 // TODO check this
    }else if(parameters[i].type == "bool")
    {
      paramSize = 32
    }else if(parameters[i].type == "uint256")
    {
      paramSize = 32
    }

    if(paramSize == 0) {
      console.log("Error: invalid param at EVM generation")
    }
    labelMap.set(parameters[i].label, {position: intToHex(4 + i*32), size: paramSize, location: "calldata"})
  }

  addJumpDestination(jumpLocation)

  convertInstructionToBytecodeIR(instructions)
}

function convertInstructionToBytecodeIR(instructionsParam) {
  let returnValue = ""
  for(let i=0; i<instructionsParam.length; i++)
  {
    if(instructionsParam[i].name == "operation")
    {
      returnValue += operationIR(instructionsParam[i].lValue, instructionsParam[i].rlValue, instructionsParam[i].operator, instructionsParam[i].rrValue)
    }else if(instructionsParam[i].name == "returnUint")
    {
      returnValue += returnLiteralIR(intToHex(parseInt(instructionsParam[i].value)), "20")
    }else if(instructionsParam[i].name == "returnLabel")
    {
      returnValue += returnLabelIR(instructionsParam[i].value, intToHex(32))
    }else if(instructionsParam[i].name == "assignment")
    {
      returnValue += assignmentIR(instructionsParam[i].lValue, instructionsParam[i].rValue)
    }else if(instructionsParam[i].name == "literalAssignment")
    {
      returnValue += literalAssignmentIR(instructionsParam[i].lValue, intToHex(parseInt(instructionsParam[i].rValue)))
    }else if(instructionsParam[i].name == "logEvent")
    {
      returnValue += logEventIR(instructionsParam[i].topics)
    }else if(instructionsParam[i].name == "declareUint")
    {
      labelMap.set(instructionsParam[i].label[0], {position: intToHex(0), size: 32, location: "memory"})
    }
  }
  return returnValue
}
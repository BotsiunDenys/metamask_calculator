import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./contractABI.json";
import "./App.css";

const App = () => {
  const [firstValue, setFirstValue] = useState(1);
  const [secondValue, setSecondValue] = useState(1);
  const [usageCount, setUsageCount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectValue, setSelectValue] = useState("add");
  const [result, setResult] = useState({
    hash: "",
    from: "",
    to: "",
    value: 0,
    gas: 0,
  });

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      setErrorMsg("Install MetaMask extension");
    }
  }, []);

  const handleSubmit = async () => {
    const address = "0x1851ffBce02A134eFd9ddBC91920b0c6DCEfB6f5";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);

    try {
      if (selectValue === "add") {
        const response = await contract.add(firstValue, secondValue);
        setResult({
          hash: response.hash,
          from: response.from,
          to: response.to,
          value: parseInt(response.value._hex),
          gas: parseInt(response.gasPrice._hex),
        });
      } else if (selectValue === "subtract") {
        const response = await contract.subtract(firstValue, secondValue);
        setResult({
          hash: response.hash,
          from: response.from,
          to: response.to,
          value: parseInt(response.value._hex),
          gas: parseInt(response.gasPrice._hex),
        });
      } else if (selectValue === "divide") {
        const response = await contract.divide(firstValue, secondValue);
        setResult({
          hash: response.hash,
          from: response.from,
          to: response.to,
          value: parseInt(response.value._hex),
          gas: parseInt(response.gasPrice._hex),
        });
      } else if (selectValue === "multiply") {
        const response = await contract.multiply(firstValue, secondValue);
        setResult({
          hash: response.hash,
          from: response.from,
          to: response.to,
          value: parseInt(response.value._hex),
          gas: parseInt(response.gasPrice._hex),
        });
      }
      const usage = await contract.usageCount();
      setUsageCount(parseInt(usage));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <main className="calculator">
      <section className="calculator_controllers">
        <input
          placeholder="Enter first value"
          type="number"
          value={firstValue}
          onChange={(e) => setFirstValue(e.target.value)}
          min={1}
          className="calculator_input"
        />
        <select
          className="calculator_input"
          onChange={(e) => setSelectValue(e.target.value)}
        >
          <option value="add">+</option>
          <option value="subtract">-</option>
          <option value="multiply">*</option>
          <option value="divide">/</option>
        </select>
        <input
          placeholder="Enter second value"
          type="number"
          value={secondValue}
          onChange={(e) => setSecondValue(e.target.value)}
          min={1}
          className="calculator_input"
        />
      </section>
      {result.hash && (
        <section className="calculator_result">
          <p>Transaction hash: {result.hash}</p>
          <p>From: {result.from}</p>
          <p>To: {result.to}</p>
          <p>Value: {result.value} ETH</p>
          <p>Gas Price: {result.gas}</p>
        </section>
      )}
      <div>
        <button
          className="calculator_button"
          disabled={errorMsg}
          onClick={handleSubmit}
        >
          Calculate
        </button>
      </div>
      {!errorMsg && usageCount && (
        <p className="calculator_usage">Calculator used: {usageCount}</p>
      )}
      <p className="calculator_error">{errorMsg}</p>
    </main>
  );
};

export default App;

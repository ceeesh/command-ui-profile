import React, { useState, useRef, useEffect } from "react";

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd) => {
    let output = "";

    if (cmd === "help") {
      output = "Available commands: help, clear, echo, date";
    } else if (cmd.startsWith("echo ")) {
      output = cmd.slice(5);
    } else if (cmd === "date") {
      output = new Date().toString();
    } else if (cmd === "clear") {
      setHistory([]);
      return;
    } else {
      output = `Unknown command: ${cmd}`;
    }

    setHistory([...history, { command: cmd, output }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input.trim());
    setInput("");
  };

  return (
    <div className="bg-black text-green-500 font-mono p-4 h-[500px] overflow-y-auto rounded-md border border-gray-800 w-[70%]">
      <div className="mb-2">
        {history.map((item, index) => (
          <div key={index}>
            <div className="text-green-500">{">"} {item.command}</div>
            <div className="text-gray-300 ml-4">{item.output}</div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <span>&gt;{" "}</span>
        <input
          type="text"
          value={input}
          className="bg-transparent border-none text-green-500 font-mono outline-none w-full pl-2"
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
};

export default Terminal;

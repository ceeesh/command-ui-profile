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
    <div className="terminal-container">
      <div className="terminal-output">
        {history.map((item, index) => (
          <div key={index}>
            <div className="terminal-command">{">"} {item.command}</div>
            <div className="terminal-response">{item.output}</div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="terminal-input">
        <span>&gt;{" "}</span>
        <input
          type="text"
          value={input}
          className="pl-2"
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
};

export default Terminal;

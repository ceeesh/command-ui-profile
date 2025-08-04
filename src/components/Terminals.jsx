import React, { useState, useRef, useEffect } from "react";

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const terminalEndRef = useRef(null);

  const availableCommands = {
    help: () =>
      `Available commands: ${Object.keys(availableCommands).join(", ")}`,
    date: () => new Date().toString(),
    echo: (args) => args.join(" "),
    clear: () => null, 
    ls: () => `what do you want`
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (input) => {
    const [cmd, ...args] = input.trim().split(" ");

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    const commandFn = availableCommands[cmd];

    let output;
    if (commandFn) {
      output = commandFn(args);
    } else {
      output = `Unknown command: ${cmd}`;
    }

    setHistory([...history, { command: input, output }]);
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
            <div className="text-green-500">
              {">"} {item.command}
            </div>
            <div className="text-gray-300 ml-4">{item.output}</div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <span>&gt; </span>
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

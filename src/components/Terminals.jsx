import { useState, useRef, useEffect } from "react";
import { PROFILE, SOCIALS } from "../constants/details";
import { COMMANDS } from "../constants/general";
import resume from "../assets/Resume.pdf";

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const availableCommands = {
    help: () => COMMANDS.HELP.trim(),
    date: () => new Date().toString(),
    echo: (args) => args.join(" "),
    clear: () => null,
    ls: () => `what do you want`,
    profile: () => PROFILE.DETAILS.trim(),
    languages: () => PROFILE.LANGUAGES.trim(),
    // Show all socials
    socials: () => {
      return Object.entries(SOCIALS)
        .map(([platform, url]) => `${platform}: ${url}`)
        .join("\n");
    },

    // Open specific social link
    social: (args) => {
      if (args.length === 0) return "Usage: social [platform]\nTry: social fb";

      const platform = args[0].toLowerCase();
      const url = SOCIALS[platform];

      if (url) {
        window.open(url, "_blank");
        return `Opening ${platform}...`;
      } else {
        return `Unknown platform: ${platform}`;
      }
    },
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (input) => {
    const [cmdRaw, ...args] = input.trim().split(" ");
    const cmd = cmdRaw === "cls" ? "clear" : cmdRaw;

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    if (cmd === "resume") {
      window.open(resume, "_blank");
      setHistory([
        ...history,
        { command: input, output: `Opened resume in new tab.` },
      ]);
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
    <div
      className="bg-black text-green-500 font-mono p-4 h-[500px] overflow-y-auto rounded-md border border-gray-800 w-[70%]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-2">
        {history.map((item, index) => (
          <div key={index}>
            <div className="text-green-500">
              {">"} {item.command}
            </div>
            <div className="text-gray-300 ml-4 whitespace-pre-wrap">
              {item.output}
            </div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <span>&gt; </span>
        <input
          ref={inputRef}
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
